import { ReactNode } from 'react';
import clsx from 'clsx';

export interface StackProps {
    /**
     * Stack children
     */
    children: ReactNode;

    /**
     * Direction (DS Section 6.7)
     */
    direction?: 'row' | 'column';

    /**
     * Gap between items using semantic spacing
     */
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    /**
     * Alignment on cross axis
     */
    align?: 'start' | 'center' | 'end' | 'stretch';

    /**
     * Justification on main axis
     */
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

    /**
     * Allow wrapping
     */
    wrap?: boolean;

    /**
     * Additional class names
     */
    className?: string;
}

/**
 * Stack component following Design System Section 6.7
 * 
 * Features:
 * - Row/column direction
 * - Semantic gap spacing
 * - Align and justify options
 * - Wrap support
 * - Semantic tokens only
 */
export function Stack({
    children,
    direction = 'column',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    className = '',
}: StackProps) {
    // Gap classes using semantic spacing tokens
    const gapClasses = {
        none: 'gap-0',
        xs: 'gap-space-xs',
        sm: 'gap-space-sm',
        md: 'gap-space-md',
        lg: 'gap-space-lg',
        xl: 'gap-space-xl',
    };

    // Align classes
    const alignClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
    };

    // Justify classes
    const justifyClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
    };

    return (
        <div
            className={clsx(
                'flex',
                direction === 'column' ? 'flex-col' : 'flex-row',
                gapClasses[gap],
                alignClasses[align],
                justifyClasses[justify],
                wrap && 'flex-wrap',
                className
            )}
        >
            {children}
        </div>
    );
}
