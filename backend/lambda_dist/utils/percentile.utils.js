"use strict";
/**
 * Percentile calculation utilities for analytics
 * Uses linear interpolation method for accurate percentile calculation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePercentile = calculatePercentile;
exports.calculateMedian = calculateMedian;
exports.calculateP75 = calculateP75;
exports.calculateMultiplePercentiles = calculateMultiplePercentiles;
exports.calculateStats = calculateStats;
/**
 * Calculate a specific percentile from a sorted array of numbers
 * @param sortedValues - Array of numbers sorted in ascending order
 * @param percentile - Percentile to calculate (0-100)
 * @returns The percentile value
 */
function calculatePercentile(sortedValues, percentile) {
    if (sortedValues.length === 0) {
        return null;
    }
    if (sortedValues.length === 1) {
        return sortedValues[0];
    }
    // Validate percentile range
    if (percentile < 0 || percentile > 100) {
        throw new Error('Percentile must be between 0 and 100');
    }
    // Calculate position using linear interpolation
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    // If index is a whole number, return that value
    if (lower === upper) {
        return sortedValues[lower];
    }
    // Linear interpolation between lower and upper values
    const weight = index - lower;
    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}
/**
 * Calculate median (P50) from an array of numbers
 * @param values - Array of numbers (will be sorted internally)
 * @returns The median value
 */
function calculateMedian(values) {
    if (values.length === 0) {
        return null;
    }
    const sorted = [...values].sort((a, b) => a - b);
    return calculatePercentile(sorted, 50);
}
/**
 * Calculate 75th percentile from an array of numbers
 * @param values - Array of numbers (will be sorted internally)
 * @returns The P75 value
 */
function calculateP75(values) {
    if (values.length === 0) {
        return null;
    }
    const sorted = [...values].sort((a, b) => a - b);
    return calculatePercentile(sorted, 75);
}
/**
 * Calculate multiple percentiles at once for efficiency
 * @param values - Array of numbers (will be sorted internally)
 * @param percentiles - Array of percentiles to calculate (e.g., [25, 50, 75, 95])
 * @returns Object with percentile values
 */
function calculateMultiplePercentiles(values, percentiles) {
    if (values.length === 0) {
        return percentiles.reduce((acc, p) => {
            acc[`p${p}`] = null;
            return acc;
        }, {});
    }
    const sorted = [...values].sort((a, b) => a - b);
    return percentiles.reduce((acc, p) => {
        acc[`p${p}`] = calculatePercentile(sorted, p);
        return acc;
    }, {});
}
/**
 * Calculate common statistics from an array of numbers
 * @param values - Array of numbers
 * @returns Object with mean, median, p75, min, max
 */
function calculateStats(values) {
    if (values.length === 0) {
        return {
            mean: null,
            median: null,
            p75: null,
            min: null,
            max: null,
            count: 0,
        };
    }
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return {
        mean: sum / values.length,
        median: calculatePercentile(sorted, 50),
        p75: calculatePercentile(sorted, 75),
        min: sorted[0],
        max: sorted[sorted.length - 1],
        count: values.length,
    };
}
//# sourceMappingURL=percentile.utils.js.map