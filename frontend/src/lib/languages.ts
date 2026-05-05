export interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    dir: 'ltr' | 'rtl';
}

/**
 * MVP supported languages.
 * To add a language: add here AND add locale files AND register in i18n.ts.
 */
export const AVAILABLE_LANGUAGES: Language[] = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        dir: 'ltr',
    },
    {
        code: 'pt-BR',
        name: 'Portuguese (Brazil)',
        nativeName: 'Português (Brasil)',
        flag: '🇧🇷',
        dir: 'ltr',
    },
    {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        dir: 'ltr',
    },
];

export function getLanguageByCode(code: string): Language | undefined {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === code);
}

export function isRTL(languageCode: string): boolean {
    const language = getLanguageByCode(languageCode);
    return language?.dir === 'rtl';
}
