import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * Middleware to check if pickup orders feature is enabled for the restaurant
 */
export const requirePickupOrdersEnabled = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // @ts-ignore
        const restaurantId = req.user?.restaurantId;

        if (!restaurantId) {
            res.status(401).json({ error: 'Authentication required' });
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
