import { Request, Response } from 'express';
export declare class QueueEntriesController {
    private repository;
    private exportService;
    constructor();
    /**
     * GET /reports/queue-entries
     * Get paginated queue entries with filters
     */
    getQueueEntries(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /reports/queue-entries/export/csv
     * Export queue entries as CSV
     */
    exportCSV(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /reports/queue-entries/export/pdf
     * Export queue entries as PDF
     */
    exportPDF(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=queue-entries.controller.d.ts.map