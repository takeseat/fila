/**
 * Countries utilities for international phone support
 * Provides country data with flags, DDI codes, and phone masks
 */
export interface Country {
    code: string;
    name: string;
    ddi: string;
    flag: string;
    phoneMask?: string;
}
export declare const COUNTRIES: Country[];
export declare const DEFAULT_COUNTRY: Country;
/**
 * Get country by country code
 * @param code - ISO 3166-1 alpha-2 code (e.g., "BR")
 * @returns Country object or undefined
 */
export declare function getCountryByCode(code: string): Country | undefined;
/**
 * Get country by DDI
 * @param ddi - Country calling code (e.g., "+55")
 * @returns Country object or undefined
 */
export declare function getCountryByDdi(ddi: string): Country | undefined;
/**
 * Validate country code
 * @param code - Country code to validate
 * @returns true if valid
 */
export declare function validateCountryCode(code: string): boolean;
/**
 * Build full international phone number
 * @param ddi - Country calling code (e.g., "+55")
 * @param localPhone - Local phone number without DDI (e.g., "11999999999")
 * @returns Full phone number (e.g., "+5511999999999")
 */
export declare function buildFullPhone(ddi: string, localPhone: string): string;
/**
 * Parse full phone into DDI and local phone
 * @param fullPhone - Full international phone (e.g., "+5511999999999")
 * @returns Object with ddi and localPhone, or null if invalid
 */
export declare function parseFullPhone(fullPhone: string): {
    ddi: string;
    localPhone: string;
    country?: Country;
} | null;
//# sourceMappingURL=countries.utils.d.ts.map