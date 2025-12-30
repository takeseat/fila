"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueEntriesController = void 0;
const queue_entries_repository_1 = require("../repositories/queue-entries.repository");
const queue_entries_export_service_1 = require("../services/queue-entries-export.service");
const queue_entries_validator_1 = require("../validators/queue-entries.validator");
const time_bucket_utils_1 = require("../utils/time-bucket.utils");
const database_1 = __importDefault(require("../config/database"));
class QueueEntriesController {
    constructor() {
        this.repository = new queue_entries_repository_1.QueueEntriesRepository();
        this.exportService = new queue_entries_export_service_1.QueueEntriesExportService();
    }
    /**
     * GET /reports/queue-entries
     * Get paginated queue entries with filters
     */
    async getQueueEntries(req, res) {
        try {
            // Validate filters
            const filters = queue_entries_validator_1.queueEntriesFiltersSchema.parse(req.query);
            const pagination = queue_entries_validator_1.paginationSchema.parse(req.query);
            // Get restaurant ID from authenticated user
            const restaurantId = req.user.restaurantId;
            // Parse dates
            const { from, to } = (0, queue_entries_validator_1.validateQueueEntriesDateRange)(filters.from, filters.to);
            // Build repository filters
            const repoFilters = {
                restaurantId,
                from,
                to,
            };
            // Parse optional filters
            if (filters.statuses) {
                repoFilters.statuses = (0, queue_entries_validator_1.parseStatuses)(filters.statuses);
            }
            if (filters.clientSearch) {
                repoFilters.clientSearch = filters.clientSearch;
            }
            if (filters.partySizeMin !== undefined) {
                repoFilters.partySizeMin = filters.partySizeMin;
            }
            if (filters.partySizeMax !== undefined) {
                repoFilters.partySizeMax = filters.partySizeMax;
            }
            if (filters.daysOfWeek) {
                repoFilters.daysOfWeek = (0, time_bucket_utils_1.parseDaysOfWeek)(filters.daysOfWeek);
            }
            if (filters.timeRange) {
                repoFilters.timeRangeHours = (0, time_bucket_utils_1.parseTimeRanges)(filters.timeRange);
            }
            // Build pagination
            const repoPagination = {
                page: pagination.page,
                pageSize: pagination.pageSize,
                sortBy: pagination.sortBy,
                sortOrder: pagination.sortOrder,
            };
            // Fetch data
            const result = await this.repository.getQueueEntries(repoFilters, repoPagination);
            return res.json(result);
        }
        catch (error) {
            console.error('Queue entries report error:', error);
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors,
                });
            }
            return res.status(500).json({
                error: 'Failed to generate queue entries report',
                message: error.message,
            });
        }
    }
    /**
     * GET /reports/queue-entries/export/csv
     * Export queue entries as CSV
     */
    async exportCSV(req, res) {
        try {
            // Validate filters
            const filters = queue_entries_validator_1.queueEntriesFiltersSchema.parse(req.query);
            // Get restaurant ID and language from authenticated user
            const restaurantId = req.user.restaurantId;
            const language = req.user.language || 'pt';
            // Parse dates
            const { from, to } = (0, queue_entries_validator_1.validateQueueEntriesDateRange)(filters.from, filters.to);
            // Build repository filters
            const repoFilters = {
                restaurantId,
                from,
                to,
            };
            // Parse optional filters (same as getQueueEntries)
            if (filters.statuses) {
                repoFilters.statuses = (0, queue_entries_validator_1.parseStatuses)(filters.statuses);
            }
            if (filters.clientSearch) {
                repoFilters.clientSearch = filters.clientSearch;
            }
            if (filters.partySizeMin !== undefined) {
                repoFilters.partySizeMin = filters.partySizeMin;
            }
            if (filters.partySizeMax !== undefined) {
                repoFilters.partySizeMax = filters.partySizeMax;
            }
            if (filters.daysOfWeek) {
                repoFilters.daysOfWeek = (0, time_bucket_utils_1.parseDaysOfWeek)(filters.daysOfWeek);
            }
            if (filters.timeRange) {
                repoFilters.timeRangeHours = (0, time_bucket_utils_1.parseTimeRanges)(filters.timeRange);
            }
            // Fetch all data (no pagination)
            const data = await this.repository.getAllQueueEntries(repoFilters);
            // Generate CSV
            const csv = this.exportService.generateCSV(data, language);
            // Set headers for file download
            const filename = `queue-entries-${from.toISOString().split('T')[0]}-${to.toISOString().split('T')[0]}.csv`;
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.send(csv);
        }
        catch (error) {
            console.error('CSV export error:', error);
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors,
                });
            }
            return res.status(500).json({
                error: 'Failed to export CSV',
                message: error.message,
            });
        }
    }
    /**
     * GET /reports/queue-entries/export/pdf
     * Export queue entries as PDF
     */
    async exportPDF(req, res) {
        try {
            // Validate filters
            const filters = queue_entries_validator_1.queueEntriesFiltersSchema.parse(req.query);
            // Get restaurant info and language from authenticated user
            const restaurantId = req.user.restaurantId;
            const language = req.user.language || 'pt';
            // Get restaurant name
            const restaurant = await database_1.default.restaurant.findUnique({
                where: { id: restaurantId },
                select: { name: true },
            });
            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }
            // Parse dates
            const { from, to } = (0, queue_entries_validator_1.validateQueueEntriesDateRange)(filters.from, filters.to);
            // Build repository filters
            const repoFilters = {
                restaurantId,
                from,
                to,
            };
            // Parse optional filters (same as getQueueEntries)
            if (filters.statuses) {
                repoFilters.statuses = (0, queue_entries_validator_1.parseStatuses)(filters.statuses);
            }
            if (filters.clientSearch) {
                repoFilters.clientSearch = filters.clientSearch;
            }
            if (filters.partySizeMin !== undefined) {
                repoFilters.partySizeMin = filters.partySizeMin;
            }
            if (filters.partySizeMax !== undefined) {
                repoFilters.partySizeMax = filters.partySizeMax;
            }
            if (filters.daysOfWeek) {
                repoFilters.daysOfWeek = (0, time_bucket_utils_1.parseDaysOfWeek)(filters.daysOfWeek);
            }
            if (filters.timeRange) {
                repoFilters.timeRangeHours = (0, time_bucket_utils_1.parseTimeRanges)(filters.timeRange);
            }
            // Fetch all data (no pagination)
            const data = await this.repository.getAllQueueEntries(repoFilters);
            // Generate PDF
            const pdfBuffer = await this.exportService.generatePDF(data, restaurant.name, { from, to }, language);
            // Set headers for file download
            const filename = `queue-entries-${from.toISOString().split('T')[0]}-${to.toISOString().split('T')[0]}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.send(pdfBuffer);
        }
        catch (error) {
            console.error('PDF export error:', error);
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors,
                });
            }
            return res.status(500).json({
                error: 'Failed to export PDF',
                message: error.message,
            });
        }
    }
}
exports.QueueEntriesController = QueueEntriesController;
//# sourceMappingURL=queue-entries.controller.js.map