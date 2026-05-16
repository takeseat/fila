import { AnalyticsRepository, AnalyticsFilters } from '../../repositories/analytics.repository';
import { determineBucketSize } from '../../utils/time-bucket.utils';
import { parseTimeRanges, parseDaysOfWeek } from '../../utils/time-bucket.utils';
import { parsePartySizeBucket, parseStatuses } from '../../validators/reports.validator';

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

export class PerformanceAnalytics {
    private repository: AnalyticsRepository;

    constructor() {
        this.repository = new AnalyticsRepository();
    }

    async generateReport(params: PerformanceReportParams) {
        // Build filters
        const filters: AnalyticsFilters = {
            restaurantId: params.restaurantId,
            from: params.from,
            to: params.to,
            maxWaitMinutes: params.maxWaitMinutes || 240,
        };

        // Parse optional filters
        if (params.timeRange) {
            filters.timeRangeHours = parseTimeRanges(params.timeRange);
        }

        if (params.daysOfWeek) {
            filters.daysOfWeek = parseDaysOfWeek(params.daysOfWeek);
        }

        if (params.partySizeBucket) {
            const bucket = parsePartySizeBucket(params.partySizeBucket);
            if (bucket) {
                filters.partySizeMin = bucket.min;
                filters.partySizeMax = bucket.max;
            }
        }

        if (params.statuses) {
            const parsed = parseStatuses(params.statuses);
            if (parsed) {
                filters.statuses = parsed;
            }
        }

        // Determine bucket size
        const bucketSize = determineBucketSize(params.from, params.to);

        // Fetch all data in parallel
        const [kpis, volumeSeries, waitTimeSeries] = await Promise.all([
            this.repository.getPerformanceKPIs(filters),
            this.repository.getVolumeSeries(filters, bucketSize),
            this.repository.getWaitTimeSeries(filters, bucketSize),
        ]);

        // Build dailyData by merging volume and wait time series by bucket_time
        const dailyData = volumeSeries.map(v => {
            const waitEntry = waitTimeSeries.find(w => w.bucket_time === v.bucket_time);
            return {
                date: v.bucket_time,
                totalServed: v.seated,
                averageWaitTime: waitEntry?.avg_wait_min != null
                    ? Math.round(waitEntry.avg_wait_min * 60) // convert minutes → seconds for frontend
                    : 0,
            };
        });

        return {
            metrics: {
                totalServed: kpis.groups_seated,
                averageWaitTime: kpis.wait_avg_min != null
                    ? Math.round(kpis.wait_avg_min * 60) // minutes → seconds
                    : 0,
            },
            dailyData,
        };
    }
}
