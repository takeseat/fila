"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
const percentile_utils_1 = require("../utils/percentile.utils");
const time_bucket_utils_1 = require("../utils/time-bucket.utils");
class AnalyticsRepository {
    /**
     * Build WHERE clause for analytics queries
     */
    buildWhereClause(filters) {
        const fromISO = filters.from.toISOString();
        const toISO = filters.to.toISOString();
        console.log('[Analytics] Building WHERE clause with dates:', {
            restaurantId: filters.restaurantId,
            from: fromISO,
            to: toISO,
        });
        const conditions = [
            `restaurant_id = '${filters.restaurantId}'`,
            `created_at >= '${fromISO}'`,
            `created_at <= '${toISO}'`,
        ];
        // Time range filter
        if (filters.timeRangeHours && filters.timeRangeHours.length > 0) {
            const timeConditions = filters.timeRangeHours.map(range => {
                if (range.start <= range.end) {
                    return `HOUR(created_at) BETWEEN ${range.start} AND ${range.end}`;
                }
                else {
                    // Overnight range
                    return `(HOUR(created_at) >= ${range.start} OR HOUR(created_at) <= ${range.end})`;
                }
            });
            conditions.push(`(${timeConditions.join(' OR ')})`);
        }
        // Days of week filter
        if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
            conditions.push(`DAYOFWEEK(created_at) - 1 IN (${filters.daysOfWeek.join(',')})`);
        }
        // Party size filter
        if (filters.partySizeMin !== undefined) {
            if (filters.partySizeMax !== null) {
                conditions.push(`party_size BETWEEN ${filters.partySizeMin} AND ${filters.partySizeMax}`);
            }
            else {
                conditions.push(`party_size >= ${filters.partySizeMin}`);
            }
        }
        // Status filter
        if (filters.statuses && filters.statuses.length > 0) {
            const statusList = filters.statuses.map(s => `'${s}'`).join(',');
            conditions.push(`status IN (${statusList})`);
        }
        return conditions.join(' AND ');
    }
    /**
     * Get wait times for percentile calculation
     */
    async getWaitTimes(filters) {
        const whereClause = this.buildWhereClause(filters);
        const maxWait = filters.maxWaitMinutes || 240;
        const query = `
            SELECT TIMESTAMPDIFF(MINUTE, created_at, seated_at) as wait_minutes
            FROM waitlist_entries
            WHERE ${whereClause}
              AND seated_at IS NOT NULL
              AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) > 0
              AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= ${maxWait}
            ORDER BY wait_minutes
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        // Convert BigInt to Number to avoid sorting issues in percentile calculation
        return result.map(r => typeof r.wait_minutes === 'bigint' ? Number(r.wait_minutes) : r.wait_minutes);
    }
    /**
     * Get performance KPIs
     */
    async getPerformanceKPIs(filters) {
        const whereClause = this.buildWhereClause(filters);
        const maxWait = filters.maxWaitMinutes || 240;
        const query = `
            SELECT 
                COUNT(*) as groups_total,
                SUM(CASE WHEN status = 'SEATED' THEN 1 ELSE 0 END) as groups_seated,
                SUM(CASE WHEN status IN ('CANCELLED', 'NO_SHOW') THEN 1 ELSE 0 END) as groups_lost,
                AVG(CASE 
                    WHEN seated_at IS NOT NULL 
                    AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= ${maxWait}
                    THEN TIMESTAMPDIFF(MINUTE, created_at, seated_at)
                    ELSE NULL 
                END) as wait_avg_min
            FROM waitlist_entries
            WHERE ${whereClause}
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        const row = result[0];
        const groups_total = Number(row.groups_total);
        const groups_seated = Number(row.groups_seated);
        const groups_lost = Number(row.groups_lost);
        // Calculate percentiles
        const waitTimes = await this.getWaitTimes(filters);
        const wait_p50_min = (0, percentile_utils_1.calculateMedian)(waitTimes);
        const wait_p75_min = (0, percentile_utils_1.calculateP75)(waitTimes);
        return {
            groups_total,
            groups_seated,
            groups_lost,
            lost_rate: groups_total > 0 ? groups_lost / groups_total : 0,
            wait_avg_min: row.wait_avg_min,
            wait_p50_min,
            wait_p75_min,
        };
    }
    /**
     * Get volume time series
     */
    async getVolumeSeries(filters, bucketSize) {
        const whereClause = this.buildWhereClause(filters);
        const bucketFormat = (0, time_bucket_utils_1.getMySQLBucketFormat)(bucketSize);
        const query = `
            SELECT 
                DATE_FORMAT(created_at, '${bucketFormat}') as bucket_time,
                COUNT(*) as entered,
                SUM(CASE WHEN status = 'SEATED' THEN 1 ELSE 0 END) as seated,
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
            seated: Number(row.seated),
            lost: Number(row.lost),
        }));
    }
    /**
     * Get wait time series
     */
    async getWaitTimeSeries(filters, bucketSize) {
        const whereClause = this.buildWhereClause(filters);
        const bucketFormat = (0, time_bucket_utils_1.getMySQLBucketFormat)(bucketSize);
        const maxWait = filters.maxWaitMinutes || 240;
        const query = `
            SELECT 
                DATE_FORMAT(created_at, '${bucketFormat}') as bucket_time,
                AVG(TIMESTAMPDIFF(MINUTE, created_at, seated_at)) as avg_wait_min
            FROM waitlist_entries
            WHERE ${whereClause}
              AND seated_at IS NOT NULL
              AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) > 0
              AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= ${maxWait}
            GROUP BY bucket_time
            ORDER BY bucket_time
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        return result;
    }
    /**
     * Get peak hour (most entries)
     */
    async getPeakHour(filters) {
        const whereClause = this.buildWhereClause(filters);
        const query = `
            SELECT 
                HOUR(created_at) as hour,
                COUNT(*) as count
            FROM waitlist_entries
            WHERE ${whereClause}
            GROUP BY hour
            ORDER BY count DESC
            LIMIT 1
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        if (result.length === 0) {
            return null;
        }
        return `${String(result[0].hour).padStart(2, '0')}:00`;
    }
    /**
     * Get peak wait hour (highest average wait)
     */
    async getPeakWaitHour(filters) {
        const whereClause = this.buildWhereClause(filters);
        const maxWait = filters.maxWaitMinutes || 240;
        const query = `
            SELECT 
                HOUR(created_at) as hour,
                AVG(TIMESTAMPDIFF(MINUTE, created_at, seated_at)) as avg_wait
            FROM waitlist_entries
            WHERE ${whereClause}
              AND seated_at IS NOT NULL
              AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= ${maxWait}
            GROUP BY hour
            ORDER BY avg_wait DESC
            LIMIT 1
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        if (result.length === 0) {
            return null;
        }
        return `${String(result[0].hour).padStart(2, '0')}:00`;
    }
    /**
     * Get hourly entry counts
     */
    async getHourlyEntries(filters) {
        const whereClause = this.buildWhereClause(filters);
        const query = `
            SELECT 
                HOUR(created_at) as hour_num,
                COUNT(*) as count
            FROM waitlist_entries
            WHERE ${whereClause}
            GROUP BY hour_num
            ORDER BY hour_num
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        return result.map(row => ({
            hour: `${String(row.hour_num).padStart(2, '0')}:00`,
            count: Number(row.count),
        }));
    }
    /**
     * Get flow metrics (entry to call, call to seat)
     */
    async getFlowMetrics(filters) {
        const whereClause = this.buildWhereClause(filters);
        const query = `
            SELECT 
                AVG(CASE 
                    WHEN called_at IS NOT NULL 
                    THEN TIMESTAMPDIFF(MINUTE, created_at, called_at)
                    ELSE NULL 
                END) as avg_entry_to_call_min,
                AVG(CASE 
                    WHEN called_at IS NOT NULL AND seated_at IS NOT NULL
                    THEN TIMESTAMPDIFF(MINUTE, called_at, seated_at)
                    ELSE NULL 
                END) as avg_call_to_seat_min,
                SUM(CASE WHEN called_at IS NOT NULL THEN 1 ELSE 0 END) as called_count,
                SUM(CASE WHEN called_at IS NOT NULL AND seated_at IS NOT NULL THEN 1 ELSE 0 END) as seated_after_call,
                SUM(CASE WHEN called_at IS NOT NULL AND status = 'NO_SHOW' THEN 1 ELSE 0 END) as noshow_after_call
            FROM waitlist_entries
            WHERE ${whereClause}
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        const row = result[0];
        const called_count = Number(row.called_count);
        return {
            avg_entry_to_call_min: row.avg_entry_to_call_min,
            avg_call_to_seat_min: row.avg_call_to_seat_min,
            called_to_seated_rate: called_count > 0 ? Number(row.seated_after_call) / called_count : 0,
            called_to_noshow_rate: called_count > 0 ? Number(row.noshow_after_call) / called_count : 0,
        };
    }
    /**
     * Get funnel counts
     */
    async getFunnelCounts(filters) {
        const whereClause = this.buildWhereClause(filters);
        const query = `
            SELECT 
                COUNT(*) as entered,
                SUM(CASE WHEN called_at IS NOT NULL THEN 1 ELSE 0 END) as called,
                SUM(CASE WHEN seated_at IS NOT NULL THEN 1 ELSE 0 END) as seated,
                SUM(CASE WHEN status IN ('CANCELLED', 'NO_SHOW') THEN 1 ELSE 0 END) as lost
            FROM waitlist_entries
            WHERE ${whereClause}
        `;
        const result = await database_1.default.$queryRawUnsafe(query);
        const row = result[0];
        return {
            entered: Number(row.entered),
            called: Number(row.called),
            seated: Number(row.seated),
            lost: Number(row.lost),
        };
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
//# sourceMappingURL=analytics.repository.js.map