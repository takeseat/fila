import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { LoginInput } from '../validators/auth.validator';
import { emailService } from './email.service';
import crypto from 'crypto';

export class AuthService {
    async signupEmail(email: string, locale: string = 'en') {
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            // Security: Don't reveal if user exists? Or throw?
            // User requested "User already exists" detailed error in previous turn, so we keep it.
            throw new Error('User already exists');
        }

        // Generate verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Upsert PendingSignup
        await prisma.pendingSignup.upsert({
            where: { email: normalizedEmail },
            update: { token, expiresAt },
            create: { email: normalizedEmail, token, expiresAt },
        });

        // Send email
        const appBaseUrl = process.env.APP_BASE_URL || 'https://app.takeseat.me';
        // Link now points to frontend /verify-email which will ask for Name/Password + Token
        const verificationLink = `${appBaseUrl}/verify-email?token=${token}&locale=${locale}`;

        try {
            await emailService.sendVerificationEmail({
                to: normalizedEmail,
                verificationLink,
                locale,
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw new Error('Failed to send verification email');
        }

        return { message: 'Verification email sent' };
    }

    async completeSignup(data: { token: string; userName: string; password: string; language?: string }) {
        // Find pending signup
        const pending = await prisma.pendingSignup.findUnique({
            where: { token: data.token },
        });

        if (!pending || pending.expiresAt < new Date()) {
            throw new Error('Invalid or expired verification token');
        }

        // Create User & Restaurant
        const passwordHash = await hashPassword(data.password);

        const result = await prisma.$transaction(async (tx) => {
            const restaurant = await tx.restaurant.create({
                data: {
                    name: `${data.userName}'s Restaurant`,
                    countryCode: 'BR',
                    city: '', // Will be filled during onboarding
                    onboardingPending: true,
                },
            });

            // Create default WhatsApp settings with templates enabled
            await tx.restaurantWhatsAppSettings.create({
                data: {
                    restaurantId: restaurant.id,
                    isEnabled: true,
                    // Waitlist messages - enabled by default
                    sendWelcome: true,
                    sendPositionUpdates: true,
                    sendTurnMessage: true,
                    welcomeText: 'Olá {{customer_name}}! Você entrou na fila de {{business_name}}. Sua posição atual é {{position}}. Tempo estimado: {{eta_minutes}} minutos.',
                    positionUpdateText: 'Olá {{customer_name}}! Sua posição na fila foi atualizada. Posição atual: {{position}}. Faltam aproximadamente {{eta_minutes}} minutos.',
                    yourTurnText: 'Olá {{customer_name}}, sua mesa está pronta! Por favor, dirija-se ao balcão de {{business_name}}. Até já!',
                    minSecondsBetweenUpdates: 300,
                    minPositionsChangeToNotify: 5,
                },
            });

            const user = await tx.user.create({
                data: {
                    restaurantId: restaurant.id,
                    name: data.userName,
                    email: pending.email,
                    passwordHash,
                    role: 'ADMIN',
                    isActive: true, // Active immediately after completing signup flow
                    emailVerifiedAt: new Date(),
                    language: data.language || 'en',
                },
            });

            // Delete pending signup
            await tx.pendingSignup.delete({ where: { id: pending.id } });

            return { user, restaurant };
        });

        const accessToken = generateAccessToken({
            userId: result.user.id,
            restaurantId: result.user.restaurantId!,
            role: result.user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: result.user.id,
            restaurantId: result.user.restaurantId!,
            role: result.user.role,
        });

        return {
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                restaurantId: result.user.restaurantId,
                language: result.user.language,
            },
            restaurant: {
                ...result.restaurant,
                onboardingPending: true,
            },
            accessToken,
            refreshToken,
        };
    }

    // Legacy method for backward compat or if needed
    async register(data: any, locale: string = 'en') {
        // Map old register to signupEmail?
        // But old register had Name/Pass. If we call signupEmail, we ignore them.
        // Given the strict requirement "Only Email", we should force signupEmail flow.
        return this.signupEmail(data.userEmail, locale);
    }

    // Verify token validity (optional, for frontend check)
    async verifyTokenValues(token: string) {
        const pending = await prisma.pendingSignup.findUnique({
            where: { token },
        });

        if (!pending || pending.expiresAt < new Date()) {
            throw new Error('Invalid or expired verification token');
        }
        return { valid: true, email: pending.email };
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
