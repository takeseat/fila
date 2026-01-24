import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { subscriptionService } from '../services/subscription.service';

/**
 * Middleware to check if restaurant has active subscription (TRIALING or ACTIVE)
 * Blocks access if subscription is EXPIRED, except for allowed paths
 */
export async function checkSubscriptionAccess(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        // SYSADMIN users bypass subscription checks
        if (req.user?.role === 'SYSADMIN') {
            return next();
        }

        // Paths that are allowed even when subscription is expired (or missing restaurantId)
        const allowedPaths = [
            '/billing',
            '/auth',
            '/onboarding',
            '/users/me', // Allow fetching user profile
        ];

        // Check if current path is allowed BEFORE checking restaurantId
        const isAllowedPath = allowedPaths.some(path => req.path.startsWith(path));

        if (isAllowedPath) {
            return next();
        }

        // Now check restaurantId (only for paths that require subscription check)
        const restaurantId = req.user?.restaurantId;

        if (!restaurantId) {
            return res.status(401).json({ error: 'Restaurant ID required' });
        }

        // Check subscription status
        const status = await subscriptionService.getSubscriptionStatus(restaurantId);

        // Block access if EXPIRED or PAST_DUE
        if (status === 'EXPIRED') {
            return res.status(403).json({
                error: 'SUBSCRIPTION_EXPIRED',
                message: 'Your trial has expired. Please subscribe to continue.',
                code: 'SUBSCRIPTION_EXPIRED'
            });
        }

        if (status === 'PAST_DUE') {
            return res.status(403).json({
                error: 'PAYMENT_PAST_DUE',
                message: 'Your payment is past due. Please update your payment method.',
                code: 'PAYMENT_PAST_DUE'
            });
        }

        // Allow access for TRIALING and ACTIVE
        next();

    } catch (error) {
        console.error('[checkSubscriptionAccess] Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
