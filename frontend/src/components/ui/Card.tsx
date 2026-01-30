import { ReactNode } from 'react';
import clsx from 'clsx';

export interface CardProps {
    /**
     * Card header title
     */
    title?: string;

    /**
     * Card subtitle (below title)
     */
    subtitle?: string;

    /**
     * Card body content
     */
    children: ReactNode;

    /**
     * Card footer content
     */
    footer?: ReactNode;

    /**
     * Header action (e.g., button, menu)
     */
    headerAction?: ReactNode;

    /**
     * Additional class names
     */
    className?: string;

    /**
     * Padding size
     */
    padding?: 'none' | 'sm' | 'md' | 'lg';

    /**
     * Visual variant - DS Spec purple accents
     */
    variant?: 'default' | 'interactive' | 'featured';
}

/**
 * Card component following Design System Section 6.4
 * 
 * Anatomy:
 * - Header (optional): title, subtitle, headerAction
 * - Body: main content
 * - Footer (optional): action buttons
 * 
 * Features:
 * - Semantic tokens only
 * - No shadow stacking for nested cards
 * - Flexible padding options
 */
export function Card({
    title,
    subtitle,
    children,
    footer,
    headerAction,
    className = '',
    padding = 'md',
    variant = 'default',  // New variant support
}: CardProps) {
    // Padding classes
    const paddingClasses = {
        none: '',
        sm: 'p-space-sm',
        md: 'p-space-lg',
        lg: 'p-space-xl',
    };

    // Variant styles (DS Spec Section 6.4)
    const variantStyles = {
        default: '',
        interactive: clsx(
            'cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-terracotta-300 hover:shadow-terracotta-md dark:hover:border-terracotta-700',
        ),
        featured: 'border-terracotta-200 shadow-terracotta-sm dark:border-terracotta-800',
    };

    return (
        <div
            className={clsx(
                // Base styles using semantic tokens
                'bg-bg-surface',
                'border border-border-default',
                'rounded-card',
                'shadow-card',
                variantStyles[variant],
                className
            )}
        >
            {/* Header */}
            {(title || subtitle || headerAction) && (
                <div
                    className={clsx(
                        'flex items-start justify-between',
                        paddingClasses[padding],
                        (children || footer) && 'border-b border-border-default'
                    )}
                >
                    <div className="flex-1">
                        {title && (
                            <h3 className="text-xl font-semibold text-text-primary mb-1">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-text-secondary">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {headerAction && (
                        <div className="ml-4 flex-shrink-0">
                            {headerAction}
                        </div>
                    )}
                </div>
            )}

            {/* Body */}
            {children && (
                <div className={clsx(paddingClasses[padding])}>
                    {children}
                </div>
            )}

            {/* Footer */}
            {footer && (
                <div
                    className={clsx(
                        paddingClasses[padding],
                        'border-t border-border-default'
                    )}
                >
                    {footer}
                </div>
            )}
        </div>
    );
}
