import prisma from '../config/database';
import { CreateWaitlistEntryInput } from '../validators/waitlist.validator';
import { WhatsAppService } from './whatsapp.service';

export class WaitlistService {
    async getWaitlist(restaurantId: string) {
        return prisma.waitlistEntry.findMany({
            where: {
                restaurantId,
                status: { in: ['WAITING', 'CALLED'] },
            },
            include: {
                customer: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async createEntry(restaurantId: string, data: CreateWaitlistEntryInput) {
        // Import utilities
        const { buildFullPhone } = await import('../utils/phone.utils');
        const customersService = new (await import('./customers.service')).CustomersService();

        // Build full phone number
        const fullPhone = buildFullPhone(data.customerDdi, data.customerPhone);

        // Calculate estimated wait time based on current queue
        const waitingCount = await prisma.waitlistEntry.count({
            where: {
                restaurantId,
                status: { in: ['WAITING', 'CALLED'] },
            },
        });

        const estimatedWaitMinutes = data.estimatedWaitMinutes || (waitingCount + 1) * 15;

        // Find or create customer
        let customerId = data.customerId;

        if (!customerId && fullPhone) {
            // Try to find existing customer by fullPhone
            const existingCustomer = await customersService.getCustomerByFullPhone(restaurantId, fullPhone);

            if (existingCustomer) {
                customerId = existingCustomer.id;

                // Update customer name and opt-in if provided
                await prisma.customer.update({
                    where: { id: existingCustomer.id },
                    data: {
                        name: data.customerName,
                        notes: data.notes || existingCustomer.notes,
                        // Update opt-in if provided or changed
                        ...(data.whatsappOptIn !== undefined && {
                            whatsappOptIn: data.whatsappOptIn,
                            whatsappOptInAt: new Date(),
                            whatsappOptInSource: 'QUEUE_ENTRY'
                        })
                    },
                });
            } else {
                // Create new customer
                const newCustomer = await customersService.createCustomer(restaurantId, {
                    name: data.customerName,
                    countryCode: data.customerCountryCode,
                    ddi: data.customerDdi,
                    phone: data.customerPhone,
                    fullPhone,
                    notes: data.notes,
                    whatsappOptIn: data.whatsappOptIn,
                } as any); // Type cast needed until we update CreateWaitlistEntryInput
                customerId = newCustomer.id;
            }
        }

        const entry = await prisma.waitlistEntry.create({
            data: {
                restaurantId,
                customerId,
                customerName: data.customerName,
                customerPhone: fullPhone,
                customerCountryCode: data.customerCountryCode,
                partySize: data.partySize,
                estimatedWaitMinutes,
                status: 'WAITING',
                whatsappOptIn: data.whatsappOptIn ?? false,
                whatsappOptInAt: data.whatsappOptIn ? new Date() : null,
            },
            include: {
                customer: true,
            },
        });

        // WhatsApp Notification (Welcome)
        console.log('[WhatsApp Debug] whatsappOptIn:', data.whatsappOptIn, 'entry.whatsappOptIn:', entry.whatsappOptIn);
        if (data.whatsappOptIn) {
            try {
                console.log('[WhatsApp] Sending welcome message to', entry.customerPhone);
                // current position is waitingCount + 1
                await WhatsAppService.sendWelcome(restaurantId, entry, waitingCount + 1);
            } catch (error) {
                console.error('Error initiating welcome message', error);
            }
        } else {
            console.log('[WhatsApp] Skipping welcome message - opt-in is false');
        }

        return entry;
    }

    async callEntry(restaurantId: string, entryId: string) {
        const entry = await prisma.waitlistEntry.findFirst({
            where: { id: entryId, restaurantId },
        });

        if (!entry) {
            throw new Error('Entry not found');
        }

        if (entry.status !== 'WAITING') {
            throw new Error('Entry is not in waiting status');
        }

        const updatedEntry = await prisma.waitlistEntry.update({
            where: { id: entryId },
            data: {
                status: 'CALLED',
                calledAt: new Date(),
            },
            include: {
                customer: true,
            },
        });

        // WhatsApp Notification (Your Turn)
        try {
            await WhatsAppService.sendYourTurn(restaurantId, updatedEntry);
        } catch (error) {
            console.error('Failed to send turn message', error);
        }

        // Notify queue updates (someone left the waiting list)
        this.notifyQueueUpdates(restaurantId);

        return updatedEntry;
    }

    async seatEntry(restaurantId: string, entryId: string) {
        const entry = await prisma.waitlistEntry.findFirst({
            where: { id: entryId, restaurantId },
        });

        if (!entry) {
            throw new Error('Entry not found');
        }

        if (!['WAITING', 'CALLED'].includes(entry.status)) {
            throw new Error('Entry cannot be seated');
        }

        const seatedAt = new Date();

        // Update waitlist entry
        const updatedEntry = await prisma.waitlistEntry.update({
            where: { id: entryId },
            data: {
                status: 'SEATED',
                seatedAt,
            },
            include: {
                customer: true,
            },
        });

        // Update customer visit tracking if customer exists
        if (entry.customerId) {
            await prisma.customer.update({
                where: { id: entry.customerId },
                data: {
                    lastVisitAt: seatedAt,
                    totalVisits: { increment: 1 },
                },
            });
        }

        this.notifyQueueUpdates(restaurantId);
        return updatedEntry;
    }

    async cancelEntry(restaurantId: string, entryId: string) {
        const entry = await prisma.waitlistEntry.findFirst({
            where: { id: entryId, restaurantId },
        });

        if (!entry) {
            throw new Error('Entry not found');
        }

        if (!['WAITING', 'CALLED'].includes(entry.status)) {
            throw new Error('Entry cannot be cancelled');
        }

        const cancelledEntry = await prisma.waitlistEntry.update({
            where: { id: entryId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
            },
            include: {
                customer: true,
            },
        });

        this.notifyQueueUpdates(restaurantId);
        return cancelledEntry;
    }

    async markNoShow(restaurantId: string, entryId: string) {
        const entry = await prisma.waitlistEntry.findFirst({
            where: { id: entryId, restaurantId },
        });

        if (!entry) {
            throw new Error('Entry not found');
        }

        if (entry.status !== 'CALLED') {
            throw new Error('Entry must be in called status');
        }

        return prisma.waitlistEntry.update({
            where: { id: entryId },
            data: {
                status: 'NO_SHOW',
                noShowAt: new Date(),
            },
            include: {
                customer: true,
            },
        });
    }
    async getQueueMetrics(restaurantId: string) {
        // 1. Get restaurant settings
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: {
                avgWaitWindowMinutes: true,
                avgWaitFallbackMinutes: true,
            },
        });

        const windowMinutes = restaurant?.avgWaitWindowMinutes ?? 90;
        const fallbackMinutes = restaurant?.avgWaitFallbackMinutes ?? 15;

        // 2. Calculate window start time
        const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

        // 3. Fetch entries that were called/seated in the window
        // Criteria:
        // - createdAt >= windowStart (entered queue in the last X minutes)
        // - status in ['CALLED', 'SEATED'] (effectively called)
        // - calledAt is not null
        const calledEntries = await prisma.waitlistEntry.findMany({
            where: {
                restaurantId,
                status: { in: ['CALLED', 'SEATED'] },
                calledAt: { not: null },
                createdAt: { gte: windowStart },
            },
            select: {
                createdAt: true,
                calledAt: true,
            },
        });

        // 4. Calculate average wait time (calledAt - createdAt)
        let averageWaitSeconds = 0;
        let isFallbackUsed = false;
        const sampleSize = calledEntries.length;

        if (sampleSize > 0) {
            const totalWaitSeconds = calledEntries.reduce((sum, entry) => {
                // Ensure we have valid dates
                if (!entry.calledAt || !entry.createdAt) return sum;
                const waitSeconds = (new Date(entry.calledAt).getTime() - new Date(entry.createdAt).getTime()) / 1000;
                return sum + waitSeconds;
            }, 0);
            averageWaitSeconds = Math.round(totalWaitSeconds / sampleSize);
        } else {
            // Use fallback
            averageWaitSeconds = fallbackMinutes * 60;
            isFallbackUsed = true;
        }

        // 5. Get current active count (WAITING + CALLED)
        const activeCount = await prisma.waitlistEntry.count({
            where: {
                restaurantId,
                status: { in: ['WAITING', 'CALLED'] },
            },
        });

        // 6. Get served today count (SEATED with seated_at today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const servedToday = await prisma.waitlistEntry.count({
            where: {
                restaurantId,
                status: 'SEATED',
                seatedAt: {
                    gte: startOfDay,
                },
            },
        });

        // 7. Return metrics
        return {
            averageWaitSeconds,
            sampleSize,
            windowMinutes,
            isFallbackUsed,
            activeCount,
            servedToday,
        };
    }
    async notifyQueueUpdates(restaurantId: string) {
        // Fire and forget - don't block
        setTimeout(async () => {
            try {
                // Get all waiting entries ordered by creation
                const waitingEntries = await prisma.waitlistEntry.findMany({
                    where: {
                        restaurantId,
                        status: 'WAITING',
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                    include: {
                        customer: true
                    }
                });

                // Iterate and send updates
                for (let i = 0; i < waitingEntries.length; i++) {
                    const entry = waitingEntries[i];
                    const position = i + 1;

                    // Service handles opt-in checks and rate limits internally
                    await WhatsAppService.sendPositionUpdate(restaurantId, entry, position);
                }
            } catch (error) {
                console.error('Error notifying queue updates:', error);
            }
        }, 1000); // 1s delay to let DB settle
    }
}
