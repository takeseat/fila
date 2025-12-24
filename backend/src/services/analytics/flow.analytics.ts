import { AnalyticsRepository, AnalyticsFilters } from '../../repositories/analytics.repository';
import { determineBucketSize, getMySQLBucketFormat } from '../../utils/time-bucket.utils';
import { parseTimeRanges, parseDaysOfWeek } from '../../utils/time-bucket.utils';
import { parsePartySizeBucket } from '../../validators/reports.validator';
import { calculateMedian, calculateP75 } from '../../utils/percentile.utils';
import prisma from '../../config/database';

export interface FlowReportParams {
    restaurantId: string;
    from: Date;
    to: Date;
    timeRange?: string;
    daysOfWeek?: string;
    partySizeBucket?: string;
    maxWaitMinutes?: number;
}

export class FlowAnalytics {
    private repository: AnalyticsRepository;

    constructor() {
        this.repository = new AnalyticsRepository();
    }

    async generateReport(params: FlowReportParams) {
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

        // Fetch flow metrics and funnel
        const [flowMetrics, funnelCounts, stageTimeSeries, funnelByBucket] = await Promise.all([
            this.repository.getFlowMetrics(filters),
            this.repository.getFunnelCounts(filters),
            this.getStageTimeSeries(filters, bucketSize),
            this.getFunnelByBucket(filters, bucketSize),
        ]);

        // Calculate idle time percentiles
        const idleTimes = await this.getIdleAfterCallTimes(filters);
        const p50_idle = calculateMedian(idleTimes);
        const p75_idle = calculateP75(idleTimes);

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

    private async getIdleAfterCallTimes(filters: AnalyticsFilters): Promise<number[]> {
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

        const result = await prisma.$queryRawUnsafe<Array<{ idle_minutes: number | bigint }>>(query);
        // Convert BigInt to Number to avoid sorting issues in percentile calculation
        return result.map(r => typeof r.idle_minutes === 'bigint' ? Number(r.idle_minutes) : r.idle_minutes);
    }

    private async getStageTimeSeries(
        filters: AnalyticsFilters,
        bucketSize: 'hour' | 'day'
    ): Promise<Array<{
        bucket_time: string;
        entry_to_call_min: number | null;
        call_to_seat_min: number | null;
    }>> {
        const whereClause = this.buildWhereClause(filters);
        const bucketFormat = getMySQLBucketFormat(bucketSize);

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

        const result = await prisma.$queryRawUnsafe<Array<{
            bucket_time: string;
            entry_to_call_min: number | null;
            call_to_seat_min: number | null;
        }>>(query);

        return result;
    }

    private async getFunnelByBucket(
        filters: AnalyticsFilters,
        bucketSize: 'hour' | 'day'
    ): Promise<Array<{
        bucket_time: string;
        entered: number;
        called: number;
        seated: number;
        lost: number;
    }>> {
        const whereClause = this.buildWhereClause(filters);
        const bucketFormat = getMySQLBucketFormat(bucketSize);

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

        const result = await prisma.$queryRawUnsafe<Array<{
            bucket_time: string;
            entered: bigint;
            called: bigint;
            seated: bigint;
            lost: bigint;
        }>>(query);

        return result.map(row => ({
            bucket_time: row.bucket_time,
            entered: Number(row.entered),
            called: Number(row.called),
            seated: Number(row.seated),
            lost: Number(row.lost),
        }));
    }

    private buildWhereClause(filters: AnalyticsFilters): string {
        const conditions: string[] = [
            `restaurant_id = '${filters.restaurantId}'`,
            `created_at >= '${filters.from.toISOString()}'`,
            `created_at <= '${filters.to.toISOString()}'`,
        ];

        if (filters.timeRangeHours && filters.timeRangeHours.length > 0) {
            const timeConditions = filters.timeRangeHours.map(range => {
                if (range.start <= range.end) {
                    return `HOUR(created_at) BETWEEN ${range.start} AND ${range.end}`;
                } else {
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
            } else {
                conditions.push(`party_size >= ${filters.partySizeMin}`);
            }
        }

        return conditions.join(' AND ');
    }
}
