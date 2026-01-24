import { PrismaClient, Plan } from '@prisma/client';
import { subscriptionService } from './subscription.service';

const prisma = new PrismaClient();

export class PlanPermissionError extends Error {
    public code: string;
    public feature: string;

    constructor(feature: string, reason: string = 'SUBSCRIPTION_REQUIRED') {
        super(`Subscription required for feature: ${feature}`);
        this.name = 'PlanPermissionError';
        this.code = reason;
        this.feature = feature;
    }
}

export const planService = {
    async checkPermission(restaurantId: string, feature: 'WHATSAPP' | 'PICKUP_ORDERS') {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: {
                plan: true,
                subscriptionStatus: true
            }
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Check subscription status instead of plan
        const { subscriptionStatus } = restaurant;

        // EXPIRED or PAST_DUE = no access to PRO features
        if (subscriptionStatus === 'EXPIRED' || subscriptionStatus === 'PAST_DUE') {
            throw new PlanPermissionError(feature, 'SUBSCRIPTION_EXPIRED');
        }

        // TRIALING or ACTIVE = full access to all features
        if (subscriptionStatus === 'TRIALING' || subscriptionStatus === 'ACTIVE') {
            return true;
        }

        // Fallback - deny if status is unknown
        throw new PlanPermissionError(feature, 'SUBSCRIPTION_REQUIRED');
    },

    async getPlan(restaurantId: string) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: {
                plan: true,
                subscriptionStatus: true
            }
        });

        // Always return PRO (BASIC is deprecated)
        return restaurant?.plan || Plan.PRO;
    },

    /**
     * Check if restaurant can access features (based on subscription status)
     */
    async canAccessFeatures(restaurantId: string): Promise<boolean> {
        return await subscriptionService.canAccessFeatures(restaurantId);
    }
};
