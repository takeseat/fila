import React, { ButtonHTMLAttributes } from 'react';
import { Icon } from '@/design-system/icons/Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg',
        secondary: 'bg-bg-subtle text-text-primary hover:bg-bg-sunken active:bg-light-300',
        ghost: 'bg-transparent text-text-primary hover:bg-bg-subtle active:bg-bg-sunken',
        outline: 'bg-transparent border-2 border-border-default text-text-primary hover:bg-bg-subtle hover:border-light-400',
        danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-md hover:shadow-lg',
        success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-md hover:shadow-lg',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2.5 text-base gap-2',
        lg: 'px-6 py-3.5 text-lg gap-2.5',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <Icon name="loading" size="sm" className="animate-spin" tone="inherit" />
            )}
            {children}
        </button>
    );
}


// Progress Bar Component
interface ProgressProps {
    value: number;
    max?: number;
    variant?: 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

export function Progress({
    value,
    max = 100,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    className = ''
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variantClasses = {
        primary: 'bg-primary-500',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        danger: 'bg-danger-500',
    };

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full bg-bg-sunken rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <div
                    className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// Toast Notification Component
interface ToastProps {
    message: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
}

export function Toast({ message, variant = 'info', onClose }: ToastProps) {
    const variantStyles = {
        success: 'bg-success-50 border-success-200 text-success-800',
        error: 'bg-danger-50 border-danger-200 text-danger-800',
        warning: 'bg-warning-50 border-warning-200 text-warning-800',
        info: 'bg-primary-50 border-primary-200 text-primary-800',
    };

    const icons = {
        success: <Icon name="success" size="md" tone="success" />,
        error: <Icon name="error" size="md" tone="error" />,
        warning: <Icon name="warning" size="md" tone="warning" />,
        info: <Icon name="info" size="md" tone="info" />,
    };

    return (
        <div className={`
      flex items-center gap-3 p-4 rounded-xl border shadow-lg
      ${variantStyles[variant]}
      animate-slide-in-right
    `}>
            {icons[variant]}
            <p className="flex-1 text-sm font-medium">{message}</p>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-current opacity-70 hover:opacity-100 transition-opacity"
                >
                    <Icon name="close" size="sm" tone="inherit" />
                </button>
            )}
        </div>
    );
}

// Divider Component
interface DividerProps {
    text?: string;
    className?: string;
}

export function Divider({ text, className = '' }: DividerProps) {
    if (text) {
        return (
            <div className={`relative flex items-center ${className}`}>
                <div className="flex-grow border-t border-border-default"></div>
                <span className="flex-shrink mx-4 text-sm text-text-secondary font-medium">{text}</span>
                <div className="flex-grow border-t border-border-default"></div>
            </div>
        );
    }

    return <div className={`border-t border-border-default ${className}`}></div>;
}

// Tooltip Component (simple version)
interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`
          absolute z-50 px-3 py-2 text-xs font-medium text-white
          bg-text-primary rounded-lg shadow-lg whitespace-nowrap
          animate-fade-in
          ${positionClasses[position]}
        `}>
                    {content}
                </div>
            )}
        </div>
    );
}

// Loading Spinner Component
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'white';
    className?: string;
}

export function Spinner({ size = 'md', variant = 'primary', className = '' }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    const variantClasses = {
        primary: 'border-primary-600',
        white: 'border-white',
    };

    return (
        <div className={`
      ${sizeClasses[size]} ${className}
      border-2 ${variantClasses[variant]} border-t-transparent
      rounded-full animate-spin
    `} />
    );
}

// Table Component (simple version for lists)
interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export function Table({ children, className = '' }: TableProps) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-light-200">
                {children}
            </table>
        </div>
    );
}


// Skeleton Loader
interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
    const variantClasses = {
        text: 'h-4 w-full',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    return (
        <div className={`skeleton ${variantClasses[variant]} ${className}`}></div>
    );
}

// Empty State
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12 px-4">
            {icon && (
                <div className="mx-auto w-16 h-16 mb-4 text-text-muted">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-text-primary mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
                    {description}
                </p>
            )}
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
}
export { Pagination } from './Pagination';
export { Input } from './Input';
export { Select } from './Select';
export { Card } from './Card';
export { Badge } from './Badge';
export { Alert } from './Alert';
export { Tabs } from './Tabs';
export { Stack } from './Stack';
export { Modal } from './Modal';
