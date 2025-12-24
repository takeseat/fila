// Business/Tax ID information by country
export interface BusinessIdInfo {
    code: string;
    labelKey?: string; // Translation key for the label
    placeholder: string;
    mask?: string;
    maxLength?: number;
}

export const BUSINESS_IDS: Record<string, BusinessIdInfo> = {
    BR: {
        code: 'BR',
        labelKey: 'CNPJ',
        placeholder: '00.000.000/0000-00',
        mask: '##.###.###/####-##',
        maxLength: 18
    },
    US: {
        code: 'US',
        labelKey: 'EIN',
        placeholder: '00-0000000',
        mask: '##-#######',
        maxLength: 10
    },
    PT: {
        code: 'PT',
        labelKey: 'NIPC',
        placeholder: '000000000',
        maxLength: 9
    },
    ES: {
        code: 'ES',
        labelKey: 'CIF/NIF',
        placeholder: 'A00000000',
        maxLength: 9
    },
    FR: {
        code: 'FR',
        labelKey: 'SIRET',
        placeholder: '000 000 000 00000',
        mask: '### ### ### #####',
        maxLength: 17
    },
    IT: {
        code: 'IT',
        labelKey: 'Partita IVA',
        placeholder: '00000000000',
        maxLength: 11
    },
    AR: {
        code: 'AR',
        labelKey: 'CUIT',
        placeholder: '00-00000000-0',
        mask: '##-########-#',
        maxLength: 13
    },
    MX: {
        code: 'MX',
        labelKey: 'RFC',
        placeholder: 'AAAA000000AAA',
        maxLength: 13
    },
    GB: {
        code: 'GB',
        labelKey: 'Company Number',
        placeholder: '00000000',
        maxLength: 8
    },
    DE: {
        code: 'DE',
        labelKey: 'Steuernummer',
        placeholder: '00/000/00000',
        mask: '##/###/#####',
        maxLength: 13
    },
    CA: {
        code: 'CA',
        labelKey: 'BN',
        placeholder: '000000000RC0000',
        maxLength: 15
    },
    AU: {
        code: 'AU',
        labelKey: 'ABN',
        placeholder: '00 000 000 000',
        mask: '## ### ### ###',
        maxLength: 14
    },
    JP: {
        code: 'JP',
        labelKey: '法人番号',
        placeholder: '0000000000000',
        maxLength: 13
    },
    CN: {
        code: 'CN',
        labelKey: '统一社会信用代码',
        placeholder: '00000000000000000A',
        maxLength: 18
    },
    RU: {
        code: 'RU',
        labelKey: 'ИНН',
        placeholder: '0000000000',
        maxLength: 10
    },
    PL: {
        code: 'PL',
        labelKey: 'NIP',
        placeholder: '000-000-00-00',
        mask: '###-###-##-##',
        maxLength: 13
    }
};

export function getBusinessIdInfo(countryCode: string): BusinessIdInfo {
    return BUSINESS_IDS[countryCode] || {
        code: countryCode,
        placeholder: 'Enter company ID',
        maxLength: 20
    };
}

export function getBusinessIdLabel(countryCode: string, fallbackLabel: string = 'Company ID'): string {
    const info = BUSINESS_IDS[countryCode];
    return info?.labelKey || fallbackLabel;
}

export function applyBusinessIdMask(value: string, countryCode: string): string {
    const info = getBusinessIdInfo(countryCode);
    if (!info.mask) return value;

    const cleaned = value.replace(/\D/g, '');
    let result = '';
    let valueIndex = 0;

    for (let i = 0; i < info.mask.length && valueIndex < cleaned.length; i++) {
        if (info.mask[i] === '#') {
            result += cleaned[valueIndex];
            valueIndex++;
        } else {
            result += info.mask[i];
        }
    }

    return result;
}
