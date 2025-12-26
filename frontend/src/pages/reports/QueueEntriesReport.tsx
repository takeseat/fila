import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueueEntriesReport, QueueEntriesFilters as Filters } from '../../hooks/useQueueEntriesReport';
import { QueueEntriesFilters } from '../../components/reports/QueueEntriesFilters';
import { QueueEntriesTable } from '../../components/reports/QueueEntriesTable';
import { Spinner } from '../../components/ui';
import api from '../../lib/api';

export function QueueEntriesReport() {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<Filters>({
        from: getDefaultFrom(),
        to: getDefaultTo(),
        page: 1,
        pageSize: 25,
    });

    const { data, isLoading, error } = useQueueEntriesReport(filters);

    const handleFiltersChange = (newFilters: any) => {
        setFilters({
            ...newFilters,
            page: 1, // Reset to first page when filters change
            pageSize: filters.pageSize,
        });
    };

    const handleSort = (column: string) => {
        setFilters(prev => ({
            ...prev,
            sortBy: column,
            sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setFilters(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
    };

    const handleExport = async (type: 'csv' | 'pdf') => {
        try {
            const params = new URLSearchParams();
            params.append('from', filters.from);
            params.append('to', filters.to);

            if (filters.clientSearch) params.append('clientSearch', filters.clientSearch);
            if (filters.statuses) params.append('statuses', filters.statuses);
            if (filters.partySizeMin) params.append('partySizeMin', filters.partySizeMin.toString());
            if (filters.partySizeMax) params.append('partySizeMax', filters.partySizeMax.toString());
            if (filters.daysOfWeek) params.append('daysOfWeek', filters.daysOfWeek);
            if (filters.timeRange) params.append('timeRange', filters.timeRange);

            const response = await api.get(`/reports/queue-entries/export/${type}?${params.toString()}`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], {
                type: type === 'pdf' ? 'application/pdf' : 'text/csv'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `queue-entries-report-${new Date().toISOString().split('T')[0]}.${type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export error:', err);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('reports:queueEntries.title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('reports:queueEntries.subtitle')}
                    </p>
                </div>

                {/* Export Buttons */}
                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleExport('csv')}
                        className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-all shadow-sm text-sm"
                        title={t('reports:queueEntries.exportCsv')}
                    >
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        CSV
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-all shadow-sm text-sm"
                        title={t('reports:queueEntries.exportPdf')}
                    >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <QueueEntriesFilters onFiltersChange={handleFiltersChange} />

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Spinner />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-medium">{t('reports:queueEntries.errorLoading')}</p>
                    <p className="text-red-600 text-sm mt-1">
                        {(error as any).message || t('reports:queueEntries.tryAgainLater')}
                    </p>
                </div>
            )}

            {/* Data Table */}
            {data && !isLoading && (
                <>
                    {data.data.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600 font-medium">{t('reports:queueEntries.noRecordsFound')}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {t('reports:queueEntries.adjustFilters')}
                            </p>
                        </div>
                    ) : (
                        <>
                            <QueueEntriesTable
                                data={data.data}
                                sortBy={filters.sortBy}
                                sortOrder={filters.sortOrder}
                                onSort={handleSort}
                            />

                            {/* Pagination */}
                            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {t('reports:queueEntries.showing', { from: ((data.page - 1) * data.pageSize) + 1, to: Math.min(data.page * data.pageSize, data.total), total: data.total })}
                                    </span>
                                    <select
                                        value={filters.pageSize}
                                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={25}>25 {t('reports:queueEntries.perPage')}</option>
                                        <option value={50}>50 {t('reports:queueEntries.perPage')}</option>
                                        <option value={100}>100 {t('reports:queueEntries.perPage')}</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(data.page - 1)}
                                        disabled={data.page === 1}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {t('reports:queueEntries.previous')}
                                    </button>
                                    <span className="px-4 py-1.5 text-sm text-gray-700">
                                        {t('reports:queueEntries.pageOf', { current: data.page, total: data.totalPages })}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(data.page + 1)}
                                        disabled={data.page === data.totalPages}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {t('reports:queueEntries.next')}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
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
