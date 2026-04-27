import { useTranslation } from 'react-i18next';
import { usePlan } from '../../hooks/usePlan';
import { Card, Button, Badge } from '../ui';
import { useNavigate } from 'react-router-dom';

export function PlanSettings() {
    const { t } = useTranslation('plans');
    const { isTrialing, isActive, isPastDue, isExpired, trialDaysRemaining } = usePlan();
    const navigate = useNavigate();

    const handleSubscribe = () => {
        // Navigate to billing page for subscription
        navigate('/billing');
    };

    // Determine badge color and text based on subscription status
    const getStatusBadge = () => {
        if (isTrialing) {
            return <Badge size="md" variant="warning">{t('subscription.trialing', { defaultValue: 'Trial Ativo' })}</Badge>;
        }
        if (isActive) {
            return <Badge size="md" variant="success">{t('subscription.active', { defaultValue: 'Assinatura Ativa' })}</Badge>;
        }
        if (isPastDue) {
            return <Badge size="md" variant="danger">{t('subscription.pastDue', { defaultValue: 'Pagamento Pendente' })}</Badge>;
        }
        if (isExpired) {
            return <Badge size="md" variant="danger">{t('subscription.expired', { defaultValue: 'Expirado' })}</Badge>;
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card title={t('settings.title', { defaultValue: 'Plano e Assinatura' })} subtitle={t('settings.subtitle', { defaultValue: 'Gerencie sua assinatura PRO' })}>
                <div className="p-4 md:p-6">
                    <div className="flex flex-col gap-4 md:gap-6 pb-6 md:pb-8 border-b border-gray-100">
                        <div>
                            <p className="text-xs md:text-sm font-medium text-text-tertiary mb-1">{t('settings.currentPlan', { defaultValue: 'Plano Atual' })}</p>
                            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                <h2 className="text-xl md:text-3xl font-bold text-text-primary">
                                    {t('pro.title', { defaultValue: 'PRO' })}
                                </h2>
                                {getStatusBadge()}
                            </div>
                            <p className="mt-2 text-sm md:text-base text-text-secondary">
                                {t('pro.description', { defaultValue: 'Acesso completo a todas as funcionalidades' })}
                            </p>
                            {isTrialing && (
                                <p className="mt-1 text-xs md:text-sm font-medium text-orange-600">
                                    {t('trial.expiresIn', { days: trialDaysRemaining, defaultValue: `Trial expira em ${trialDaysRemaining} dias` })}
                                </p>
                            )}
                            {isExpired && (
                                <p className="mt-1 text-xs md:text-sm font-medium text-red-600">
                                    {t('subscription.expiredMessage', { defaultValue: 'Seu trial expirou. Assine para continuar.' })}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col md:items-end gap-3">
                            <div className="md:text-right">
                                <p className="text-xl md:text-2xl font-bold text-text-primary">
                                    {t('pro.price', { defaultValue: 'R$ 99' })}
                                    <span className="text-xs md:text-sm font-normal text-text-tertiary">{t('pro.period', { defaultValue: '/mês' })}</span>
                                </p>
                            </div>

                            <Button
                                onClick={handleSubscribe}
                                variant="primary"
                                size="md"
                                className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
                            >
                                {isActive
                                    ? t('subscription.manage', { defaultValue: 'Gerenciar Assinatura' })
                                    : t('subscription.subscribe', { defaultValue: 'Assinar Agora' })
                                }
                            </Button>
                        </div>
                    </div>

                    <div className="pt-6 md:pt-8">
                        <h3 className="text-base md:text-lg font-medium text-text-primary mb-4 md:mb-6">{t('settings.featuresTitle', { defaultValue: 'Funcionalidades Incluídas' })}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                            {/* Waitlist Feature */}
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm md:text-base font-semibold text-text-primary">{t('features.waitlist', { defaultValue: 'Gerenciamento de Fila' })}</p>
                                    <p className="text-xs md:text-sm text-text-tertiary mt-1">
                                        {t('features.included', { defaultValue: 'Incluído' })}
                                    </p>
                                </div>
                            </div>

                            {/* WhatsApp Feature */}
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-green-50 border border-green-100">
                                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm md:text-base font-semibold text-text-primary">{t('features.whatsapp', { defaultValue: 'WhatsApp' })}</p>
                                    <p className="text-xs md:text-sm text-text-tertiary mt-1">
                                        {t('features.included', { defaultValue: 'Incluído' })}
                                    </p>
                                </div>
                            </div>

                            {/* Pickup Orders Feature */}
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm md:text-base font-semibold text-text-primary">{t('features.pickupOrders', { defaultValue: 'Pedidos para Retirar' })}</p>
                                    <p className="text-xs md:text-sm text-text-tertiary mt-1">
                                        {t('features.included', { defaultValue: 'Incluído' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
