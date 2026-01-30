import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button variant - defines visual style (DS Section 6.1)
     */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';

    /**
     * Button size - sm: 32px, md: 40px, lg: 48px (DS Section 6.1)
     * Mobile: ensures ≥44px touch target
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Loading state - preserves width, shows spinner (DS Section 6.1)
     */
    isLoading?: boolean;

    /**
     * Icon to display before label
     */
    leftIcon?: ReactNode;

    /**
     * Icon to display after label
     */
    rightIcon?: ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className = '',
    leftIcon,
    rightIcon,
    ...props
}: ButtonProps) {
    // Base styles (all buttons)
    const baseStyles = clsx(
        'inline-flex items-center justify-center gap-2',
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'rounded-control'
    );

    // Size styles (DS Section 6.1)
    const sizeStyles = {
        sm: clsx(
            'h-8 px-space-sm text-sm',
            // Mobile: ensure ≥44px touch target
            'min-h-[44px] md:min-h-[32px]'
        ),
        md: clsx(
            'h-10 px-space-md text-base'
        ),
        lg: clsx(
            'h-12 px-space-lg text-lg'
        ),
    };

    // Variant styles using ONLY semantic tokens (DS Section 6.1)
    const variantStyles = {
        primary: clsx(
            'bg-action-primary-bg text-action-primary-fg',
            'hover:bg-action-primary-bg-hover active:bg-action-primary-bg-active',
            'hover:shadow-terracotta-md', // Purple shadow on hover (DS Spec)
            'focus:ring-action-primary-bg/20'
        ),
        secondary: clsx(
            'bg-action-secondary-bg text-action-secondary-fg border border-action-secondary-border',
            'hover:bg-action-secondary-bg-hover active:bg-action-secondary-bg-active',
            'focus:ring-action-secondary-fg/20'
        ),
        ghost: clsx(
            'bg-action-ghost-bg text-action-ghost-fg',
            'hover:bg-action-ghost-bg-hover',
            'focus:ring-action-ghost-fg/20'
        ),
        danger: clsx(
            'bg-action-danger-bg text-action-danger-fg',
            'hover:bg-action-danger-bg-hover',
            'focus:ring-action-danger-bg/20'
        ),
        link: clsx(
            'bg-transparent text-action-link-fg h-auto px-0',
            'hover:text-action-link-fg-hover underline-offset-4 hover:underline',
            'focus:ring-action-link-fg/20'
        ),
    };

    // Loading spinner component
    const Spinner = () => (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
    );

    return (
        <button
            className={clsx(
                baseStyles,
                sizeStyles[size],
                variantStyles[variant],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Spinner />
                    {/* Preserve width by keeping content but making it invisible */}
                    <span className="opacity-0">{children}</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
}
