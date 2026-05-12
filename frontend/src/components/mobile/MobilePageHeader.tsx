import { ReactNode, useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { Icon } from '../../design-system/icons/Icon';

interface MobilePageHeaderProps {
    title: string;
    subtitle?: string;
    leading?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function MobilePageHeader({
    title: _title,
    subtitle: _subtitle,
    actions,
    className = ''
}: MobilePageHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <header className={`lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 shadow-sm z-50 safe-area-top ${className}`}>
            <div className="flex items-center justify-between h-14 px-4">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                        <Icon name="tableService" size="xs" className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 tracking-tight">
                        Take<span className="text-indigo-600">Seat</span>
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {actions}
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Icon name="user" size="sm" tone="inherit" />
                    </button>
                </div>
            </div>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}
