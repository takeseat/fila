import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePerformanceReport } from '../../hooks/useReports';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { KpiCard } from '../../components/reports/KpiCard';
import { WaitTimeChart } from '../../components/reports/charts/WaitTimeChart';
import { VolumeChart } from '../../components/reports/charts/VolumeChart';
import { Spinner } from '../../components/ui';

export function PerformanceReport() {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        from: getDefaultFrom(),
        to: getDefaultTo(),
    });

    const { data, isLoading, error } = usePerformanceReport(filters);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('reports:performance.title')}
                </h1>
                <p className="text-gray-600">
                    {t('reports:performance.subtitle')}
                </p>
            </div>

            {/* Filters */}
            <ReportFilters onFiltersChange={setFilters} />

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Spinner />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-medium">{t('reports:queueEntries.errorLoading')}</p>
                    <p className="text-red-600 text-sm mt-1">
                        {(error as any).message || t('reports:queueEntries.tryAgainLater')}
                    </p>
                </div>
            )}

            {/* Report Content */}
            {data && !isLoading && (
                <>
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard
                            title={t('reports:performance.kpis.totalGroups')}
                            value={data.kpis.groups_total}
                            format="number"
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                        />
                        <KpiCard
                            title={t('reports:performance.kpis.groupsSeated')}
                            value={data.kpis.groups_seated}
                            format="number"
                            subtitle={`${data.kpis.groups_total > 0 ? ((data.kpis.groups_seated / data.kpis.groups_total) * 100).toFixed(1) : 0}% ${t('reports:performance.kpis.ofTotal')}`}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <KpiCard
                            title={t('reports:performance.kpis.lostRate')}
                            value={data.kpis.lost_rate}
                            format="percentage"
                            subtitle={`${data.kpis.groups_lost} ${t('reports:performance.kpis.groupsLost')}`}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            }
                        />
                        <KpiCard
                            title={t('reports:performance.kpis.peakConcurrent')}
                            value={data.kpis.peak_concurrent_groups}
                            format="number"
                            subtitle={t('reports:performance.kpis.maxInQueue')}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Wait Time KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <KpiCard
                            title={t('reports:performance.kpis.avgWaitTime')}
                            value={data.kpis.wait_avg_min || 0}
                            format="minutes"
                        />
                        <KpiCard
                            title={t('reports:performance.kpis.medianP50')}
                            value={data.kpis.wait_p50_min || 0}
                            format="minutes"
                            subtitle={t('reports:performance.kpis.waited50Less')}
                        />
                        <KpiCard
                            title={t('reports:performance.kpis.percentile75')}
                            value={data.kpis.wait_p75_min || 0}
                            format="minutes"
                            subtitle={t('reports:performance.kpis.waited75Less')}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <WaitTimeChart data={data.series.wait_time_series} />
                        <VolumeChart data={data.series.volume_series} />
                    </div>

                    {/* Metadata */}
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                        <p>
                            <strong>{t('reports:performance.kpis.period')}:</strong> {filters.from} {t('reports:performance.kpis.until')} {filters.to} •
                            <strong className="ml-2">{t('reports:performance.kpis.aggregation')}:</strong> {data.metadata.bucket_size === 'hour' ? t('reports:performance.kpis.perHour') : t('reports:performance.kpis.perDay')}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

function getDefaultFrom(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
}

function getDefaultTo(): string {
    return new Date().toISOString().split('T')[0];
}
