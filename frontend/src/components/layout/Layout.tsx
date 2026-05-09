import { useState, useRef, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { BottomNavigation } from './BottomNavigation';
import { MobileHeader } from './MobileHeader';

interface LayoutProps {
    children: ReactNode;
    pageTitle?: string;
    simple?: boolean;
    mobileShell?: boolean;
}

export function Layout({ children, pageTitle, simple = false, mobileShell = false }: LayoutProps) {
    const { t } = useTranslation(['nav', 'common']);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, restaurant, logout } = useAuth();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/waitlist', label: t('menu.waitlist') },
        { path: '/reports', label: t('menu.reports') },
        { path: '/settings', label: t('menu.settings') },
    ];

    // Get page title from route
    const getCurrentPageTitle = () => {
        if (pageTitle) return pageTitle;
        const currentItem = menuItems.find(item => item.path === location.pathname);
        return currentItem?.label || 'TakeSeat';
    };

    return (
        <div className="flex h-screen bg-bg-canvas w-full">
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Mobile Header: Hide if using mobileShell or simple layout */}
                {!simple && !mobileShell && <MobileHeader title={getCurrentPageTitle()} />}

                {/* Desktop Header */}
                {!simple && (
                    <header className="hidden lg:flex h-16 bg-bg-surface border-b border-border-subtle px-6 items-center justify-between z-30 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/waitlist')}>
                                <div className="bg-amber-600 p-2 rounded-xl shadow-lg shadow-amber-600/20 group-hover:scale-110 transition-transform">
                                    <Icon name="tableService" size="sm" className="text-white" />
                                </div>
                                <span className="text-2xl font-black text-slate-900 tracking-tighter font-display">
                                    Take<span className="text-amber-600">Seat</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all focus:outline-none"
                                aria-label="Menu do usuário"
                            >
                                {user?.name.charAt(0).toUpperCase()}
                            </button>

                            {/* User Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute top-12 right-0 mt-2 w-64 bg-bg-surface border border-border-default rounded-xl shadow-lg z-[100] overflow-hidden animate-slide-in-down">
                                    {/* Seção 1 - Usuário */}
                                    <div className="p-4 border-b border-border-default">
                                        <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                                        <p className="text-xs text-text-muted truncate">{t('common:roles.' + user?.role)}</p>
                                    </div>
                                    
                                    {/* Seção 2 - Contexto (Restaurante) */}
                                    <div className="px-4 py-3 border-b border-border-default bg-bg-subtle">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <p className="text-xs font-medium text-text-secondary truncate">{restaurant?.name}</p>
                                        </div>
                                    </div>

                                    {/* Seção 3 - Navegação */}
                                    <div className="p-2 border-b border-border-default">
                                        <Link
                                            to="/settings/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text-primary rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {t('user.profile')}
                                        </Link>
                                        <Link
                                            to="/settings"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text-primary rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {t('menu.settings')}
                                        </Link>
                                        <Link
                                            to="/reports"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text-primary rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            {t('menu.reports')}
                                        </Link>
                                    </div>

                                    {/* Seção 4 - Ações */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-status-danger hover:bg-status-danger-bg rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            {t('user.logout')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className={`
                    flex-1 w-full
                    ${mobileShell
                        ? 'overflow-hidden p-0'
                        : 'overflow-y-auto px-4 py-4 sm:px-6 lg:px-8'
                    } 
                    pb-20 lg:pb-8
                `}>
                    <div className={mobileShell ? 'h-full w-full' : 'max-w-screen-2xl mx-auto w-full'}>
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation - stays! */}
            {!simple && <BottomNavigation />}
        </div>
    );
}
