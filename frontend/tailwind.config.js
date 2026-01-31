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
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'bg-tertiary': 'var(--bg-tertiary)',
                'bg-elevated': 'var(--bg-elevated)',
                'bg-overlay': 'var(--bg-overlay)',
                'bg-canvas': 'var(--semantic-bg-canvas)',
                'bg-surface': 'var(--semantic-bg-surface)',
                'bg-subtle': 'var(--semantic-bg-subtle)',
                'bg-sunken': 'var(--semantic-bg-sunken)',

                'bg-brand': 'var(--bg-brand)',
                'bg-brand-subtle': 'var(--bg-brand-subtle)',
                'bg-brand-light': 'var(--bg-brand-light)',
                'bg-brand-hover': 'var(--bg-brand-hover)',
                'bg-brand-active': 'var(--bg-brand-active)',

                'bg-success': 'var(--bg-success)',
                'bg-warning': 'var(--bg-warning)',
                'bg-error': 'var(--bg-error)',
                'bg-info': 'var(--bg-info)',

                // Text colors (semantic tokens)
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--semantic-text-muted)',
                'text-tertiary': 'var(--text-tertiary)',
                'text-disabled': 'var(--text-disabled)',
                'text-inverse': 'var(--text-inverse)',

                'text-brand': 'var(--text-brand)',
                'text-brand-hover': 'var(--text-brand-hover)',
                'text-success': 'var(--text-success)',
                'text-warning': 'var(--text-warning)',
                'text-error': 'var(--text-error)',
                'text-info': 'var(--text-info)',
                'text-link': 'var(--text-link)',
                'text-link-hover': 'var(--text-link-hover)',

                // Border colors (semantic tokens)
                'border-default': 'var(--border-default)',
                'border-subtle': 'var(--border-subtle)',
                'border-muted': 'var(--semantic-border-muted)',
                'border-strong': 'var(--border-strong)',
                'border-brand': 'var(--border-brand)',
                'border-error': 'var(--border-error)',
                'border-focus': 'var(--border-focus)',

                // Interactive colors
                'interactive-primary': 'var(--interactive-primary)',
                'interactive-primary-hover': 'var(--interactive-primary-hover)',
                'interactive-primary-active': 'var(--interactive-primary-active)',
                'interactive-primary-disabled': 'var(--interactive-primary-disabled)',

                'interactive-secondary': 'var(--interactive-secondary)',
                'interactive-secondary-hover': 'var(--interactive-secondary-hover)',
                'interactive-secondary-active': 'var(--interactive-secondary-active)',
                'interactive-secondary-disabled': 'var(--interactive-secondary-disabled)',

                // Brand Colors - Indigo (Primary)
                indigo: {
                    50: 'var(--base-color-indigo-50)',
                    100: 'var(--base-color-indigo-100)',
                    200: 'var(--base-color-indigo-200)',
                    300: 'var(--base-color-indigo-300)',
                    400: 'var(--base-color-indigo-400)',
                    500: 'var(--base-color-indigo-500)',
                    600: 'var(--base-color-indigo-600)',
                    700: 'var(--base-color-indigo-700)',
                    800: 'var(--base-color-indigo-800)',
                    900: 'var(--base-color-indigo-900)',
                    950: 'var(--base-color-indigo-950)',
                },
                // Accent Colors
                violet: {
                    50: 'var(--base-color-violet-50)',
                    100: 'var(--base-color-violet-100)',
                    200: 'var(--base-color-violet-200)',
                    300: 'var(--base-color-violet-300)',
                    400: 'var(--base-color-violet-400)',
                    500: 'var(--base-color-violet-500)',
                    600: 'var(--base-color-violet-600)',
                    700: 'var(--base-color-violet-700)',
                    800: 'var(--base-color-violet-800)',
                    900: 'var(--base-color-violet-900)',
                    950: 'var(--base-color-violet-950)',
                },
                purple: {
                    50: 'var(--base-color-purple-50)',
                    100: 'var(--base-color-purple-100)',
                    200: 'var(--base-color-purple-200)',
                    300: 'var(--base-color-purple-300)',
                    400: 'var(--base-color-purple-400)',
                    500: 'var(--base-color-purple-500)',
                    600: 'var(--base-color-purple-600)',
                    700: 'var(--base-color-purple-700)',
                    800: 'var(--base-color-purple-800)',
                    900: 'var(--base-color-purple-900)',
                    950: 'var(--base-color-purple-950)',
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
            },

            // Semantic spacing
            spacing: {
                'space-1': 'var(--base-spacing-1)',   // 4px
                'space-2': 'var(--base-spacing-2)',   // 8px
                'space-3': 'var(--base-spacing-3)',   // 12px
                'space-4': 'var(--base-spacing-4)',   // 16px
                'space-5': 'var(--base-spacing-5)',   // 20px
                'space-6': 'var(--base-spacing-6)',   // 24px
                'space-8': 'var(--base-spacing-8)',   // 32px
                'space-10': 'var(--base-spacing-10)', // 40px
                'space-12': 'var(--base-spacing-12)', // 48px
                'space-16': 'var(--base-spacing-16)', // 64px
                'space-20': 'var(--base-spacing-20)', // 80px

                // Legacy spacing aliases (to be migrated)
                'space-xs': 'var(--base-spacing-2)',
                'space-sm': 'var(--base-spacing-3)',
                'space-md': 'var(--base-spacing-4)',
                'space-lg': 'var(--base-spacing-6)',
                'space-xl': 'var(--base-spacing-8)',
            },

            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                display: ['Inter', 'sans-serif'], // Changed from Lexend to Inter for consistency
            },

            fontSize: {
                'xs': ['var(--base-font-size-xs)', { lineHeight: '16px' }],
                'sm': ['var(--base-font-size-sm)', { lineHeight: '20px' }],
                'base': ['var(--base-font-size-base)', { lineHeight: '24px' }],
                'lg': ['var(--base-font-size-lg)', { lineHeight: '28px' }],
                'xl': ['var(--base-font-size-xl)', { lineHeight: '28px' }],
                '2xl': ['var(--base-font-size-2xl)', { lineHeight: '32px' }],
                '3xl': ['var(--base-font-size-3xl)', { lineHeight: '36px' }],
                '4xl': ['var(--base-font-size-4xl)', { lineHeight: '40px' }],
                '5xl': ['var(--base-font-size-5xl)', { lineHeight: '48px' }],
                '6xl': ['var(--base-font-size-6xl)', { lineHeight: '60px' }],
                '7xl': ['var(--base-font-size-7xl)', { lineHeight: '72px' }],
            },

            // Semantic border radius
            borderRadius: {
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
                'xl': 'var(--radius-xl)',
                'full': 'var(--radius-full)',

                // Aliases
                'DEFAULT': 'var(--radius-md)',
            },

            // Semantic box shadows
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'xl': 'var(--shadow-xl)',
                '2xl': 'var(--shadow-2xl)',

                // Indigo Shadows (DS Spec - Restaurant Brand)
                'indigo-sm': 'var(--shadow-indigo-sm)',
                'indigo-md': 'var(--shadow-indigo-md)',
                'indigo-lg': 'var(--shadow-indigo-lg)',
                'indigo-xl': 'var(--shadow-indigo-xl)',

                'DEFAULT': 'var(--shadow-sm)',
            },

            transitionDuration: {
                'fast': '150ms',
                'base': '200ms',
                'slow': '300ms',
            },

            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'slide-in-left': 'slideInLeft 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
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
            },
        },
    },
    plugins: [],
}
