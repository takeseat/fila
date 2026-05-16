import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { z } from 'zod';

const updateSettingsSchema = z.object({
    isEnabled: z.boolean(),
    sendWelcome: z.boolean(),
    sendPositionUpdates: z.boolean(),
    sendTurnMessage: z.boolean(),
    welcomeText: z.string().max(1000).nullable().optional(),
    positionUpdateText: z.string().max(1000).nullable().optional(),
    yourTurnText: z.string().max(1000).nullable().optional(),

    // Rate limits
    minSecondsBetweenUpdates: z.number().min(60).nullable().optional(),
    minPositionsChangeToNotify: z.number().min(1).nullable().optional(),
});

export class WhatsAppSettingsController {
    /**
     * Get WhatsApp settings for the restaurant
     */
    async getSettings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;

            let settings = await prisma.restaurantWhatsAppSettings.findUnique({
                where: { restaurantId }
            });

            if (!settings) {
                // Create default if not exists
                settings = await prisma.restaurantWhatsAppSettings.create({
                    data: { restaurantId }
                });
            }

            res.json(settings);
        } catch (error: any) {
            console.error('Error fetching WhatsApp settings:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update WhatsApp settings
     */
    async updateSettings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const data = updateSettingsSchema.parse(req.body);

            // Upsert
            const settings = await prisma.restaurantWhatsAppSettings.upsert({
                where: { restaurantId },
                update: {
                    isEnabled: data.isEnabled,
                    sendWelcome: data.sendWelcome,
                    sendPositionUpdates: data.sendPositionUpdates,
                    sendTurnMessage: data.sendTurnMessage,
                    welcomeText: data.welcomeText ?? undefined,
                    positionUpdateText: data.positionUpdateText ?? undefined,
                    yourTurnText: data.yourTurnText ?? undefined,
                    ...(data.minSecondsBetweenUpdates && { minSecondsBetweenUpdates: data.minSecondsBetweenUpdates }),
                    ...(data.minPositionsChangeToNotify && { minPositionsChangeToNotify: data.minPositionsChangeToNotify }),
                },
                create: {
                    restaurantId,
                    isEnabled: data.isEnabled,
                    sendWelcome: data.sendWelcome,
                    sendPositionUpdates: data.sendPositionUpdates,
                    sendTurnMessage: data.sendTurnMessage,
                    welcomeText: data.welcomeText,
                    positionUpdateText: data.positionUpdateText,
                    yourTurnText: data.yourTurnText,
                    ...(data.minSecondsBetweenUpdates && { minSecondsBetweenUpdates: data.minSecondsBetweenUpdates }),
                    ...(data.minPositionsChangeToNotify && { minPositionsChangeToNotify: data.minPositionsChangeToNotify }),
                }
            });

            res.json(settings);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: 'Validation error', details: error.errors });
                return;
            }
            console.error('Error updating WhatsApp settings:', error);
            if (error instanceof z.ZodError) {
                console.error('Zod Validation Details:', JSON.stringify(error.errors, null, 2));
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
