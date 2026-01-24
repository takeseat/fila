import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TrialExpirationJob {
    /**
     * Process expired trials.
     * Sets subscriptionStatus to EXPIRED while keeping plan as PRO.
     */
    static async processExpiredTrials() {
        console.log('[TrialExpirationJob] Starting check...');

        try {
            const now = new Date();

            // Find tenants with TRIALING status AND trial expired
            const expiredRestaurants = await prisma.restaurant.findMany({
                where: {
                    subscriptionStatus: 'TRIALING', // Check subscription status instead of trialStatus
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
                            subscriptionStatus: 'EXPIRED', // Set to EXPIRED
                            trialStatus: 'EXPIRED', // Also update legacy trialStatus for consistency
                            // Keep plan as PRO - don't revert to BASIC
                            // Don't disable features - gate will handle access control
                        }
                    });

                    // TODO: Consider sending notification email to restaurant owner

                    processed++;
                } catch (err) {
                    console.error(`[TrialExpirationJob] Failed to expire restaurant ${restaurant.id}:`, err);
                }
            }

            console.log(`[TrialExpirationJob] Successfully processed ${processed} expirations.`);
            return { success: true, processed };

        } catch (error) {
            console.error('[TrialExpirationJob] Job failed:', error);
            throw error;
        }
    }
}
