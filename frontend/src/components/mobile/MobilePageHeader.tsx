import { ReactNode } from 'react';

interface MobilePageHeaderProps {
    title: string;
    subtitle?: string;
    leading?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function MobilePageHeader({
    title,
    subtitle,
    leading,
    actions,
    className = ''
}: MobilePageHeaderProps) {
    return (
        <header className={`lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-area-top ${className}`}>
            <div className="flex items-center justify-between h-14 px-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {leading && (
                        <div className="flex-shrink-0">
                            {leading}
                        </div>
                    )}

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-lg font-semibold text-gray-900 truncate leading-snug">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
}
