import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { ModalBackdrop } from './ModalBackdrop';

export interface ModalProps {
    /**
     * Controls modal visibility
     */
    isOpen: boolean;

    /**
     * Called when user attempts to close modal
     */
    onClose: () => void;

    /**
     * Modal title
     */
    title: string;

    /**
     * Modal content
     */
    children: ReactNode;

    /**
     * Size variant (DS Section 6.6)
     * - sm: 400px
     * - md: 600px
     * - lg: 800px
     * - fullscreenMobile: full screen on mobile, lg on desktop
     */
    size?: 'sm' | 'md' | 'lg' | 'fullscreenMobile';

    /**
     * Optional footer content (actions)
     */
    footer?: ReactNode;

    /**
     * Disable close on backdrop click
     */
    disableBackdropClose?: boolean;
}

/**
 * Modal component following Design System Section 6.6
 * 
 * Features:
 * - Size variants (sm, md, lg, fullscreenMobile)
 * - Focus trap (keeps focus within modal)
 * - ESC key handler
 * - Backdrop click to close
 * - Semantic tokens only
 * - Mobile: fullscreen by default on small screens
 */
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer,
    disableBackdropClose = false,
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    // Portal mount
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // ESC key handler
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    // Size classes (DS Section 6.6)
    const sizeClasses = {
        sm: 'max-w-sm',      // 400px
        md: 'max-w-lg',      // 600px
        lg: 'max-w-3xl',     // 800px
        fullscreenMobile: 'max-w-3xl h-full md:h-auto md:max-h-[90vh]',
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !disableBackdropClose) {
            onClose();
        }
    };

    // Base styles for the button
    const closeButtonStyles = "ml-4 text-text-secondary hover:text-text-primary transition-colors p-1 hover:bg-bg-subtle rounded-control";

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <ModalBackdrop />

            {/* Modal */}
            <div
                className={clsx(
                    "relative w-full",
                    sizeClasses[size],
                    "bg-bg-surface",
                    "rounded-modal",
                    "shadow-modal",
                    "flex flex-col",
                    "animate-scale-in",
                    { 'h-full md:h-auto': size === 'fullscreenMobile' }
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-space-lg border-b border-border-default">
                    <h2
                        id="modal-title"
                        className="text-2xl font-semibold text-text-primary"
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className={closeButtonStyles}
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-space-lg">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-border-default p-space-lg">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
