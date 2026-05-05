/**
 * Language Utilities
 *
 * Centralized utilities for language management.
 * Single source of truth for supported languages and language resolution logic.
 *
 * MVP supported languages: en, pt-BR, es
 */

export const SUPPORTED_LANGUAGES = [
    'en',
    'pt-BR',
    'es',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Normalize language code to supported format.
 * Maps common browser variants to our supported languages.
 *
 * Examples:
 * - 'pt' → 'pt-BR'
 * - 'pt-PT' → 'pt-BR'
 * - 'en-US' → 'en'
 * - 'es-MX' → 'es'
 * - anything else → 'en' (fallback)
 */
export function normalizeLanguage(lang: string | undefined | null): SupportedLanguage {
    if (!lang) return 'en';

    const normalized = lang.toLowerCase().trim();

    // Direct match (case-insensitive)
    const direct = SUPPORTED_LANGUAGES.find(l => l.toLowerCase() === normalized);
    if (direct) return direct;

    // Map common variants
    if (normalized.startsWith('pt')) return 'pt-BR';
    if (normalized.startsWith('es')) return 'es';
    if (normalized.startsWith('en')) return 'en';

    // Fallback
    return 'en';
}

/**
 * Check if language is supported
 */
export function isSupported(lang: string | undefined | null): boolean {
    if (!lang) return false;
    const normalized = normalizeLanguage(lang);
    return SUPPORTED_LANGUAGES.includes(normalized);
}

/**
 * Check if language uses Right-to-Left layout.
 * None of the MVP languages are RTL.
 */
export function isRTL(_lang: string | undefined | null): boolean {
    return false;
}

/**
 * Resolve language with correct priority
 *
 * Priority:
 * 1. User's language (when logged in) — source of truth
 * 2. Stored language (localStorage)
 * 3. Browser language
 * 4. Fallback to English
 */
export function resolveLanguage(options: {
    userLanguage?: string | null;
    storedLanguage?: string | null;
    browserLanguage?: string | null;
}): SupportedLanguage {
    const { userLanguage, storedLanguage, browserLanguage } = options;

    // 1. User language (highest priority when logged in)
    if (userLanguage) {
        return normalizeLanguage(userLanguage);
    }

    // 2. Stored language (user preference when not logged in)
    if (storedLanguage) {
        return normalizeLanguage(storedLanguage);
    }

    // 3. Browser language
    if (browserLanguage) {
        const normalized = normalizeLanguage(browserLanguage);
        if (isSupported(normalized)) {
            return normalized;
        }
    }

    // 4. Fallback
    return 'en';
}

/**
 * Get browser language
 */
export function getBrowserLanguage(): string | null {
    if (typeof navigator === 'undefined') return null;
    return navigator.language || null;
}

/**
 * Get stored language from localStorage
 */
export function getStoredLanguage(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('preferredLanguage');
}

/**
 * Store language in localStorage
 */
export function storeLanguage(lang: SupportedLanguage): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('preferredLanguage', lang);
}
