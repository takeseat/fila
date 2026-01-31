import React from 'react';


export { Button } from './Button';


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
        primary: 'bg-brand',
        success: 'bg-success',
        warning: 'bg-warning',
        danger: 'bg-error',
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


export { Toast } from './Toast';

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
        primary: 'border-brand',
        white: 'border-text-inverse',
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
            <table className="min-w-full divide-y divide-border-default">
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
