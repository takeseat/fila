import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface QueueEntriesFilters {
    from: string;
    to: string;
    statuses?: string;
    clientSearch?: string;
    partySizeMin?: number;
    partySizeMax?: number;
    daysOfWeek?: string;
    timeRange?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface QueueEntryRow {
    id: string;
    queueDate: string;
    customerName: string;
    customerPhone: string;
    partySize: number;
    createdAt: string;
    calledAt: string | null;
    seatedAt: string | null;
    cancelledAt: string | null;
    noShowAt: string | null;
    status: string;
    timeToCall: number | null;
    timeToSeat: number | null;
    timeCallToSeat: number | null;
}

export interface QueueEntriesResult {
    data: QueueEntryRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export function useQueueEntriesReport(filters: QueueEntriesFilters) {
    return useQuery<QueueEntriesResult>({
        queryKey: ['reports', 'queue-entries', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('from', filters.from);
            params.append('to', filters.to);

            if (filters.statuses) params.append('statuses', filters.statuses);
            if (filters.clientSearch) params.append('clientSearch', filters.clientSearch);
            if (filters.partySizeMin) params.append('partySizeMin', filters.partySizeMin.toString());
            if (filters.partySizeMax) params.append('partySizeMax', filters.partySizeMax.toString());
            if (filters.daysOfWeek) params.append('daysOfWeek', filters.daysOfWeek);
            if (filters.timeRange) params.append('timeRange', filters.timeRange);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

            const { data } = await api.get(`/reports/queue-entries?${params.toString()}`);
            return data;
        },
        enabled: !!filters.from && !!filters.to,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

export function getExportURL(type: 'csv' | 'pdf', filters: QueueEntriesFilters): string {
    const params = new URLSearchParams();
    params.append('from', filters.from);
    params.append('to', filters.to);

    if (filters.statuses) params.append('statuses', filters.statuses);
    if (filters.clientSearch) params.append('clientSearch', filters.clientSearch);
    if (filters.partySizeMin) params.append('partySizeMin', filters.partySizeMin.toString());
    if (filters.partySizeMax) params.append('partySizeMax', filters.partySizeMax.toString());
    if (filters.daysOfWeek) params.append('daysOfWeek', filters.daysOfWeek);
    if (filters.timeRange) params.append('timeRange', filters.timeRange);

    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${baseURL}/reports/queue-entries/export/${type}?${params.toString()}`;
}
