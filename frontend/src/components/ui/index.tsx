import React, { ButtonHTMLAttributes } from 'react';

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
        secondary: 'bg-light-100 text-dark-900 hover:bg-light-200 active:bg-light-300',
        ghost: 'bg-transparent text-dark-700 hover:bg-light-100 active:bg-light-200',
        outline: 'bg-transparent border-2 border-light-300 text-dark-900 hover:bg-light-50 hover:border-light-400',
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
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-dark-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={`
            w-full px-4 py-2.5 rounded-xl border-2 transition-smooth
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error
                            ? 'border-danger-500 focus:border-danger-600 focus:ring-danger-500/20'
                            : 'border-light-300 focus:border-primary-500 focus:ring-primary-500/20'
                        }
            bg-white text-dark-900 placeholder:text-dark-400
            focus:outline-none focus:ring-4
            disabled:bg-light-100 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {hint && !error && (
                <p className="mt-1.5 text-xs text-dark-500">{hint}</p>
            )}
            {error && (
                <p className="mt-1.5 text-xs text-danger-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

// Card Component
interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
    variant?: 'default' | 'glass' | 'premium';
}

export function Card({
    title,
    subtitle,
    children,
    className = '',
    headerAction,
    variant = 'premium'
}: CardProps) {
    const variantClasses = {
        default: 'bg-white border border-light-200',
        glass: 'glass',
        premium: 'card-premium',
    };

    return (
        <div className={`${variantClasses[variant]} rounded-2xl p-6 ${className}`}>
            {(title || subtitle || headerAction) && (
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            {title && (
                                <h3 className="text-xl font-semibold text-dark-900 mb-1">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-dark-500">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {headerAction && (
                            <div>{headerAction}</div>
                        )}
                    </div>
                </div>
            )}
            {children}
        </div>
    );
}

// Badge Component
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}: BadgeProps) {
    const variantClasses = {
        default: 'bg-light-200 text-dark-700',
        primary: 'bg-primary-100 text-primary-700',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        danger: 'bg-danger-100 text-danger-700',
        info: 'bg-blue-100 text-blue-700',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span className={`
      inline-flex items-center font-medium rounded-full
      ${variantClasses[variant]} ${sizeClasses[size]} ${className}
    `}>
            {children}
        </span>
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
                    <span className="text-sm font-medium text-dark-700">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full bg-light-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
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
        success: (
            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        ),
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
                <div className="flex-grow border-t border-light-300"></div>
                <span className="flex-shrink mx-4 text-sm text-dark-500 font-medium">{text}</span>
                <div className="flex-grow border-t border-light-300"></div>
            </div>
        );
    }

    return <div className={`border-t border-light-300 ${className}`}></div>;
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
          bg-dark-900 rounded-lg shadow-lg whitespace-nowrap
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

// Modal Component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className={`
          relative bg-white rounded-2xl shadow-2xl 
          w-full ${sizeClasses[size]} p-6 sm:p-8
          text-left transform transition-all animate-scale-in
        `}>
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-semibold text-dark-900">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-dark-400 hover:text-dark-600 transition-colors p-1 hover:bg-light-100 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
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
                <div className="mx-auto w-16 h-16 mb-4 text-dark-300">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-dark-900 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-dark-500 mb-6 max-w-sm mx-auto">
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
