import { useState, useRef, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { BottomNavigation } from './BottomNavigation';
import { MobileHeader } from './MobileHeader';
import { Icon } from '../../design-system/icons/Icon';

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
                    <header className="hidden lg:flex h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 items-center justify-between z-30 shadow-sm sticky top-0">
                        {/* Left: Logo + Nav */}
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/waitlist')}>
                                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                    <Icon name="tableService" size="sm" className="text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-800 tracking-tight">
                                    Take<span className="text-indigo-600">Seat</span>
                                </span>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex items-center gap-1 h-16">
                                {menuItems.map((item) => {
                                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`h-full flex items-center px-4 text-sm font-semibold border-b-2 transition-colors ${
                                                isActive
                                                    ? 'text-indigo-600 border-indigo-600'
                                                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right: Avatar */}
                        <div className="flex items-center gap-3" ref={dropdownRef}>
                            {/* Avatar / User Dropdown */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all focus:outline-none border border-white shadow-sm"
                                aria-label="Menu do usuário"
                            >
                                {user?.name.charAt(0).toUpperCase()}
                            </button>

                            {/* User Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute top-16 right-6 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] overflow-hidden">
                                    {/* Seção 1 - Usuário */}
                                    <div className="p-4 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{t('common:roles.' + user?.role)}</p>
                                    </div>
                                    
                                    {/* Seção 2 - Restaurante */}
                                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                        <div className="flex items-center gap-2">
                                            <Icon name="home" size="xs" tone="secondary" />
                                            <p className="text-xs font-medium text-slate-600 truncate">{restaurant?.name}</p>
                                        </div>
                                    </div>

                                    {/* Seção 3 - Navegação */}
                                    <div className="p-2 border-b border-slate-100">
                                        <Link
                                            to="/settings/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                                        >
                                            <Icon name="users" size="xs" tone="inherit" />
                                            {t('user.profile')}
                                        </Link>

                                    </div>

                                    {/* Seção 4 - Logout */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Icon name="logout" size="xs" tone="inherit" />
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
