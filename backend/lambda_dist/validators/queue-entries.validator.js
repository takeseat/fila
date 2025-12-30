"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.queueEntriesFiltersSchema = void 0;
exports.parseStatuses = parseStatuses;
exports.validateQueueEntriesDateRange = validateQueueEntriesDateRange;
const zod_1 = require("zod");
/**
 * Queue entries report filters schema
 */
exports.queueEntriesFiltersSchema = zod_1.z.object({
    from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    statuses: zod_1.z.string().optional(),
    clientSearch: zod_1.z.string().optional(),
    partySizeMin: zod_1.z.coerce.number().int().min(1).optional(),
    partySizeMax: zod_1.z.coerce.number().int().min(1).optional(),
    daysOfWeek: zod_1.z.string().optional(),
    timeRange: zod_1.z.string().optional(),
});
/**
 * Pagination schema
 */
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(25),
    sortBy: zod_1.z.enum(['createdAt', 'customerName', 'partySize', 'status', 'timeToCall', 'timeToSeat', 'timeCallToSeat']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
/**
 * Parse statuses string into array
 */
function parseStatuses(statuses) {
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
function validateQueueEntriesDateRange(from, to) {
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
//# sourceMappingURL=queue-entries.validator.js.map