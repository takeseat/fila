# Reports & Analytics

The reporting module provides a single focused view into queue performance.

## Queue Performance (`/reports`)

The only analytics screen in the MVP. Covers the last 7 days.

### KPIs
- **Total Served** — number of groups/customers seated in the period.
- **Average Wait Time** — mean time from queue entry to being called.

### Chart
- **Wait Time vs Volume per Day** — dual-axis line chart showing daily wait time (in minutes) and total served groups.

### No data state
If no queue entries exist for the period, the chart displays a friendly empty state.

## Technical Implementation
- **Endpoint:** `GET /reports/waitlist-performance?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Authentication:** JWT required.
- **Data source:** Calculated via Prisma aggregations on `waitlist_entries` table.
- **DB indexes:** `[restaurantId, createdAt]` and `[restaurantId, status]` ensure fast queries.
