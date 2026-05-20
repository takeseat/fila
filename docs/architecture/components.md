# System Components

## Overview
TakeSeat is split into a client SPA Web Frontend, an Express API Backend running on AWS Lambda, a relational MySQL database, and pluggable messaging integration providers.

## Responsibilities
- **Frontend SPA**: Deliver the operator interface for queue management, reports, and settings.
- **Backend API**: Expose authenticated endpoints, process business actions, and validate structures.
- **Database Storage**: Store records with relational integrity.
- **Migration Runner**: Perform database schema updates via CI/CD execution.

## Architecture / Flow
- **Request Lifecycle**:
  1. Client SPA captures user actions -> compiles payload -> sends REST request.
  2. Backend Lambda Express middleware intercepts -> validates token -> executes controller -> queries database.
  3. Service executes callbacks -> triggers WhatsApp integrations.
- **Schema Management**:
  1. CI/CD initiates build -> deploys `takeseat-migrate-prod` Lambda function.
  2. Migration function runs `prisma migrate deploy` directly against the database inside the secure VPC.

## Rules
- **No Direct DB Access from UI**: The React client must never contact the MySQL database directly. All operations must route through the secure REST API.
- **Domain Service Separation**: Core business rules (Waitlist, Customers, Auth) must remain isolated in dedicated Service classes inside the API.

## Edge Cases
- **VPC Net Isolation**: Database instances are isolated inside private subnets. The API Lambda and Migration Lambda must reside inside the same VPC/Subnet route to resolve DB queries.

## Technical Notes
- Technologies: React (Vite/TypeScript), Node.js (TypeScript/Express), MySQL (Prisma ORM), AWS Lambda, Z-API.

## Related Documents
- [System Architecture Overview](./overview.md)
- [Database Schema](../database/schema-overview.md)
