import { z } from 'zod';


/**
 * Queue entries report filters schema
 */
export const queueEntriesFiltersSchema = z.object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    statuses: z.string().optional(),
    clientSearch: z.string().optional(),
    partySizeMin: z.coerce.number().int().min(1).optional(),
    partySizeMax: z.coerce.number().int().min(1).optional(),
    daysOfWeek: z.string().optional(),
    timeRange: z.string().optional(),
});

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(25),
    sortBy: z.enum(['createdAt', 'customerName', 'partySize', 'status', 'timeToCall', 'timeToSeat', 'timeCallToSeat']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Parse statuses string into array
 */
export function parseStatuses(statuses?: string): string[] | undefined {
    if (!statuses) {
        return undefined;
    }

    const validStatuses = ['WAITING', 'CALLED', 'SEATED', 'CANCELLED', 'NO_SHOW'];
    const parsed = statuses.split(',').map(s => s.trim().toUpperCase());

    const filtered = parsed.filter(s => validStatuses.includes(s));
    return filtered.length > 0 ? filtered : undefined;
}

/**
 * Validate and parse date range for queue entries
 */
export function validateQueueEntriesDateRange(from: string, to: string): { from: Date; to: Date } {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime())) {
        throw new Error('Invalid from date');
    }

    if (isNaN(toDate.getTime())) {
        throw new Error('Invalid to date');
    }

    if (fromDate > toDate) {
        throw new Error('from date must be before to date');
    }

    // Set from date to start of day
    fromDate.setHours(0, 0, 0, 0);

    // Set to date to end of day (D+1 at 02:59:59.999 UTC for GMT-3)
    toDate.setDate(toDate.getDate() + 1);
    toDate.setUTCHours(2, 59, 59, 999);

    return { from: fromDate, to: toDate };
}

export type QueueEntriesFilters = z.infer<typeof queueEntriesFiltersSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
