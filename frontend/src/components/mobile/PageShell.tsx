import { ReactNode } from 'react';

interface PageShellProps {
    children: ReactNode;
    className?: string;
}

/**
 * Mobile Page Shell
 * 
 * Determines the structure of a page on mobile:
 * - Fixed header (provided by children using MobilePageHeader)
 * - Scrollable content area
 * - Proper padding for top header
 */
export function PageShell({ children, className = '' }: PageShellProps) {
    return (
        <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
            {/* The header is fixed, so we need to ensure the content 
                doesn't get hidden behind it.
                MobilePageHeader is h-14 (56px) + safe-area-top.
                The content container should handle the scrolling.
            */}
            <div className="flex-1 overflow-hidden relative pt-14 safe-area-pt">
                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Helper component for the scrollable content area if we want more granular control
export function PageContent({ children, className = '' }: { children: ReactNode, className?: string }) {
    return (
        <div className={`p-4 lg:p-8 pb-24 lg:pb-8 ${className}`}>
            {children}
        </div>
    );
}
