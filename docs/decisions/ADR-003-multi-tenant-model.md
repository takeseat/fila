# ADR 003: Multi-Tenant Database Design

## Overview
This document records the selection of a shared database with logical discriminator columns to partition tenant data across the SaaS system.

## Responsibilities
- Provide cost-effective resource utilization.
- Secure tenant data isolation through strict application-level scoping.

## Architecture / Flow
- **Data Partitioning**: All tables containing customer, user, or waitlist metrics implement a mandatory `restaurantId` column referencing the parent restaurant.

## Rules
- All application queries accessing tenant tables must verify that `where: { restaurantId }` filters are appended.

## Edge Cases
- **Shared Analytics Leak Risk**: Security tests must regularly review APIs to ensure data is not exposed between tenants due to a missing filter constraint.

## Technical Notes
- Implemented using Aurora Serverless v2 MySQL and Prisma Client code bindings.

## Related Documents
- [Database Schema Overview](../database/schema-overview.md)
- [Backend Architecture](../backend/backend-architecture.md)
