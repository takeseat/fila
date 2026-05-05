import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English translations
import enAuth from '../locales/en/auth.json';
import enCommon from '../locales/en/common.json';
import enProfile from '../locales/en/profile.json';
import enNav from '../locales/en/nav.json';
import enDashboard from '../locales/en/dashboard.json';
import enWaitlist from '../locales/en/waitlist.json';
import enCustomers from '../locales/en/customers.json';
import enSettings from '../locales/en/settings.json';
import enErrors from '../locales/en/errors.json';
import enTables from '../locales/en/tables.json';
import enReports from '../locales/en/reports.json';
import enUsers from '../locales/en/users.json';
import enPlans from '../locales/en/plans.json';

// Import Portuguese (Brazil) translations
import ptBRAuth from '../locales/pt-BR/auth.json';
import ptBRCommon from '../locales/pt-BR/common.json';
import ptBRProfile from '../locales/pt-BR/profile.json';
import ptBRNav from '../locales/pt-BR/nav.json';
import ptBRDashboard from '../locales/pt-BR/dashboard.json';
import ptBRWaitlist from '../locales/pt-BR/waitlist.json';
import ptBRCustomers from '../locales/pt-BR/customers.json';
import ptBRSettings from '../locales/pt-BR/settings.json';
import ptBRErrors from '../locales/pt-BR/errors.json';
import ptBRTables from '../locales/pt-BR/tables.json';
import ptBRReports from '../locales/pt-BR/reports.json';
import ptBRUsers from '../locales/pt-BR/users.json';
import ptBRPlans from '../locales/pt-BR/plans.json';
import ptBRHome from '../locales/pt-BR/home.json';

// Import Spanish translations
import esAuth from '../locales/es/auth.json';
import esCommon from '../locales/es/common.json';
import esProfile from '../locales/es/profile.json';
import esNav from '../locales/es/nav.json';
import esDashboard from '../locales/es/dashboard.json';
import esWaitlist from '../locales/es/waitlist.json';
import esCustomers from '../locales/es/customers.json';
import esSettings from '../locales/es/settings.json';
import esReports from '../locales/es/reports.json';

/**
 * i18n Configuration
 *
 * MVP supported languages: en, pt-BR, es
 *
 * Note: Language is controlled by LanguageProvider.
 * This just initializes i18n with default 'en'.
 * LanguageProvider will call i18n.changeLanguage() with the correct language.
 */
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                auth: enAuth,
                common: enCommon,
                profile: enProfile,
                nav: enNav,
                dashboard: enDashboard,
                waitlist: enWaitlist,
                customers: enCustomers,
                settings: enSettings,
                errors: enErrors,
                tables: enTables,
                reports: enReports,
                users: enUsers,
                plans: enPlans,
            },
            'pt-BR': {
                auth: ptBRAuth,
                common: ptBRCommon,
                profile: ptBRProfile,
                nav: ptBRNav,
                dashboard: ptBRDashboard,
                waitlist: ptBRWaitlist,
                customers: ptBRCustomers,
                settings: ptBRSettings,
                errors: ptBRErrors,
                tables: ptBRTables,
                reports: ptBRReports,
                users: ptBRUsers,
                plans: ptBRPlans,
                home: ptBRHome,
            },
            es: {
                auth: esAuth,
                common: esCommon,
                profile: esProfile,
                nav: esNav,
                dashboard: esDashboard,
                waitlist: esWaitlist,
                customers: esCustomers,
                settings: esSettings,
                reports: esReports,
            },
        },
        lng: 'en', // Default - LanguageProvider will override
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common', 'auth', 'profile', 'nav', 'dashboard', 'waitlist', 'customers', 'settings', 'errors', 'tables', 'reports', 'plans', 'home'],
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
