import { PrismaClient, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class SubscriptionService {
    /**
     * Check if restaurant has active subscription (TRIALING or ACTIVE)
     */
    async hasActiveSubscription(restaurantId: string): Promise<boolean> {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { subscriptionStatus: true }
        });

        if (!restaurant) {
            return false;
        }

        return restaurant.subscriptionStatus === 'TRIALING' ||
            restaurant.subscriptionStatus === 'ACTIVE';
    }

    /**
     * Get current subscription status
     */
    async getSubscriptionStatus(restaurantId: string): Promise<SubscriptionStatus | null> {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { subscriptionStatus: true }
        });

        return restaurant?.subscriptionStatus || null;
    }

    /**
     * Get full subscription info
     */
    async getSubscriptionInfo(restaurantId: string) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: {
                plan: true,
                subscriptionStatus: true,
                subscriptionStartedAt: true,
                subscriptionEndsAt: true,
                trialStatus: true,
                trialStartAt: true,
                trialEndAt: true,
                trialConsumedAt: true
            }
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        return restaurant;
    }

    /**
     * Activate subscription (called after successful payment)
     */
    async activateSubscription(restaurantId: string, subscriptionData?: {
        subscriptionEndsAt?: Date;
    }) {
        const now = new Date();

        return await prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                subscriptionStatus: 'ACTIVE',
                subscriptionStartedAt: now,
                subscriptionEndsAt: subscriptionData?.subscriptionEndsAt,
                plan: 'PRO' // Ensure PRO plan
            }
        });
    }

    /**
     * Expire subscription (called when trial ends or payment fails)
     */
    async expireSubscription(restaurantId: string) {
        return await prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                subscriptionStatus: 'EXPIRED'
                // Keep plan as PRO - just change status
            }
        });
    }

    /**
     * Set subscription to PAST_DUE (payment failed, grace period)
     */
    async setPastDue(restaurantId: string) {
        return await prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                subscriptionStatus: 'PAST_DUE'
            }
        });
    }

    /**
     * Check if restaurant can access PRO features
     * Returns true if TRIALING or ACTIVE, false if EXPIRED or PAST_DUE
     */
    async canAccessFeatures(restaurantId: string): Promise<boolean> {
        const status = await this.getSubscriptionStatus(restaurantId);
        return status === 'TRIALING' || status === 'ACTIVE';
    }

    /**
     * Start trial for a new restaurant (auto-called on signup)
     */
    async startTrial(restaurantId: string) {
        const now = new Date();
        const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

        return await prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                plan: 'PRO',
                subscriptionStatus: 'TRIALING',
                trialStatus: 'ACTIVE',
                trialStartAt: now,
                trialEndAt: trialEndsAt,
                trialConsumedAt: now
            }
        });
    }
}

export const subscriptionService = new SubscriptionService();
