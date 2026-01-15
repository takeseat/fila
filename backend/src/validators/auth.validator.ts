import { z } from 'zod';

// Step 1: Email only
export const signupEmailSchema = z.object({
    userEmail: z.string()
        .trim()
        .toLowerCase()
        .email('Invalid user email'),
    locale: z.string().optional(),
});

// Step 2: Complete Signup
export const completeSignupSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    userName: z.string()
        .trim()
        .min(1, 'User name is required')
        .min(2, 'User name must be at least 2 characters long')
        .max(80, 'User name must not exceed 80 characters')
        .refine((val) => val.trim().length > 0, 'User name cannot be just spaces'),
    password: z.string()
        .min(10, 'Password must be at least 10 characters long')
        .refine((val) => {
            let matches = 0;
            if (/[a-z]/.test(val)) matches++;
            if (/[A-Z]/.test(val)) matches++;
            if (/\d/.test(val)) matches++;
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) matches++;
            return matches >= 3;
        }, 'Password must contain at least 3 of the following: uppercase, lowercase, number, special character'),
    language: z.string().optional(),
});

// Kept for backward compatibility if needed, but implementation will change
export const registerSchema = signupEmailSchema;

export type SignupEmailInput = z.infer<typeof signupEmailSchema>;
export type CompleteSignupInput = z.infer<typeof completeSignupSchema>;
export type RegisterInput = SignupEmailInput; // Alias for now

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
