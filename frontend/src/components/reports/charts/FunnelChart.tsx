import { useTranslation } from 'react-i18next';

interface FunnelChartProps {
    data: {
        entered: number;
        called: number;
        seated: number;
        lost: number;
    };
}

export function FunnelChart({ data }: FunnelChartProps) {
    const { t } = useTranslation();

    const funnelData = [
        { stage: t('reports:charts.enteredQueue'), value: data.entered, color: '#3b82f6' },
        { stage: t('reports:charts.wereCalled'), value: data.called, color: '#8b5cf6' },
        { stage: t('reports:charts.seated'), value: data.seated, color: '#10b981' },
        { stage: t('reports:charts.lost'), value: data.lost, color: '#ef4444' },
    ];

    const maxValue = Math.max(...funnelData.map(d => d.value));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reports:charts.conversionFunnel')}</h3>

            {/* Visual Funnel */}
            <div className="space-y-3 mb-6">
                {funnelData.map((item, index) => {
                    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    const conversionRate = index > 0 && funnelData[index - 1].value > 0
                        ? (item.value / funnelData[index - 1].value) * 100
                        : 100;

                    return (
                        <div key={item.stage}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                    {index > 0 && (
                                        <span className="text-xs text-gray-500">
                                            ({conversionRate.toFixed(1)}%)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: item.color,
                                    }}
                                >
                                    {percentage > 20 && (
                                        <span className="text-white text-xs font-semibold">
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Conversion Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">{t('reports:charts.conversionRate')}</p>
                    <p className="text-lg font-bold text-gray-900">
                        {data.entered > 0 ? ((data.seated / data.entered) * 100).toFixed(1) : 0}%
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">{t('reports:charts.lossRate')}</p>
                    <p className="text-lg font-bold text-red-600">
                        {data.entered > 0 ? ((data.lost / data.entered) * 100).toFixed(1) : 0}%
                    </p>
                </div>
            </div>
        </div>
    );
}
