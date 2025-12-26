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
    // Check if it looks like a daily bucket (ends in 00:00:00 or similar 00:00:00.000Z)
    // Or if checking the filter context is hard, let's rely on the string format.
    // If it contains "T00:00:00.000Z" or " 00:00:00", it is likely a daily bucket.
    const isDailyBucket = time.includes('00:00:00') || time.includes('T00:00:00');

    // If it's a generic time string but NOT a daily bucket (so it's hourly data)
    if (time.includes(':') && !isDailyBucket) {
        // Adjust for timezone if needed, assuming input is UTC-ish if coming from backend
        const date = new Date(time.replace(' ', 'T') + (time.includes('Z') ? '' : 'Z'));
        if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        return time.split(' ')[1]?.substring(0, 5) || time.substring(0, 5);
    }

    // If it's daily bucket or just date string
    // Parse date parts manually to avoid timezone shifting
    // Expected format: YYYY-MM-DD...
    const datePart = time.split(' ')[0].split('T')[0];
    const [year, month, day] = datePart.split('-');

    // Create date object at NOON to simulate "safe" local date avoids midnight shift issues
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);

    const dayStr = `${day}/${month}`;
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekDay = weekDays[date.getDay()];

    return `${dayStr} (${weekDay})`;
}
