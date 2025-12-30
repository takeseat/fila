"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    // Restaurant Information
    restaurantName: zod_1.z.string().min(1, 'Restaurant name is required'),
    tradeName: zod_1.z.string().optional().nullable(),
    businessId: zod_1.z.string().min(1, 'Business ID is required'), // Replaces cnpj, now required
    countryCode: zod_1.z.string().length(2).default('BR'), // ISO 3166-1 alpha-2
    stateCode: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().min(1, 'City is required'),
    addressLine: zod_1.z.string().min(1, 'Address is required'),
    addressNumber: zod_1.z.string().min(1, 'Address number is required'),
    addressComplement: zod_1.z.string().optional().nullable(),
    postalCode: zod_1.z.string().min(1, 'Postal code is required'),
    timezone: zod_1.z.string().default('America/Sao_Paulo'),
    // User Information
    userName: zod_1.z.string().min(1, 'User name is required'),
    userEmail: zod_1.z.string().email('Invalid user email'),
    userPhone: zod_1.z.string().min(1, 'Phone is required'), // Changed from 'phone'
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
//# sourceMappingURL=auth.validator.js.map