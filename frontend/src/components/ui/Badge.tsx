import { ReactNode } from 'react';
import clsx from 'clsx';

export interface BadgeProps {
    /**
     * Badge content
     */
    children: ReactNode;

    /**
     * Status variant (DS Section 6.8)
     */
    variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Additional class names
     */
    className?: string;
}

/**
 * Badge component following Design System Section 6.8
 * 
 * Features:
 * - Status variants with semantic colors
 * - Non-clickable (display only)
 * - Semantic tokens only
 * - Multiple sizes
 */
export function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    className = '',
}: BadgeProps) {
    // Variant styles using ONLY semantic tokens
    const variantStyles = {
        neutral: 'bg-bg-sunken text-text-secondary',
        brand: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300', // Indigo/Brand variant
        success: 'bg-status-success-bg text-status-success-fg',
        warning: 'bg-status-warning-bg text-status-warning-fg',
        danger: 'bg-status-danger-bg text-status-danger-fg',
        info: 'bg-status-info-bg text-status-info-fg',
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center font-medium rounded-pill',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {children}
        </span>
    );
}
