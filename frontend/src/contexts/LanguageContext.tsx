/**
 * Language Context
 * 
 * Single source of truth for language management across the entire application.
 * Manages language state, i18n integration, DOM updates, and persistence.
 */

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import i18n from '../lib/i18n';
import {
    resolveLanguage,
    isRTL,
    SupportedLanguage,
    getBrowserLanguage,
    getStoredLanguage,
    storeLanguage,
} from '../lib/languageUtils';
import { useAuth } from '../hooks/useAuth';

interface LanguageContextType {
    currentLanguage: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
    const [isReady, setIsReady] = useState(false);

    /**
     * Apply language globally
     * - Updates i18n
     * - Updates DOM (lang attribute and dir for RTL)
     * - Persists to localStorage
     */
    const applyLanguage = (lang: SupportedLanguage) => {
        // Update i18n
        i18n.changeLanguage(lang);

        // Update DOM
        document.documentElement.lang = lang;
        document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';

        // Persist to localStorage
        storeLanguage(lang);

        // Update state
        setCurrentLanguage(lang);
    };

    /**
     * Initialize language on mount
     * Resolves language with correct priority
     */
    useEffect(() => {
        const storedLanguage = getStoredLanguage();
        const browserLanguage = getBrowserLanguage();

        const resolved = resolveLanguage({
            userLanguage: user?.language,
            storedLanguage,
            browserLanguage,
        });

        applyLanguage(resolved);
        setIsReady(true);
    }, []); // Only run once on mount

    /**
     * Watch for changes in user.language
     * When user logs in or user language changes, apply it immediately
     */
    useEffect(() => {
        if (user?.language && user.language !== currentLanguage) {
            applyLanguage(user.language as SupportedLanguage);
        }
    }, [user?.language]);

    /**
     * Public method to change language
     * Used by Profile page and LanguageSelector
     */
    const setLanguage = (lang: SupportedLanguage) => {
        applyLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, isReady }}>
            {children}
        </LanguageContext.Provider>
    );
}

/**
 * Hook to access language context
 */
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
