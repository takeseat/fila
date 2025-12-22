import { ReactNode } from 'react';

interface MobileActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function MobileActionSheet({ isOpen, onClose, title, children }: MobileActionSheetProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 lg:hidden animate-slide-up safe-area-bottom">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Title */}
                {title && (
                    <div className="px-4 pb-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                )}

                {/* Content */}
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    );
}

interface ActionSheetButtonProps {
    onClick: () => void;
    icon?: ReactNode;
    children: ReactNode;
    variant?: 'default' | 'danger' | 'success';
    disabled?: boolean;
}

export function ActionSheetButton({
    onClick,
    icon,
    children,
    variant = 'default',
    disabled = false
}: ActionSheetButtonProps) {
    const variantClasses = {
        default: 'text-gray-700 hover:bg-gray-100',
        danger: 'text-red-600 hover:bg-red-50',
        success: 'text-green-600 hover:bg-green-50',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors font-medium
                ${disabled ? 'opacity-50 cursor-not-allowed' : variantClasses[variant]}
            `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span className="flex-1 text-left">{children}</span>
        </button>
    );
}
