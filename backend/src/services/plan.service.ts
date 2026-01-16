import { PrismaClient, Plan } from '@prisma/client';

const prisma = new PrismaClient();

export class PlanPermissionError extends Error {
    public code: string;
    public feature: string;

    constructor(feature: string) {
        super(`Upgrade to PRO plan required for feature: ${feature}`);
        this.name = 'PlanPermissionError';
        this.code = 'PLAN_UPGRADE_REQUIRED';
        this.feature = feature;
    }
}

export const planService = {
    async checkPermission(restaurantId: string, feature: 'WHATSAPP' | 'PICKUP_ORDERS') {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { plan: true }
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Basic Plan Restrictions
        if (restaurant.plan === Plan.BASIC) {
            if (feature === 'WHATSAPP' || feature === 'PICKUP_ORDERS') {
                throw new PlanPermissionError(feature);
            }
        }

        // PRO plan has access to everything
        return true;
    },

    async getPlan(restaurantId: string) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { plan: true }
        });
        return restaurant?.plan || Plan.BASIC;
    }
};
