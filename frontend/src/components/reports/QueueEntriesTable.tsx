import { QueueEntryRow } from '../../hooks/useQueueEntriesReport';

interface QueueEntriesTableProps {
    data: QueueEntryRow[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort: (column: string) => void;
}

export function QueueEntriesTable({ data, sortBy, sortOrder, onSort }: QueueEntriesTableProps) {
    const renderSortIcon = (column: string) => {
        if (sortBy !== column) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortOrder === 'asc' ? (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
        <th
            onClick={() => onSort(column)}
            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center gap-1">
                {children}
                {renderSortIcon(column)}
            </div>
        </th>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Data
                            </th>
                            <SortableHeader column="customerName">Cliente</SortableHeader>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Telefone
                            </th>
                            <SortableHeader column="partySize">Pessoas</SortableHeader>
                            <SortableHeader column="createdAt">Entrada</SortableHeader>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Chamado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Sentado
                            </th>
                            <SortableHeader column="timeToCall">Tempo→Chamar</SortableHeader>
                            <SortableHeader column="timeToSeat">Tempo→Sentar</SortableHeader>
                            <SortableHeader column="timeCallToSeat">Chamar→Sentar</SortableHeader>
                            <SortableHeader column="status">Status</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(row.queueDate)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {row.customerName}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {row.customerPhone}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                    {row.partySize}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {formatTime(row.createdAt)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {row.calledAt ? formatTime(row.calledAt) : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {row.seatedAt ? formatTime(row.seatedAt) : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {row.timeToCall !== null ? `${row.timeToCall} min` : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {row.timeToSeat !== null ? `${row.timeToSeat} min` : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {row.timeCallToSeat !== null ? `${row.timeCallToSeat} min` : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <StatusBadge status={row.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string }> = {
        WAITING: { label: 'Aguardando', className: 'bg-yellow-100 text-yellow-800' },
        CALLED: { label: 'Chamado', className: 'bg-blue-100 text-blue-800' },
        SEATED: { label: 'Sentado', className: 'bg-green-100 text-green-800' },
        CANCELLED: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' },
        NO_SHOW: { label: 'Não Compareceu', className: 'bg-red-100 text-red-800' },
    };

    const { label, className } = config[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {label}
        </span>
    );
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
}

function formatTime(datetime: string): string {
    const d = new Date(datetime);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
