import { useAuth } from './useAuth';
import { differenceInDays, parseISO } from 'date-fns';

export type PlanType = 'BASIC' | 'PRO';
export type TrialStatus = 'NONE' | 'ACTIVE' | 'EXPIRED';

export function usePlan() {
    const { restaurant } = useAuth();

    // Default to BASIC if undefined/null (safe fail)
    const plan: PlanType = restaurant?.plan || 'BASIC';
    const trialStatus: TrialStatus = restaurant?.trialStatus || 'NONE';

    const isPro = plan === 'PRO';
    const isTrialActive = trialStatus === 'ACTIVE';
    const hasConsumedTrial = !!restaurant?.trialConsumedAt || trialStatus === 'EXPIRED';

    let trialDaysRemaining = 0;
    if (isTrialActive && restaurant?.trialEndAt) {
        // Calculate remaining days
        const end = parseISO(restaurant.trialEndAt);
        const now = new Date();
        trialDaysRemaining = Math.max(0, differenceInDays(end, now));
    }

    return {
        plan,
        trialStatus,
        isPro,
        isTrialActive,
        hasConsumedTrial,
        trialDaysRemaining,
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
