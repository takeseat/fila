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
export function determineBucketSize(from: Date, to: Date): BucketSize {
    const diffMs = to.getTime() - from.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays <= 2 ? 'hour' : 'day';
}

/**
 * Generate array of bucket timestamps for a date range
 * @param from - Start date
 * @param to - End date
 * @param bucketSize - 'hour' or 'day'
 * @returns Array of Date objects representing bucket starts
 */
export function generateBuckets(
    from: Date,
    to: Date,
    bucketSize: BucketSize
): Date[] {
    const buckets: Date[] = [];
    const current = new Date(from);

    // Normalize to bucket start
    if (bucketSize === 'hour') {
        current.setMinutes(0, 0, 0);
    } else {
        current.setHours(0, 0, 0, 0);
    }

    while (current <= to) {
        buckets.push(new Date(current));

        if (bucketSize === 'hour') {
            current.setHours(current.getHours() + 1);
        } else {
            current.setDate(current.getDate() + 1);
        }
    }

    return buckets;
}

/**
 * Format bucket timestamp for display
 * @param date - Bucket date
 * @param bucketSize - 'hour' or 'day'
 * @returns Formatted string (e.g., "2024-01-15 14:00" or "2024-01-15")
 */
export function formatBucketLabel(date: Date, bucketSize: BucketSize): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (bucketSize === 'day') {
        return `${year}-${month}-${day}`;
    }

    const hour = String(date.getHours()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:00`;
}

/**
 * Get MySQL date format string for bucketing
 * @param bucketSize - 'hour' or 'day'
 * @returns MySQL DATE_FORMAT pattern
 */
export function getMySQLBucketFormat(bucketSize: BucketSize): string {
    if (bucketSize === 'hour') {
        return '%Y-%m-%d %H:00:00';
    }
    return '%Y-%m-%d 00:00:00';
}

/**
 * Round a date to the nearest bucket
 * @param date - Date to round
 * @param bucketSize - 'hour' or 'day'
 * @returns Rounded date
 */
export function roundToBucket(date: Date, bucketSize: BucketSize): Date {
    const rounded = new Date(date);

    if (bucketSize === 'hour') {
        rounded.setMinutes(0, 0, 0);
    } else {
        rounded.setHours(0, 0, 0, 0);
    }

    return rounded;
}

/**
 * Parse time range string (e.g., "11:00-15:00,18:00-23:00")
 * @param timeRange - Time range string
 * @returns Array of {start, end} hour objects
 */
export function parseTimeRanges(timeRange: string): Array<{ start: number; end: number }> {
    if (!timeRange) {
        return [];
    }

    const ranges = timeRange.split(',').map(range => range.trim());

    return ranges.map(range => {
        const [startStr, endStr] = range.split('-');
        const start = parseInt(startStr.split(':')[0], 10);
        const end = parseInt(endStr.split(':')[0], 10);

        if (isNaN(start) || isNaN(end) || start < 0 || start > 23 || end < 0 || end > 23) {
            throw new Error(`Invalid time range: ${range}`);
        }

        return { start, end };
    });
}

/**
 * Check if a date falls within specified time ranges
 * @param date - Date to check
 * @param timeRanges - Array of {start, end} hour objects
 * @returns true if date is within any of the ranges
 */
export function isInTimeRange(
    date: Date,
    timeRanges: Array<{ start: number; end: number }>
): boolean {
    if (timeRanges.length === 0) {
        return true; // No filter = include all
    }

    const hour = date.getHours();

    return timeRanges.some(range => {
        if (range.start <= range.end) {
            return hour >= range.start && hour <= range.end;
        } else {
            // Handle overnight ranges (e.g., 22:00-02:00)
            return hour >= range.start || hour <= range.end;
        }
    });
}

/**
 * Parse days of week string (e.g., "0,1,2,3,4,5,6")
 * @param daysOfWeek - Comma-separated string of day numbers (0=Sunday)
 * @returns Array of day numbers
 */
export function parseDaysOfWeek(daysOfWeek: string): number[] {
    if (!daysOfWeek) {
        return [];
    }

    return daysOfWeek
        .split(',')
        .map(day => parseInt(day.trim(), 10))
        .filter(day => !isNaN(day) && day >= 0 && day <= 6);
}

/**
 * Check if a date falls on specified days of week
 * @param date - Date to check
 * @param daysOfWeek - Array of day numbers (0=Sunday)
 * @returns true if date is on one of the specified days
 */
export function isOnDayOfWeek(date: Date, daysOfWeek: number[]): boolean {
    if (daysOfWeek.length === 0) {
        return true; // No filter = include all
    }

    const dayOfWeek = date.getDay();
    return daysOfWeek.includes(dayOfWeek);
}
