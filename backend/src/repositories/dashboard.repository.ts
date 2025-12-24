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
     * Get average wait time for customers seated today (in minutes)
     */
    async getAverageWaitTimeToday(restaurantId: string): Promise<number | null> {
        const result = await prisma.$queryRawUnsafe<Array<{ avg_wait: number | null }>>(
            `SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, seated_at)) as avg_wait
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND status = 'SEATED'
               AND DATE(seated_at) = CURDATE()
               AND seated_at IS NOT NULL
               AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) > 0
               AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= 240`,
            restaurantId
        );

        const avgWait = result[0].avg_wait;
        return avgWait !== null ? Math.round(avgWait) : null;
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
     * Get daily volume for last 7 days
     */
    async getDailyVolumeLast7Days(restaurantId: string): Promise<DailyVolume[]> {
        const result = await prisma.$queryRawUnsafe<Array<{ date: Date; count: bigint }>>(
            `SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY DATE(created_at)
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

        // Average wait time yesterday
        const avgWaitResult = await prisma.$queryRawUnsafe<Array<{ avg_wait: number | null }>>(
            `SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, seated_at)) as avg_wait
             FROM waitlist_entries
             WHERE restaurant_id = ?
               AND status = 'SEATED'
               AND DATE(seated_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
               AND seated_at IS NOT NULL
               AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) > 0
               AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= 240`,
            restaurantId
        );

        return {
            activeQueueCount: Number(activeQueueResult[0].count),
            seatedCount: Number(seatedResult[0].count),
            avgWaitTimeMinutes: avgWaitResult[0].avg_wait !== null
                ? Math.round(avgWaitResult[0].avg_wait)
                : null,
        };
    }
}
