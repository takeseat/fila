import { Request, Response } from 'express';
import { PerformanceAnalytics } from '../services/analytics/performance.analytics';
import { ExecutiveAnalytics } from '../services/analytics/executive.analytics';
import { FlowAnalytics } from '../services/analytics/flow.analytics';
import {
    performanceReportFiltersSchema,
    executiveSummaryFiltersSchema,
    flowReportFiltersSchema,
    validateDateRange,
} from '../validators/reports.validator';

export class ReportsController {
    private performanceAnalytics: PerformanceAnalytics;
    private executiveAnalytics: ExecutiveAnalytics;
    private flowAnalytics: FlowAnalytics;

    constructor() {
        this.performanceAnalytics = new PerformanceAnalytics();
        this.executiveAnalytics = new ExecutiveAnalytics();
        this.flowAnalytics = new FlowAnalytics();
    }

    /**
     * GET /reports/waitlist-performance
     * Performance report with KPIs and time series
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

    /**
     * GET /reports/executive-summary
     * Executive summary with key metrics
     */
    async getExecutiveSummary(req: Request, res: Response) {
        try {
            // Validate query params
            const filters = executiveSummaryFiltersSchema.parse(req.query);

            // Validate and parse dates
            const { from, to } = validateDateRange(filters.from, filters.to);

            // Get restaurant ID from authenticated user
            const restaurantId = (req as any).user.restaurantId;

            // Generate report
            const report = await this.executiveAnalytics.generateReport({
                restaurantId,
                from,
                to,
                timeRange: filters.timeRange,
                daysOfWeek: filters.daysOfWeek,
                partySizeBucket: filters.partySizeBucket,
                maxWaitMinutes: filters.maxWaitMinutes,
            });

            return res.json(report);
        } catch (error: any) {
            console.error('Executive summary error:', error);

            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors,
                });
            }

            return res.status(500).json({
                error: 'Failed to generate executive summary',
                message: error.message,
            });
        }
    }

    /**
     * GET /reports/waitlist-flow
     * Flow analysis with bottleneck metrics
     */
    async getFlowReport(req: Request, res: Response) {
        try {
            // Validate query params
            const filters = flowReportFiltersSchema.parse(req.query);

            // Validate and parse dates
            const { from, to } = validateDateRange(filters.from, filters.to);

            // Get restaurant ID from authenticated user
            const restaurantId = (req as any).user.restaurantId;

            // Generate report
            const report = await this.flowAnalytics.generateReport({
                restaurantId,
                from,
                to,
                timeRange: filters.timeRange,
                daysOfWeek: filters.daysOfWeek,
                partySizeBucket: filters.partySizeBucket,
                maxWaitMinutes: filters.maxWaitMinutes,
            });

            return res.json(report);
        } catch (error: any) {
            console.error('Flow report error:', error);

            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors,
                });
            }

            return res.status(500).json({
                error: 'Failed to generate flow report',
                message: error.message,
            });
        }
    }
}
