"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const performance_analytics_1 = require("../services/analytics/performance.analytics");
const executive_analytics_1 = require("../services/analytics/executive.analytics");
const flow_analytics_1 = require("../services/analytics/flow.analytics");
const reports_validator_1 = require("../validators/reports.validator");
class ReportsController {
    constructor() {
        this.performanceAnalytics = new performance_analytics_1.PerformanceAnalytics();
        this.executiveAnalytics = new executive_analytics_1.ExecutiveAnalytics();
        this.flowAnalytics = new flow_analytics_1.FlowAnalytics();
    }
    /**
     * GET /reports/waitlist-performance
     * Performance report with KPIs and time series
     */
    async getPerformanceReport(req, res) {
        try {
            // Validate query params
            const filters = reports_validator_1.performanceReportFiltersSchema.parse(req.query);
            // Validate and parse dates
            const { from, to } = (0, reports_validator_1.validateDateRange)(filters.from, filters.to);
            // Get restaurant ID from authenticated user
            const restaurantId = req.user.restaurantId;
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
        }
        catch (error) {
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
    async getExecutiveSummary(req, res) {
        try {
            // Validate query params
            const filters = reports_validator_1.executiveSummaryFiltersSchema.parse(req.query);
            // Validate and parse dates
            const { from, to } = (0, reports_validator_1.validateDateRange)(filters.from, filters.to);
            // Get restaurant ID from authenticated user
            const restaurantId = req.user.restaurantId;
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
        }
        catch (error) {
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
    async getFlowReport(req, res) {
        try {
            // Validate query params
            const filters = reports_validator_1.flowReportFiltersSchema.parse(req.query);
            // Validate and parse dates
            const { from, to } = (0, reports_validator_1.validateDateRange)(filters.from, filters.to);
            // Get restaurant ID from authenticated user
            const restaurantId = req.user.restaurantId;
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
        }
        catch (error) {
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
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map