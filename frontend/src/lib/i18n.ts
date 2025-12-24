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

// Import Italian translations
import itAuth from '../locales/it/auth.json';
import itCommon from '../locales/it/common.json';
import itNav from '../locales/it/nav.json';
import itDashboard from '../locales/it/dashboard.json';
import itWaitlist from '../locales/it/waitlist.json';
import itCustomers from '../locales/it/customers.json';
import itSettings from '../locales/it/settings.json';

// Import French translations
import frAuth from '../locales/fr/auth.json';
import frCommon from '../locales/fr/common.json';
import frNav from '../locales/fr/nav.json';
import frDashboard from '../locales/fr/dashboard.json';
import frWaitlist from '../locales/fr/waitlist.json';
import frCustomers from '../locales/fr/customers.json';
import frSettings from '../locales/fr/settings.json';

// Import Chinese (Simplified) translations
import zhCNAuth from '../locales/zh-CN/auth.json';
import zhCNCommon from '../locales/zh-CN/common.json';
import zhCNNav from '../locales/zh-CN/nav.json';
import zhCNDashboard from '../locales/zh-CN/dashboard.json';
import zhCNWaitlist from '../locales/zh-CN/waitlist.json';
import zhCNCustomers from '../locales/zh-CN/customers.json';
import zhCNSettings from '../locales/zh-CN/settings.json';

// Import Japanese translations
import jaAuth from '../locales/ja/auth.json';
import jaCommon from '../locales/ja/common.json';
import jaNav from '../locales/ja/nav.json';
import jaDashboard from '../locales/ja/dashboard.json';
import jaWaitlist from '../locales/ja/waitlist.json';
import jaCustomers from '../locales/ja/customers.json';
import jaSettings from '../locales/ja/settings.json';

// Import Russian translations
import ruAuth from '../locales/ru/auth.json';
import ruCommon from '../locales/ru/common.json';
import ruNav from '../locales/ru/nav.json';
import ruDashboard from '../locales/ru/dashboard.json';
import ruWaitlist from '../locales/ru/waitlist.json';
import ruCustomers from '../locales/ru/customers.json';
import ruSettings from '../locales/ru/settings.json';

// Import Polish translations
import plAuth from '../locales/pl/auth.json';
import plCommon from '../locales/pl/common.json';
import plNav from '../locales/pl/nav.json';
import plDashboard from '../locales/pl/dashboard.json';
import plWaitlist from '../locales/pl/waitlist.json';
import plCustomers from '../locales/pl/customers.json';
import plSettings from '../locales/pl/settings.json';

// Import Arabic translations
import arAuth from '../locales/ar/auth.json';
import arCommon from '../locales/ar/common.json';
import arNav from '../locales/ar/nav.json';
import arDashboard from '../locales/ar/dashboard.json';
import arWaitlist from '../locales/ar/waitlist.json';
import arCustomers from '../locales/ar/customers.json';
import arSettings from '../locales/ar/settings.json';

/**
 * i18n Configuration
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
            it: {
                auth: itAuth,
                common: itCommon,
                nav: itNav,
                dashboard: itDashboard,
                waitlist: itWaitlist,
                customers: itCustomers,
                settings: itSettings,
            },
            fr: {
                auth: frAuth,
                common: frCommon,
                nav: frNav,
                dashboard: frDashboard,
                waitlist: frWaitlist,
                customers: frCustomers,
                settings: frSettings,
            },
            'zh-CN': {
                auth: zhCNAuth,
                common: zhCNCommon,
                nav: zhCNNav,
                dashboard: zhCNDashboard,
                waitlist: zhCNWaitlist,
                customers: zhCNCustomers,
                settings: zhCNSettings,
            },
            ja: {
                auth: jaAuth,
                common: jaCommon,
                nav: jaNav,
                dashboard: jaDashboard,
                waitlist: jaWaitlist,
                customers: jaCustomers,
                settings: jaSettings,
            },
            ru: {
                auth: ruAuth,
                common: ruCommon,
                nav: ruNav,
                dashboard: ruDashboard,
                waitlist: ruWaitlist,
                customers: ruCustomers,
                settings: ruSettings,
            },
            pl: {
                auth: plAuth,
                common: plCommon,
                nav: plNav,
                dashboard: plDashboard,
                waitlist: plWaitlist,
                customers: plCustomers,
                settings: plSettings,
            },
            ar: {
                auth: arAuth,
                common: arCommon,
                nav: arNav,
                dashboard: arDashboard,
                waitlist: arWaitlist,
                customers: arCustomers,
                settings: arSettings,
            },
        },
        lng: 'en', // Default - LanguageProvider will override
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common', 'auth', 'profile', 'nav', 'dashboard', 'waitlist', 'customers', 'settings', 'errors', 'tables', 'reports'],
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
