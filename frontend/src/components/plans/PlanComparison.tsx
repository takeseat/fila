import { useTranslation } from 'react-i18next';

interface PlanComparisonProps {
    onSelectBasic?: () => void;
    onSelectPro?: () => void;
    currentPlan?: 'BASIC' | 'PRO';
    isUpgrade?: boolean;
}

export function PlanComparison({ onSelectBasic, onSelectPro, currentPlan, isUpgrade = false }: PlanComparisonProps) {
    const { t } = useTranslation('plans');

    return (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className={`
                relative p-6 rounded-2xl border-2 transition-all
                ${currentPlan === 'BASIC' ? 'border-gray-200 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}
            `}>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{t('basic.title')}</h3>
                    <p className="text-gray-500 mt-1">{t('basic.description')}</p>
                    <div className="mt-4 text-3xl font-bold text-gray-900">
                        {t('basic.price')}
                    </div>
                </div>

                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{t('features.waitlist')}</span>
                    </li>
                    <li className="flex items-center gap-3 opacity-50">
                        <span className="text-gray-400">✕</span>
                        <span className="text-gray-500">{t('features.whatsapp')}</span>
                    </li>
                    <li className="flex items-center gap-3 opacity-50">
                        <span className="text-gray-400">✕</span>
                        <span className="text-gray-500">{t('features.pickupOrders')}</span>
                    </li>
                </ul>

                {onSelectBasic && !isUpgrade && (
                    <button
                        onClick={onSelectBasic}
                        className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        {t('basic.cta')}
                    </button>
                )}

                {isUpgrade && currentPlan === 'BASIC' && (
                    <div className="w-full py-3 px-4 text-center text-gray-500 text-sm font-medium">
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
                    <h3 className="text-xl font-bold text-gray-900">{t('pro.title')}</h3>
                    <p className="text-gray-500 mt-1">{t('pro.description')}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">{t('pro.price')}</span>
                        <span className="text-gray-500">/mo</span>
                    </div>
                </div>

                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{t('features.waitlist')}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-900 font-medium">{t('features.whatsapp')}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-900 font-medium">{t('features.pickupOrders')}</span>
                    </li>
                </ul>

                <button
                    onClick={onSelectPro}
                    className="w-full py-3 px-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98]"
                >
                    {isUpgrade ? t('upgrade.cta') : t('pro.cta')}
                </button>
            </div>
        </div>
    );
}
