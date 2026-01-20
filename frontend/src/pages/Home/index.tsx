import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import { usePickupOrders } from '../../hooks/usePickupOrders';
import { usePlan } from '../../hooks/usePlan';
import { useAuth } from '../../hooks/useAuth';
import { Users, ShoppingBag, AlertTriangle, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PageShell, PageContent } from '../../components/mobile/PageShell';
import { MobilePageHeader } from '../../components/mobile/MobilePageHeader';

export const Home: React.FC = () => {
    const { t } = useTranslation(['home', 'nav']);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { canUsePickupOrders } = usePlan();

    // Data Fetching
    // We use staleTime: 0 so data is always fresh when mounting/focusing Home
    const { data: metrics, isLoading: loadingMetrics } = useDashboardMetrics({ staleTime: 0 });
    const { data: pickupOrdersData, isLoading: loadingOrders } = usePickupOrders(
        {
            status: 'READY_FOR_PICKUP',
            limit: 100
        },
        { staleTime: 0 }
    );


    // Derived State
    const queueCount = metrics?.activeQueue?.count || 0;
    const readyOrdersCount = pickupOrdersData?.pagination?.total || 0;
    const waitTime = metrics?.avgWaitTime?.minutes || 0;

    // Layer 1: Operational Exceptions
    // Example logic: Wait time > 45 mins OR Orders waiting too long (simplified to count > 10 for MVP)
    const operationalAlerts = useMemo(() => {
        const alerts = [];
        if (waitTime > 45) {
            alerts.push({
                type: 'warning',
                message: t('layers.operational.high_wait_time', { minutes: waitTime })
            });
        }
        // Placeholder for "orders waiting too long" logic
        // In real scenario we would check timestamps of ready orders

        return alerts;
    }, [waitTime, t]);

    const handleQueueClick = () => navigate('/waitlist');
    const handleOrdersClick = () => navigate('/pickup-orders');

    if (loadingMetrics && loadingOrders) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <PageShell>
            <MobilePageHeader
                title={t('nav:menu.home', 'Início')}
                subtitle={t('greeting', { name: user?.name?.split(' ')[0] })}
            />

            <PageContent>
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header / Greeting (Hidden on mobile as it is in header) */}
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {t('greeting', { name: user?.name?.split(' ')[0] })}
                        </h1>
                    </div>

                    {/* Trial Expiration Banner */}
                    {canUsePickupOrders === false && usePlan().trialStatus === 'EXPIRED' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-100 p-2 rounded-full hidden md:block">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-red-900">{t('trial_expired.title')}</h3>
                                    <p className="text-red-700 mt-1">{t('trial_expired.description')}</p>
                                </div>
                            </div>
                            <Button onClick={() => window.dispatchEvent(new CustomEvent('open-upgrade-modal'))} variant="danger">
                                {t('trial_expired.cta')}
                            </Button>
                        </div>
                    )}

                    {/* LAYER 1: Operational Status (Conditional) */}
                    {operationalAlerts.length > 0 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            {operationalAlerts.map((alert, idx) => (
                                <div
                                    key={idx}
                                    className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800"
                                >
                                    <AlertTriangle className="flex-shrink-0 w-5 h-5" />
                                    <span className="font-medium text-sm">{alert.message}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* LAYER 2: Journey Direction (Always Visible) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Queue Card */}
                        <div
                            onClick={handleQueueClick}
                            className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary-500 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users size={80} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2 text-gray-500 group-hover:text-primary-600 transition-colors">
                                        <Users className="w-6 h-6" />
                                        <h2 className="text-lg font-medium">{t('layers.journey.queue.title')}</h2>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-3xl font-bold text-gray-900">{queueCount}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {queueCount === 0
                                                ? t('layers.journey.queue.status_empty')
                                                : t('layers.journey.queue.status_normal', { count: queueCount })}
                                        </p>
                                    </div>
                                </div>

                                {/* Visual Indicator of "Action" */}
                                <div className="mt-6 flex items-center text-primary-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                    {t('layers.journey.queue.cta')} &rarr;
                                </div>
                            </div>
                        </div>

                        {/* Orders Card - Only if enabled */}
                        {canUsePickupOrders && (
                            <div
                                onClick={handleOrdersClick}
                                className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ShoppingBag size={80} />
                                </div>

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2 text-gray-500 group-hover:text-blue-600 transition-colors">
                                            <ShoppingBag className="w-6 h-6" />
                                            <h2 className="text-lg font-medium">{t('layers.journey.orders.title')}</h2>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-3xl font-bold text-gray-900">{readyOrdersCount}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {readyOrdersCount === 0
                                                    ? t('layers.journey.orders.status_empty')
                                                    : t('layers.journey.orders.status_ready', { count: readyOrdersCount })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                        {t('layers.journey.orders.cta')} &rarr;
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* LAYER 3: Communication (Always Permitted, Low Priority) */}
                    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-50 p-2 rounded-full text-primary-600">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm">
                                {t('layers.communication.nps_question')}
                            </span>
                        </div>
                        {/* Placeholder for future interactivity */}
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} className="text-gray-300 hover:text-yellow-400 transition-colors">
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </PageContent>
        </PageShell>
    );
};
