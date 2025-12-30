"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceAnalytics = void 0;
const analytics_repository_1 = require("../../repositories/analytics.repository");
const time_bucket_utils_1 = require("../../utils/time-bucket.utils");
const time_bucket_utils_2 = require("../../utils/time-bucket.utils");
const reports_validator_1 = require("../../validators/reports.validator");
class PerformanceAnalytics {
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
        if (params.statuses) {
            const parsed = (0, reports_validator_1.parseStatuses)(params.statuses);
            if (parsed) {
                filters.statuses = parsed;
            }
        }
        // Determine bucket size
        const bucketSize = (0, time_bucket_utils_1.determineBucketSize)(params.from, params.to);
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
exports.PerformanceAnalytics = PerformanceAnalytics;
//# sourceMappingURL=performance.analytics.js.map