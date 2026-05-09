import { useTranslation } from 'react-i18next';
import { Icon } from '../../design-system/icons/Icon';

interface PlanComparisonProps {
    onSelectBasic?: () => void;
    onSelectPro?: () => void;
    onStartTrial?: () => void;
    currentPlan?: 'BASIC' | 'PRO';
    isUpgrade?: boolean;
    isTrialEligible?: boolean;
    isTrialLoading?: boolean;
}

export function PlanComparison({
    onSelectBasic,
    onSelectPro,
    onStartTrial,
    currentPlan,
    isUpgrade = false,
    isTrialEligible = false,
    isTrialLoading = false
}: PlanComparisonProps) {
    const { t } = useTranslation('plans');

    return (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className={`
                relative p-6 rounded-2xl border-2 transition-all
                ${currentPlan === 'BASIC' ? 'border-border-default bg-bg-subtle' : 'border-border-default hover:border-border-default'}
            `}>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-text-primary">{t('basic.title')}</h3>
                    <p className="text-text-tertiary mt-1">{t('basic.description')}</p>
                    <div className="mt-4 text-3xl font-bold text-text-primary">
                        {t('basic.price')}
                    </div>
                </div>

                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                        <Icon name="check" size="xs" tone="success" />
                        <span className="text-text-secondary">{t('features.waitlist')}</span>
                    </li>
                    <li className="flex items-center gap-3 opacity-50">
                        <Icon name="close" size="xs" tone="muted" />
                        <span className="text-text-tertiary">{t('features.whatsapp')}</span>
                    </li>
                    <li className="flex items-center gap-3 opacity-50">
                        <Icon name="close" size="xs" tone="muted" />
                        <span className="text-text-tertiary">{t('features.pickupOrders')}</span>
                    </li>
                </ul>

                {onSelectBasic && !isUpgrade && (
                    <button
                        onClick={onSelectBasic}
                        className="w-full py-3 px-4 rounded-xl border border-border-default text-text-secondary font-medium hover:bg-bg-subtle transition-colors duration-150 transition-colors"
                    >
                        {t('basic.cta')}
                    </button>
                )}

                {isUpgrade && currentPlan === 'BASIC' && (
                    <div className="w-full py-3 px-4 text-center text-text-tertiary text-sm font-medium">
                        {t('currentPlan')}
                    </div>
                )}
            </div>

            {/* Pro Plan */}
            <div className={`
                relative p-6 rounded-2xl border-2 transition-all shadow-lg
                ${currentPlan === 'PRO' ? 'border-primary-500 bg-primary-50/10' : 'border-primary-500 ring-4 ring-primary-500/10'}
            `}>
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                    RECOMMENDED
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-bold text-text-primary">{t('pro.title')}</h3>
                    <p className="text-text-tertiary mt-1">{t('pro.description')}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-text-primary">{t('pro.price')}</span>
                        <span className="text-text-tertiary">/mo</span>
                    </div>
                </div>

                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                        <Icon name="check" size="xs" tone="success" />
                        <span className="text-text-secondary">{t('features.waitlist')}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Icon name="check" size="xs" tone="success" />
                        <span className="text-text-primary font-medium">{t('features.whatsapp')}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Icon name="check" size="xs" tone="success" />
                        <span className="text-text-primary font-medium">{t('features.pickupOrders')}</span>
                    </li>
                </ul>

                {isTrialEligible && onStartTrial ? (
                    <div className="space-y-3">
                        <button
                            onClick={onStartTrial}
                            disabled={isTrialLoading}
                            className="w-full py-3 px-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isTrialLoading ? '...' : t('trial.start')}
                        </button>
                        <p className="text-xs text-center text-text-tertiary">{t('trial.description')}</p>
                    </div>
                ) : (
                    <button
                        onClick={onSelectPro}
                        className="w-full py-3 px-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98]"
                    >
                        {isUpgrade ? t('upgrade.cta') : t('pro.cta')}
                    </button>
                )}
            </div>
        </div>
    );
}
