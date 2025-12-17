import { z } from 'zod';

export const registerSchema = z.object({
    restaurantName: z.string().min(1, 'Restaurant name is required'),
    cnpj: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email'),
    city: z.string().min(1, 'City is required'),
    timezone: z.string().default('America/Sao_Paulo'),
    userName: z.string().min(1, 'User name is required'),
    userEmail: z.string().email('Invalid user email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
