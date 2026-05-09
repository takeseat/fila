import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AVAILABLE_LANGUAGES } from '../lib/languages';
import { Icon } from '../design-system/icons/Icon';

interface LanguageSelectorProps {
    className?: string;
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
    const { currentLanguage, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        setLanguage(languageCode as any);
        setIsOpen(false);
    };

    const currentLang = AVAILABLE_LANGUAGES.find(l => l.code === currentLanguage) || AVAILABLE_LANGUAGES[0];

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Compact button showing only flag */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="glass rounded-lg px-2.5 py-2 text-xl cursor-pointer hover:bg-bg-surface/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-bg-surface/10 transition-colors ${lang.code === currentLanguage ? 'bg-bg-surface/5' : ''
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                            {lang.code === currentLanguage && (
                                <Icon name="check" size="xs" tone="primary" className="ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
