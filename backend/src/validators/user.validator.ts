import { z } from 'zod';

// Supported languages
export const SUPPORTED_LANGUAGES = [
    'en',
    'pt-BR',
    'es',
    'it',
    'fr',
    'zh-CN',
    'ja',
    'ru',
    'pl',
    'ar',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Update user language schema
export const updateUserLanguageSchema = z.object({
    language: z.enum(SUPPORTED_LANGUAGES, {
        errorMap: () => ({ message: 'Invalid language. Must be one of: en, pt-BR, es, it, fr, zh-CN, ja, ru, pl, ar' }),
    }),
});

export type UpdateUserLanguageDto = z.infer<typeof updateUserLanguageSchema>;

// Update profile schema (name and/or language)
export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters').optional(),
    language: z.enum(SUPPORTED_LANGUAGES, {
        errorMap: () => ({ message: 'Invalid language. Must be one of: en, pt-BR, es, it, fr, zh-CN, ja, ru, pl, ar' }),
    }).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

// Update password schema
export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
