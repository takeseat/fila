import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
    private service: DashboardService;

    constructor() {
        this.service = new DashboardService();
    }

    /**
     * GET /dashboard/metrics
     * Get all dashboard metrics for the authenticated restaurant
     */
    async getMetrics(req: Request, res: Response) {
        try {
            // Get restaurant ID from authenticated user
            const restaurantId = (req as any).user.restaurantId;

            if (!restaurantId) {
                return res.status(400).json({
                    error: 'Restaurant ID not found in user context',
                });
            }

            // Fetch all metrics
            const metrics = await this.service.getMetrics(restaurantId);

            return res.json(metrics);
        } catch (error: any) {
            console.error('Dashboard metrics error:', error);

            return res.status(500).json({
                error: 'Failed to fetch dashboard metrics',
                message: error.message,
            });
        }
    }
}
