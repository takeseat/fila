"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
class DashboardController {
    constructor() {
        this.service = new dashboard_service_1.DashboardService();
    }
    /**
     * GET /dashboard/metrics
     * Get all dashboard metrics for the authenticated restaurant
     */
    async getMetrics(req, res) {
        try {
            // Get restaurant ID from authenticated user
            const restaurantId = req.user.restaurantId;
            if (!restaurantId) {
                return res.status(400).json({
                    error: 'Restaurant ID not found in user context',
                });
            }
            // Fetch all metrics
            const metrics = await this.service.getMetrics(restaurantId);
            return res.json(metrics);
        }
        catch (error) {
            console.error('Dashboard metrics error:', error);
            return res.status(500).json({
                error: 'Failed to fetch dashboard metrics',
                message: error.message,
            });
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map