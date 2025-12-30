"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordSchema = exports.updateProfileSchema = exports.updateUserLanguageSchema = exports.SUPPORTED_LANGUAGES = void 0;
const zod_1 = require("zod");
// Supported languages
exports.SUPPORTED_LANGUAGES = [
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
];
// Update user language schema
exports.updateUserLanguageSchema = zod_1.z.object({
    language: zod_1.z.enum(exports.SUPPORTED_LANGUAGES, {
        errorMap: () => ({ message: 'Invalid language. Must be one of: en, pt-BR, es, it, fr, zh-CN, ja, ru, pl, ar' }),
    }),
});
// Update profile schema (name and/or language)
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters').optional(),
    language: zod_1.z.enum(exports.SUPPORTED_LANGUAGES, {
        errorMap: () => ({ message: 'Invalid language. Must be one of: en, pt-BR, es, it, fr, zh-CN, ja, ru, pl, ar' }),
    }).optional(),
});
// Update password schema
exports.updatePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
//# sourceMappingURL=user.validator.js.map