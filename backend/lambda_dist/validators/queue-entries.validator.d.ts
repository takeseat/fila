import { z } from 'zod';
/**
 * Queue entries report filters schema
 */
export declare const queueEntriesFiltersSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    statuses: z.ZodOptional<z.ZodString>;
    clientSearch: z.ZodOptional<z.ZodString>;
    partySizeMin: z.ZodOptional<z.ZodNumber>;
    partySizeMax: z.ZodOptional<z.ZodNumber>;
    daysOfWeek: z.ZodOptional<z.ZodString>;
    timeRange: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    statuses?: string | undefined;
    clientSearch?: string | undefined;
    partySizeMin?: number | undefined;
    partySizeMax?: number | undefined;
}, {
    from: string;
    to: string;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    statuses?: string | undefined;
    clientSearch?: string | undefined;
    partySizeMin?: number | undefined;
    partySizeMax?: number | undefined;
}>;
/**
 * Pagination schema
 */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodEnum<["createdAt", "customerName", "partySize", "status", "timeToCall", "timeToSeat", "timeCallToSeat"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    sortBy?: "status" | "createdAt" | "customerName" | "partySize" | "timeToCall" | "timeToSeat" | "timeCallToSeat" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
    sortBy?: "status" | "createdAt" | "customerName" | "partySize" | "timeToCall" | "timeToSeat" | "timeCallToSeat" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
/**
 * Parse statuses string into array
 */
export declare function parseStatuses(statuses?: string): string[] | undefined;
/**
 * Validate and parse date range for queue entries
 */
export declare function validateQueueEntriesDateRange(from: string, to: string): {
    from: Date;
    to: Date;
};
export type QueueEntriesFilters = z.infer<typeof queueEntriesFiltersSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
//# sourceMappingURL=queue-entries.validator.d.ts.map