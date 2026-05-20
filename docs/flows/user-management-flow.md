# User Management Flow

## Overview
This flow governs administrative operations to create staff accounts, update roles, and manage credentials within a tenant restaurant.

## Responsibilities
- Create and update user accounts.
- Restrict access privileges using roles.
- Manage password reset credentials.

## Architecture / Flow
- **Create User Flow**:
  1. Admin clicks "Add Team Member" -> fills name, email, password, and role.
  2. Router verifies creator has role `ADMIN`.
  3. Backend checks if email is unique -> hashes password -> persists record associated with creator's `restaurantId`.
  4. Language is set to default language of creator user profile.
- **Update Status Flow**:
  - Admin can update user status to inactive (`isActive = false`), immediately restricting future authentication operations.

## Rules
- **Role Hierarchy Controls**:
  - Only `ADMIN` role users can add, edit, or disable team members.
  - `MANAGER` and `HOSTESS` roles are forbidden from accessing team management routes.

## Edge Cases
- **Self-Disabling Guard**: Admins are blocked from disabling their own accounts or changing their own role to prevent lockout events.

## Technical Notes
- Controlled in `users-management.routes.ts` and managed in `UsersManagement.tsx`.

## Related Documents
- [Features List](../product/features.md)
- [Security Overview](../security/security-overview.md)
