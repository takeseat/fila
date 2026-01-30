import { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@/design-system/icons/Icon';

export interface AlertProps {
    /**
     * Severity level (DS Section 6.9)
     */
    severity: 'info' | 'success' | 'warning' | 'danger';

    /**
     * Alert title
     */
    title?: string;

    /**
     * Alert description/message
     */
    children: ReactNode;

    /**
     * Optional icon override
     */
    icon?: ReactNode;

    /**
     * Optional action buttons
     */
    actions?: ReactNode;

    /**
     * Closeable alert
     */
    onClose?: () => void;

    /**
     * Additional class names
     */
    className?: string;
}

/**
 * Alert component following Design System Section 6.9
 * 
 * Features:
 * - 4 severity levels with semantic colors
 * - Icon, title, description, actions
 * - User-friendly messaging
 * - Semantic tokens only
 */
export function Alert({
    severity,
    title,
    children,
    icon,
    actions,
    onClose,
    className = '',
}: AlertProps) {
    // Default icons for each severity
    const defaultIcons = {
        info: <Icon name="info" size="md" tone="info" />,
        success: <Icon name="success" size="md" tone="success" />,
        warning: <Icon name="warning" size="md" tone="warning" />,
        danger: <Icon name="error" size="md" tone="error" />,
    };

    // Variant-specific styles using semantic tokens
    const variantStyles = {
        info: 'bg-status-info-bg/10 text-status-info-bg border-status-info-bg/30',
        success: 'bg-status-success-bg/10 text-status-success-bg border-status-success-bg/30',
        warning: 'bg-status-warning-bg/10 text-status-warning-bg border-status-warning-bg/30',
        danger: 'bg-status-danger-bg/10 text-status-danger-bg border-status-danger-bg/30',
    };

    return (
        <div
            className={clsx(
                'flex gap-3 p-space-md rounded-control border',
                variantStyles[severity],
                className
            )}
            role="alert"
        >
            {/* Icon */}
            <div className="flex-shrink-0">
                {icon || defaultIcons[severity]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className="font-semibold mb-1">
                        {title}
                    </h4>
                )}
                <div className="text-sm opacity-90">
                    {children}
                </div>
                {actions && (
                    <div className="mt-3 flex gap-2">
                        {actions}
                    </div>
                )}
            </div>

            {/* Close button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Close alert"
                >
                    <Icon name="close" size="md" tone="inherit" />
                </button>
            )}
        </div>
    );
}
