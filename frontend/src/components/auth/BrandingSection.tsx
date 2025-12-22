import { useTranslation } from 'react-i18next';

interface BrandingSectionProps {
    className?: string;
}

export function BrandingSection({ className = '' }: BrandingSectionProps) {
    const { t } = useTranslation('auth');

    const benefits = [
        t('branding.benefit1'),
        t('branding.benefit2'),
        t('branding.benefit3'),
    ];

    return (
        <div className={`hidden lg:flex lg:flex-col lg:justify-center lg:px-16 xl:px-24 ${className}`}>
            {/* Logo */}
            <div className="mb-12">
                <img
                    src="/assets/logo-dark.png"
                    alt="TakeSeat"
                    className="h-10 w-auto"
                    onError={(e) => {
                        // Fallback to text logo if image not found
                        e.currentTarget.style.display = 'none';
                        const textLogo = document.createElement('div');
                        textLogo.className = 'text-3xl font-bold text-gray-900';
                        textLogo.textContent = 'TakeSeat';
                        e.currentTarget.parentElement?.appendChild(textLogo);
                    }}
                />
            </div>

            {/* Headline */}
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {t('branding.headline')}
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {t('branding.subheadline')}
            </p>

            {/* Benefits */}
            <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <svg
                            className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span className="text-lg text-gray-700">{benefit}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
