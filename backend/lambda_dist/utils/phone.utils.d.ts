/**
 * Phone utility functions for local phone number handling
 * Works with phone numbers WITHOUT DDI (country code is separate)
 */
/**
 * Normalize phone number to international format
 * Removes all non-digit characters except the leading +
 * @param phone - Phone number in any format
 * @returns Normalized phone (e.g., "+5511999999999")
 */
export declare function normalizePhone(phone: string): string;
/**
 * Check if phone number is Brazilian (+55)
 * @param phone - Normalized phone number
 * @returns true if Brazilian phone
 */
export declare function isBrazilianPhone(phone: string): boolean;
/**
 * Validate international phone format
 * Must start with + followed by 8-15 digits
 * @param phone - Phone number to validate
 * @returns true if valid international format
 */
export declare function validateInternationalPhone(phone: string): boolean;
/**
 * Validate Brazilian phone format specifically
 * Must be +55 followed by 10 or 11 digits (DDD + number)
 * @param phone - Phone number to validate
 * @returns true if valid Brazilian format
 */
export declare function validateBrazilianPhone(phone: string): boolean;
/**
 * Normalize local phone number (remove formatting, keep only digits)
 * @param phone - Phone number in any format
 * @returns Normalized phone with only digits (e.g., "11999999999")
 */
export declare function normalizeLocalPhone(phone: string): string;
/**
 * Build full international phone number
 * @param ddi - Country calling code (e.g., "+55")
 * @param localPhone - Local phone number (e.g., "11999999999")
 * @returns Full phone number (e.g., "+5511999999999")
 */
export declare function buildFullPhone(ddi: string, localPhone: string): string;
/**
 * Validate Brazilian local phone format
 * Must have 10 or 11 digits (DDD + number)
 * @param phone - Local phone number
 * @returns true if valid Brazilian format
 */
export declare function validateBrazilianLocalPhone(phone: string): boolean;
/**
 * Validate generic local phone (minimum length check)
 * @param phone - Local phone number
 * @param minLength - Minimum number of digits (default: 6)
 * @returns true if valid
 */
export declare function validateLocalPhone(phone: string, minLength?: number): boolean;
//# sourceMappingURL=phone.utils.d.ts.map