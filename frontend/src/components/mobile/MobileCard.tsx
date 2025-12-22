import { ReactNode } from 'react';

interface MobileCardProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    alert?: 'warning' | 'danger' | null;
}

export function MobileCard({ children, onClick, className = '', alert }: MobileCardProps) {
    const alertClasses = {
        warning: 'border-l-4 border-l-warning-500 bg-warning-50/10',
        danger: 'border-l-4 border-l-danger-500 bg-danger-50/10',
    };

    return (
        <div
            onClick={onClick}
            className={`
                bg-white rounded-lg shadow-sm border border-gray-200 p-4
                ${onClick ? 'active:bg-gray-50 cursor-pointer' : ''}
                ${alert ? alertClasses[alert] : ''}
                transition-colors
                ${className}
            `}
        >
            {children}
        </div>
    );
}
