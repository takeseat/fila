import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../design-system/icons/Icon';

export function BottomNavigation() {
    const { t } = useTranslation('nav');
    const location = useLocation();

    const navItems = [
        {
            path: '/waitlist',
            label: t('menu.waitlist'),
            icon: <Icon name="waitTime" size="md" tone="inherit" />
        },
        {
            path: '/reports',
            label: t('menu.reports'),
            icon: <Icon name="reports" size="md" tone="inherit" />
        },
        {
            path: '/settings',
            label: t('menu.settings'),
            icon: <Icon name="settings" size="md" tone="inherit" />
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-default lg:hidden z-50 safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                ? 'text-indigo-600'
                                : 'text-text-secondary active:text-text-primary'
                                }`}
                        >
                            <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-xs mt-1 font-medium ${isActive ? 'text-indigo-600' : 'text-text-secondary'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
