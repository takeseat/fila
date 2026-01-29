interface FilterChipsProps {
    activeFilter: 'all' | 'pending' | 'called' | 'completed';
    onFilterChange: (filter: 'all' | 'pending' | 'called' | 'completed') => void;
}

export function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
    const filters = [
        { id: 'all', label: 'Todos', icon: '📋' },
        { id: 'pending', label: 'Pendentes', icon: '🔥' },
        { id: 'called', label: 'Chamados', icon: '🔔' },
        { id: 'completed', label: 'Retirados Hoje', icon: '✅' },
    ] as const;

    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={`
                        flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm
                        transition-all duration-200
                        ${activeFilter === filter.id
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-bg-surface text-text-primary border-2 border-border-default hover:border-primary-300'
                        }
                    `}
                >
                    <span className="mr-1.5">{filter.icon}</span>
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
