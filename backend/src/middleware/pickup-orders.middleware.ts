import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import prisma from '../config/database';

/**
 * Middleware to check if pickup orders feature is enabled for the restaurant
 */
export const requirePickupOrdersEnabled = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.method === 'OPTIONS') {
            return next();
        }

        const restaurantId = req.user?.restaurantId;

        if (!restaurantId) {
            res.status(401).json({
                error: 'Authentication required',
                debug: {
                    hasUser: !!req.user,
                    payload: req.user
                }
            });
            return;
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { pickupOrdersEnabled: true },
        });

        if (!restaurant?.pickupOrdersEnabled) {
            res.status(403).json({
                error: 'Pickup orders feature is not enabled for this restaurant',
            });
            return;
        }

        next();
    } catch (error) {
        console.error('[PickupOrdersMiddleware] Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
