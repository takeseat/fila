# Reports & Analytics

The Reporting module provides insights into restaurant performance and queue efficiency.

## 1. Waitlist Performance
Focuses on operational metrics.
- **KPIs**:
    - Average Wait Time.
    - Throughput (Guests/Hour).
    - Abandonment Rate (Hit Rate).
- **Charts**:
    - Daily Volume vs Wait Time.
    - Seated vs Cancelled pie chart.

## 2. Executive Summary
High-level overview for owners.
- **KPIs**: Total Guests, Total Parties, Average Party Size.
- **Trend**: Weekly growth/decline in visits.

## 3. Flow Analysis
Detailed breakdown of the customer journey.
- **Stages**:
    - Added -> Called (Wait Time)
    - Called -> Seated (Response Time)
    - Called -> No Show (Loss)

## Technical Implementation
- **Data Source**: Calculated on-the-fly via efficient SQL/Prisma aggregations on `waitlist_entries` table.
- **Performance**:
    - DB Indexes on `[restaurantId, createdAt]` and `[restaurantId, status]` ensure fast queries.
    - Frontend uses `@tanstack/react-query` for caching and loading states.
