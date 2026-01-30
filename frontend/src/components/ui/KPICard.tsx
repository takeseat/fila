import { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface KPICardProps {
    icon: ReactNode;
    value: string | number;
    label: string;
    /**
     * Color variant for icon background
     */
    iconVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * KPI Card component using Design System
 * 
 * Features:
 * - Semantic tokens only
 * - Icon variants with status colors
 * - Responsive sizing (mobile vs desktop)
 */
export function KPICard({ icon, value, label, iconVariant = 'primary' }: KPICardProps) {
    // Icon background colors using semantic tokens
    const iconBgClasses = {
        primary: 'bg-action-primary-bg/10 text-action-primary-bg',
        success: 'bg-status-success-bg text-status-success-fg',
        warning: 'bg-status-warning-bg text-status-warning-fg',
        danger: 'bg-status-danger-bg text-status-danger-fg',
        info: 'bg-status-info-bg text-status-info-fg',
    };

    return (
        <Card padding="sm" className="min-w-[140px]">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 md:w-12 md:h-12 ${iconBgClasses[iconVariant]} rounded-control flex items-center justify-center flex-shrink-0`}>
                    {icon}
                </div>

                {/* Value and Label */}
                <div>
                    <p className="text-xs md:text-sm font-medium text-text-secondary truncate">
                        {label}
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-text-primary">
                        {value}
                    </p>
                </div>
            </div>
        </Card>
    );
}
