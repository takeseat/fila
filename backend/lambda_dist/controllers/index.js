"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const reports_service_1 = require("../services/reports.service");
// Reports Controller
const reportsService = new reports_service_1.ReportsService();
class ReportsController {
    async getWaitlistSummary(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { from, to } = req.query;
            const summary = await reportsService.getWaitlistSummary(restaurantId, from ? new Date(from) : undefined, to ? new Date(to) : undefined);
            res.json(summary);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.ReportsController = ReportsController;
//# sourceMappingURL=index.js.map