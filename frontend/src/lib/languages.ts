export interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    dir: 'ltr' | 'rtl';
}

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
    {
        code: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
        flag: '🇮🇹',
        dir: 'ltr',
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        dir: 'ltr',
    },
    {
        code: 'zh-CN',
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        flag: '🇨🇳',
        dir: 'ltr',
    },
    {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        dir: 'ltr',
    },
    {
        code: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
        flag: '🇷🇺',
        dir: 'ltr',
    },
    {
        code: 'pl',
        name: 'Polish',
        nativeName: 'Polski',
        flag: '🇵🇱',
        dir: 'ltr',
    },
    {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦',
        dir: 'rtl',
    },
];

export function getLanguageByCode(code: string): Language | undefined {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === code);
}

export function isRTL(languageCode: string): boolean {
    const language = getLanguageByCode(languageCode);
    return language?.dir === 'rtl';
}
