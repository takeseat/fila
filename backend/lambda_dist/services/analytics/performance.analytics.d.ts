export interface PerformanceReportParams {
    restaurantId: string;
    from: Date;
    to: Date;
    timeRange?: string;
    daysOfWeek?: string;
    partySizeBucket?: string;
    statuses?: string;
    maxWaitMinutes?: number;
}
export declare class PerformanceAnalytics {
    private repository;
    constructor();
    generateReport(params: PerformanceReportParams): Promise<{
        kpis: {
            peak_concurrent_groups: number;
            groups_total: number;
            groups_seated: number;
            groups_lost: number;
            lost_rate: number;
            wait_avg_min: number | null;
            wait_p50_min: number | null;
            wait_p75_min: number | null;
        };
        series: {
            wait_time_series: {
                bucket_time: string;
                avg_wait_min: number | null;
            }[];
            volume_series: {
                bucket_time: string;
                entered: number;
                seated: number;
                lost: number;
            }[];
        };
        metadata: {
            bucket_size: import("../../utils/time-bucket.utils").BucketSize;
            filters_applied: {
                time_range: boolean;
                days_of_week: boolean;
                party_size: boolean;
                statuses: boolean;
            };
        };
    }>;
}
//# sourceMappingURL=performance.analytics.d.ts.map