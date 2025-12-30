/**
 * Time bucketing utilities for analytics reports
 * Handles hourly and daily aggregation based on date range
 */
export type BucketSize = 'hour' | 'day';
/**
 * Determine appropriate bucket size based on date range
 * Rule: <= 2 days = hourly, > 2 days = daily
 * @param from - Start date
 * @param to - End date
 * @returns 'hour' or 'day'
 */
export declare function determineBucketSize(from: Date, to: Date): BucketSize;
/**
 * Generate array of bucket timestamps for a date range
 * @param from - Start date
 * @param to - End date
 * @param bucketSize - 'hour' or 'day'
 * @returns Array of Date objects representing bucket starts
 */
export declare function generateBuckets(from: Date, to: Date, bucketSize: BucketSize): Date[];
/**
 * Format bucket timestamp for display
 * @param date - Bucket date
 * @param bucketSize - 'hour' or 'day'
 * @returns Formatted string (e.g., "2024-01-15 14:00" or "2024-01-15")
 */
export declare function formatBucketLabel(date: Date, bucketSize: BucketSize): string;
/**
 * Get MySQL date format string for bucketing
 * @param bucketSize - 'hour' or 'day'
 * @returns MySQL DATE_FORMAT pattern
 */
export declare function getMySQLBucketFormat(bucketSize: BucketSize): string;
/**
 * Round a date to the nearest bucket
 * @param date - Date to round
 * @param bucketSize - 'hour' or 'day'
 * @returns Rounded date
 */
export declare function roundToBucket(date: Date, bucketSize: BucketSize): Date;
/**
 * Parse time range string (e.g., "11:00-15:00,18:00-23:00")
 * @param timeRange - Time range string
 * @returns Array of {start, end} hour objects
 */
export declare function parseTimeRanges(timeRange: string): Array<{
    start: number;
    end: number;
}>;
/**
 * Check if a date falls within specified time ranges
 * @param date - Date to check
 * @param timeRanges - Array of {start, end} hour objects
 * @returns true if date is within any of the ranges
 */
export declare function isInTimeRange(date: Date, timeRanges: Array<{
    start: number;
    end: number;
}>): boolean;
/**
 * Parse days of week string (e.g., "0,1,2,3,4,5,6")
 * @param daysOfWeek - Comma-separated string of day numbers (0=Sunday)
 * @returns Array of day numbers
 */
export declare function parseDaysOfWeek(daysOfWeek: string): number[];
/**
 * Check if a date falls on specified days of week
 * @param date - Date to check
 * @param daysOfWeek - Array of day numbers (0=Sunday)
 * @returns true if date is on one of the specified days
 */
export declare function isOnDayOfWeek(date: Date, daysOfWeek: number[]): boolean;
//# sourceMappingURL=time-bucket.utils.d.ts.map