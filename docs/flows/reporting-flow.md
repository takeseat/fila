# Reporting Flow

## Overview
The Reporting flow aggregates historical waitlist data into metrics and visualizations to help operators analyze queue throughput and performance.

## Responsibilities
- Aggregate ended waitlist entries over date ranges.
- Compute average wait times, called-to-seated durations, and cancellation percentages.
- Export raw tabular data.

## Architecture / Flow
1. **Query Dispatch**: UI sends request `GET /reports/waitlist-performance?startDate=...&endDate=...`.
2. **Data Aggregation**: Backend queries database, filtering completed entries (`SEATED`, `CANCELLED`, `NO_SHOW`) by date range.
3. **KPI Computation**:
   - **Average Wait Time**: Difference between `seatedAt` / `calledAt` and `createdAt`.
   - **Abandonment Rate**: Percentage of cancelled/no-show entries vs total entries.
   - **Daily Peak Hours**: Grouping check-in records by hour of day.
4. **Data Delivery**: UI renders values on KPI cards and plots trend lines using Recharts components.

## Rules
- **Date Range Limit**: The query date range must not exceed a maximum window of 90 days to prevent excessive database loading.
- **Tenant Scope isolation**: Aggregations must enforce `where: { restaurantId }` to ensure data privacy.

## Edge Cases
- **No Data Fallback**: If zero entries exist in the selected range, the endpoint returns default zeroed metrics to prevent divide-by-zero runtime exceptions.

## Technical Notes
- Implemented in `ReportsController` and displayed on the `/reports/waitlist-performance` route.

## Related Documents
- [Features List](../product/features.md)
- [Database Schema](../database/schema-overview.md)
