import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface WaitTimeChartProps {
    data: Array<{
        bucket_time: string;
        avg_wait_min: number | null;
        p50_wait_min?: number | null;
    }>;
}

export function WaitTimeChart({ data }: WaitTimeChartProps) {
    const { t } = useTranslation();

    if (!data || data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-500">
                {t('reports:common.noData')}
            </div>
        );
    }

    const formattedData = data.map(item => ({
        time: formatTime(item.bucket_time),
        [t('reports:charts.avgTime')]: item.avg_wait_min ? Math.round(item.avg_wait_min) : null,
        [t('reports:charts.medianP50')]: item.p50_wait_min ? Math.round(item.p50_wait_min) : null,
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reports:charts.waitTimeOverTime')}</h3>
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                    />
                    <YAxis
                        label={{ value: t('reports:common.minutes'), angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={t('reports:charts.avgTime')}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    {formattedData.some(d => d[t('reports:charts.medianP50')] !== null) && (
                        <Line
                            type="monotone"
                            dataKey={t('reports:charts.medianP50')}
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: '#10b981', r: 4 }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function formatTime(time: string): string {
    // Format "2024-01-15 14:00:00" to "14:00" or "2024-01-15" to "15/01"
    if (time.includes(':')) {
        return time.split(' ')[1].substring(0, 5);
    }
    const [, month, day] = time.split('-');
    return `${day}/${month}`;
}
