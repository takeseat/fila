import { PrismaClient, PickupOrderStatus, PickupOrderSource } from '@prisma/client';
import { subMinutes } from 'date-fns';

const prisma = new PrismaClient();

export interface CreatePickupOrderInput {
    restaurantId: string;
    orderCode: string;
    customerPhoneE164: string;
    customerCountryCode: string;
    customerName?: string;
    customerId?: string;
    partySize?: number;
    notes?: string;
    whatsappOptIn?: boolean;
    source?: PickupOrderSource;
    createdByUserId?: string;
}

export interface UpdatePickupOrderInput {
    orderCode?: string;
    customerName?: string;
    customerPhoneE164?: string;
    customerCountryCode?: string;
    partySize?: number;
    notes?: string;
}

export interface ListPickupOrdersFilters {
    restaurantId: string;
    status?: PickupOrderStatus;
    search?: string;
    from?: Date;
    to?: Date;
}

const VALID_STATUS_TRANSITIONS: Record<PickupOrderStatus, PickupOrderStatus[]> = {
    CREATED: ['READY_FOR_PICKUP', 'NOT_PICKED_UP'],
    READY_FOR_PICKUP: ['PICKED_UP', 'NOT_PICKED_UP'],
    PICKED_UP: [],
    NOT_PICKED_UP: [],
};

export class PickupOrdersService {
    /**
     * List pickup orders with filters and pagination
     */
    static async listPickupOrders(
        filters: ListPickupOrdersFilters,
        page: number = 1,
        limit: number = 50
    ) {
        const where: any = {
            restaurantId: filters.restaurantId,
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.from || filters.to) {
            where.createdAt = {};
            if (filters.from) where.createdAt.gte = filters.from;
            if (filters.to) where.createdAt.lte = filters.to;
        }

        if (filters.search) {
            where.OR = [
                { orderCode: { contains: filters.search } },
                { customerName: { contains: filters.search } },
                { customerPhoneE164: { contains: filters.search } },
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.pickupOrder.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            fullPhone: true,
                            email: true,
                        },
                    },
                    createdByUser: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.pickupOrder.count({ where }),
        ]);

        return {
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get pickup order by ID
     */
    static async getPickupOrderById(id: string, restaurantId: string) {
        const order = await prisma.pickupOrder.findFirst({
            where: { id, restaurantId },
            include: {
                customer: true,
                createdByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                whatsappMessages: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!order) {
            throw new Error('Pickup order not found');
        }

        return order;
    }

    /**
     * Create new pickup order
     */
    static async createPickupOrder(input: CreatePickupOrderInput) {
        // Check if customer exists by phone
        let customerId = input.customerId;

        if (!customerId && input.customerPhoneE164) {
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    restaurantId: input.restaurantId,
                    fullPhone: input.customerPhoneE164,
                },
            });

            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else if (input.customerName) {
                // Create customer if name provided
                const newCustomer = await prisma.customer.create({
                    data: {
                        restaurantId: input.restaurantId,
                        name: input.customerName,
                        countryCode: input.customerCountryCode,
                        ddi: input.customerPhoneE164.substring(
                            0,
                            input.customerPhoneE164.length - 10
                        ),
                        phone: input.customerPhoneE164.slice(-10),
                        fullPhone: input.customerPhoneE164,
                        whatsappOptIn: input.whatsappOptIn ?? true,
                        whatsappOptInAt: input.whatsappOptIn ? new Date() : null,
                        whatsappOptInSource: 'PICKUP_ORDER',
                    },
                });
                customerId = newCustomer.id;
            }
        }

        const order = await prisma.pickupOrder.create({
            data: {
                restaurantId: input.restaurantId,
                orderCode: input.orderCode,
                customerId,
                customerName: input.customerName,
                customerPhoneE164: input.customerPhoneE164,
                customerCountryCode: input.customerCountryCode,
                partySize: input.partySize,
                notes: input.notes,
                whatsappOptIn: input.whatsappOptIn ?? true,
                source: input.source || 'MANUAL',
                createdByUserId: input.createdByUserId,
            },
            include: {
                customer: true,
            },
        });

        return order;
    }

    /**
     * Update pickup order
     */
    static async updatePickupOrder(
        id: string,
        restaurantId: string,
        input: UpdatePickupOrderInput
    ) {
        const order = await prisma.pickupOrder.findFirst({
            where: { id, restaurantId },
        });

        if (!order) {
            throw new Error('Pickup order not found');
        }

        // Don't allow updates if already picked up or not picked up
        if (order.status === 'PICKED_UP' || order.status === 'NOT_PICKED_UP') {
            throw new Error('Cannot update completed orders');
        }

        const updated = await prisma.pickupOrder.update({
            where: { id },
            data: input,
            include: {
                customer: true,
            },
        });

        return updated;
    }

    /**
     * Change order status with validation
     */
    static async changeStatus(
        id: string,
        restaurantId: string,
        newStatus: PickupOrderStatus,
        metadata?: { automated?: boolean }
    ) {
        const order = await prisma.pickupOrder.findFirst({
            where: { id, restaurantId },
        });

        if (!order) {
            throw new Error('Pickup order not found');
        }

        // Validate transition
        const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status];
        if (!allowedTransitions.includes(newStatus)) {
            throw new Error(
                `Invalid status transition from ${order.status} to ${newStatus}`
            );
        }

        const updateData: any = { status: newStatus };

        // Set appropriate timestamp
        switch (newStatus) {
            case 'READY_FOR_PICKUP':
                updateData.readyAt = new Date();
                break;
            case 'PICKED_UP':
                updateData.pickedUpAt = new Date();
                break;
            case 'NOT_PICKED_UP':
                updateData.notPickedUpAt = new Date();
                break;
        }

        const updated = await prisma.pickupOrder.update({
            where: { id },
            data: updateData,
            include: {
                customer: true,
            },
        });

        console.log('[PickupOrders] Status changed:', {
            orderId: id,
            orderCode: order.orderCode,
            from: order.status,
            to: newStatus,
            automated: metadata?.automated || false,
        });

        return updated;
    }

    /**
     * Check if can resend WhatsApp (rate limiting)
     */
    static canResendWhatsApp(order: any): { allowed: boolean; reason?: string } {
        if (!order.whatsappOptIn) {
            return { allowed: false, reason: 'Customer has not opted in to WhatsApp' };
        }

        if (order.status !== 'READY_FOR_PICKUP') {
            return { allowed: false, reason: 'Can only resend for ready orders' };
        }

        if (order.lastWhatsAppNotifiedAt) {
            const twoMinutesAgo = subMinutes(new Date(), 2);
            if (order.lastWhatsAppNotifiedAt > twoMinutesAgo) {
                return {
                    allowed: false,
                    reason: 'Must wait 2 minutes between messages',
                };
            }
        }

        return { allowed: true };
    }

    /**
     * Update last WhatsApp notification time
     */
    static async updateLastNotified(id: string) {
        await prisma.pickupOrder.update({
            where: { id },
            data: { lastWhatsAppNotifiedAt: new Date() },
        });
    }

    /**
     * Get orders ready for auto-timeout
     */
    static async getOrdersForAutoTimeout(
        restaurantId: string,
        timeoutMinutes: number
    ) {
        const cutoffTime = subMinutes(new Date(), timeoutMinutes);

        return prisma.pickupOrder.findMany({
            where: {
                restaurantId,
                status: 'READY_FOR_PICKUP',
                readyAt: { lte: cutoffTime },
            },
            include: {
                customer: true,
            },
        });
    }
}
