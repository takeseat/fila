/**
 * Phone utility functions for frontend
 * Handles local phone numbers (without DDI) and masking by country
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
 * Apply US/Canada phone mask
 * Format: (999) 999-9999
 */
export function applyUSMask(phone: string): string {
    const digits = removeMask(phone);

    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Apply UK phone mask
 * Format: 9999 999 9999
 */
export function applyUKMask(phone: string): string {
    const digits = removeMask(phone);

    if (digits.length === 0) return '';
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
}

/**
 * Apply Argentina phone mask
 * Format: 9999-9999 or 99 9999-9999
 */
export function applyArgentinaMask(phone: string): string {
    const digits = removeMask(phone);

    if (digits.length === 0) return '';
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Apply Mexico phone mask
 * Format: 999 999 9999
 */
export function applyMexicoMask(phone: string): string {
    const digits = removeMask(phone);

    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
}

/**
 * Apply generic international mask
 * Format: Groups of 3-4 digits separated by spaces
 */
export function applyGenericMask(phone: string): string {
    const digits = removeMask(phone);

    if (digits.length === 0) return '';

    // Group digits: first 3, then groups of 3
    const parts: string[] = [];
    if (digits.length > 0) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 9));
    if (digits.length > 9) parts.push(digits.slice(9, 12));
    if (digits.length > 12) parts.push(digits.slice(12));

    return parts.join(' ');
}

/**
 * Apply phone mask based on country code
 * @param phone - Phone number
 * @param countryCode - ISO country code
 * @returns Formatted phone number
 */
export function applyPhoneMask(phone: string, countryCode: string): string {
    if (!phone) return '';

    const digits = removeMask(phone);
    if (digits.length === 0) return '';

    switch (countryCode) {
        case 'BR':
            return applyBrazilianMask(phone);
        case 'US':
        case 'CA':
            return applyUSMask(phone);
        case 'GB':
            return applyUKMask(phone);
        case 'AR':
            return applyArgentinaMask(phone);
        case 'MX':
            return applyMexicoMask(phone);
        default:
            return applyGenericMask(phone);
    }
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
    return applyPhoneMask(phone, countryCode);
}

/**
 * Get placeholder for phone input based on country
 * @param countryCode - Country code
 * @returns Placeholder text
 */
export function getPhonePlaceholder(countryCode: string): string {
    switch (countryCode) {
        case 'BR':
            return '(11) 99999-9999';
        case 'US':
        case 'CA':
            return '(555) 123-4567';
        case 'GB':
            return '7700 900123';
        case 'AR':
            return '11 1234-5678';
        case 'MX':
            return '55 1234 5678';
        default:
            return '123 456 7890';
    }
}
