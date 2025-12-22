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

const updateBusinessDataSchema = z.object({
    name: z.string().min(1).max(255),
    tradeName: z.string().max(255).nullable().optional(),
    phone: z.string().min(1),
    countryCode: z.string().length(2), // ISO 3166-1 alpha-2
    stateCode: z.string().nullable().optional(),
    city: z.string().min(1),
    addressLine: z.string().nullable().optional(),
    addressNumber: z.string().nullable().optional(),
    addressComplement: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    // email and cnpj are READ-ONLY, not accepted in updates
});

export class RestaurantsController {
    /**
     * Get business data (name, address, contact)
     */
    async getBusinessData(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;

            const restaurant = await prisma.restaurant.findUnique({
                where: { id: restaurantId },
                select: {
                    name: true,
                    tradeName: true,
                    email: true,
                    cnpj: true,
                    phone: true,
                    countryCode: true,
                    stateCode: true,
                    city: true,
                    addressLine: true,
                    addressNumber: true,
                    addressComplement: true,
                    postalCode: true,
                }
            });

            if (!restaurant) {
                res.status(404).json({ error: 'Restaurant not found' });
                return;
            }

            res.json(restaurant);
        } catch (error: any) {
            console.error('Error fetching business data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update business data (editable fields only)
     */
    async updateBusinessData(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const data = updateBusinessDataSchema.parse(req.body);

            const updatedRestaurant = await prisma.restaurant.update({
                where: { id: restaurantId },
                data: {
                    name: data.name,
                    tradeName: data.tradeName,
                    phone: data.phone,
                    countryCode: data.countryCode,
                    stateCode: data.stateCode,
                    city: data.city,
                    addressLine: data.addressLine,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
                    postalCode: data.postalCode,
                    // email and cnpj are intentionally NOT updated
                },
                select: {
                    name: true,
                    tradeName: true,
                    email: true,
                    cnpj: true,
                    phone: true,
                    countryCode: true,
                    stateCode: true,
                    city: true,
                    addressLine: true,
                    addressNumber: true,
                    addressComplement: true,
                    postalCode: true,
                }
            });

            res.json(updatedRestaurant);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: 'Validation error', details: error.errors });
                return;
            }
            console.error('Error updating business data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

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
