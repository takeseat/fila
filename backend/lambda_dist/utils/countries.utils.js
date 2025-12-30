"use strict";
/**
 * Countries utilities for international phone support
 * Provides country data with flags, DDI codes, and phone masks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_COUNTRY = exports.COUNTRIES = void 0;
exports.getCountryByCode = getCountryByCode;
exports.getCountryByDdi = getCountryByDdi;
exports.validateCountryCode = validateCountryCode;
exports.buildFullPhone = buildFullPhone;
exports.parseFullPhone = parseFullPhone;
exports.COUNTRIES = [
    { code: "BR", name: "Brasil", ddi: "+55", flag: "🇧🇷", phoneMask: "(99) 99999-9999" },
    { code: "US", name: "Estados Unidos", ddi: "+1", flag: "🇺🇸" },
    { code: "CA", name: "Canadá", ddi: "+1", flag: "🇨🇦" },
    { code: "PT", name: "Portugal", ddi: "+351", flag: "🇵🇹" },
    { code: "AR", name: "Argentina", ddi: "+54", flag: "🇦🇷" },
    { code: "CL", name: "Chile", ddi: "+56", flag: "🇨🇱" },
    { code: "MX", name: "México", ddi: "+52", flag: "🇲🇽" },
    { code: "CO", name: "Colômbia", ddi: "+57", flag: "🇨🇴" },
    { code: "PE", name: "Peru", ddi: "+51", flag: "🇵🇪" },
    { code: "UY", name: "Uruguai", ddi: "+598", flag: "🇺🇾" },
    { code: "PY", name: "Paraguai", ddi: "+595", flag: "🇵🇾" },
    { code: "ES", name: "Espanha", ddi: "+34", flag: "🇪🇸" },
    { code: "IT", name: "Itália", ddi: "+39", flag: "🇮🇹" },
    { code: "FR", name: "França", ddi: "+33", flag: "🇫🇷" },
    { code: "DE", name: "Alemanha", ddi: "+49", flag: "🇩🇪" },
    { code: "GB", name: "Reino Unido", ddi: "+44", flag: "🇬🇧" },
    { code: "AU", name: "Austrália", ddi: "+61", flag: "🇦🇺" },
    { code: "JP", name: "Japão", ddi: "+81", flag: "🇯🇵" },
    { code: "CN", name: "China", ddi: "+86", flag: "🇨🇳" },
    { code: "IN", name: "Índia", ddi: "+91", flag: "🇮🇳" },
];
exports.DEFAULT_COUNTRY = exports.COUNTRIES[0]; // Brasil
/**
 * Get country by country code
 * @param code - ISO 3166-1 alpha-2 code (e.g., "BR")
 * @returns Country object or undefined
 */
function getCountryByCode(code) {
    return exports.COUNTRIES.find(c => c.code === code);
}
/**
 * Get country by DDI
 * @param ddi - Country calling code (e.g., "+55")
 * @returns Country object or undefined
 */
function getCountryByDdi(ddi) {
    return exports.COUNTRIES.find(c => c.ddi === ddi);
}
/**
 * Validate country code
 * @param code - Country code to validate
 * @returns true if valid
 */
function validateCountryCode(code) {
    return exports.COUNTRIES.some(c => c.code === code);
}
/**
 * Build full international phone number
 * @param ddi - Country calling code (e.g., "+55")
 * @param localPhone - Local phone number without DDI (e.g., "11999999999")
 * @returns Full phone number (e.g., "+5511999999999")
 */
function buildFullPhone(ddi, localPhone) {
    // Ensure DDI starts with +
    const normalizedDdi = ddi.startsWith('+') ? ddi : `+${ddi}`;
    // Remove any non-digit characters from local phone
    const normalizedPhone = localPhone.replace(/\D/g, '');
    return `${normalizedDdi}${normalizedPhone}`;
}
/**
 * Parse full phone into DDI and local phone
 * @param fullPhone - Full international phone (e.g., "+5511999999999")
 * @returns Object with ddi and localPhone, or null if invalid
 */
function parseFullPhone(fullPhone) {
    if (!fullPhone || !fullPhone.startsWith('+')) {
        return null;
    }
    // Try to match against known DDIs (longest first)
    const sortedCountries = [...exports.COUNTRIES].sort((a, b) => b.ddi.length - a.ddi.length);
    for (const country of sortedCountries) {
        if (fullPhone.startsWith(country.ddi)) {
            return {
                ddi: country.ddi,
                localPhone: fullPhone.substring(country.ddi.length),
                country,
            };
        }
    }
    // Fallback: assume first 1-4 digits after + are DDI
    const match = fullPhone.match(/^(\+\d{1,4})(\d+)$/);
    if (match) {
        return {
            ddi: match[1],
            localPhone: match[2],
        };
    }
    return null;
}
//# sourceMappingURL=countries.utils.js.map