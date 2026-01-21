interface KPICardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    iconBgColor?: string;
}

export function KPICard({ icon, value, label, iconBgColor = 'bg-primary-100' }: KPICardProps) {
    return (
        <div className="card-premium p-3 md:p-5 min-w-[140px]">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3">
                <div className={`w-8 h-8 md:w-12 md:h-12 ${iconBgColor} rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs md:text-sm font-medium text-dark-600 truncate">{label}</p>
                    <p className="text-xl md:text-3xl font-bold text-dark-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
