interface KPICardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function KPICard({ icon, value, label, variant = 'default' }: KPICardProps) {
    const variantClasses = {
        default: 'bg-gray-50 text-gray-700',
        primary: 'bg-primary-50 text-primary-700',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
    };

    return (
        <div className={`flex-shrink-0 rounded-xl p-4 min-w-[140px] ${variantClasses[variant]}`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-sm font-medium opacity-80">{label}</div>
                </div>
            </div>
        </div>
    );
}
