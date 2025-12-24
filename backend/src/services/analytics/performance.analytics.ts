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

        // Calculate peak concurrent groups (approximation)
        // For MVP, we'll use the max "entered - seated - lost" in any bucket
        const peak_concurrent_groups = volumeSeries.reduce((max, bucket) => {
            const concurrent = bucket.entered - bucket.seated - bucket.lost;
            return Math.max(max, concurrent);
        }, 0);

        return {
            kpis: {
                ...kpis,
                peak_concurrent_groups,
            },
            series: {
                wait_time_series: waitTimeSeries,
                volume_series: volumeSeries,
            },
            metadata: {
                bucket_size: bucketSize,
                filters_applied: {
                    time_range: !!params.timeRange,
                    days_of_week: !!params.daysOfWeek,
                    party_size: !!params.partySizeBucket,
                    statuses: !!params.statuses,
                },
            },
        };
    }
}
