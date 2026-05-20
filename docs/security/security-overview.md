# Security Overview

## Overview
This document outlines the security parameters, access controls, transport protocols, and data isolation strategies implemented across the TakeSeat application platform.

## Responsibilities
- **Access Verification**: Validate identity credentials of platform operators and verify signatures.
- **Data Isolation Enforcement**: Guard tenant datasets from cross-tenant visibility leaks.
- **Secrets Management**: Prevent sensitive credentials and keys from exposure in static source files.

## Architecture / Flow
- **Staff Access Flow**: Operator sends credentials -> API validates password hash and issues signed JWT -> client stores JWT -> subsequent requests send JWT in `Authorization` header -> middleware decrypts and checks role clearance.
- **Guest Access Flow**: Guest checks in -> database generates UUID for `WaitlistEntry` -> system generates public URL containing entry UUID -> guest requests status via URL token (no password login required).

## Rules
- **Password Hashing**: Store all passwords using bcrypt hashing. Plaintext storage is forbidden.
- **JWT Signing**: Access tokens are signed using the `JWT_SECRET` key via the HS256 algorithm.
- **Tenant Scope Enforcement**: All data service endpoints must filter database queries using `where: { restaurantId }`.
- **API CORS**: Whitelist only authorized domains (`takeseat.me`, local development origins) in Express CORS configurations.
- **Transport Layer Security**: HTTPS is mandatory across all channels (Vite UI via CloudFront, API routes via AWS API Gateway).

## Edge Cases
- **Sysadmin Impersonation Security Audit**: When a system administrator impersonates a restaurant tenant, the actions are audited in `ImpersonationLog` records to log the operator ID, target restaurant, start/end timestamps, and reason.

## Technical Notes
- Input validation: Implemented using Zod validation schemas to protect endpoints against injection attacks.

## Related Documents
- [Database Schema Overview](../database/schema-overview.md)
- [API Patterns](../backend/api-patterns.md)
