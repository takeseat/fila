import { ReactNode } from 'react';
import clsx from 'clsx';

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
        info: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        ),
        success: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
        danger: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
