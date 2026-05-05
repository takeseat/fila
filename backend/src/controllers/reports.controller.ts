import { Request, Response } from 'express';
import { PerformanceAnalytics } from '../services/analytics/performance.analytics';
import {
    performanceReportFiltersSchema,
    validateDateRange,
} from '../validators/reports.validator';

export class ReportsController {
    private performanceAnalytics: PerformanceAnalytics;

    constructor() {
        this.performanceAnalytics = new PerformanceAnalytics();
    }

    /**
     * GET /reports/waitlist-performance
     * Performance report with KPIs and time series (MVP report)
     */
    async getPerformanceReport(req: Request, res: Response) {
        try {
            // Validate query params
            const filters = performanceReportFiltersSchema.parse(req.query);

            // Validate and parse dates
            const { from, to } = validateDateRange(filters.from, filters.to);

            // Get restaurant ID from authenticated user
            const restaurantId = (req as any).user.restaurantId;

            // Generate report
            const report = await this.performanceAnalytics.generateReport({
                restaurantId,
                from,
                to,
                timeRange: filters.timeRange,
                daysOfWeek: filters.daysOfWeek,
                partySizeBucket: filters.partySizeBucket,
                statuses: filters.statuses,
                maxWaitMinutes: filters.maxWaitMinutes,
            });

            return res.json(report);
        } catch (error: any) {
            console.error('Performance report error:', error);

            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors,
                });
            }

            return res.status(500).json({
                error: 'Failed to generate performance report',
                message: error.message,
            });
        }
    }
}
