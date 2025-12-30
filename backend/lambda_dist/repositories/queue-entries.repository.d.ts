export interface QueueEntriesFilters {
    restaurantId: string;
    from: Date;
    to: Date;
    statuses?: string[];
    clientSearch?: string;
    partySizeMin?: number;
    partySizeMax?: number;
    daysOfWeek?: number[];
    timeRangeHours?: Array<{
        start: number;
        end: number;
    }>;
}
export interface QueueEntriesPagination {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface QueueEntryRow {
    id: string;
    queueDate: Date;
    customerName: string;
    customerPhone: string;
    partySize: number;
    createdAt: Date;
    calledAt: Date | null;
    seatedAt: Date | null;
    cancelledAt: Date | null;
    noShowAt: Date | null;
    status: string;
    timeToCall: number | null;
    timeToSeat: number | null;
    timeCallToSeat: number | null;
}
export interface QueueEntriesResult {
    data: QueueEntryRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export declare class QueueEntriesRepository {
    /**
     * Build WHERE clause for queue entries queries
     */
    private buildWhereClause;
    /**
     * Get queue entries with filters and pagination
     */
    getQueueEntries(filters: QueueEntriesFilters, pagination: QueueEntriesPagination): Promise<QueueEntriesResult>;
    /**
     * Get all queue entries for export (no pagination)
     */
    getAllQueueEntries(filters: QueueEntriesFilters): Promise<QueueEntryRow[]>;
    /**
     * Map sortBy parameter to actual column name
     */
    private getSortColumn;
}
//# sourceMappingURL=queue-entries.repository.d.ts.map