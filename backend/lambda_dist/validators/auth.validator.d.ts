import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    restaurantName: z.ZodString;
    tradeName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    businessId: z.ZodString;
    countryCode: z.ZodDefault<z.ZodString>;
    stateCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    city: z.ZodString;
    addressLine: z.ZodString;
    addressNumber: z.ZodString;
    addressComplement: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    postalCode: z.ZodString;
    timezone: z.ZodDefault<z.ZodString>;
    userName: z.ZodString;
    userEmail: z.ZodString;
    userPhone: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    restaurantName: string;
    businessId: string;
    countryCode: string;
    city: string;
    addressLine: string;
    addressNumber: string;
    postalCode: string;
    timezone: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    password: string;
    tradeName?: string | null | undefined;
    stateCode?: string | null | undefined;
    addressComplement?: string | null | undefined;
}, {
    restaurantName: string;
    businessId: string;
    city: string;
    addressLine: string;
    addressNumber: string;
    postalCode: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    password: string;
    tradeName?: string | null | undefined;
    countryCode?: string | undefined;
    stateCode?: string | null | undefined;
    addressComplement?: string | null | undefined;
    timezone?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
//# sourceMappingURL=auth.validator.d.ts.map