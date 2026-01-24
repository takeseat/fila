import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateStep1Schema = z.object({
    restaurantName: z.string().min(2, 'Name must be at least 2 characters'),
    countryCode: z.string().length(2, 'Invalid country code'),
});

const updateStep2Schema = z.object({
    language: z.string().length(2, 'Invalid language code'),
});

export class OnboardingController {
    /**
     * Step 1: Update Restaurant Name and Country
     */
    static async updateStep1(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            console.log('[Onboarding] Step 1 req.user:', req.user);

            // @ts-ignore
            if (!req.user || !req.user.restaurantId) {
                throw new Error('User context missing or invalid');
            }

            // @ts-ignore
            const restaurantId = req.user.restaurantId;
            const data = updateStep1Schema.parse(req.body);

            await prisma.restaurant.update({
                where: { id: restaurantId },
                data: {
                    name: data.restaurantName,
                    countryCode: data.countryCode,
                },
            });

            res.json({ success: true, message: 'Step 1 completed' });
        } catch (error: any) {
            console.error('[Onboarding] Step 1 error:', error);
            res.status(400).json({ error: error.message || 'Failed to update details' });
        }
    }

    /**
     * Step 2: Update Language
     */
    static async updateStep2(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            console.log('[Onboarding] Step 2 req.user:', req.user);

            // @ts-ignore
            if (!req.user || !req.user.userId) { // Use userId from AuthRequest
                throw new Error('User context missing or invalid');
            }

            // @ts-ignore
            const userId = req.user.userId; // Fixed: was req.user.id
            const data = updateStep2Schema.parse(req.body);

            // Update user language preference
            await prisma.user.update({
                where: { id: userId },
                data: { language: data.language },
            });

            res.json({ success: true, message: 'Step 2 completed' });
        } catch (error: any) {
            console.error('[Onboarding] Step 2 error:', error);
            res.status(400).json({ error: error.message || 'Failed to update language' });
        }
    }

    /**
     * Complete Onboarding
     * Now auto-starts PRO trial with 7-day period
     */
    static async complete(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            if (!req.user || !req.user.restaurantId) {
                throw new Error('User context missing');
            }
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            const now = new Date();
            const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

            await prisma.restaurant.update({
                where: { id: restaurantId },
                data: {
                    onboardingPending: false,
                    // Initialize PRO trial
                    plan: 'PRO',
                    subscriptionStatus: 'TRIALING',
                    trialStatus: 'ACTIVE',
                    trialStartAt: now,
                    trialEndAt: trialEndsAt,
                    trialConsumedAt: now,
                },
            });

            console.log(`[Onboarding] PRO trial started for restaurant ${restaurantId}. Expires: ${trialEndsAt.toISOString()}`);

            res.json({
                success: true,
                message: 'Onboarding completed - PRO trial activated',
                onboardingPending: false,
                plan: 'PRO',
                subscriptionStatus: 'TRIALING',
                trialEndsAt: trialEndsAt.toISOString()
            });
        } catch (error: any) {
            console.error('[Onboarding] Complete error:', error);
            res.status(400).json({ error: error.message || 'Failed to complete onboarding' });
        }
    }
}
