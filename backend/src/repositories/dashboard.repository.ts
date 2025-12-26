import prisma from '../config/database';

export interface HourlyVolume {
    hour: number;
    count: number;
}

export interface DailyVolume {
    date: string;
    count: number;
}

export interface YesterdayMetrics {
    activeQueueCount: number;
    seatedCount: number;
    avgWaitTimeMinutes: number | null;
}

export class DashboardRepository {
    /**
     * Get count of customers currently in queue (WAITING or CALLED)
     */
    async getActiveQueueCount(restaurantId: string): Promise<number> {
        const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND status IN ('WAITING', 'CALLED')`,
            restaurantId
        );
        return Number(result[0].count);
    }

    /**
     * Get count of customers seated today
     */
    async getSeatedTodayCount(restaurantId: string): Promise<number> {
        const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND status = 'SEATED'
               AND DATE(seated_at) = CURDATE()`,
            restaurantId
        );
        return Number(result[0].count);
    }

    /**
     * Get P90 (90th percentile) wait time for customers seated today (in minutes)
     */
    async getAverageWaitTimeToday(restaurantId: string): Promise<number | null> {
        const result = await prisma.$queryRawUnsafe<Array<{ p90_wait: number | null }>>(
            `WITH wait_times AS (
                SELECT 
                    TIMESTAMPDIFF(MINUTE, created_at, seated_at) as wait_minutes,
                    ROW_NUMBER() OVER (ORDER BY TIMESTAMPDIFF(MINUTE, created_at, seated_at)) as row_num,
                    COUNT(*) OVER () as total_count
                FROM waitlist_entries
                WHERE restaurant_id = ?
                  AND status = 'SEATED'
                  AND DATE(seated_at) = CURDATE()
                  AND seated_at IS NOT NULL
                  AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) > 0
                  AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= 240
            )
            SELECT wait_minutes as p90_wait
            FROM wait_times
            WHERE row_num = CEIL(0.9 * total_count)
            LIMIT 1`,
            restaurantId
        );

        const p90Wait = result[0]?.p90_wait;
        return p90Wait !== null && p90Wait !== undefined ? Math.round(Number(p90Wait)) : null;
    }

    /**
     * Get count of cancelled/no-show customers today
     */
    async getCancelledTodayCount(restaurantId: string): Promise<number> {
        const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND (
                 (status = 'CANCELLED' AND DATE(cancelled_at) = CURDATE())
                 OR
                 (status = 'NO_SHOW' AND DATE(no_show_at) = CURDATE())
               )`,
            restaurantId
        );
        return Number(result[0].count);
    }

    /**
     * Get hourly volume for today
     */
    async getHourlyVolumeToday(restaurantId: string): Promise<HourlyVolume[]> {
        const result = await prisma.$queryRawUnsafe<Array<{ hour: number; count: bigint }>>(
            `SELECT 
                HOUR(created_at) as hour,
                COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND DATE(created_at) = CURDATE()
             GROUP BY HOUR(created_at)
             ORDER BY hour`,
            restaurantId
        );

        return result.map(row => ({
            hour: row.hour,
            count: Number(row.count),
        }));
    }

    /**
     * Get daily volume for current week (Monday to Sunday)
     */
    async getDailyVolumeLast7Days(restaurantId: string): Promise<DailyVolume[]> {
        const result = await prisma.$queryRawUnsafe<Array<{ date: Date; count: bigint; weekday: number }>>(
            `SELECT 
                DATE(created_at) as date,
                DAYOFWEEK(created_at) as weekday,
                COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
               AND created_at < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY)
             GROUP BY DATE(created_at), DAYOFWEEK(created_at)
             ORDER BY date`,
            restaurantId
        );

        return result.map(row => ({
            date: row.date.toISOString().split('T')[0],
            count: Number(row.count),
        }));
    }

    /**
     * Get yesterday's metrics for comparison
     */
    async getYesterdayMetrics(restaurantId: string): Promise<YesterdayMetrics> {
        // Active queue count at same time yesterday
        const activeQueueResult = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND status IN ('WAITING', 'CALLED')
               AND DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
               AND HOUR(created_at) = HOUR(NOW())`,
            restaurantId
        );

        // Seated count yesterday
        const seatedResult = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
            `SELECT COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND status = 'SEATED'
               AND DATE(seated_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`,
            restaurantId
        );

        // P90 wait time for yesterday
        const p90Result = await prisma.$queryRawUnsafe<Array<{ p90_wait: number | null }>>(
            `WITH wait_times AS (
                SELECT 
                    TIMESTAMPDIFF(MINUTE, created_at, seated_at) as wait_minutes,
                    ROW_NUMBER() OVER (ORDER BY TIMESTAMPDIFF(MINUTE, created_at, seated_at)) as row_num,
                    COUNT(*) OVER () as total_count
                FROM waitlist_entries
                WHERE restaurant_id = ?
                  AND status = 'SEATED'
                  AND DATE(seated_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                  AND seated_at IS NOT NULL
                  AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) > 0
                  AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= 240
            )
            SELECT wait_minutes as p90_wait
            FROM wait_times
            WHERE row_num = CEIL(0.9 * total_count)
            LIMIT 1`,
            restaurantId
        );

        return {
            activeQueueCount: Number(activeQueueResult[0].count),
            seatedCount: Number(seatedResult[0].count),
            avgWaitTimeMinutes: p90Result[0]?.p90_wait !== null && p90Result[0]?.p90_wait !== undefined
                ? Math.round(Number(p90Result[0].p90_wait))
                : null,
        };
    }
}
