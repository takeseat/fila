import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface ModalBackdropProps extends HTMLAttributes<HTMLDivElement> { }

/**
 * Shared Modal Backdrop component
 * Enforces Design System overlay (color + blur) via .ds-modal-backdrop class.
 *
 * Usage:
 * Place as a sibling to the modal content.
 * Ensure parent/modal z-index is handled correctly (backdrop is z-50).
 */
export function ModalBackdrop({ className, ...props }: ModalBackdropProps) {
    return (
        <div
            className={clsx('ds-modal-backdrop', className)}
            aria-hidden="true"
            {...props}
        />
    );
}
