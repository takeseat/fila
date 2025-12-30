import { z } from 'zod';
/**
 * Base report filters schema
 * Common filters used across all reports
 */
export declare const baseReportFiltersSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    timeRange: z.ZodOptional<z.ZodString>;
    daysOfWeek: z.ZodOptional<z.ZodString>;
    partySizeBucket: z.ZodOptional<z.ZodEnum<["1-2", "3-4", "5+"]>>;
    statuses: z.ZodOptional<z.ZodString>;
    maxWaitMinutes: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    maxWaitMinutes: number;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
}, {
    from: string;
    to: string;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
    maxWaitMinutes?: number | undefined;
}>;
/**
 * Performance report filters
 */
export declare const performanceReportFiltersSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    timeRange: z.ZodOptional<z.ZodString>;
    daysOfWeek: z.ZodOptional<z.ZodString>;
    partySizeBucket: z.ZodOptional<z.ZodEnum<["1-2", "3-4", "5+"]>>;
    statuses: z.ZodOptional<z.ZodString>;
    maxWaitMinutes: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    maxWaitMinutes: number;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
}, {
    from: string;
    to: string;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
    maxWaitMinutes?: number | undefined;
}>;
/**
 * Executive summary filters
 */
export declare const executiveSummaryFiltersSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    timeRange: z.ZodOptional<z.ZodString>;
    daysOfWeek: z.ZodOptional<z.ZodString>;
    partySizeBucket: z.ZodOptional<z.ZodEnum<["1-2", "3-4", "5+"]>>;
    statuses: z.ZodOptional<z.ZodString>;
    maxWaitMinutes: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    maxWaitMinutes: number;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
}, {
    from: string;
    to: string;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
    maxWaitMinutes?: number | undefined;
}>;
/**
 * Flow report filters
 */
export declare const flowReportFiltersSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    timeRange: z.ZodOptional<z.ZodString>;
    daysOfWeek: z.ZodOptional<z.ZodString>;
    partySizeBucket: z.ZodOptional<z.ZodEnum<["1-2", "3-4", "5+"]>>;
    statuses: z.ZodOptional<z.ZodString>;
    maxWaitMinutes: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    maxWaitMinutes: number;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
}, {
    from: string;
    to: string;
    timeRange?: string | undefined;
    daysOfWeek?: string | undefined;
    partySizeBucket?: "1-2" | "3-4" | "5+" | undefined;
    statuses?: string | undefined;
    maxWaitMinutes?: number | undefined;
}>;
/**
 * Validate and parse date range
 * For timezone GMT-3 (Brasília), we need to adjust the end date to include the full day
 */
export declare function validateDateRange(from: string, to: string): {
    from: Date;
    to: Date;
};
/**
 * Parse party size bucket into SQL condition
 */
export declare function parsePartySizeBucket(bucket?: string): {
    min: number;
    max: number | null;
} | null;
/**
 * Parse statuses string into array
 */
export declare function parseStatuses(statuses?: string): string[] | null;
export type BaseReportFilters = z.infer<typeof baseReportFiltersSchema>;
export type PerformanceReportFilters = z.infer<typeof performanceReportFiltersSchema>;
export type ExecutiveSummaryFilters = z.infer<typeof executiveSummaryFiltersSchema>;
export type FlowReportFilters = z.infer<typeof flowReportFiltersSchema>;
//# sourceMappingURL=reports.validator.d.ts.map