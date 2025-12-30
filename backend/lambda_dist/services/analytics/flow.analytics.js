"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowAnalytics = void 0;
const analytics_repository_1 = require("../../repositories/analytics.repository");
const time_bucket_utils_1 = require("../../utils/time-bucket.utils");
const time_bucket_utils_2 = require("../../utils/time-bucket.utils");
const reports_validator_1 = require("../../validators/reports.validator");
const percentile_utils_1 = require("../../utils/percentile.utils");
const database_1 = __importDefault(require("../../config/database"));
class FlowAnalytics {
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
        // Fetch flow metrics and funnel
        const [flowMetrics, funnelCounts, stageTimeSeries, funnelByBucket] = await Promise.all([
            this.repository.getFlowMetrics(filters),
            this.repository.getFunnelCounts(filters),
            this.getStageTimeSeries(filters, bucketSize),
            this.getFunnelByBucket(filters, bucketSize),
        ]);
        // Calculate idle time percentiles
        const idleTimes = await this.getIdleAfterCallTimes(filters);
        const p50_idle = (0, percentile_utils_1.calculateMedian)(idleTimes);
        const p75_idle = (0, percentile_utils_1.calculateP75)(idleTimes);
        return {
            kpis: {
                avg_entry_to_call_min: flowMetrics.avg_entry_to_call_min,
                avg_call_to_seat_min: flowMetrics.avg_call_to_seat_min,
                called_to_seated_rate: flowMetrics.called_to_seated_rate,
                called_to_noshow_rate: flowMetrics.called_to_noshow_rate,
                avg_idle_after_call_min: flowMetrics.avg_call_to_seat_min,
                p50_idle_after_call_min: p50_idle,
                p75_idle_after_call_min: p75_idle,
            },
            funnel: funnelCounts,
            series: {
                stage_time_series: stageTimeSeries,
                funnel_by_bucket: funnelByBucket,
            },
            metadata: {
                bucket_size: bucketSize,
            },
        };
    }
    async getIdleAfterCallTimes(filters) {
        const whereClause = this.buildWhereClause(filters);
        const query = `
            SELECT TIMESTAMPDIFF(MINUTE, called_at, seated_at) as idle_minutes
            FROM waitlist_entries
            WHERE ${whereClause}
              AND called_at IS NOT NULL
              AND seated_at IS NOT NULL
              AND TIMESTAMPDIFF(MINUTE, called_at, seated_at) > 0
              AND TIMESTAMPDIFF(MINUTE, called_at, seated_at) <= 60
            ORDER BY idle_minutes
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        // Convert BigInt to Number to avoid sorting issues in percentile calculation
        return result.map(r => typeof r.idle_minutes === 'bigint' ? Number(r.idle_minutes) : r.idle_minutes);
    }
    async getStageTimeSeries(filters, bucketSize) {
        const whereClause = this.buildWhereClause(filters);
        const bucketFormat = (0, time_bucket_utils_1.getMySQLBucketFormat)(bucketSize);
        const query = `
            SELECT 
                DATE_FORMAT(created_at, '${bucketFormat}') as bucket_time,
                AVG(CASE 
                    WHEN called_at IS NOT NULL 
                    THEN TIMESTAMPDIFF(MINUTE, created_at, called_at)
                    ELSE NULL 
                END) as entry_to_call_min,
                AVG(CASE 
                    WHEN called_at IS NOT NULL AND seated_at IS NOT NULL
                    THEN TIMESTAMPDIFF(MINUTE, called_at, seated_at)
                    ELSE NULL 
                END) as call_to_seat_min
            FROM waitlist_entries
            WHERE ${whereClause}
            GROUP BY bucket_time
            ORDER BY bucket_time
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        return result;
    }
    async getFunnelByBucket(filters, bucketSize) {
        const whereClause = this.buildWhereClause(filters);
        const bucketFormat = (0, time_bucket_utils_1.getMySQLBucketFormat)(bucketSize);
        const query = `
            SELECT 
                DATE_FORMAT(created_at, '${bucketFormat}') as bucket_time,
                COUNT(*) as entered,
                SUM(CASE WHEN called_at IS NOT NULL THEN 1 ELSE 0 END) as called,
                SUM(CASE WHEN seated_at IS NOT NULL THEN 1 ELSE 0 END) as seated,
                SUM(CASE WHEN status IN ('CANCELLED', 'NO_SHOW') THEN 1 ELSE 0 END) as lost
            FROM waitlist_entries
            WHERE ${whereClause}
            GROUP BY bucket_time
            ORDER BY bucket_time
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        return result.map(row => ({
            bucket_time: row.bucket_time,
            entered: Number(row.entered),
            called: Number(row.called),
            seated: Number(row.seated),
            lost: Number(row.lost),
        }));
    }
    buildWhereClause(filters) {
        const conditions = [
            `restaurant_id = '${filters.restaurantId}'`,
            `created_at >= '${filters.from.toISOString()}'`,
            `created_at <= '${filters.to.toISOString()}'`,
        ];
        if (filters.timeRangeHours && filters.timeRangeHours.length > 0) {
            const timeConditions = filters.timeRangeHours.map(range => {
                if (range.start <= range.end) {
                    return `HOUR(created_at) BETWEEN ${range.start} AND ${range.end}`;
                }
                else {
                    return `(HOUR(created_at) >= ${range.start} OR HOUR(created_at) <= ${range.end})`;
                }
            });
            conditions.push(`(${timeConditions.join(' OR ')})`);
        }
        if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
            conditions.push(`DAYOFWEEK(created_at) - 1 IN (${filters.daysOfWeek.join(',')})`);
        }
        if (filters.partySizeMin !== undefined) {
            if (filters.partySizeMax !== null) {
                conditions.push(`party_size BETWEEN ${filters.partySizeMin} AND ${filters.partySizeMax}`);
            }
            else {
                conditions.push(`party_size >= ${filters.partySizeMin}`);
            }
        }
        return conditions.join(' AND ');
    }
}
exports.FlowAnalytics = FlowAnalytics;
//# sourceMappingURL=flow.analytics.js.map