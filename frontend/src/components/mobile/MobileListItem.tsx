import { ReactNode } from 'react';

interface MobileListItemProps {
    title: string;
    subtitle?: string;
    badge?: ReactNode;
    icon?: ReactNode;
    rightContent?: ReactNode;
    onClick?: () => void;
    className?: string;
}

export function MobileListItem({
    title,
    subtitle,
    badge,
    icon,
    rightContent,
    onClick,
    className = ''
}: MobileListItemProps) {
    return (
        <div
            onClick={onClick}
            className={`
                flex items-center gap-3 p-4 bg-white border-b border-gray-100
                ${onClick ? 'active:bg-gray-50 cursor-pointer' : ''}
                transition-colors
                ${className}
            `}
        >
            {icon && (
                <div className="flex-shrink-0">
                    {icon}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {title}
                    </h3>
                    {badge}
                </div>
                {subtitle && (
                    <p className="text-xs text-gray-500 truncate">
                        {subtitle}
                    </p>
                )}
            </div>

            {rightContent && (
                <div className="flex-shrink-0">
                    {rightContent}
                </div>
            )}
        </div>
    );
}
