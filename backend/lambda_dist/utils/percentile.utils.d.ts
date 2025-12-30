/**
 * Percentile calculation utilities for analytics
 * Uses linear interpolation method for accurate percentile calculation
 */
/**
 * Calculate a specific percentile from a sorted array of numbers
 * @param sortedValues - Array of numbers sorted in ascending order
 * @param percentile - Percentile to calculate (0-100)
 * @returns The percentile value
 */
export declare function calculatePercentile(sortedValues: number[], percentile: number): number | null;
/**
 * Calculate median (P50) from an array of numbers
 * @param values - Array of numbers (will be sorted internally)
 * @returns The median value
 */
export declare function calculateMedian(values: number[]): number | null;
/**
 * Calculate 75th percentile from an array of numbers
 * @param values - Array of numbers (will be sorted internally)
 * @returns The P75 value
 */
export declare function calculateP75(values: number[]): number | null;
/**
 * Calculate multiple percentiles at once for efficiency
 * @param values - Array of numbers (will be sorted internally)
 * @param percentiles - Array of percentiles to calculate (e.g., [25, 50, 75, 95])
 * @returns Object with percentile values
 */
export declare function calculateMultiplePercentiles(values: number[], percentiles: number[]): Record<string, number | null>;
/**
 * Calculate common statistics from an array of numbers
 * @param values - Array of numbers
 * @returns Object with mean, median, p75, min, max
 */
export declare function calculateStats(values: number[]): {
    mean: number | null;
    median: number | null;
    p75: number | null;
    min: number | null;
    max: number | null;
    count: number;
};
//# sourceMappingURL=percentile.utils.d.ts.map