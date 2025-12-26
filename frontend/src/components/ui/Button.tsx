import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    loading = false,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'px-4 py-2.5 rounded-xl font-medium transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/20',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500/20',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{children}</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
}
