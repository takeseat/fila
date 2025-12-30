# Permissions & Roles

Access control in TakeSeat is role-based (RBAC), managed via JWT tokens and middleware.

## Roles

Defined in `schema.prisma` enum `UserRole`:

1.  **ADMIN** (Restaurant Admin)
    - Full access to all modules.
    - Can manage Team Members (create/delete users).
    - Can configure Restaurant Settings (WhatsApp, Business Info).
    - Can view Reports.
2.  **MANAGER**
    - High-level access but limited configuration.
    - Can view Reports.
    - Can manage Queue and Customers.
    - *Cannot* delete other users or change critical business settings (implementation dependent).
3.  **HOSTESS**
    - Operational access only.
    - **Can**: Add/Edit/Move/Call/Seat customers in Waitlist.
    - **Cannot**: Access Settings, View Reports, Manage Users.

## Middleware

- `authenticate`: Verifies valid JWT and attaches `user` (id, restaurantId, role) to request.
- `authorize(...roles)`: Checks if `req.user.role` is in the allowed list.
    - Example: `router.delete('/users/:id', authorize('ADMIN'), ...)`

## Security Scope
All data access is strictly scoped to `req.user.restaurantId`. A user cannot access data from another restaurant, regardless of role.
