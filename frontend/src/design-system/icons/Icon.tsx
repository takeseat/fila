import React from 'react';
import { ICONS, IconName } from './icons';
// eslint-disable-next-line no-restricted-imports
import { LucideProps } from 'lucide-react';

/**
 * Icon size variants
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

/**
 * Icon tone variants (maps to semantic tokens)
 */
export type IconTone =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'inherit';

/**
 * Icon component props
 */
export interface IconProps extends Omit<LucideProps, 'size' | 'color'> {
    /** Icon name from the catalog */
    name: IconName;
    /** Icon size (preset or custom number) */
    size?: IconSize;
    /** Icon tone (maps to semantic color tokens) */
    tone?: IconTone;
    /** Stroke width (default: 2) */
    strokeWidth?: number;
    /** Accessible label (if absent, aria-hidden=true) */
    ariaLabel?: string;
}

/**
 * Size mapping (in pixels)
 */
const SIZE_MAP: Record<Exclude<IconSize, number>, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
};

/**
 * Tone mapping to CSS variables
 */
const TONE_MAP: Record<IconTone, string> = {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    brand: 'var(--text-brand)',
    success: 'var(--text-success)',
    warning: 'var(--text-warning)',
    error: 'var(--text-error)',
    info: 'var(--text-info)',
    inherit: 'currentColor',
};

/**
 * Icon Wrapper Component
 * 
 * Standardized icon component that enforces Design System consistency.
 * This is the ONLY way icons should be rendered in the application.
 * 
 * @example
 * ```tsx
 * <Icon name="home" size="md" tone="brand" />
 * <Icon name="delete" size={18} tone="error" ariaLabel="Delete item" />
 * <Icon name="loading" className="animate-spin" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
    name,
    size = 'md',
    tone = 'inherit',
    strokeWidth = 2,
    ariaLabel,
    className,
    ...rest
}) => {
    const IconComponent = ICONS[name];

    if (!IconComponent) {
        console.error(`Icon "${name}" not found in catalog`);
        return null;
    }

    // Resolve size to pixel value
    const sizeValue = typeof size === 'number' ? size : SIZE_MAP[size];

    // Resolve tone to CSS variable
    const colorValue = TONE_MAP[tone];

    // Accessibility: if no label provided, hide from screen readers
    const accessibilityProps = ariaLabel
        ? { 'aria-label': ariaLabel, role: 'img' }
        : { 'aria-hidden': true };

    return (
        <IconComponent
            size={sizeValue}
            strokeWidth={strokeWidth}
            color={colorValue}
            className={className}
            {...accessibilityProps}
            {...rest}
        />
    );
};

/**
 * Export icon catalog for type checking
 */
export { ICONS, type IconName };
