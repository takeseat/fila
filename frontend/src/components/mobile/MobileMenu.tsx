import { useNavigate } from 'react-router-dom';
import { ModalBackdrop } from '../ui/ModalBackdrop';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSelector } from '../LanguageSelector';
import { Icon } from '../../design-system/icons/Icon';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { t } = useTranslation(['nav', 'common']);
    const { user, restaurant, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <ModalBackdrop onClick={onClose} className="lg:hidden" />

            {/* Drawer */}
            <div className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-bg-surface z-[1000] shadow-2xl animate-slide-in-right">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border-default">
                        <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-bg-subtle rounded-lg transition-colors"
                        >
                            <Icon name="close" size="sm" tone="secondary" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-border-default">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                                <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
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
                        <Button
                            variant="ghost"
                            onClick={() => {
                                navigate('/settings/profile');
                                onClose();
                            }}
                            className="w-full justify-start text-left px-4 py-3"
                            leftIcon={<Icon name="user" size="sm" />}
                        >
                            {t('user.profile')}
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => {
                                navigate('/reports');
                                onClose();
                            }}
                            className="w-full justify-start text-left px-4 py-3"
                            leftIcon={<Icon name="reports" size="sm" />}
                        >
                            {t('menu.reports')}
                        </Button>

                        <div className="pt-2">
                            <p className="px-4 py-2 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                                {t('common:settings')}
                            </p>
                            <div className="px-4 py-3">
                                <LanguageSelector />
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={() => {
                                handleLogout();
                                onClose();
                            }}
                            className="w-full justify-start text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                            leftIcon={<Icon name="logout" size="sm" />}
                        >
                            {t('user.logout')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
