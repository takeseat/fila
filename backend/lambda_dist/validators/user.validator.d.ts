import { z } from 'zod';
export declare const SUPPORTED_LANGUAGES: readonly ["en", "pt-BR", "es", "it", "fr", "zh-CN", "ja", "ru", "pl", "ar"];
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
export declare const updateUserLanguageSchema: z.ZodObject<{
    language: z.ZodEnum<["en", "pt-BR", "es", "it", "fr", "zh-CN", "ja", "ru", "pl", "ar"]>;
}, "strip", z.ZodTypeAny, {
    language: "en" | "pt-BR" | "es" | "it" | "fr" | "zh-CN" | "ja" | "ru" | "pl" | "ar";
}, {
    language: "en" | "pt-BR" | "es" | "it" | "fr" | "zh-CN" | "ja" | "ru" | "pl" | "ar";
}>;
export type UpdateUserLanguageDto = z.infer<typeof updateUserLanguageSchema>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodEnum<["en", "pt-BR", "es", "it", "fr", "zh-CN", "ja", "ru", "pl", "ar"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    language?: "en" | "pt-BR" | "es" | "it" | "fr" | "zh-CN" | "ja" | "ru" | "pl" | "ar" | undefined;
}, {
    name?: string | undefined;
    language?: "en" | "pt-BR" | "es" | "it" | "fr" | "zh-CN" | "ja" | "ru" | "pl" | "ar" | undefined;
}>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export declare const updatePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
//# sourceMappingURL=user.validator.d.ts.map