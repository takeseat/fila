import { useAuth } from './useAuth';
import { differenceInDays, parseISO } from 'date-fns';

export type PlanType = 'PRO'; // Only PRO now
export type TrialStatus = 'NONE' | 'ACTIVE' | 'EXPIRED';
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'EXPIRED';

export function usePlan() {
    const { restaurant } = useAuth();

    // Always PRO plan (BASIC is deprecated)
    const plan: PlanType = 'PRO';
    const subscriptionStatus: SubscriptionStatus = restaurant?.subscriptionStatus || 'TRIALING';
    const trialStatus: TrialStatus = restaurant?.trialStatus || 'NONE';

    // Subscription status checks
    const isTrialing = subscriptionStatus === 'TRIALING';
    const isActive = subscriptionStatus === 'ACTIVE';
    const isPastDue = subscriptionStatus === 'PAST_DUE';
    const isExpired = subscriptionStatus === 'EXPIRED';

    // Legacy compatibility
    const isPro = true; // Always true now
    const isTrialActive = isTrialing; // Legacy name
    const hasConsumedTrial = !!restaurant?.trialConsumedAt || trialStatus === 'EXPIRED';

    // Calculate trial days remaining
    let trialDaysRemaining = 0;
    if (isTrialing && restaurant?.trialEndAt) {
        const end = parseISO(restaurant.trialEndAt);
        const now = new Date();
        trialDaysRemaining = Math.max(0, differenceInDays(end, now));
    }

    // Feature access based on subscription status
    const canAccessFeatures = isTrialing || isActive;

    return {
        plan,
        subscriptionStatus,
        trialStatus,

        // Primary status flags
        isTrialing,
        isActive,
        isPastDue,
        isExpired,

        // Feature access
        canAccessFeatures,
        canUseWhatsApp: canAccessFeatures,
        canUsePickupOrders: canAccessFeatures,

        // Legacy compatibility (always true/false for PRO-only)
        isPro,
        isBasic: false, // BASIC no longer exists
        isTrialActive,
        hasConsumedTrial,
        trialDaysRemaining,

        // Helper to check specific features (legacy)
        checkFeature: (_feature: 'WHATSAPP' | 'PICKUP_ORDERS') => {
            return canAccessFeatures;
        }
    };
}
