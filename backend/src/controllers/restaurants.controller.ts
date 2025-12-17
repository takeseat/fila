import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { z } from 'zod';

const updateSettingsSchema = z.object({
    waitingAlertMinutes: z.number().int().min(1).nullable().optional(),
    calledAlertMinutes: z.number().int().min(1).nullable().optional(),
    avgWaitWindowMinutes: z.number().int().min(1).nullable().optional(),
    avgWaitFallbackMinutes: z.number().int().min(1).nullable().optional(),
});

export class RestaurantsController {
    /**
     * Get restaurant settings
     */
    async getSettings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;

            const restaurant = await prisma.restaurant.findUnique({
                where: { id: restaurantId },
                select: {
                    waitingAlertMinutes: true,
                    calledAlertMinutes: true,
                    avgWaitWindowMinutes: true,
                    avgWaitFallbackMinutes: true,
                    name: true,
                    email: true,
                    phone: true,
                    timezone: true
                }
            });

            if (!restaurant) {
                res.status(404).json({ error: 'Restaurant not found' });
                return;
            }

            res.json(restaurant);
        } catch (error: any) {
            console.error('Error fetching settings:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update restaurant settings
     */
    async updateSettings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const data = updateSettingsSchema.parse(req.body);

            const updatedRestaurant = await prisma.restaurant.update({
                where: { id: restaurantId },
                data: {
                    waitingAlertMinutes: data.waitingAlertMinutes,
                    calledAlertMinutes: data.calledAlertMinutes,
                    avgWaitWindowMinutes: data.avgWaitWindowMinutes,
                    avgWaitFallbackMinutes: data.avgWaitFallbackMinutes,
                },
                select: {
                    waitingAlertMinutes: true,
                    calledAlertMinutes: true,
                    avgWaitWindowMinutes: true,
                    avgWaitFallbackMinutes: true,
                }
            });

            res.json(updatedRestaurant);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: 'Validation error', details: error.errors });
                return;
            }
            console.error('Error updating settings:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
