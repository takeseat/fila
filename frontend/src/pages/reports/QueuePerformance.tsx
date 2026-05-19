import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { format, subDays } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../lib/api';
import { KPICard } from '../../components/ui/KPICard';
import { Icon } from '../../design-system/icons/Icon';
import { Spinner } from '../../components/ui';
import { PageShell, PageContent } from '../../components/mobile/PageShell';
import { MobilePageHeader } from '../../components/mobile/MobilePageHeader';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function QueuePerformance() {
    const { t } = useTranslation(['reports', 'common']);
    const { currentLanguage } = useLanguage();

    const getDateLocale = () => {
        switch (currentLanguage) {
            case 'pt-BR': return ptBR;
            case 'es': return es;
            default: return enUS;
        }
    };

    const endDate = new Date();
    const startDate = subDays(endDate, 7);

    const { data, isLoading } = useQuery({
        queryKey: ['report-queue-performance'],
        queryFn: async () => {
            const startStr = format(startDate, 'yyyy-MM-dd');
            const endStr = format(endDate, 'yyyy-MM-dd');
            const { data } = await api.get(`/reports/waitlist-performance?from=${startStr}&to=${endStr}`);
            return data;
        }
    });

    const metrics = data?.metrics || { totalServed: 0, averageWaitTime: 0 };
    const chartData = data?.dailyData || [];

    const formatTime = (seconds: number) => {
        const mins = Math.round(seconds / 60);
        return `${mins} min`;
    };

    return (
        <PageShell>
            <MobilePageHeader
                title="Analytics"
                subtitle={t('reports:queuePerformance.last7Days')}
            />

            <PageContent className="px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Spinner size="lg" className="mx-auto mb-4" />
                            <p className="text-text-secondary">{t('common:loading')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                        {/* Desktop header — hidden on mobile (MobilePageHeader handles it) */}
                        <div className="hidden md:block">
                            <h1 className="text-3xl font-bold text-text-primary mb-1">Analytics</h1>
                            <p className="text-text-secondary">
                                {t('reports:queuePerformance.subtitle')}
                            </p>
                        </div>

                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <KPICard
                                label={t('reports:queuePerformance.totalServed')}
                                value={metrics.totalServed}
                                icon={<Icon name="users" tone="brand" />}
                            />
                            <KPICard
                                label={t('reports:queuePerformance.avgWaitTime')}
                                value={formatTime(metrics.averageWaitTime)}
                                icon={<Icon name="waitTime" tone="warning" />}
                            />
                        </div>

                        {/* Chart */}
                        <div className="bg-bg-surface border border-border-default rounded-card p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-text-primary mb-6">
                                {t('reports:queuePerformance.chartTitle')}
                            </h3>
                            {chartData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-text-secondary gap-3">
                                    <Icon name="reports" className="w-12 h-12 opacity-30" />
                                    <p className="text-sm">{t('reports:common.noData')}</p>
                                </div>
                            ) : (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(val) => format(new Date(val), 'dd/MM', { locale: getDateLocale() })}
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                yAxisId="left"
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(val) => `${Math.round(val / 60)}m`}
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                labelFormatter={(val) => format(new Date(val), 'dd MMM yyyy', { locale: getDateLocale() })}
                                                formatter={(value: number, name: string) => {
                                                    if (name === 'averageWaitTime') return [formatTime(value), t('reports:queuePerformance.avgWaitTime')];
                                                    return [value, t('reports:queuePerformance.totalServed')];
                                                }}
                                            />
                                            <Line yAxisId="left" type="monotone" dataKey="averageWaitTime" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="averageWaitTime" />
                                            <Line yAxisId="right" type="monotone" dataKey="totalServed" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="totalServed" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </PageContent>
        </PageShell>
    );
}
