export interface ExecutiveSummaryParams {
    restaurantId: string;
    from: Date;
    to: Date;
    timeRange?: string;
    daysOfWeek?: string;
    partySizeBucket?: string;
    maxWaitMinutes?: number;
}
export declare class ExecutiveAnalytics {
    private repository;
    constructor();
    generateReport(params: ExecutiveSummaryParams): Promise<{
        kpis: {
            wait_p50_min: number | null;
            groups_seated: number;
            groups_lost: number;
            lost_rate: number;
            peak_hour: string;
            peak_wait_hour: string;
        };
        series: {
            hourly_entries: {
                hour: string;
                count: number;
            }[];
            wait_by_period: {
                bucket_time: string;
                avg_wait_min: number | null;
            }[];
        };
        metadata: {
            bucket_size: import("../../utils/time-bucket.utils").BucketSize;
            period_days: number;
        };
    }>;
}
//# sourceMappingURL=executive.analytics.d.ts.map