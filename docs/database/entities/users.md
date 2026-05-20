# Users Entity

## Overview
The `User` model represents administrative, management, and host staff accounts that log in to manage restaurant operations.

## Responsibilities
- Hold authentication identifiers (email, hashed password).
- Restrict interface permissions through RBAC (Role-Based Access Control) assignments.
- Store email verification tokens and status.

## Architecture / Flow
- Mapped to the `users` table in MySQL.
- Belongs to `Restaurant` (optional relationship, since platform-wide `SYSADMIN` users do not link to any single restaurant).

## Rules
- **Unique Fields**: The `email` field has a unique database constraint.
- **Roles**: Must belong to the `UserRole` enum:
  - `SYSADMIN`: Platform-wide admin with impersonation rights.
  - `ADMIN`: Restaurant account owner.
  - `MANAGER`: Store manager with settings control.
  - `HOSTESS`: Operational staff restricted to waitlist activities.

## Edge Cases
- **Nullable Tenant Relationship**: `restaurantId` is nullable. When `null`, the system evaluates the user role; if not `SYSADMIN`, access is denied.

## Technical Notes
- Password hashes are stored using bcrypt algorithms.
- Indexes: Applied on `[restaurantId]` and `[email]` for rapid login lookup.

## Related Documents
- [Database Schema Overview](../schema-overview.md)
- [Security Overview](../../security/security-overview.md)
