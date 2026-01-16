import { useAuth } from './useAuth';

export type PlanType = 'BASIC' | 'PRO';

export function usePlan() {
    const { restaurant } = useAuth();

    // Default to BASIC if undefined/null (safe fail)
    const plan: PlanType = restaurant?.plan || 'BASIC';
    const isPro = plan === 'PRO';

    return {
        plan,
        isPro,
        isBasic: plan === 'BASIC',
        canUseWhatsApp: isPro,
        canUsePickupOrders: isPro,

        // Helper to check specific features if we add more granular ones later
        checkFeature: (feature: 'WHATSAPP' | 'PICKUP_ORDERS') => {
            if (feature === 'WHATSAPP' || feature === 'PICKUP_ORDERS') return isPro;
            return true;
        }
    };
}
