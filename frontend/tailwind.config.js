/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable .dark class for dark mode (DS Spec)
    theme: {
        extend: {
            // Semantic colors mapped to CSS variables
            colors: {
                // Background colors (semantic tokens)
                'bg-canvas': 'var(--semantic-bg-canvas)',
                'bg-surface': 'var(--semantic-bg-surface)',
                'bg-subtle': 'var(--semantic-bg-subtle)',
                'bg-sunken': 'var(--semantic-bg-sunken)',

                // Text colors (semantic tokens)
                'text-primary': 'var(--semantic-text-primary)',
                'text-secondary': 'var(--semantic-text-secondary)',
                'text-muted': 'var(--semantic-text-muted)',
                'text-inverse': 'var(--semantic-text-inverse)',
                'text-danger': 'var(--semantic-text-danger)',

                // Border colors (semantic tokens)
                'border-default': 'var(--semantic-border-default)',
                'border-muted': 'var(--semantic-border-muted)',
                'border-strong': 'var(--semantic-border-strong)',
                'border-focus': 'var(--semantic-border-focus)',
                'border-danger': 'var(--semantic-border-danger)',

                // Action colors - Primary (semantic tokens)
                'action-primary-bg': 'var(--semantic-action-primary-bg)',
                'action-primary-bg-hover': 'var(--semantic-action-primary-bg-hover)',
                'action-primary-bg-active': 'var(--semantic-action-primary-bg-active)',
                'action-primary-fg': 'var(--semantic-action-primary-fg)',

                // Action colors - Secondary (semantic tokens)
                'action-secondary-bg': 'var(--semantic-action-secondary-bg)',
                'action-secondary-bg-hover': 'var(--semantic-action-secondary-bg-hover)',
                'action-secondary-bg-active': 'var(--semantic-action-secondary-bg-active)',
                'action-secondary-fg': 'var(--semantic-action-secondary-fg)',
                'action-secondary-border': 'var(--semantic-action-secondary-border)',

                // Action colors - Ghost (semantic tokens)
                'action-ghost-bg': 'var(--semantic-action-ghost-bg)',
                'action-ghost-bg-hover': 'var(--semantic-action-ghost-bg-hover)',
                'action-ghost-fg': 'var(--semantic-action-ghost-fg)',

                // Action colors - Danger (semantic tokens)
                'action-danger-bg': 'var(--semantic-action-danger-bg)',
                'action-danger-bg-hover': 'var(--semantic-action-danger-bg-hover)',
                'action-danger-fg': 'var(--semantic-action-danger-fg)',

                // Action colors - Link (semantic tokens)
                'action-link-fg': 'var(--semantic-action-link-fg)',
                'action-link-fg-hover': 'var(--semantic-action-link-fg-hover)',


                // Brand Colors - Terracotta (Restaurant Optimized)
                terracotta: {
                    50: 'var(--base-color-terracotta-50)',
                    100: 'var(--base-color-terracotta-100)',
                    200: 'var(--base-color-terracotta-200)',
                    300: 'var(--base-color-terracotta-300)',
                    400: 'var(--base-color-terracotta-400)',
                    500: 'var(--base-color-terracotta-500)',
                    600: 'var(--base-color-terracotta-600)',
                    700: 'var(--base-color-terracotta-700)',
                    800: 'var(--base-color-terracotta-800)',
                    900: 'var(--base-color-terracotta-900)',
                    950: 'var(--base-color-terracotta-950)',
                },
                coral: {
                    50: 'var(--base-color-coral-50)',
                    100: 'var(--base-color-coral-100)',
                    200: 'var(--base-color-coral-200)',
                    300: 'var(--base-color-coral-300)',
                    400: 'var(--base-color-coral-400)',
                    500: 'var(--base-color-coral-500)',
                    600: 'var(--base-color-coral-600)',
                    700: 'var(--base-color-coral-700)',
                    800: 'var(--base-color-coral-800)',
                    900: 'var(--base-color-coral-900)',
                    950: 'var(--base-color-coral-950)',
                },
                peach: {
                    50: 'var(--base-color-peach-50)',
                    100: 'var(--base-color-peach-100)',
                    200: 'var(--base-color-peach-200)',
                    300: 'var(--base-color-peach-300)',
                    400: 'var(--base-color-peach-400)',
                    500: 'var(--base-color-peach-500)',
                    600: 'var(--base-color-peach-600)',
                    700: 'var(--base-color-peach-700)',
                    800: 'var(--base-color-peach-800)',
                    900: 'var(--base-color-peach-900)',
                    950: 'var(--base-color-peach-950)',
                },

                // Neutral Primitive - DS Spec
                neutral: {
                    0: 'var(--base-color-neutral-0)',
                    50: 'var(--base-color-neutral-50)',
                    100: 'var(--base-color-neutral-100)',
                    200: 'var(--base-color-neutral-200)',
                    300: 'var(--base-color-neutral-300)',
                    400: 'var(--base-color-neutral-400)',
                    500: 'var(--base-color-neutral-500)',
                    600: 'var(--base-color-neutral-600)',
                    700: 'var(--base-color-neutral-700)',
                    800: 'var(--base-color-neutral-800)',
                    900: 'var(--base-color-neutral-900)',
                    950: 'var(--base-color-neutral-950)',
                },

                // Status colors (semantic tokens)
                'status-success-bg': 'var(--semantic-status-success-bg)',
                'status-success-fg': 'var(--semantic-status-success-fg)',
                'status-warning-bg': 'var(--semantic-status-warning-bg)',
                'status-warning-fg': 'var(--semantic-status-warning-fg)',
                'status-danger-bg': 'var(--semantic-status-danger-bg)',
                'status-danger-fg': 'var(--semantic-status-danger-fg)',
                'status-info-bg': 'var(--semantic-status-info-bg)',
                'status-info-fg': 'var(--semantic-status-info-fg)',

                // Legacy colors for compatibility (will be replaced gradually)
                dark: {
                    900: '#0E0E10',
                    800: '#1A1A1E',
                    700: '#2A2A2E',
                    600: '#3A3A3E',
                    500: 'var(--semantic-text-muted)',
                },
                light: {
                    50: '#FAFAFA',
                    100: '#F5F5F7',
                    200: '#E8E8ED',
                    300: '#D1D1D6',
                },
                primary: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: 'var(--semantic-action-primary-bg)',
                    600: 'var(--semantic-action-primary-bg-hover)',
                    700: 'var(--semantic-action-primary-bg-active)',
                    800: '#312E81',
                    900: '#1E1B4B',
                },
                success: {
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    500: 'var(--semantic-status-success-bg)',
                    600: '#22C55E',
                    700: '#16A34A',
                },
                warning: {
                    50: '#FEFCE8',
                    100: '#FEF9C3',
                    500: 'var(--semantic-status-warning-bg)',
                    600: '#EAB308',
                },
                danger: {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    500: 'var(--semantic-status-danger-bg)',
                    600: '#DC2626',
                    700: '#B91C1C',
                },
            },

            // Semantic spacing
            spacing: {
                'space-xs': 'var(--semantic-space-xs)',   // 8px
                'space-sm': 'var(--semantic-space-sm)',   // 12px
                'space-md': 'var(--semantic-space-md)',   // 16px
                'space-lg': 'var(--semantic-space-lg)',   // 24px
                'space-xl': 'var(--semantic-space-xl)',   // 32px

                // Legacy spacing (kept for compatibility)
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },

            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Lexend', 'Inter', 'sans-serif'],
            },

            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },

            // Semantic border radius
            borderRadius: {
                'control': 'var(--semantic-shape-radius-control)',
                'card': 'var(--semantic-shape-radius-card)',
                'modal': 'var(--semantic-shape-radius-modal)',
                'pill': 'var(--semantic-shape-radius-pill)',

                // Legacy radius (kept for compatibility)
                'sm': '0.375rem',
                'DEFAULT': '0.5rem',
                'md': '0.75rem',
                'lg': '1rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },

            // Semantic box shadows
            boxShadow: {
                'control': 'var(--semantic-shape-shadow-control)',
                'card': 'var(--semantic-shape-shadow-card)',
                'modal': 'var(--semantic-shape-shadow-modal)',

                // Legacy shadows (kept for compatibility)
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'premium': '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',

                //Terracotta Shadows (DS Spec - Restaurant Brand)
                'terracotta-sm': 'var(--shadow-terracotta-sm)',
                'terracotta-md': 'var(--shadow-terracotta-md)',
                'terracotta-lg': 'var(--shadow-terracotta-lg)',
                'terracotta-xl': 'var(--shadow-terracotta-xl)',
                'glow-terracotta': 'var(--glow-terracotta)',
            },

            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '24px',
                '3xl': '40px',
            },

            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'slide-in-left': 'slideInLeft 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-in': 'bounceIn 0.5s ease-out',
                'spin-slow': 'spin 3s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
