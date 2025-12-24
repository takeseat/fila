import prisma from '../config/database';

export interface QueueEntriesFilters {
    restaurantId: string;
    from: Date;
    to: Date;
    statuses?: string[];
    clientSearch?: string;
    partySizeMin?: number;
    partySizeMax?: number;
    daysOfWeek?: number[];
    timeRangeHours?: Array<{ start: number; end: number }>;
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
    timeToCall: number | null; // minutes
    timeToSeat: number | null; // minutes
    timeCallToSeat: number | null; // minutes
}

export interface QueueEntriesResult {
    data: QueueEntryRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export class QueueEntriesRepository {
    /**
     * Build WHERE clause for queue entries queries
     */
    private buildWhereClause(filters: QueueEntriesFilters): string {
        const conditions: string[] = [
            `we.restaurant_id = '${filters.restaurantId}'`,
            `we.created_at >= '${filters.from.toISOString()}'`,
            `we.created_at <= '${filters.to.toISOString()}'`,
        ];

        // Status filter
        if (filters.statuses && filters.statuses.length > 0) {
            const statusList = filters.statuses.map(s => `'${s}'`).join(',');
            conditions.push(`we.status IN (${statusList})`);
        }

        // Client search (name or phone)
        if (filters.clientSearch) {
            const search = filters.clientSearch.replace(/'/g, "''"); // Escape quotes
            conditions.push(`(we.customer_name LIKE '%${search}%' OR we.customer_phone LIKE '%${search}%')`);
        }

        // Party size filter
        if (filters.partySizeMin !== undefined) {
            conditions.push(`we.party_size >= ${filters.partySizeMin}`);
        }
        if (filters.partySizeMax !== undefined) {
            conditions.push(`we.party_size <= ${filters.partySizeMax}`);
        }

        // Days of week filter
        if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
            conditions.push(`DAYOFWEEK(we.created_at) - 1 IN (${filters.daysOfWeek.join(',')})`);
        }

        // Time range filter
        if (filters.timeRangeHours && filters.timeRangeHours.length > 0) {
            const timeConditions = filters.timeRangeHours.map(range => {
                if (range.start <= range.end) {
                    return `HOUR(we.created_at) BETWEEN ${range.start} AND ${range.end}`;
                } else {
                    // Overnight range
                    return `(HOUR(we.created_at) >= ${range.start} OR HOUR(we.created_at) <= ${range.end})`;
                }
            });
            conditions.push(`(${timeConditions.join(' OR ')})`);
        }

        return conditions.join(' AND ');
    }

    /**
     * Get queue entries with filters and pagination
     */
    async getQueueEntries(
        filters: QueueEntriesFilters,
        pagination: QueueEntriesPagination
    ): Promise<QueueEntriesResult> {
        const whereClause = this.buildWhereClause(filters);
        const offset = (pagination.page - 1) * pagination.pageSize;

        // Determine sort column and order
        const sortColumn = this.getSortColumn(pagination.sortBy || 'createdAt');
        const sortOrder = pagination.sortOrder || 'desc';

        // Query for data
        const dataQuery = `
            SELECT 
                we.id,
                DATE(we.created_at) as queue_date,
                we.customer_name,
                we.customer_phone,
                we.party_size,
                we.created_at,
                we.called_at,
                we.seated_at,
                we.cancelled_at,
                we.no_show_at,
                we.status,
                CASE 
                    WHEN we.called_at IS NOT NULL 
                    THEN TIMESTAMPDIFF(MINUTE, we.created_at, we.called_at)
                    ELSE NULL 
                END as time_to_call,
                CASE 
                    WHEN we.seated_at IS NOT NULL 
                    THEN TIMESTAMPDIFF(MINUTE, we.created_at, we.seated_at)
                    ELSE NULL 
                END as time_to_seat,
                CASE 
                    WHEN we.called_at IS NOT NULL AND we.seated_at IS NOT NULL
                    THEN TIMESTAMPDIFF(MINUTE, we.called_at, we.seated_at)
                    ELSE NULL 
                END as time_call_to_seat
            FROM waitlist_entries we
            WHERE ${whereClause}
            ORDER BY ${sortColumn} ${sortOrder}
            LIMIT ${pagination.pageSize} OFFSET ${offset}
        `;

        // Query for total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM waitlist_entries we
            WHERE ${whereClause}
        `;

        const [dataResult, countResult] = await Promise.all([
            prisma.$queryRawUnsafe<Array<any>>(dataQuery),
            prisma.$queryRawUnsafe<Array<{ total: bigint }>>(countQuery),
        ]);

        const total = Number(countResult[0].total);
        const totalPages = Math.ceil(total / pagination.pageSize);

        // Map results to QueueEntryRow
        const data: QueueEntryRow[] = dataResult.map(row => ({
            id: row.id,
            queueDate: row.queue_date,
            customerName: row.customer_name,
            customerPhone: row.customer_phone,
            partySize: Number(row.party_size),
            createdAt: row.created_at,
            calledAt: row.called_at,
            seatedAt: row.seated_at,
            cancelledAt: row.cancelled_at,
            noShowAt: row.no_show_at,
            status: row.status,
            timeToCall: row.time_to_call !== null ? Number(row.time_to_call) : null,
            timeToSeat: row.time_to_seat !== null ? Number(row.time_to_seat) : null,
            timeCallToSeat: row.time_call_to_seat !== null ? Number(row.time_call_to_seat) : null,
        }));

        return {
            data,
            total,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalPages,
        };
    }

    /**
     * Get all queue entries for export (no pagination)
     */
    async getAllQueueEntries(filters: QueueEntriesFilters): Promise<QueueEntryRow[]> {
        const whereClause = this.buildWhereClause(filters);

        const query = `
            SELECT 
                we.id,
                DATE(we.created_at) as queue_date,
                we.customer_name,
                we.customer_phone,
                we.party_size,
                we.created_at,
                we.called_at,
                we.seated_at,
                we.cancelled_at,
                we.no_show_at,
                we.status,
                CASE 
                    WHEN we.called_at IS NOT NULL 
                    THEN TIMESTAMPDIFF(MINUTE, we.created_at, we.called_at)
                    ELSE NULL 
                END as time_to_call,
                CASE 
                    WHEN we.seated_at IS NOT NULL 
                    THEN TIMESTAMPDIFF(MINUTE, we.created_at, we.seated_at)
                    ELSE NULL 
                END as time_to_seat,
                CASE 
                    WHEN we.called_at IS NOT NULL AND we.seated_at IS NOT NULL
                    THEN TIMESTAMPDIFF(MINUTE, we.called_at, we.seated_at)
                    ELSE NULL 
                END as time_call_to_seat
            FROM waitlist_entries we
            WHERE ${whereClause}
            ORDER BY we.created_at DESC
        `;

        const result = await prisma.$queryRawUnsafe<Array<any>>(query);

        return result.map(row => ({
            id: row.id,
            queueDate: row.queue_date,
            customerName: row.customer_name,
            customerPhone: row.customer_phone,
            partySize: Number(row.party_size),
            createdAt: row.created_at,
            calledAt: row.called_at,
            seatedAt: row.seated_at,
            cancelledAt: row.cancelled_at,
            noShowAt: row.no_show_at,
            status: row.status,
            timeToCall: row.time_to_call !== null ? Number(row.time_to_call) : null,
            timeToSeat: row.time_to_seat !== null ? Number(row.time_to_seat) : null,
            timeCallToSeat: row.time_call_to_seat !== null ? Number(row.time_call_to_seat) : null,
        }));
    }

    /**
     * Map sortBy parameter to actual column name
     */
    private getSortColumn(sortBy: string): string {
        const columnMap: Record<string, string> = {
            createdAt: 'we.created_at',
            customerName: 'we.customer_name',
            partySize: 'we.party_size',
            status: 'we.status',
            timeToCall: 'time_to_call',
            timeToSeat: 'time_to_seat',
            timeCallToSeat: 'time_call_to_seat',
        };

        return columnMap[sortBy] || 'we.created_at';
    }
}
