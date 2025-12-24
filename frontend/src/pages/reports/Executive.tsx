import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExecutiveReport } from '../../hooks/useReports';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { KpiCard } from '../../components/reports/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Spinner } from '../../components/ui';

export function ExecutiveReport() {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        from: getDefaultFrom(),
        to: getDefaultTo(),
    });

    const { data, isLoading, error } = useExecutiveReport(filters);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('reports:executive.title')}</h1>
                <p className="text-gray-600">{t('reports:executive.subtitle')}</p>
            </div>

            <ReportFilters onFiltersChange={setFilters} />

            {isLoading && <div className="flex justify-center py-12"><Spinner /></div>}
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-800">{t('reports:common.errorLoading')}</div>}

            {data && !isLoading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <KpiCard title={t('reports:executive.kpis.waitP50')} value={data.kpis.wait_p50_min || 0} format="minutes" />
                        <KpiCard title={t('reports:executive.kpis.groupsSeated')} value={data.kpis.groups_seated} format="number" />
                        <KpiCard title={t('reports:executive.kpis.lostRate')} value={data.kpis.lost_rate} format="percentage" />
                        <KpiCard title={t('reports:executive.kpis.peakHour')} value={data.kpis.peak_hour} format="time" subtitle={t('reports:executive.kpis.mostEntries')} />
                        <KpiCard title={t('reports:executive.kpis.peakWaitHour')} value={data.kpis.peak_wait_hour} format="time" subtitle={t('reports:executive.kpis.highestAvgWait')} />
                        <KpiCard title={t('reports:executive.kpis.groupsLost')} value={data.kpis.groups_lost} format="number" />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">{t('reports:executive.charts.hourlyEntries')}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.series.hourly_entries}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
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
