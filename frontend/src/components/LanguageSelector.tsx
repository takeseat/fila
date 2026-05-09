import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AVAILABLE_LANGUAGES } from '../lib/languages';

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


    const handleLanguageChange = (code: string) => {
        setLanguage(code as SupportedLanguage);
    };

    return (
        <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border-default rounded-lg text-sm text-text-primary">
                <Icon name="globe" size="xs" tone="muted" />
                <select
                    value={currentLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium cursor-pointer appearance-none pr-4"
                >
                    {AVAILABLE_LANGUAGES.map((lang) => (
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
