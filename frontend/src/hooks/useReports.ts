import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface ReportFilters {
    from: string;
    to: string;
    timeRange?: string;
    daysOfWeek?: string;
    partySizeBucket?: '1-2' | '3-4' | '5+';
    statuses?: string;
    maxWaitMinutes?: number;
}

export function usePerformanceReport(filters: ReportFilters) {
    return useQuery({
        queryKey: ['reports', 'performance', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('from', filters.from);
            params.append('to', filters.to);
            if (filters.timeRange) params.append('timeRange', filters.timeRange);
            if (filters.daysOfWeek) params.append('daysOfWeek', filters.daysOfWeek);
            if (filters.partySizeBucket) params.append('partySizeBucket', filters.partySizeBucket);
            if (filters.statuses) params.append('statuses', filters.statuses);
            if (filters.maxWaitMinutes) params.append('maxWaitMinutes', filters.maxWaitMinutes.toString());

            const { data } = await api.get(`/reports/waitlist-performance?${params.toString()}`);
            return data;
        },
        enabled: !!filters.from && !!filters.to,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useExecutiveReport(filters: ReportFilters) {
    return useQuery({
        queryKey: ['reports', 'executive', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('from', filters.from);
            params.append('to', filters.to);
            if (filters.timeRange) params.append('timeRange', filters.timeRange);
            if (filters.daysOfWeek) params.append('daysOfWeek', filters.daysOfWeek);
            if (filters.partySizeBucket) params.append('partySizeBucket', filters.partySizeBucket);
            if (filters.maxWaitMinutes) params.append('maxWaitMinutes', filters.maxWaitMinutes.toString());

            const { data } = await api.get(`/reports/executive-summary?${params.toString()}`);
            return data;
        },
        enabled: !!filters.from && !!filters.to,
        staleTime: 5 * 60 * 1000,
    });
}

export function useFlowReport(filters: ReportFilters) {
    return useQuery({
        queryKey: ['reports', 'flow', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('from', filters.from);
            params.append('to', filters.to);
            if (filters.timeRange) params.append('timeRange', filters.timeRange);
            if (filters.daysOfWeek) params.append('daysOfWeek', filters.daysOfWeek);
            if (filters.partySizeBucket) params.append('partySizeBucket', filters.partySizeBucket);
            if (filters.maxWaitMinutes) params.append('maxWaitMinutes', filters.maxWaitMinutes.toString());

            const { data } = await api.get(`/reports/waitlist-flow?${params.toString()}`);
            return data;
        },
        enabled: !!filters.from && !!filters.to,
        staleTime: 5 * 60 * 1000,
    });
}
