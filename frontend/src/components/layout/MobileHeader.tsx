import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSelector } from '../LanguageSelector';
import { Icon } from '../../design-system/icons/Icon';

interface MobileHeaderProps {
    title: string;
    showMenu?: boolean;
}

export function MobileHeader({ title, showMenu = true }: MobileHeaderProps) {
    const { t } = useTranslation('nav');
    const { user, restaurant, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-[#fcf9f8]/80 backdrop-blur-xl border-b border-amber-100/50 z-40 safe-area-top shadow-sm">
                <div className="flex items-center justify-between h-14 px-6">
                    {/* Title */}
                    <h1 className="text-base font-semibold text-text-primary truncate flex-1">
                        {title}
                    </h1>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notifications removed as per prompt */}
                        {/* Menu Button */}
                        {showMenu && (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 hover:bg-bg-subtle rounded-lg transition-colors"
                            >
                                <Icon name="menu" size="sm" tone="secondary" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-bg-surface z-50 shadow-2xl">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border-default">
                                <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-bg-subtle rounded-lg transition-colors"
                                >
                                    <Icon name="close" size="sm" tone="secondary" />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="p-4 border-b border-border-default">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                                        {user?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                                        <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                                    </div>
                                </div>
                                {/* Restaurant name */}
                                <div className="flex items-center gap-2 px-3 py-2 bg-bg-subtle rounded-lg">
                                    <Icon name="home" size="xs" tone="secondary" />
                                    <p className="text-xs font-medium text-text-secondary truncate">{restaurant?.name}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                <button
                                    onClick={() => {
                                        navigate('/settings/profile');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-subtle rounded-lg transition-colors"
                                >
                                    <Icon name="user" size="sm" />
                                    <span className="text-sm font-medium">{t('user.profile')}</span>
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/reports');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-subtle rounded-lg transition-colors"
                                >
                                    <Icon name="reports" size="sm" />
                                    <span className="text-sm font-medium">{t('menu.reports')}</span>
                                </button>

                                <div className="pt-2">
                                    <p className="px-4 py-2 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                                        {t('common:settings')}
                                    </p>
                                    <div className="px-4 py-3">
                                        <LanguageSelector />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Icon name="logout" size="sm" />
                                    <span className="text-sm font-medium">{t('user.logout')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
