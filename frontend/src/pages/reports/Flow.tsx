import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFlowReport } from '../../hooks/useReports';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { KpiCard } from '../../components/reports/KpiCard';
import { FunnelChart } from '../../components/reports/charts/FunnelChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Spinner } from '../../components/ui';

export function FlowReport() {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        from: getDefaultFrom(),
        to: getDefaultTo(),
    });

    const { data, isLoading, error } = useFlowReport(filters);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('reports:flow.title')}</h1>
                <p className="text-gray-600">{t('reports:flow.subtitle')}</p>
            </div>

            <ReportFilters onFiltersChange={setFilters} />

            {isLoading && <div className="flex justify-center py-12"><Spinner /></div>}
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-800">{t('reports:common.errorLoading')}</div>}

            {data && !isLoading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard title={t('reports:flow.kpis.entryToCall')} value={data.kpis.avg_entry_to_call_min || 0} format="minutes" subtitle={t('reports:flow.kpis.avgTime')} />
                        <KpiCard title={t('reports:flow.kpis.callToSeat')} value={data.kpis.avg_call_to_seat_min || 0} format="minutes" subtitle={t('reports:flow.kpis.avgTime')} />
                        <KpiCard title={t('reports:flow.kpis.calledToSeatedRate')} value={data.kpis.called_to_seated_rate} format="percentage" />
                        <KpiCard title={t('reports:flow.kpis.calledToNoshowRate')} value={data.kpis.called_to_noshow_rate} format="percentage" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <KpiCard title={t('reports:flow.kpis.avgIdleAfterCall')} value={data.kpis.avg_idle_after_call_min || 0} format="minutes" subtitle={t('reports:flow.kpis.afterCall')} />
                        <KpiCard title={t('reports:flow.kpis.p50Idle')} value={data.kpis.p50_idle_after_call_min || 0} format="minutes" />
                        <KpiCard title={t('reports:flow.kpis.p75Idle')} value={data.kpis.p75_idle_after_call_min || 0} format="minutes" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FunnelChart data={data.funnel} />

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">{t('reports:flow.charts.stageTime')}</h3>
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={data.series.stage_time_series}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="bucket_time" tick={{ fontSize: 12 }} />
                                    <YAxis label={{ value: t('reports:flow.charts.minutes'), angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="entry_to_call_min" stroke="#3b82f6" name={t('reports:flow.charts.entryToCallLine')} strokeWidth={2} />
                                    <Line type="monotone" dataKey="call_to_seat_min" stroke="#10b981" name={t('reports:flow.charts.callToSeatLine')} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
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
