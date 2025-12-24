import { DashboardRepository, HourlyVolume, DailyVolume } from '../repositories/dashboard.repository';

export interface DashboardMetrics {
    activeQueue: {
        count: number;
        vsYesterday: number; // percentage change
    };
    seatedToday: {
        count: number;
        vsYesterday: number; // percentage change
    };
    avgWaitTime: {
        minutes: number | null;
        vsYesterday: number | null; // difference in minutes
    };
    cancelledToday: {
        count: number;
    };
    hourlyVolume: HourlyVolume[];
    weeklyTrend: DailyVolume[];
}

export class DashboardService {
    private repository: DashboardRepository;

    constructor() {
        this.repository = new DashboardRepository();
    }

    async getMetrics(restaurantId: string): Promise<DashboardMetrics> {
        // Fetch all metrics in parallel
        const [
            activeQueueCount,
            seatedTodayCount,
            avgWaitTimeToday,
            cancelledTodayCount,
            hourlyVolume,
            weeklyTrend,
            yesterdayMetrics,
        ] = await Promise.all([
            this.repository.getActiveQueueCount(restaurantId),
            this.repository.getSeatedTodayCount(restaurantId),
            this.repository.getAverageWaitTimeToday(restaurantId),
            this.repository.getCancelledTodayCount(restaurantId),
            this.repository.getHourlyVolumeToday(restaurantId),
            this.repository.getDailyVolumeLast7Days(restaurantId),
            this.repository.getYesterdayMetrics(restaurantId),
        ]);

        // Calculate comparisons
        const activeQueueVsYesterday = this.calculatePercentageChange(
            activeQueueCount,
            yesterdayMetrics.activeQueueCount
        );

        const seatedVsYesterday = this.calculatePercentageChange(
            seatedTodayCount,
            yesterdayMetrics.seatedCount
        );

        const avgWaitVsYesterday = avgWaitTimeToday !== null && yesterdayMetrics.avgWaitTimeMinutes !== null
            ? avgWaitTimeToday - yesterdayMetrics.avgWaitTimeMinutes
            : null;

        return {
            activeQueue: {
                count: activeQueueCount,
                vsYesterday: activeQueueVsYesterday,
            },
            seatedToday: {
                count: seatedTodayCount,
                vsYesterday: seatedVsYesterday,
            },
            avgWaitTime: {
                minutes: avgWaitTimeToday,
                vsYesterday: avgWaitVsYesterday,
            },
            cancelledToday: {
                count: cancelledTodayCount,
            },
            hourlyVolume,
            weeklyTrend,
        };
    }

    /**
     * Calculate percentage change between current and previous value
     */
    private calculatePercentageChange(current: number, previous: number): number {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return Math.round(((current - previous) / previous) * 100);
    }
}
