import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlan } from '../../hooks/usePlan';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Badge } from '../ui';
import { restaurantsApi } from '../../services/restaurantsApi';
import { StartTrialModal } from '../plans/StartTrialModal';
import toast from 'react-hot-toast';

export function PlanSettings() {
    const { t } = useTranslation('plans');
    const { isPro, isTrialActive, hasConsumedTrial, trialDaysRemaining, trialStatus } = usePlan();
    const { refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isStartTrialModalOpen, setIsStartTrialModalOpen] = useState(false);

    const handleUpgrade = () => {
        // Trigger the global upgrade modal
        window.dispatchEvent(new CustomEvent('open-upgrade-modal'));
    };

    const handleStartTrial = async () => {
        try {
            setLoading(true);
            await restaurantsApi.startTrial();
            await refreshProfile();
            toast.success(t('trial.active'));
        } catch (error: any) {
            console.error('Failed to start trial', error);
            if (error.response?.data?.error === 'INCOMPLETE_PROFILE') {
                // Open the profile completion modal instead of redirecting
                setIsStartTrialModalOpen(true);
            } else {
                toast.error('Failed to start trial');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card title={t('settings.title')} subtitle={t('settings.subtitle')}>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{t('settings.currentPlan')}</p>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {isPro ? t('pro.title') : t('basic.title')}
                                </h2>
                                {isPro && !isTrialActive && (
                                    <Badge size="md" variant="success">
                                        {t('pro.active')}
                                    </Badge>
                                )}
                                {isTrialActive && (
                                    <Badge size="md" variant="warning">
                                        {t('trial.active')}
                                    </Badge>
                                )}
                                {trialStatus === 'EXPIRED' && !isPro && (
                                    <Badge size="md" variant="danger">
                                        {t('trial.expired')}
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-2 text-gray-600">
                                {isPro ? t('pro.description') : t('basic.description')}
                            </p>
                            {isTrialActive && (
                                <p className="mt-1 text-sm font-medium text-orange-600">
                                    {t('trial.expiresIn', { days: trialDaysRemaining })}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                    {isPro ? t('pro.price') : t('basic.price')}
                                    {isPro && <span className="text-sm font-normal text-gray-500">{t('pro.period')}</span>}
                                </p>
                            </div>

                            {!isPro && !hasConsumedTrial && (
                                <div className="flex flex-col items-end gap-2">
                                    <Button
                                        onClick={handleStartTrial}
                                        disabled={loading}
                                        variant="outline"
                                        size="lg"
                                        className="border-primary-600 text-primary-600 hover:bg-primary-50"
                                    >
                                        {loading ? '...' : t('trial.start')}
                                    </Button>
                                    <p className="text-xs text-gray-500">{t('trial.description')}</p>
                                </div>
                            )}

                            {!isPro && (hasConsumedTrial || isTrialActive) && (
                                <Button
                                    onClick={handleUpgrade}
                                    variant="primary"
                                    size="lg"
                                    className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {t('upgrade.cta')}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('settings.featuresTitle')}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Waitlist Feature */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('features.waitlist')}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('basic.title')} & {t('pro.title')}
                                    </p>
                                </div>
                            </div>

                            {/* WhatsApp Feature */}
                            <div className={`flex items-start gap-4 p-4 rounded-xl border ${isPro ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-75'}`}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isPro ? 'bg-green-100' : 'bg-gray-200'}`}>
                                    <svg className={`w-5 h-5 ${isPro ? 'text-green-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900">{t('features.whatsapp')}</p>
                                        {!isPro && <Badge size="sm" variant="default" className="text-xs">{t('pro.badge')}</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isPro ? t('features.activeState') : t('upgrade.featureLocked')}
                                    </p>
                                </div>
                            </div>

                            {/* Pickup Orders Feature */}
                            <div className={`flex items-start gap-4 p-4 rounded-xl border ${isPro ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100 opacity-75'}`}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isPro ? 'bg-purple-100' : 'bg-gray-200'}`}>
                                    <svg className={`w-5 h-5 ${isPro ? 'text-purple-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900">{t('features.pickupOrders')}</p>
                                        {!isPro && <Badge size="sm" variant="default" className="text-xs">{t('pro.badge')}</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isPro ? t('features.activeState') : t('upgrade.featureLocked')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <StartTrialModal
                isOpen={isStartTrialModalOpen}
                onClose={() => setIsStartTrialModalOpen(false)}
                onSuccess={() => setIsStartTrialModalOpen(false)}
            />
        </div>
    );
}
