"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersManagementRouter = exports.dashboardRouter = exports.reportsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const reports_controller_1 = require("../controllers/reports.controller");
const queue_entries_controller_1 = require("../controllers/queue-entries.controller");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const users_management_routes_1 = __importDefault(require("./users-management.routes"));
// Reports Routes
exports.reportsRouter = (0, express_1.Router)();
const reportsController = new reports_controller_1.ReportsController();
const queueEntriesController = new queue_entries_controller_1.QueueEntriesController();
// Dashboard Routes
exports.dashboardRouter = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
// Users Management Routes
exports.usersManagementRouter = users_management_routes_1.default;
// All routes require authentication
exports.reportsRouter.use(auth_1.authenticate);
exports.dashboardRouter.use(auth_1.authenticate);
/**
 * GET /dashboard/metrics
 * Get all dashboard metrics
 */
exports.dashboardRouter.get('/metrics', (req, res) => dashboardController.getMetrics(req, res));
/**
 * GET /reports/waitlist-performance
 * Performance report with KPIs and time series
 */
exports.reportsRouter.get('/waitlist-performance', (req, res) => reportsController.getPerformanceReport(req, res));
/**
 * GET /reports/executive-summary
 * Executive summary with key metrics
 */
exports.reportsRouter.get('/executive-summary', (req, res) => reportsController.getExecutiveSummary(req, res));
/**
 * GET /reports/waitlist-flow
 * Flow analysis with bottleneck metrics
 */
exports.reportsRouter.get('/waitlist-flow', (req, res) => reportsController.getFlowReport(req, res));
/**
 * GET /reports/queue-entries
 * Analytical queue report with pagination
 */
exports.reportsRouter.get('/queue-entries', (req, res) => queueEntriesController.getQueueEntries(req, res));
/**
 * GET /reports/queue-entries/export/csv
 * Export queue entries as CSV
 */
exports.reportsRouter.get('/queue-entries/export/csv', (req, res) => queueEntriesController.exportCSV(req, res));
/**
 * GET /reports/queue-entries/export/pdf
 * Export queue entries as PDF
 */
exports.reportsRouter.get('/queue-entries/export/pdf', (req, res) => queueEntriesController.exportPDF(req, res));
// Legacy endpoint (keep for backward compatibility if needed)
// reportsRouter.get('/waitlist-summary', (req, res) => ...);
//# sourceMappingURL=index.js.map