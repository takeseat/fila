import { useEffect } from 'react';
import { Icon } from '@/design-system/icons/Icon';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    }[type];

    const iconName = {
        success: 'success' as const,
        error: 'error' as const,
        info: 'info' as const,
    }[type];

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}>
                <div className="flex-shrink-0">
                    <Icon name={iconName} size="md" tone="inherit" />
                </div>
                <p className="flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:bg-bg-surface/20 rounded p-1 transition-colors"
                >
                    <Icon name="close" size="sm" tone="inherit" />
                </button>
            </div>
        </div>
    );
}
