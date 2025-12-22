import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES, isRTL } from '../lib/languages';

interface LanguageSelectorProps {
    className?: string;
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
        setCurrentLanguage(languageCode);

        // Set RTL for Arabic
        document.dir = isRTL(languageCode) ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
    };

    return (
        <div className={`relative ${className}`}>
            <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="glass rounded-lg px-3 py-2 pr-8 text-sm text-white appearance-none cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{ minWidth: '140px' }}
            >
                {AVAILABLE_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-dark-800 text-white">
                        {lang.flag} {lang.nativeName}
                    </option>
                ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-light-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
