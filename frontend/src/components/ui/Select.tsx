import { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    /**
     * Select label - required for accessibility
     */
    label?: string;

    /**
     * Helper text displayed below select
     */
    helperText?: string;

    /**
     * Error message - takes precedence over helperText
     */
    error?: string;

    /**
     * Options array
     */
    options?: SelectOption[];

    /**
     * Placeholder option
     */
    placeholder?: string;
}

/**
 * Select component following Design System Section 6.3
 * 
 * Features:
 * - Label, helper text, error states
 * - Options via array or children
 * - Semantic tokens only
 * - Accessibility (ARIA attributes)
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            helperText,
            error,
            options,
            placeholder,
            className = '',
            disabled,
            required,
            children,
            ...props
        },
        ref
    ) => {
        // Base select styles using ONLY semantic tokens
        const selectStyles = clsx(
            // Layout & sizing
            'w-full h-10 px-space-md',

            // Typography
            'text-base text-text-primary',

            // Background & borders
            'bg-bg-surface',
            'border border-border-default',
            'rounded-control',

            // States
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle',

            // Shadow
            'shadow-control',

            // Error state
            error && 'border-border-danger focus:ring-border-danger focus:border-border-danger',

            // Appearance
            'appearance-none cursor-pointer',
            'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")]',
            'bg-no-repeat bg-[position:right_0.5rem_center] bg-[size:1.5em_1.5em]',
            'pr-10'
        );

        return (
            <div className={clsx('w-full', className)}>
                {/* Label */}
                {label && (
                    <label className="block mb-2 text-sm font-normal text-text-tertiary">
                        {label}
                        {required && <span className="ml-1 text-text-danger">*</span>}
                    </label>
                )}

                {/* Select */}
                <select
                    ref={ref}
                    className={selectStyles}
                    disabled={disabled}
                    required={required}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
                    }
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {options
                        ? options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))
                        : children}
                </select>

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

Select.displayName = 'Select';
