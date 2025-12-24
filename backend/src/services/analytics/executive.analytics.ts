import { AnalyticsRepository, AnalyticsFilters } from '../../repositories/analytics.repository';
import { determineBucketSize } from '../../utils/time-bucket.utils';
import { parseTimeRanges, parseDaysOfWeek } from '../../utils/time-bucket.utils';
import { parsePartySizeBucket } from '../../validators/reports.validator';

export interface ExecutiveSummaryParams {
    restaurantId: string;
    from: Date;
    to: Date;
    timeRange?: string;
    daysOfWeek?: string;
    partySizeBucket?: string;
    maxWaitMinutes?: number;
}

export class ExecutiveAnalytics {
    private repository: AnalyticsRepository;

    constructor() {
        this.repository = new AnalyticsRepository();
    }

    async generateReport(params: ExecutiveSummaryParams) {
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

        // Determine bucket size
        const bucketSize = determineBucketSize(params.from, params.to);

        // Fetch all data in parallel
        const [
            performanceKPIs,
            peakHour,
            peakWaitHour,
            hourlyEntries,
            waitByPeriod,
        ] = await Promise.all([
            this.repository.getPerformanceKPIs(filters),
            this.repository.getPeakHour(filters),
            this.repository.getPeakWaitHour(filters),
            this.repository.getHourlyEntries(filters),
            this.repository.getWaitTimeSeries(filters, bucketSize),
        ]);

        return {
            kpis: {
                wait_p50_min: performanceKPIs.wait_p50_min,
                groups_seated: performanceKPIs.groups_seated,
                groups_lost: performanceKPIs.groups_lost,
                lost_rate: performanceKPIs.lost_rate,
                peak_hour: peakHour || 'N/A',
                peak_wait_hour: peakWaitHour || 'N/A',
            },
            series: {
                hourly_entries: hourlyEntries,
                wait_by_period: waitByPeriod,
            },
            metadata: {
                bucket_size: bucketSize,
                period_days: Math.ceil((params.to.getTime() - params.from.getTime()) / (1000 * 60 * 60 * 24)),
            },
        };
    }
}
