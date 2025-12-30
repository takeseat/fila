import { BucketSize } from '../utils/time-bucket.utils';
export interface AnalyticsFilters {
    restaurantId: string;
    from: Date;
    to: Date;
    timeRangeHours?: Array<{
        start: number;
        end: number;
    }>;
    daysOfWeek?: number[];
    partySizeMin?: number;
    partySizeMax?: number | null;
    statuses?: string[];
    maxWaitMinutes?: number;
}
export declare class AnalyticsRepository {
    /**
     * Build WHERE clause for analytics queries
     */
    private buildWhereClause;
    /**
     * Get wait times for percentile calculation
     */
    getWaitTimes(filters: AnalyticsFilters): Promise<number[]>;
    /**
     * Get performance KPIs
     */
    getPerformanceKPIs(filters: AnalyticsFilters): Promise<{
        groups_total: number;
        groups_seated: number;
        groups_lost: number;
        lost_rate: number;
        wait_avg_min: number | null;
        wait_p50_min: number | null;
        wait_p75_min: number | null;
    }>;
    /**
     * Get volume time series
     */
    getVolumeSeries(filters: AnalyticsFilters, bucketSize: BucketSize): Promise<Array<{
        bucket_time: string;
        entered: number;
        seated: number;
        lost: number;
    }>>;
    /**
     * Get wait time series
     */
    getWaitTimeSeries(filters: AnalyticsFilters, bucketSize: BucketSize): Promise<Array<{
        bucket_time: string;
        avg_wait_min: number | null;
    }>>;
    /**
     * Get peak hour (most entries)
     */
    getPeakHour(filters: AnalyticsFilters): Promise<string | null>;
    /**
     * Get peak wait hour (highest average wait)
     */
    getPeakWaitHour(filters: AnalyticsFilters): Promise<string | null>;
    /**
     * Get hourly entry counts
     */
    getHourlyEntries(filters: AnalyticsFilters): Promise<Array<{
        hour: string;
        count: number;
    }>>;
    /**
     * Get flow metrics (entry to call, call to seat)
     */
    getFlowMetrics(filters: AnalyticsFilters): Promise<{
        avg_entry_to_call_min: number | null;
        avg_call_to_seat_min: number | null;
        called_to_seated_rate: number;
        called_to_noshow_rate: number;
    }>;
    /**
     * Get funnel counts
     */
    getFunnelCounts(filters: AnalyticsFilters): Promise<{
        entered: number;
        called: number;
        seated: number;
        lost: number;
    }>;
}
//# sourceMappingURL=analytics.repository.d.ts.map