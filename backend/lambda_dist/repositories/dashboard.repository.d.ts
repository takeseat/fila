export interface HourlyVolume {
    hour: number;
    count: number;
}
export interface DailyVolume {
    date: string;
    count: number;
}
export interface YesterdayMetrics {
    activeQueueCount: number;
    seatedCount: number;
    avgWaitTimeMinutes: number | null;
}
export declare class DashboardRepository {
    /**
     * Get count of customers currently in queue (WAITING or CALLED)
     */
    getActiveQueueCount(restaurantId: string): Promise<number>;
    /**
     * Get count of customers seated today
     */
    getSeatedTodayCount(restaurantId: string): Promise<number>;
    /**
     * Get P90 (90th percentile) wait time for customers seated today (in minutes)
     */
    getAverageWaitTimeToday(restaurantId: string): Promise<number | null>;
    /**
     * Get count of cancelled/no-show customers today
     */
    getCancelledTodayCount(restaurantId: string): Promise<number>;
    /**
     * Get hourly volume for today
     */
    getHourlyVolumeToday(restaurantId: string): Promise<HourlyVolume[]>;
    /**
     * Get daily volume for current week (Monday to Sunday)
     */
    getDailyVolumeLast7Days(restaurantId: string): Promise<DailyVolume[]>;
    /**
     * Get yesterday's metrics for comparison
     */
    getYesterdayMetrics(restaurantId: string): Promise<YesterdayMetrics>;
}
//# sourceMappingURL=dashboard.repository.d.ts.map