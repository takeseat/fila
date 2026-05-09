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
            icon: (_active: boolean) => <Icon name="waitTime" size="md" tone="inherit" />,
        },
        {
            path: '/reports',
            label: t('menu.reports'),
            icon: (_active: boolean) => <Icon name="reports" size="md" tone="inherit" />,
        },
        {
            path: '/settings',
            label: t('menu.settings'),
            icon: (_active: boolean) => <Icon name="settings" size="md" tone="inherit" />,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 lg:hidden z-50 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-around px-4 py-2 pb-safe">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all"
                        >
                            <span className={`flex flex-col items-center justify-center rounded-2xl px-5 py-1.5 transition-all ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 -translate-y-0.5'
                                    : 'text-slate-500'
                            }`}>
                                {item.icon(isActive)}
                            </span>
                            <span className={`text-[10px] font-semibold transition-colors ${
                                isActive ? 'text-indigo-600' : 'text-slate-400'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
