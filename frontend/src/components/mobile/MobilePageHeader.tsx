import { ReactNode, useState } from 'react';
import { MobileMenu } from './MobileMenu';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={`lg:hidden fixed top-0 left-0 right-0 bg-bg-surface border-b border-gray-200 z-50 safe-area-top ${className}`}>
            <div className="flex items-center justify-between h-14 px-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Leading or Menu Trigger */}
                    <div className="flex-shrink-0">
                        {leading ? (
                            leading
                        ) : (
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}
                    </div>

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

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}
