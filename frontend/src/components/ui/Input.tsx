import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    /**
     * Input label - required for accessibility (DS Section 6.2)
     */
    label?: string;

    /**
     * Helper text displayed below input
     */
    helperText?: string;

    /**
     * Error message - takes precedence over helperText
     */
    error?: string;

    /**
     * Icon or element to display before input
     */
    prefix?: ReactNode;

    /**
     * Icon or element to display after input
     */
    suffix?: ReactNode;

    /**
     * Icon to display to the left of input (alias for prefix)
     */
    leftIcon?: ReactNode;

    /**
     * Icon to display to the right of input (alias for suffix)
     */
    rightIcon?: ReactNode;
}

/**
 * Input component following Design System Section 6.2
 * 
 * Anatomy:
 * - Label (optional but recommended)
 * - Input control (40px default, 48px on mobile forms)
 * - Helper text (optional)
 * - Error message (optional)
 * - Prefix/Suffix icons (optional)
 * 
 * States: default | focus | error | disabled
 * Token usage: ONLY semantic tokens
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            prefix,
            suffix,
            leftIcon,
            rightIcon,
            className = '',
            disabled,
            required,
            ...props
        },
        ref
    ) => {
        // Resolve icon props (leftIcon/rightIcon are aliases)
        const prefixIcon = prefix || leftIcon;
        const suffixIcon = suffix || rightIcon;

        // Base input styles using ONLY semantic tokens
        const inputStyles = clsx(
            // Layout & sizing
            'w-full h-10 px-space-md',
            'flex items-center',

            // Typography
            'text-base text-text-primary',
            'placeholder:text-text-muted',

            // Background & borders (DS Section 6.2)
            'bg-bg-surface',
            'border border-border-default',
            'rounded-control',

            // States
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle',

            //Shadow
            'shadow-control',

            // Error state
            error && 'border-border-danger focus:ring-border-danger focus:border-border-danger',

            // Adjust padding if icons present
            prefixIcon && 'pl-10',
            suffixIcon && 'pr-10'
        );

        return (
            <div className={clsx('w-full', className)}>
                {/* Label */}
                {label && (
                    <label className="block mb-2 text-sm font-medium text-text-primary">
                        {label}
                        {required && <span className="ml-1 text-text-danger">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Prefix Icon */}
                    {prefixIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-text-muted">
                            {prefixIcon}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        className={inputStyles}
                        disabled={disabled}
                        required={required}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={
                            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
                        }
                        {...props}
                    />

                    {/* Suffix Icon */}
                    {suffixIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-text-muted">
                            {suffixIcon}
                        </div>
                    )}
                </div>

                {/* Helper Text or Error Message */}
                {(error || helperText) && (
                    <p
                        id={error ? `${props.id}-error` : `${props.id}-helper`}
                        className={clsx(
                            'mt-1.5 text-sm',
                            error ? 'text-text-danger' : 'text-text-secondary'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
