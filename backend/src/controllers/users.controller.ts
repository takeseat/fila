import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { updateUserLanguageSchema, updateProfileSchema, updatePasswordSchema } from '../validators/user.validator';
import { AuthRequest } from '../middleware/auth';
import { comparePassword, hashPassword } from '../utils/password';

const prisma = new PrismaClient();

export class UsersController {
    // Update user language preference
    async updateLanguage(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validate request body
            const validation = updateUserLanguageSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validation.error.errors,
                });
            }

            const { language } = validation.data;

            // Update user language
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { language },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    language: true,
                },
            });

            return res.json({
                message: 'Language updated successfully',
                user: updatedUser,
            });
        } catch (error) {
            console.error('Error updating user language:', error);
            return res.status(500).json({ error: 'Failed to update language' });
        }
    }

    // Get current user profile
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    language: true,
                    restaurantId: true,
                },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json({ user });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }

    // Update user profile (name and/or language)
    async updateProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validate request body
            const validation = updateProfileSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validation.error.errors,
                });
            }

            const updateData = validation.data;

            // Check if there's anything to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'No data to update' });
            }

            // Update user profile
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    language: true,
                    restaurantId: true,
                },
            });

            return res.json({
                message: 'Profile updated successfully',
                user: updatedUser,
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    // Update user password
    async updatePassword(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validate request body
            const validation = updatePasswordSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validation.error.errors,
                });
            }

            const { currentPassword, newPassword } = validation.data;

            // Get user with password hash
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    passwordHash: true,
                },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify current password
            const isValidPassword = await comparePassword(currentPassword, user.passwordHash);

            if (!isValidPassword) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            // Hash new password
            const newPasswordHash = await hashPassword(newPassword);

            // Update password
            await prisma.user.update({
                where: { id: userId },
                data: {
                    passwordHash: newPasswordHash,
                    updatedAt: new Date(),
                },
            });

            return res.json({
                message: 'Password updated successfully',
            });
        } catch (error) {
            console.error('Error updating password:', error);
            return res.status(500).json({ error: 'Failed to update password' });
        }
    }
}
