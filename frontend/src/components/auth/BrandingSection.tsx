import { useTranslation } from 'react-i18next';

interface BrandingSectionProps {
    className?: string;
import { Icon } from '../../design-system/icons/Icon';

export function BrandingSection() {
    const { t } = useTranslation('auth');

    return (
        <div className="hidden lg:flex lg:w-1/2 bg-[#fcf9f8] p-12 flex-col justify-between relative overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            {/* Logo/Brand */}
            <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-600/20">
                    <Icon name="tableService" size="sm" tone="inherit" className="text-white" />
                </div>
                <span className="text-2xl font-bold text-text-primary tracking-tight">TakeSeat</span>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-md">
                <h1 className="text-4xl font-bold text-text-primary leading-tight mb-6">
                    {t('branding.title')}
                </h1>
                <p className="text-lg text-text-secondary mb-12">
                    {t('branding.subtitle')}
                </p>

                {/* Features List */}
                <div className="space-y-6">
                    {[
                        { icon: <Icon name="waitTime" size="sm" />, text: t('branding.feature1') },
                        { icon: <Icon name="message" size="sm" />, text: t('branding.feature2') },
                        { icon: <Icon name="reports" size="sm" />, text: t('branding.feature3') }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <p className="font-medium text-text-primary">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Text */}
            <div className="relative z-10">
                <p className="text-sm text-text-tertiary">
                    © {new Date().getFullYear()} TakeSeat. {t('branding.allRightsReserved')}
                </p>
            </div>
        </div>
    );
}
