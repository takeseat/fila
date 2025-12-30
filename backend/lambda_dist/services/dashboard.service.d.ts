import { HourlyVolume, DailyVolume } from '../repositories/dashboard.repository';
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
export declare class DashboardService {
    private repository;
    private waitlistService;
    constructor();
    getMetrics(restaurantId: string): Promise<DashboardMetrics>;
    /**
     * Calculate percentage change between current and previous value
     */
    private calculatePercentageChange;
}
//# sourceMappingURL=dashboard.service.d.ts.map