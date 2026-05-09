import { Icon } from '../../design-system/icons/Icon';

// Button styles extracted to avoid circular dependency
const buttonBase = "inline-flex items-center justify-center font-medium rounded-xl transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
const buttonSizes = { sm: "px-2 py-0.5 text-sm" };
const buttonVariants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg",
    secondary: "bg-bg-subtle text-text-primary hover:bg-bg-sunken active:bg-light-300"
};

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    pageSize?: number;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    pageSize,
    className = '',
}: PaginationProps) {
    // if (totalPages <= 1) return null; // Removed check to allow showing "Showing X of Y" results

    const renderPageButton = (page: number) => {
        const isActive = currentPage === page;
        const variantClass = isActive ? buttonVariants.primary : buttonVariants.secondary;

        return (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`${buttonBase} ${buttonSizes.sm} ${variantClass} w-8 h-8 p-0 flex items-center justify-center`}
            >
                {page}
            </button>
        );
    };

    const renderEllipsis = (key: string) => (
        <span key={key} className="px-2 text-text-muted">...</span>
    );

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(renderPageButton(i));
            }
        } else {
            // Always show first page
            pages.push(renderPageButton(1));

            if (currentPage > 3) {
                pages.push(renderEllipsis('dots-1'));
            }

            // Show current page and neighbors
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(renderPageButton(i));
            }

            if (currentPage < totalPages - 2) {
                pages.push(renderEllipsis('dots-2'));
            }

            // Always show last page
            pages.push(renderPageButton(totalPages));
        }

        return pages;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {totalItems !== undefined && pageSize !== undefined && (
                <div className="text-sm text-text-secondary">
                    Mostrando <span className="font-semibold text-text-primary">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> até <span className="font-semibold text-text-primary">{Math.min(currentPage * pageSize, totalItems)}</span> de <span className="font-semibold text-text-primary">{totalItems}</span> registros
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${buttonBase} ${buttonSizes.sm} ${buttonVariants.secondary} px-2 h-8 w-8`}
                    >
                        <Icon name="chevronLeft" size="sm" />
                    </button>

                    {getPageNumbers()}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${buttonBase} ${buttonSizes.sm} ${buttonVariants.secondary} px-2 h-8 w-8`}
                    >
                        <Icon name="chevronRight" size="sm" />
                    </button>
                </div>
            )}
        </div>
    );
}
