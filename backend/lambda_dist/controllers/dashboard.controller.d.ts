import { Request, Response } from 'express';
export declare class DashboardController {
    private service;
    constructor();
    /**
     * GET /dashboard/metrics
     * Get all dashboard metrics for the authenticated restaurant
     */
    getMetrics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map