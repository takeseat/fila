import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TrialExpirationJob {
    /**
     * Process expired trials.
     * Reverts plan to BASIC and marks status as EXPIRED.
     */
    static async processExpiredTrials() {
        console.log('[TrialExpirationJob] Starting check...');

        try {
            const now = new Date();

            // Find candidates
            const expiredRestaurants = await prisma.restaurant.findMany({
                where: {
                    trialStatus: 'ACTIVE',
                    trialEndAt: {
                        lt: now
                    }
                },
                select: { id: true, name: true }
            });

            console.log(`[TrialExpirationJob] Found ${expiredRestaurants.length} expired trials.`);

            if (expiredRestaurants.length === 0) {
                return { success: true, processed: 0 };
            }

            let processed = 0;

            for (const restaurant of expiredRestaurants) {
                try {
                    console.log(`[TrialExpirationJob] Expiring trial for ${restaurant.name} (${restaurant.id})`);

                    await prisma.restaurant.update({
                        where: { id: restaurant.id },
                        data: {
                            plan: 'BASIC',
                            trialStatus: 'EXPIRED',
                            // Disable features immediately
                            pickupOrdersEnabled: false,
                            pickupOrdersWhatsappEnabled: false
                        }
                    });

                    // TODO: Audit log here if needed (e.g. PlanChangeLog)

                    processed++;
                } catch (err) {
                    console.error(`[TrialExpirationJob] Failed to expire restaurant ${restaurant.id}:`, err);
                }
            }

            return { success: true, processed };

        } catch (error) {
            console.error('[TrialExpirationJob] Job failed:', error);
            throw error;
        }
    }
}
