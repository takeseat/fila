// ISO 3166-1 alpha-2 country codes with states/regions
// This file contains comprehensive country data for international address support

export interface State {
    code: string;
    name: string;
}

export interface Country {
    code: string; // ISO 3166-1 alpha-2
    name: string;
    nameI18nKey: string; // Translation key
    ddi: string; // Phone prefix
    states?: State[]; // States/Provinces/Regions (if applicable)
}

// Brazilian States
const BRAZILIAN_STATES: State[] = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' },
];

// US States
const US_STATES: State[] = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
];

export const COUNTRIES: Country[] = [
    {
        code: 'BR',
        name: 'Brazil',
        nameI18nKey: 'countries.brazil',
        ddi: '+55',
        states: BRAZILIAN_STATES,
    },
    {
        code: 'US',
        name: 'United States',
        nameI18nKey: 'countries.unitedStates',
        ddi: '+1',
        states: US_STATES,
    },
    {
        code: 'PT',
        name: 'Portugal',
        nameI18nKey: 'countries.portugal',
        ddi: '+351',
    },
    {
        code: 'ES',
        name: 'Spain',
        nameI18nKey: 'countries.spain',
        ddi: '+34',
    },
    {
        code: 'IT',
        name: 'Italy',
        nameI18nKey: 'countries.italy',
        ddi: '+39',
    },
    {
        code: 'FR',
        name: 'France',
        nameI18nKey: 'countries.france',
        ddi: '+33',
    },
    {
        code: 'DE',
        name: 'Germany',
        nameI18nKey: 'countries.germany',
        ddi: '+49',
    },
    {
        code: 'CN',
        name: 'China',
        nameI18nKey: 'countries.china',
        ddi: '+86',
    },
    {
        code: 'JP',
        name: 'Japan',
        nameI18nKey: 'countries.japan',
        ddi: '+81',
    },
    {
        code: 'RU',
        name: 'Russia',
        nameI18nKey: 'countries.russia',
        ddi: '+7',
    },
    {
        code: 'PL',
        name: 'Poland',
        nameI18nKey: 'countries.poland',
        ddi: '+48',
    },
    {
        code: 'MX',
        name: 'Mexico',
        nameI18nKey: 'countries.mexico',
        ddi: '+52',
    },
    {
        code: 'AR',
        name: 'Argentina',
        nameI18nKey: 'countries.argentina',
        ddi: '+54',
    },
    {
        code: 'GB',
        name: 'United Kingdom',
        nameI18nKey: 'countries.unitedKingdom',
        ddi: '+44',
    },
    {
        code: 'CA',
        name: 'Canada',
        nameI18nKey: 'countries.canada',
        ddi: '+1',
    },
];

// Helper functions
export function getCountryByCode(code: string): Country | undefined {
    return COUNTRIES.find(c => c.code === code);
}

export function getStatesByCountryCode(countryCode: string): State[] {
    const country = getCountryByCode(countryCode);
    return country?.states || [];
}

export function getCountryByDDI(ddi: string): Country | undefined {
    return COUNTRIES.find(c => c.ddi === ddi);
}

// Default country (Brazil)
export const DEFAULT_COUNTRY = COUNTRIES[0];
