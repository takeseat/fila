export interface FlowReportParams {
    restaurantId: string;
    from: Date;
    to: Date;
    timeRange?: string;
    daysOfWeek?: string;
    partySizeBucket?: string;
    maxWaitMinutes?: number;
}
export declare class FlowAnalytics {
    private repository;
    constructor();
    generateReport(params: FlowReportParams): Promise<{
        kpis: {
            avg_entry_to_call_min: number | null;
            avg_call_to_seat_min: number | null;
            called_to_seated_rate: number;
            called_to_noshow_rate: number;
            avg_idle_after_call_min: number | null;
            p50_idle_after_call_min: number | null;
            p75_idle_after_call_min: number | null;
        };
        funnel: {
            entered: number;
            called: number;
            seated: number;
            lost: number;
        };
        series: {
            stage_time_series: {
                bucket_time: string;
                entry_to_call_min: number | null;
                call_to_seat_min: number | null;
            }[];
            funnel_by_bucket: {
                bucket_time: string;
                entered: number;
                called: number;
                seated: number;
                lost: number;
            }[];
        };
        metadata: {
            bucket_size: import("../../utils/time-bucket.utils").BucketSize;
        };
    }>;
    private getIdleAfterCallTimes;
    private getStageTimeSeries;
    private getFunnelByBucket;
    private buildWhereClause;
}
//# sourceMappingURL=flow.analytics.d.ts.map