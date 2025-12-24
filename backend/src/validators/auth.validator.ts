import { z } from 'zod';

export const registerSchema = z.object({
    // Restaurant Information
    restaurantName: z.string().min(1, 'Restaurant name is required'),
    tradeName: z.string().optional().nullable(),
    businessId: z.string().min(1, 'Business ID is required'), // Replaces cnpj, now required
    countryCode: z.string().length(2).default('BR'), // ISO 3166-1 alpha-2
    stateCode: z.string().optional().nullable(),
    city: z.string().min(1, 'City is required'),
    addressLine: z.string().min(1, 'Address is required'),
    addressNumber: z.string().min(1, 'Address number is required'),
    addressComplement: z.string().optional().nullable(),
    postalCode: z.string().min(1, 'Postal code is required'),
    timezone: z.string().default('America/Sao_Paulo'),

    // User Information
    userName: z.string().min(1, 'User name is required'),
    userEmail: z.string().email('Invalid user email'),
    userPhone: z.string().min(1, 'Phone is required'), // Changed from 'phone'
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
