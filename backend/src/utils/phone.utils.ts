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
export function normalizePhone(phone: string): string {
    if (!phone) return '';

    // Remove all spaces, dashes, parentheses, etc.
    let normalized = phone.replace(/[\s\-\(\)\.]/g, '');

    // Ensure it starts with +
    if (!normalized.startsWith('+')) {
        normalized = '+' + normalized;
    }

    // Keep only + and digits
    normalized = normalized.replace(/[^\d+]/g, '');

    return normalized;
}

/**
 * Check if phone number is Brazilian (+55)
 * @param phone - Normalized phone number
 * @returns true if Brazilian phone
 */
export function isBrazilianPhone(phone: string): boolean {
    const normalized = normalizePhone(phone);
    return normalized.startsWith('+55');
}

/**
 * Validate international phone format
 * Must start with + followed by 8-15 digits
 * @param phone - Phone number to validate
 * @returns true if valid international format
 */
export function validateInternationalPhone(phone: string): boolean {
    const normalized = normalizePhone(phone);

    // Must start with + and have 8-15 digits after it
    const regex = /^\+\d{8,15}$/;
    return regex.test(normalized);
}

/**
 * Validate Brazilian phone format specifically
 * Must be +55 followed by 10 or 11 digits (DDD + number)
 * @param phone - Phone number to validate
 * @returns true if valid Brazilian format
 */
export function validateBrazilianPhone(phone: string): boolean {
    const normalized = normalizePhone(phone);

    // +55 + 2 digits (DDD) + 8 or 9 digits (number)
    const regex = /^\+55\d{10,11}$/;
    return regex.test(normalized);
}

/**
 * Normalize local phone number (remove formatting, keep only digits)
 * @param phone - Phone number in any format
 * @returns Normalized phone with only digits (e.g., "11999999999")
 */
export function normalizeLocalPhone(phone: string): string {
    if (!phone) return '';

    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
}

/**
 * Build full international phone number
 * @param ddi - Country calling code (e.g., "+55")
 * @param localPhone - Local phone number (e.g., "11999999999")
 * @returns Full phone number (e.g., "+5511999999999")
 */
export function buildFullPhone(ddi: string, localPhone: string): string {
    // Ensure DDI starts with +
    const normalizedDdi = ddi.startsWith('+') ? ddi : `+${ddi}`;

    // Normalize local phone
    const normalizedPhone = normalizeLocalPhone(localPhone);

    return `${normalizedDdi}${normalizedPhone}`;
}

/**
 * Validate Brazilian local phone format
 * Must have 10 or 11 digits (DDD + number)
 * @param phone - Local phone number
 * @returns true if valid Brazilian format
 */
export function validateBrazilianLocalPhone(phone: string): boolean {
    const normalized = normalizeLocalPhone(phone);

    // Brazilian phones: 10 digits (landline) or 11 digits (mobile)
    // Format: DDD (2 digits) + number (8 or 9 digits)
    return /^\d{10,11}$/.test(normalized);
}

/**
 * Validate generic local phone (minimum length check)
 * @param phone - Local phone number
 * @param minLength - Minimum number of digits (default: 6)
 * @returns true if valid
 */
export function validateLocalPhone(phone: string, minLength: number = 6): boolean {
    const normalized = normalizeLocalPhone(phone);
    return normalized.length >= minLength;
}
