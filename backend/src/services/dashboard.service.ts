import { DashboardRepository, HourlyVolume, DailyVolume } from '../repositories/dashboard.repository';
import { WaitlistService } from './waitlist.service';

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
        vsYesterday: number | null; // difference in minutes compared to yesterday
        windowMinutes?: number; // configuration window
        isFallbackUsed?: boolean; // whether fallback was used
    };
    cancelledToday: {
        count: number;
    };
    hourlyVolume: HourlyVolume[];
    weeklyTrend: DailyVolume[];
}

export class DashboardService {
    private repository: DashboardRepository;
    private waitlistService: WaitlistService;

    constructor() {
        this.repository = new DashboardRepository();
        this.waitlistService = new WaitlistService();
    }

    async getMetrics(restaurantId: string): Promise<DashboardMetrics> {
        // Fetch all metrics in parallel
        const [
            queueMetrics,
            cancelledTodayCount,
            hourlyVolume,
            weeklyTrend,
            yesterdayMetrics,
        ] = await Promise.all([
            this.waitlistService.getQueueMetrics(restaurantId), // Use waitlist metrics
            this.repository.getCancelledTodayCount(restaurantId),
            this.repository.getHourlyVolumeToday(restaurantId),
            this.repository.getDailyVolumeLast7Days(restaurantId),
            this.repository.getYesterdayMetrics(restaurantId),
        ]);

        // Calculate comparisons
        const activeQueueVsYesterday = this.calculatePercentageChange(
            queueMetrics.activeCount,
            yesterdayMetrics.activeQueueCount
        );

        const seatedVsYesterday = this.calculatePercentageChange(
            queueMetrics.servedToday,
            yesterdayMetrics.seatedCount
        );

        // Convert average wait from seconds to minutes
        const avgWaitMinutes = queueMetrics.averageWaitSeconds > 0
            ? Math.round(queueMetrics.averageWaitSeconds / 60)
            : null;

        const avgWaitVsYesterday = avgWaitMinutes !== null && yesterdayMetrics.avgWaitTimeMinutes !== null
            ? avgWaitMinutes - yesterdayMetrics.avgWaitTimeMinutes
            : null;

        return {
            activeQueue: {
                count: queueMetrics.activeCount,
                vsYesterday: activeQueueVsYesterday,
            },
            seatedToday: {
                count: queueMetrics.servedToday,
                vsYesterday: seatedVsYesterday,
            },
            avgWaitTime: {
                minutes: avgWaitMinutes,
                vsYesterday: avgWaitVsYesterday,
                windowMinutes: queueMetrics.windowMinutes,
                isFallbackUsed: queueMetrics.isFallbackUsed,
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
