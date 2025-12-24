import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES, isRTL } from '../lib/languages';

interface LanguageSelectorProps {
    className?: string;
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
        setCurrentLanguage(languageCode);
        setIsOpen(false);

        // Set RTL for Arabic
        document.dir = isRTL(languageCode) ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
    };

    const currentLang = AVAILABLE_LANGUAGES.find(l => l.code === currentLanguage) || AVAILABLE_LANGUAGES[0];

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Compact button showing only flag */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="glass rounded-lg px-2.5 py-2 text-xl cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                {currentLang.flag}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl overflow-hidden z-50 min-w-[160px]">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors ${lang.code === currentLanguage ? 'bg-white/5' : ''
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                            {lang.code === currentLanguage && (
                                <svg className="w-4 h-4 ml-auto text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
