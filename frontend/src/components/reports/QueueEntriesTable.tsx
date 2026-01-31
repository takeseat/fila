import { QueueEntryRow } from '../../hooks/useQueueEntriesReport';
import { Badge } from '@/components/ui';

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
                <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortOrder === 'asc' ? (
            <svg className="w-4 h-4 text-action-primary-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-action-primary-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
        <th
            onClick={() => onSort(column)}
            className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-bg-subtle transition-colors"
        >
            <div className="flex items-center gap-1">
                {children}
                {renderSortIcon(column)}
            </div>
        </th>
    );

    return (
        <div className="bg-bg-surface rounded-xl shadow-sm border border-border-default overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-default">
                    <thead className="bg-bg-subtle">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Data
                            </th>
                            <SortableHeader column="customerName">Cliente</SortableHeader>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Telefone
                            </th>
                            <SortableHeader column="partySize">Pessoas</SortableHeader>
                            <SortableHeader column="createdAt">Entrada</SortableHeader>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Chamado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Sentado
                            </th>
                            <SortableHeader column="timeToCall">Tempo→Chamar</SortableHeader>
                            <SortableHeader column="timeToSeat">Tempo→Sentar</SortableHeader>
                            <SortableHeader column="timeCallToSeat">Chamar→Sentar</SortableHeader>
                            <SortableHeader column="status">Status</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-bg-surface divide-y divide-border-default">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-bg-subtle transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                                    {formatDate(row.queueDate)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-primary">
                                    {row.customerName}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                                    {row.customerPhone}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary text-center">
                                    {row.partySize}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                                    {formatTime(row.createdAt)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                                    {row.calledAt ? formatTime(row.calledAt) : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                                    {row.seatedAt ? formatTime(row.seatedAt) : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                                    {row.timeToCall !== null ? `${row.timeToCall} min` : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                                    {row.timeToSeat !== null ? `${row.timeToSeat} min` : '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
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
    const config: Record<string, { label: string; variant: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }> = {
        WAITING: { label: 'Aguardando', variant: 'warning' },
        CALLED: { label: 'Chamado', variant: 'info' },
        SEATED: { label: 'Sentado', variant: 'success' },
        CANCELLED: { label: 'Cancelado', variant: 'neutral' },
        NO_SHOW: { label: 'Não Compareceu', variant: 'danger' },
    };

    const { label, variant } = config[status] || { label: status, variant: 'neutral' };

    return (
        <Badge variant={variant}>
            {label}
        </Badge>
    );
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
}

function formatTime(datetime: string): string {
    const d = new Date(datetime);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
