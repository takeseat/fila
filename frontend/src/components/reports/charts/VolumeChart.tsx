import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface VolumeChartProps {
    data: Array<{
        bucket_time: string;
        entered: number;
        seated: number;
        lost: number;
    }>;
}

export function VolumeChart({ data }: VolumeChartProps) {
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
        [t('reports:charts.entered')]: item.entered,
        [t('reports:charts.seated')]: item.seated,
        [t('reports:charts.lost')]: item.lost,
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reports:charts.queueVolume')}</h3>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                    />
                    <YAxis
                        label={{ value: t('reports:common.groups'), angle: -90, position: 'insideLeft' }}
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
                    <Bar dataKey={t('reports:charts.entered')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={t('reports:charts.seated')} fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={t('reports:charts.lost')} fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function formatTime(time: string): string {
    if (time.includes(':')) {
        return time.split(' ')[1].substring(0, 5);
    }
    const [, month, day] = time.split('-');
    return `${day}/${month}`;
}
