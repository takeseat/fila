import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { z } from 'zod';

const updateSettingsSchema = z.object({
    waitingAlertMinutes: z.number().int().min(1).nullable().optional(),
    calledAlertMinutes: z.number().int().min(1).nullable().optional(),
    avgWaitWindowMinutes: z.number().int().min(1).nullable().optional(),
    avgWaitFallbackMinutes: z.number().int().min(1).nullable().optional(),
    autoNotPickedUpMinutes: z.number().int().min(5).max(120).nullable().optional(),
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
     * Patch business data (partial update)
     */
    async patchBusinessData(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            // Use .partial() to make all fields optional
            const data = updateBusinessDataSchema.partial().parse(req.body);

            const updatedRestaurant = await prisma.restaurant.update({
                where: { id: restaurantId },
                data: { // Only update fields that are present in data
                    ...(data.name && { name: data.name }),
                    ...(data.tradeName !== undefined && { tradeName: data.tradeName }),
                    ...(data.phone && { phone: data.phone }),
                    ...(data.countryCode && { countryCode: data.countryCode }),
                    ...(data.stateCode !== undefined && { stateCode: data.stateCode }),
                    ...(data.city && { city: data.city }),
                    ...(data.addressLine !== undefined && { addressLine: data.addressLine }),
                    ...(data.addressNumber !== undefined && { addressNumber: data.addressNumber }),
                    ...(data.addressComplement !== undefined && { addressComplement: data.addressComplement }),
                    ...(data.postalCode !== undefined && { postalCode: data.postalCode }),
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
            console.error('Error patching business data:', error);
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
                    timezone: true,
                    pickupOrdersConfig: true
                }
            });

            if (!restaurant) {
                res.status(404).json({ error: 'Restaurant not found' });
                return;
            }

            const config = restaurant.pickupOrdersConfig as any;
            const settings = {
                ...restaurant,
                autoNotPickedUpMinutes: config?.autoNotPickedUpMinutes ?? 30,
                pickupOrdersConfig: undefined
            };

            res.json(settings);
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

            // Fetch current config to merge
            const current = await prisma.restaurant.findUnique({
                where: { id: restaurantId },
                select: { pickupOrdersConfig: true }
            });

            const currentConfig = (current?.pickupOrdersConfig as any) || {};

            // Update JSON
            if (data.autoNotPickedUpMinutes !== undefined) {
                currentConfig.autoNotPickedUpMinutes = data.autoNotPickedUpMinutes;
            }

            const updatedRestaurant = await prisma.restaurant.update({
                where: { id: restaurantId },
                data: {
                    waitingAlertMinutes: data.waitingAlertMinutes,
                    calledAlertMinutes: data.calledAlertMinutes,
                    avgWaitWindowMinutes: data.avgWaitWindowMinutes,
                    avgWaitFallbackMinutes: data.avgWaitFallbackMinutes,
                    pickupOrdersConfig: currentConfig
                },
                select: {
                    waitingAlertMinutes: true,
                    calledAlertMinutes: true,
                    avgWaitWindowMinutes: true,
                    avgWaitFallbackMinutes: true,
                    pickupOrdersConfig: true
                }
            });

            const config = updatedRestaurant.pickupOrdersConfig as any;
            const response = {
                ...updatedRestaurant,
                autoNotPickedUpMinutes: config?.autoNotPickedUpMinutes ?? 30,
                pickupOrdersConfig: undefined
            };

            res.json(response);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: 'Validation error', details: error.errors });
                return;
            }
            console.error('Error updating settings:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Start PRO Plan Trial (7 days)
     */
    async startTrial(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;

            // 1. Fetch current data to validate eligibility and profile
            const restaurant = await prisma.restaurant.findUnique({
                where: { id: restaurantId },
                select: {
                    plan: true,
                    trialConsumedAt: true,
                    trialStatus: true,
                    cnpj: true,
                    addressLine: true,
                    addressNumber: true,
                    city: true,
                    stateCode: true,
                    postalCode: true
                }
            });

            if (!restaurant) {
                res.status(404).json({ error: 'Restaurant not found' });
                return;
            }

            // 2. Validate Eligibility
            if (restaurant.trialConsumedAt) {
                res.status(400).json({ error: 'TRIAL_ALREADY_CONSUMED' });
                return;
            }

            if (restaurant.trialStatus === 'ACTIVE') {
                res.status(400).json({ error: 'TRIAL_ALREADY_ACTIVE' });
                return;
            }

            // 3. Validate Profile Completeness
            const isProfileComplete =
                !!restaurant.cnpj &&
                !!restaurant.addressLine &&
                !!restaurant.addressNumber &&
                !!restaurant.city &&
                !!restaurant.stateCode &&
                !!restaurant.postalCode;

            if (!isProfileComplete) {
                res.status(400).json({ error: 'RESTAURANT_PROFILE_INCOMPLETE' });
                return;
            }

            // 4. Activate Trial
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

            const updated = await prisma.restaurant.update({
                where: { id: restaurantId },
                data: {
                    plan: 'PRO',
                    trialStatus: 'ACTIVE',
                    trialStartAt: now,
                    trialEndAt: expiresAt,
                    trialConsumedAt: now,
                    // Auto-enable features for better UX
                    pickupOrdersEnabled: true,
                    pickupOrdersWhatsappEnabled: true
                }
            });

            res.json({
                success: true,
                plan: updated.plan,
                trialStatus: updated.trialStatus,
                trialEndAt: updated.trialEndAt
            });

        } catch (error: any) {
            console.error('Error starting trial:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
