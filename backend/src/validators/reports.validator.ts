import { z } from 'zod';

/**
 * Base report filters schema
 * Common filters used across all reports
 */
export const baseReportFiltersSchema = z.object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    timeRange: z.string().optional(),
    daysOfWeek: z.string().optional(),
    partySizeBucket: z.enum(['1-2', '3-4', '5+']).optional(),
    statuses: z.string().optional(),
    maxWaitMinutes: z.coerce.number().int().min(1).max(1440).optional().default(240),
});

/**
 * Performance report filters
 */
export const performanceReportFiltersSchema = baseReportFiltersSchema.extend({
    // No additional filters for performance report
});

/**
 * Executive summary filters
 */
export const executiveSummaryFiltersSchema = baseReportFiltersSchema.extend({
    // No additional filters for executive summary
});

/**
 * Flow report filters
 */
export const flowReportFiltersSchema = baseReportFiltersSchema.extend({
    // No additional filters for flow report
});

/**
 * Validate and parse date range
 * For timezone GMT-3 (Brasília), we need to adjust the end date to include the full day
 */
export function validateDateRange(from: string, to: string): { from: Date; to: Date } {
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

    // Set time to start/end of day
    fromDate.setHours(0, 0, 0, 0);

    // For the end date, add 1 day and set to 02:59:59.999Z
    // This ensures we include the full selected day in GMT-3 timezone
    // Example: selecting "2025-12-23" will filter up to "2025-12-24T02:59:59.999Z"
    // which is 2025-12-23 23:59:59 in GMT-3
    toDate.setDate(toDate.getDate() + 1);
    toDate.setUTCHours(2, 59, 59, 999);

    return { from: fromDate, to: toDate };
}

/**
 * Parse party size bucket into SQL condition
 */
export function parsePartySizeBucket(bucket?: string): { min: number; max: number | null } | null {
    if (!bucket) {
        return null;
    }

    switch (bucket) {
        case '1-2':
            return { min: 1, max: 2 };
        case '3-4':
            return { min: 3, max: 4 };
        case '5+':
            return { min: 5, max: null };
        default:
            return null;
    }
}

/**
 * Parse statuses string into array
 */
export function parseStatuses(statuses?: string): string[] | null {
    if (!statuses) {
        return null;
    }

    const validStatuses = ['WAITING', 'CALLED', 'SEATED', 'CANCELLED', 'NO_SHOW'];
    const parsed = statuses.split(',').map(s => s.trim().toUpperCase());

    return parsed.filter(s => validStatuses.includes(s));
}

export type BaseReportFilters = z.infer<typeof baseReportFiltersSchema>;
export type PerformanceReportFilters = z.infer<typeof performanceReportFiltersSchema>;
export type ExecutiveSummaryFilters = z.infer<typeof executiveSummaryFiltersSchema>;
export type FlowReportFilters = z.infer<typeof flowReportFiltersSchema>;
