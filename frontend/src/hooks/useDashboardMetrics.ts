import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface HourlyVolume {
    hour: number;
    count: number;
}

export interface DailyVolume {
    date: string;
    count: number;
}

export interface DashboardMetrics {
    activeQueue: {
        count: number;
        vsYesterday: number;
    };
    seatedToday: {
        count: number;
        vsYesterday: number;
    };
    avgWaitTime: {
        minutes: number | null;
        vsYesterday: number | null;
        windowMinutes?: number;
        isFallbackUsed?: boolean;
    };
    cancelledToday: {
        count: number;
    };
    hourlyVolume: HourlyVolume[];
    weeklyTrend: DailyVolume[];
}

export function useDashboardMetrics(options?: { staleTime?: number }) {
    return useQuery<DashboardMetrics>({
        queryKey: ['dashboard', 'metrics'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/metrics');
            return data;
        },
        refetchInterval: 30000,
        staleTime: 20000,
        ...options,
    });
}
