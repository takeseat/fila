import { QueueEntryRow } from '../repositories/queue-entries.repository';
export declare class QueueEntriesExportService {
    /**
     * Generate CSV export
     */
    generateCSV(data: QueueEntryRow[], language?: string): string;
    /**
     * Generate PDF export
     */
    generatePDF(data: QueueEntryRow[], restaurantName: string, dateRange: {
        from: Date;
        to: Date;
    }, language?: string): Promise<Buffer>;
    /**
     * Draw table in PDF
     */
    private drawTable;
    /**
     * Get CSV fields with translations
     */
    private getCSVFields;
    /**
     * Get translated label
     */
    private getLabel;
    /**
     * Get report title
     */
    private getReportTitle;
    /**
     * Translate status
     */
    private translateStatus;
    /**
     * Format date (YYYY-MM-DD)
     */
    private formatDate;
    /**
     * Format datetime (YYYY-MM-DD HH:mm)
     */
    private formatDateTime;
    /**
     * Format time only (HH:mm)
     */
    private formatTime;
}
//# sourceMappingURL=queue-entries-export.service.d.ts.map