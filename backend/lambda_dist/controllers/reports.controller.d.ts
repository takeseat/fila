import { Request, Response } from 'express';
export declare class ReportsController {
    private performanceAnalytics;
    private executiveAnalytics;
    private flowAnalytics;
    constructor();
    /**
     * GET /reports/waitlist-performance
     * Performance report with KPIs and time series
     */
    getPerformanceReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /reports/executive-summary
     * Executive summary with key metrics
     */
    getExecutiveSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /reports/waitlist-flow
     * Flow analysis with bottleneck metrics
     */
    getFlowReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=reports.controller.d.ts.map