"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowReportFiltersSchema = exports.executiveSummaryFiltersSchema = exports.performanceReportFiltersSchema = exports.baseReportFiltersSchema = void 0;
exports.validateDateRange = validateDateRange;
exports.parsePartySizeBucket = parsePartySizeBucket;
exports.parseStatuses = parseStatuses;
const zod_1 = require("zod");
/**
 * Base report filters schema
 * Common filters used across all reports
 */
exports.baseReportFiltersSchema = zod_1.z.object({
    from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    timeRange: zod_1.z.string().optional(),
    daysOfWeek: zod_1.z.string().optional(),
    partySizeBucket: zod_1.z.enum(['1-2', '3-4', '5+']).optional(),
    statuses: zod_1.z.string().optional(),
    maxWaitMinutes: zod_1.z.coerce.number().int().min(1).max(1440).optional().default(240),
});
/**
 * Performance report filters
 */
exports.performanceReportFiltersSchema = exports.baseReportFiltersSchema.extend({
// No additional filters for performance report
});
/**
 * Executive summary filters
 */
exports.executiveSummaryFiltersSchema = exports.baseReportFiltersSchema.extend({
// No additional filters for executive summary
});
/**
 * Flow report filters
 */
exports.flowReportFiltersSchema = exports.baseReportFiltersSchema.extend({
// No additional filters for flow report
});
/**
 * Validate and parse date range
 * For timezone GMT-3 (Brasília), we need to adjust the end date to include the full day
 */
function validateDateRange(from, to) {
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
function parsePartySizeBucket(bucket) {
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
function parseStatuses(statuses) {
    if (!statuses) {
        return null;
    }
    const validStatuses = ['WAITING', 'CALLED', 'SEATED', 'CANCELLED', 'NO_SHOW'];
    const parsed = statuses.split(',').map(s => s.trim().toUpperCase());
    return parsed.filter(s => validStatuses.includes(s));
}
//# sourceMappingURL=reports.validator.js.map