interface KpiCardProps {
    title: string;
    value: string | number;
    format?: 'number' | 'percentage' | 'minutes' | 'time';
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

export function KpiCard({ title, value, format = 'number', subtitle, icon, trend }: KpiCardProps) {
    const formatValue = (val: string | number, fmt: string) => {
        if (val === null || val === undefined || val === 'N/A') return 'N/A';

        const numVal = typeof val === 'string' ? parseFloat(val) : val;

        switch (fmt) {
            case 'percentage':
                return `${(numVal * 100).toFixed(1)}%`;
            case 'minutes':
                if (numVal < 60) {
                    return `${Math.round(numVal)}min`;
                }
                const hours = Math.floor(numVal / 60);
                const mins = Math.round(numVal % 60);
                return `${hours}h ${mins}min`;
            case 'time':
                return val.toString();
            default:
                return Math.round(numVal).toLocaleString();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {formatValue(value, format)}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
