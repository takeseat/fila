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
    // Check if it looks like a daily bucket (ends in 00:00:00 or similar 00:00:00.000Z)
    // If it contains "T00:00:00.000Z" or " 00:00:00", it is likely a daily bucket.
    const isDailyBucket = time.includes('00:00:00') || time.includes('T00:00:00');

    // If it's a generic time string but NOT a daily bucket
    if (time.includes(':') && !isDailyBucket) {
        // Adjust for timezone if needed
        const date = new Date(time.replace(' ', 'T') + (time.includes('Z') ? '' : 'Z'));
        if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        return time.split(' ')[1]?.substring(0, 5) || time.substring(0, 5);
    }

    // If it's a daily bucket, force date interpretation
    const datePart = time.split(' ')[0].split('T')[0];
    const [year, month, day] = datePart.split('-');

    // Create date object at NOON to simulate "safe" local date avoids midnight shift issues
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);

    const dayStr = `${day}/${month}`;
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekDay = weekDays[date.getDay()];

    return `${dayStr} (${weekDay})`;
}
