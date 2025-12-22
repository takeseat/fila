/**
 * Locale detection and country mapping utilities
 * Used for auto-selecting country based on browser locale
 */

/**
 * Map of locale codes to ISO 3166-1 alpha-2 country codes
 */
const LOCALE_TO_COUNTRY_MAP: Record<string, string> = {
    // Portuguese
    'pt-BR': 'BR',
    'pt-PT': 'PT',

    // English
    'en-US': 'US',
    'en-GB': 'GB',
    'en-CA': 'CA',

    // Spanish
    'es-ES': 'ES',
    'es-MX': 'MX',
    'es-AR': 'AR',

    // Italian
    'it-IT': 'IT',

    // French
    'fr-FR': 'FR',
    'fr-CA': 'CA',

    // German
    'de-DE': 'DE',

    // Chinese
    'zh-CN': 'CN',
    'zh-TW': 'CN',

    // Japanese
    'ja-JP': 'JP',

    // Russian
    'ru-RU': 'RU',

    // Polish
    'pl-PL': 'PL',

    // Arabic
    'ar-SA': 'SA',
    'ar-AE': 'AE',
};

/**
 * Fallback mapping for language codes (without region)
 */
const LANGUAGE_TO_COUNTRY_MAP: Record<string, string> = {
    'pt': 'BR',
    'en': 'US',
    'es': 'ES',
    'it': 'IT',
    'fr': 'FR',
    'de': 'DE',
    'zh': 'CN',
    'ja': 'JP',
    'ru': 'RU',
    'pl': 'PL',
    'ar': 'SA',
};

/**
 * Get country code from locale string
 * @param locale - Locale string (e.g., 'pt-BR', 'en-US')
 * @returns ISO 3166-1 alpha-2 country code
 */
export function getCountryFromLocale(locale: string): string {
    // Try exact match first
    if (LOCALE_TO_COUNTRY_MAP[locale]) {
        return LOCALE_TO_COUNTRY_MAP[locale];
    }

    // Try language code only
    const languageCode = locale.split('-')[0];
    if (LANGUAGE_TO_COUNTRY_MAP[languageCode]) {
        return LANGUAGE_TO_COUNTRY_MAP[languageCode];
    }

    // Default fallback
    return 'US';
}

/**
 * Detect country from browser locale
 * @returns ISO 3166-1 alpha-2 country code
 */
export function detectCountryFromBrowser(): string {
    // Try navigator.language first
    if (navigator.language) {
        return getCountryFromLocale(navigator.language);
    }

    // Try first language from navigator.languages
    if (navigator.languages && navigator.languages.length > 0) {
        return getCountryFromLocale(navigator.languages[0]);
    }

    // Ultimate fallback
    return 'US';
}

/**
 * Get browser locale string
 * @returns Locale string (e.g., 'pt-BR', 'en-US')
 */
export function getBrowserLocale(): string {
    return navigator.language || navigator.languages?.[0] || 'en-US';
}
