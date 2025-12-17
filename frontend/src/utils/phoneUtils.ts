/**
 * Phone utility functions for frontend
 * Handles local phone numbers (without DDI) and Brazilian masking
 */

/**
 * Remove all non-digit characters from phone
 * @param phone - Phone number in any format
 * @returns Only digits
 */
export function removeMask(phone: string): string {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
}

/**
 * Apply Brazilian phone mask
 * Format: (99) 99999-9999 or (99) 9999-9999
 * @param phone - Phone number (digits only or with partial mask)
 * @returns Formatted Brazilian phone
 */
export function applyBrazilianMask(phone: string): string {
    const digits = removeMask(phone);

    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        // 10 digits: (99) 9999-9999 (landline)
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
    }
    // 11 digits: (99) 99999-9999 (mobile)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
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

    // Remove mask from local phone
    const normalizedPhone = removeMask(localPhone);

    return `${normalizedDdi}${normalizedPhone}`;
}

/**
 * Validate Brazilian local phone format
 * Must have 10 or 11 digits (DDD + number)
 * @param phone - Local phone number
 * @returns true if valid Brazilian format
 */
export function validateBrazilianLocalPhone(phone: string): boolean {
    const digits = removeMask(phone);

    // Brazilian phones: 10 digits (landline) or 11 digits (mobile)
    // Format: DDD (2 digits) + number (8 or 9 digits)
    return /^\d{10,11}$/.test(digits);
}

/**
 * Validate generic local phone (minimum length check)
 * @param phone - Local phone number
 * @param minLength - Minimum number of digits (default: 6)
 * @returns true if valid
 */
export function validateLocalPhone(phone: string, minLength: number = 6): boolean {
    const digits = removeMask(phone);
    return digits.length >= minLength;
}

/**
 * Get phone display value based on country
 * @param phone - Local phone number
 * @param countryCode - Country code (e.g., "BR")
 * @returns Formatted phone for display
 */
export function getPhoneDisplay(phone: string, countryCode: string): string {
    if (!phone) return '';

    if (countryCode === 'BR') {
        return applyBrazilianMask(phone);
    }

    // For other countries, just return digits with spaces every 3 chars
    const digits = removeMask(phone);
    return digits.match(/.{1,3}/g)?.join(' ') || digits;
}
