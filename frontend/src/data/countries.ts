/**
 * Countries data for international phone support
 * Provides country codes, names, DDI codes, and flags
 */

export interface Country {
    code: string;       // ISO 3166-1 alpha-2: "BR", "US", "PT"
    name: string;       // "Brasil", "Estados Unidos"
    ddi: string;        // "+55", "+1", "+351"
    flag: string;       // "🇧🇷", "🇺🇸", "🇵🇹"
    phoneMask?: string; // Optional mask for specific countries
}

export const COUNTRIES: Country[] = [
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

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Brasil

/**
 * Get country by country code
 */
export function getCountryByCode(code: string): Country | undefined {
    return COUNTRIES.find(c => c.code === code);
}

/**
 * Get country by DDI
 */
export function getCountryByDdi(ddi: string): Country | undefined {
    return COUNTRIES.find(c => c.ddi === ddi);
}
