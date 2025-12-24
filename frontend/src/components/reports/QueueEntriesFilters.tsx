import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface QueueEntriesFiltersProps {
    onFiltersChange: (filters: any) => void;
}

export function QueueEntriesFilters({ onFiltersChange }: QueueEntriesFiltersProps) {
    const { t } = useTranslation();
    const [from, setFrom] = useState(getDefaultFrom());
    const [to, setTo] = useState(getDefaultTo());
    const [statuses, setStatuses] = useState<string[]>([]);
    const [clientSearch, setClientSearch] = useState('');
    const [partySizeMin, setPartySizeMin] = useState<number | ''>('');
    const [partySizeMax, setPartySizeMax] = useState<number | ''>('');

    const handleApply = () => {
        const filters: any = { from, to };

        if (statuses.length > 0) {
            filters.statuses = statuses.join(',');
        }
        if (clientSearch.trim()) {
            filters.clientSearch = clientSearch.trim();
        }
        if (partySizeMin !== '') {
            filters.partySizeMin = partySizeMin;
        }
        if (partySizeMax !== '') {
            filters.partySizeMax = partySizeMax;
        }

        onFiltersChange(filters);
    };

    const handleClear = () => {
        setFrom(getDefaultFrom());
        setTo(getDefaultTo());
        setStatuses([]);
        setClientSearch('');
        setPartySizeMin('');
        setPartySizeMax('');
        onFiltersChange({ from: getDefaultFrom(), to: getDefaultTo() });
    };

    const toggleStatus = (status: string) => {
        setStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('reports:filters.title')}</h3>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('reports:filters.dateInitial')}
                    </label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('reports:filters.dateFinal')}
                    </label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Status Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('reports:filters.status')}
                </label>
                <div className="flex flex-wrap gap-2">
                    {['WAITING', 'CALLED', 'SEATED', 'CANCELLED', 'NO_SHOW'].map(status => (
                        <button
                            key={status}
                            onClick={() => toggleStatus(status)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statuses.includes(status)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {t(`waitlist:status.${status}`)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Client Search */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reports:filters.searchClient')}
                </label>
                <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder={t('reports:filters.searchPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Party Size Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('reports:filters.minPeople')}
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={partySizeMin}
                        onChange={(e) => setPartySizeMin(e.target.value ? parseInt(e.target.value) : '')}
                        placeholder="Ex: 1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('reports:filters.maxPeople')}
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={partySizeMax}
                        onChange={(e) => setPartySizeMax(e.target.value ? parseInt(e.target.value) : '')}
                        placeholder="Ex: 10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleApply}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    {t('reports:filters.applyFilters')}
                </button>
                <button
                    onClick={handleClear}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {t('reports:filters.clear')}
                </button>
            </div>
        </div>
    );
}

function getDefaultFrom(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
}

function getDefaultTo(): string {
    return new Date().toISOString().split('T')[0];
}


