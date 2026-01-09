import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { emailService } from './email.service';
import crypto from 'crypto';

export class AuthService {
    async register(data: RegisterInput, locale: string = 'en') {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.userEmail },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

        // Create restaurant and user in a transaction
        const passwordHash = await hashPassword(data.password);

        await prisma.$transaction(async (tx) => {
            // Create minimal restaurant placeholder
            const restaurant = await tx.restaurant.create({
                data: {
                    name: `${data.userName}'s Restaurant`, // Placeholder
                    countryCode: 'BR', // Default, will be updated in wizard
                    city: 'Pending', // Placeholder
                    onboardingPending: true,
                },
            });

            await tx.user.create({
                data: {
                    restaurantId: restaurant.id,
                    name: data.userName,
                    email: data.userEmail,
                    passwordHash,
                    role: 'ADMIN',
                    isActive: false, // Inactive until verified
                    verificationToken,
                    verificationTokenExpiresAt,
                },
            });
        });

        // Send verification email
        const appBaseUrl = process.env.APP_BASE_URL || 'https://takeseat.me';
        const verificationLink = `${appBaseUrl}/verify-email?token=${verificationToken}`;

        // Fire and forget (or await if critical) - awaiting to ensure SES accepts it
        try {
            await emailService.sendVerificationEmail({
                to: data.userEmail,
                verificationLink,
                locale,
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // We still return success to the user to avoid enumeration/blocking, 
            // but in a strict system we might rollback transaction.
            // For now, assume SES works or we have logs.
        }

        return {
            message: 'Verification email sent',
        };
    }

    async verifyEmail(token: string) {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            throw new Error('Invalid or expired verification token');
        }

        // Verify user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isActive: true,
                emailVerifiedAt: new Date(),
                verificationToken: null,
                verificationTokenExpiresAt: null,
            },
        });

        return {
            message: 'Email verified successfully. You can now login.',
        };
    }

    async login(data: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { restaurant: true },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('Account inactive. Please check your email for verification link.');
        }

        const isValidPassword = await comparePassword(data.password, user.passwordHash);

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccessToken({
            userId: user.id,
            restaurantId: user.restaurantId!,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
            restaurantId: user.restaurantId!,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                restaurantId: user.restaurantId,
                language: user.language,
            },
            restaurant: user.restaurant,
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(token: string) {
        try {
            const payload = verifyRefreshToken(token);

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            const accessToken = generateAccessToken({
                userId: user.id,
                restaurantId: user.restaurantId!,
                role: user.role,
            });

            return { accessToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
