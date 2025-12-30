"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const dashboard_repository_1 = require("../repositories/dashboard.repository");
const waitlist_service_1 = require("./waitlist.service");
class DashboardService {
    constructor() {
        this.repository = new dashboard_repository_1.DashboardRepository();
        this.waitlistService = new waitlist_service_1.WaitlistService();
    }
    async getMetrics(restaurantId) {
        // Fetch all metrics in parallel
        const [queueMetrics, cancelledTodayCount, hourlyVolume, weeklyTrend, yesterdayMetrics,] = await Promise.all([
            this.waitlistService.getQueueMetrics(restaurantId), // Use waitlist metrics
            this.repository.getCancelledTodayCount(restaurantId),
            this.repository.getHourlyVolumeToday(restaurantId),
            this.repository.getDailyVolumeLast7Days(restaurantId),
            this.repository.getYesterdayMetrics(restaurantId),
        ]);
        // Calculate comparisons
        const activeQueueVsYesterday = this.calculatePercentageChange(queueMetrics.activeCount, yesterdayMetrics.activeQueueCount);
        const seatedVsYesterday = this.calculatePercentageChange(queueMetrics.servedToday, yesterdayMetrics.seatedCount);
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
    calculatePercentageChange(current, previous) {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return Math.round(((current - previous) / previous) * 100);
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map