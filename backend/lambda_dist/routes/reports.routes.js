"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_controller_1 = require("../controllers/reports.controller");
const queue_entries_controller_1 = require("../controllers/queue-entries.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const reportsController = new reports_controller_1.ReportsController();
const queueEntriesController = new queue_entries_controller_1.QueueEntriesController();
// All reports routes require authentication
router.use(auth_1.authenticate);
/**
 * GET /reports/waitlist-performance
 * Query params: from, to, timeRange?, daysOfWeek?, partySizeBucket?, statuses?, maxWaitMinutes?
 */
router.get('/waitlist-performance', (req, res) => reportsController.getPerformanceReport(req, res));
/**
 * GET /reports/executive-summary
 * Query params: from, to, timeRange?, daysOfWeek?, partySizeBucket?, maxWaitMinutes?
 */
router.get('/executive-summary', (req, res) => reportsController.getExecutiveSummary(req, res));
/**
 * GET /reports/waitlist-flow
 * Query params: from, to, timeRange?, daysOfWeek?, partySizeBucket?, maxWaitMinutes?
 */
router.get('/waitlist-flow', (req, res) => reportsController.getFlowReport(req, res));
/**
 * GET /reports/queue-entries
 * Analytical queue report with pagination
 * Query params: from, to, page?, pageSize?, sortBy?, sortOrder?, statuses?, clientSearch?, partySizeMin?, partySizeMax?, daysOfWeek?, timeRange?
 */
router.get('/queue-entries', (req, res) => queueEntriesController.getQueueEntries(req, res));
/**
 * GET /reports/queue-entries/export/csv
 * Export queue entries as CSV
 * Query params: same as /queue-entries
 */
router.get('/queue-entries/export/csv', (req, res) => queueEntriesController.exportCSV(req, res));
/**
 * GET /reports/queue-entries/export/pdf
 * Export queue entries as PDF
 * Query params: same as /queue-entries
 */
router.get('/queue-entries/export/pdf', (req, res) => queueEntriesController.exportPDF(req, res));
exports.default = router;
//# sourceMappingURL=reports.routes.js.map