import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui';

interface ReportFiltersProps {
    onFiltersChange: (filters: any) => void;
}

export function ReportFilters({ onFiltersChange }: ReportFiltersProps) {
    const { t } = useTranslation('reports');
    const [filters, setFilters] = useState({
        from: getDefaultFrom(),
        to: getDefaultTo(),
        timeRange: '',
        daysOfWeek: '',
        partySizeBucket: '' as '' | '1-2' | '3-4' | '5+',
    });

    useEffect(() => {
        // Debounce filter changes
        const timer = setTimeout(() => {
            onFiltersChange(filters);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, onFiltersChange]);

    return (
        <div className="bg-bg-surface rounded-xl shadow-sm border border-border-default p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{t('reports:filters.title')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date Range */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        {t('reports:filters.dateStart')}
                    </label>
                    <Input
                        type="date"
                        value={filters.from}
                        onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        {t('reports:filters.dateEnd')}
                    </label>
                    <Input
                        type="date"
                        value={filters.to}
                        onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                    />
                </div>

                {/* Party Size */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        {t('reports:filters.partySize')}
                    </label>
                    <select
                        value={filters.partySizeBucket}
                        onChange={(e) => setFilters({ ...filters, partySizeBucket: e.target.value as any })}
                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    >
                        <option value="">{t('reports:filters.all')}</option>
                        <option value="1-2">1-2 {t('reports:filters.people')}</option>
                        <option value="3-4">3-4 {t('reports:filters.people')}</option>
                        <option value="5+">5+ {t('reports:filters.people')}</option>
                    </select>
                </div>

                {/* Time Range */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        {t('reports:filters.timeRange')}
                    </label>
                    <select
                        value={filters.timeRange}
                        onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    >
                        <option value="">{t('reports:filters.allDay')}</option>
                        <option value="11:00-15:00">{t('reports:filters.lunch')}</option>
                        <option value="18:00-23:00">{t('reports:filters.dinner')}</option>
                        <option value="11:00-15:00,18:00-23:00">{t('reports:filters.lunchAndDinner')}</option>
                    </select>
                </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => setFilters({ ...filters, from: getDefaultTo(), to: getDefaultTo() })}
                    className="px-3 py-1 text-sm bg-bg-subtle hover:bg-bg-sunken rounded-lg transition-colors"
                >
                    {t('reports:filters.today')}
                </button>
                <button
                    onClick={() => setFilters({ ...filters, from: getDefaultFrom(7), to: getDefaultTo() })}
                    className="px-3 py-1 text-sm bg-bg-subtle hover:bg-bg-sunken rounded-lg transition-colors"
                >
                    {t('reports:filters.last7Days')}
                </button>
                <button
                    onClick={() => setFilters({ ...filters, from: getDefaultFrom(30), to: getDefaultTo() })}
                    className="px-3 py-1 text-sm bg-bg-subtle hover:bg-bg-sunken rounded-lg transition-colors"
                >
                    {t('reports:filters.last30Days')}
                </button>
                <button
                    onClick={() => setFilters({ ...filters, from: getDefaultFrom(90), to: getDefaultTo() })}
                    className="px-3 py-1 text-sm bg-bg-subtle hover:bg-bg-sunken rounded-lg transition-colors"
                >
                    {t('reports:filters.last90Days')}
                </button>
            </div>
        </div>
    );
}

function getDefaultFrom(daysAgo: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}

function getDefaultTo(): string {
    return new Date().toISOString().split('T')[0];
}
