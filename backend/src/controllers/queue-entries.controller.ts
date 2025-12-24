import { Request, Response } from 'express';
import { QueueEntriesRepository, QueueEntriesFilters as RepoFilters, QueueEntriesPagination } from '../repositories/queue-entries.repository';
import { QueueEntriesExportService } from '../services/queue-entries-export.service';
import {
    queueEntriesFiltersSchema,
    paginationSchema,
    parseStatuses,
    validateQueueEntriesDateRange,
} from '../validators/queue-entries.validator';
import { parseTimeRanges, parseDaysOfWeek } from '../utils/time-bucket.utils';
import prisma from '../config/database';

export class QueueEntriesController {
    private repository: QueueEntriesRepository;
    private exportService: QueueEntriesExportService;

    constructor() {
        this.repository = new QueueEntriesRepository();
        this.exportService = new QueueEntriesExportService();
    }

    /**
     * GET /reports/queue-entries
     * Get paginated queue entries with filters
     */
    async getQueueEntries(req: Request, res: Response) {
        try {
            // Validate filters
            const filters = queueEntriesFiltersSchema.parse(req.query);
            const pagination = paginationSchema.parse(req.query);

            // Get restaurant ID from authenticated user
            const restaurantId = (req as any).user.restaurantId;

            // Parse dates
            const { from, to } = validateQueueEntriesDateRange(filters.from, filters.to);

            // Build repository filters
            const repoFilters: RepoFilters = {
                restaurantId,
                from,
                to,
            };

            // Parse optional filters
            if (filters.statuses) {
                repoFilters.statuses = parseStatuses(filters.statuses);
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
                repoFilters.daysOfWeek = parseDaysOfWeek(filters.daysOfWeek);
            }

            if (filters.timeRange) {
                repoFilters.timeRangeHours = parseTimeRanges(filters.timeRange);
            }

            // Build pagination
            const repoPagination: QueueEntriesPagination = {
                page: pagination.page,
                pageSize: pagination.pageSize,
                sortBy: pagination.sortBy,
                sortOrder: pagination.sortOrder,
            };

            // Fetch data
            const result = await this.repository.getQueueEntries(repoFilters, repoPagination);

            return res.json(result);
        } catch (error: any) {
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
    async exportCSV(req: Request, res: Response) {
        try {
            // Validate filters
            const filters = queueEntriesFiltersSchema.parse(req.query);

            // Get restaurant ID and language from authenticated user
            const restaurantId = (req as any).user.restaurantId;
            const language = (req as any).user.language || 'pt';

            // Parse dates
            const { from, to } = validateQueueEntriesDateRange(filters.from, filters.to);

            // Build repository filters
            const repoFilters: RepoFilters = {
                restaurantId,
                from,
                to,
            };

            // Parse optional filters (same as getQueueEntries)
            if (filters.statuses) {
                repoFilters.statuses = parseStatuses(filters.statuses);
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
                repoFilters.daysOfWeek = parseDaysOfWeek(filters.daysOfWeek);
            }
            if (filters.timeRange) {
                repoFilters.timeRangeHours = parseTimeRanges(filters.timeRange);
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
        } catch (error: any) {
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
    async exportPDF(req: Request, res: Response) {
        try {
            // Validate filters
            const filters = queueEntriesFiltersSchema.parse(req.query);

            // Get restaurant info and language from authenticated user
            const restaurantId = (req as any).user.restaurantId;
            const language = (req as any).user.language || 'pt';

            // Get restaurant name
            const restaurant = await prisma.restaurant.findUnique({
                where: { id: restaurantId },
                select: { name: true },
            });

            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            // Parse dates
            const { from, to } = validateQueueEntriesDateRange(filters.from, filters.to);

            // Build repository filters
            const repoFilters: RepoFilters = {
                restaurantId,
                from,
                to,
            };

            // Parse optional filters (same as getQueueEntries)
            if (filters.statuses) {
                repoFilters.statuses = parseStatuses(filters.statuses);
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
                repoFilters.daysOfWeek = parseDaysOfWeek(filters.daysOfWeek);
            }
            if (filters.timeRange) {
                repoFilters.timeRangeHours = parseTimeRanges(filters.timeRange);
            }

            // Fetch all data (no pagination)
            const data = await this.repository.getAllQueueEntries(repoFilters);

            // Generate PDF
            const pdfBuffer = await this.exportService.generatePDF(
                data,
                restaurant.name,
                { from, to },
                language
            );

            // Set headers for file download
            const filename = `queue-entries-${from.toISOString().split('T')[0]}-${to.toISOString().split('T')[0]}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

            return res.send(pdfBuffer);
        } catch (error: any) {
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
