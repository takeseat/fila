"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutiveAnalytics = void 0;
const analytics_repository_1 = require("../../repositories/analytics.repository");
const time_bucket_utils_1 = require("../../utils/time-bucket.utils");
const time_bucket_utils_2 = require("../../utils/time-bucket.utils");
const reports_validator_1 = require("../../validators/reports.validator");
class ExecutiveAnalytics {
    constructor() {
        this.repository = new analytics_repository_1.AnalyticsRepository();
    }
    async generateReport(params) {
        // Build filters
        const filters = {
            restaurantId: params.restaurantId,
            from: params.from,
            to: params.to,
            maxWaitMinutes: params.maxWaitMinutes || 240,
        };
        // Parse optional filters
        if (params.timeRange) {
            filters.timeRangeHours = (0, time_bucket_utils_2.parseTimeRanges)(params.timeRange);
        }
        if (params.daysOfWeek) {
            filters.daysOfWeek = (0, time_bucket_utils_2.parseDaysOfWeek)(params.daysOfWeek);
        }
        if (params.partySizeBucket) {
            const bucket = (0, reports_validator_1.parsePartySizeBucket)(params.partySizeBucket);
            if (bucket) {
                filters.partySizeMin = bucket.min;
                filters.partySizeMax = bucket.max;
            }
        }
        // Determine bucket size
        const bucketSize = (0, time_bucket_utils_1.determineBucketSize)(params.from, params.to);
        // Fetch all data in parallel
        const [performanceKPIs, peakHour, peakWaitHour, hourlyEntries, waitByPeriod,] = await Promise.all([
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
exports.ExecutiveAnalytics = ExecutiveAnalytics;
//# sourceMappingURL=executive.analytics.js.map