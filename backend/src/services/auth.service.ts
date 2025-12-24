import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthService {
    async register(data: RegisterInput) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.userEmail },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create restaurant and user in a transaction
        const passwordHash = await hashPassword(data.password);

        const result = await prisma.$transaction(async (tx) => {
            const restaurant = await tx.restaurant.create({
                data: {
                    name: data.restaurantName,
                    tradeName: data.tradeName,
                    cnpj: data.businessId, // Using businessId for cnpj field
                    countryCode: data.countryCode,
                    stateCode: data.stateCode,
                    city: data.city,
                    addressLine: data.addressLine,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
                    postalCode: data.postalCode,
                    timezone: data.timezone,
                },
            });

            const user = await tx.user.create({
                data: {
                    restaurantId: restaurant.id,
                    name: data.userName,
                    email: data.userEmail,
                    passwordHash,
                    role: 'ADMIN',
                },
            });

            return { restaurant, user };
        });

        const accessToken = generateAccessToken({
            userId: result.user.id,
            restaurantId: result.user.restaurantId,
            role: result.user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: result.user.id,
            restaurantId: result.user.restaurantId,
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
            restaurant: result.restaurant,
            accessToken,
            refreshToken,
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

        const isValidPassword = await comparePassword(data.password, user.passwordHash);

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccessToken({
            userId: user.id,
            restaurantId: user.restaurantId,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
            restaurantId: user.restaurantId,
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
                restaurantId: user.restaurantId,
                role: user.role,
            });

            return { accessToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
