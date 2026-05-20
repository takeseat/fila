# Agent Guidelines

## Overview
This document outlines critical software invariants, architectural boundaries, and safety constraints that AI coding agents must respect when modifying the TakeSeat codebase.

## Responsibilities
- Prevent regressions in security, authentication, and multi-tenant scoping.
- Protect the mobile responsive layout viewport configuration.
- Enforce clean phone number sanitization rules.

## Architecture / Flow
1. **Understand Constraints**: Review repository boundaries and existing conventions before code edits.
2. **Execute Changes**: Modify logic using clean separation patterns.
3. **Verify Compliance**: Compile typescript, run linting checks, and execute local builds.
4. **Deploy Safely**: Push code cleanly through version control pipelines.

## Rules
- **Multi-Tenant Safeguard**: Never omit the `restaurantId` filter in queries. Every database operation must restrict search queries to the active tenant's context.
- **Mobile Viewport Locks**: Do not alter the mobile viewport configuration. The root layout locks height using `h-dvh` and `overflow-hidden`, using `overflow-y-auto` on the inner `PageShell` scroll wrapper to prevent address bar resizing bugs in mobile browsers.
- **Strict Billing Gates**: Do not bypass subscription middleware authorization routines. Only allow access to active or trialing tenants.
- **No Destructive Database Changes**: Do not mutate existing database schemas or delete Prisma columns without prior confirmation.

## Edge Cases
- **Bcrypt Native Modules**: If compilation errors crop up in backend containers, ensure `npm rebuild bcrypt --build-from-source` is run to compile binaries correctly.
- **WebSocket Placeholders**: Do not hook or import WebSocket clients in the core UI context as AWS Lambda runtime states do not actively support persistent connections.

## Technical Notes
- Build verification: Run `npm run build` inside both `frontend` and `backend` subdirectories to check for compilation issues.

## Related Documents
- [System Architecture Overview](../architecture/overview.md)
- [Security Overview](../security/security-overview.md)
