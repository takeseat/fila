# API Patterns

## Overview
This document outlines the design standards, request-response layouts, validation mechanisms, and error routing patterns for the TakeSeat RESTful API.

## Responsibilities
- Define RESTful URL routing standards and HTTP verb mappings.
- Enforce strict input structures using schemas.
- Standardize the HTTP status codes and error payloads returned to clients.

## Architecture / Flow
1. **Request Intake**: Client issues request (e.g. POST `/waitlist`) with payload.
2. **Schema Verification**: Router runs the associated validator middleware:
   ```typescript
   validateBody(createWaitlistEntrySchema)
   ```
   If validation fails, the request is blocked, returning a `400 Bad Request` immediately.
3. **Execution**: If valid, the controller processes the payload and delegates to the service.
4. **Error Interception**: If an exception is thrown in the service, the global `errorHandler` middleware catches it, formats the message, and returns the appropriate HTTP code.

## Rules
- **Authentication Header**: All private endpoints require the header `Authorization: Bearer <JWT_Token>`.
- **Response Format**: All successful responses must return a JSON payload with standard properties. Wrap list operations inside `data` envelopes accompanied by pagination metadata if applicable.
- **Input Validation**: All payloads (`req.body`, `req.query`, `req.params`) must be validated using **Zod** validator schemas. No raw manual properties evaluation is permitted in controllers.
- **HTTP Status Codes**:
  - `200 OK`: Successful read or update operation.
  - `201 Created`: Successful resource generation.
  - `400 Bad Request`: Input validation failed.
  - `401 Unauthorized`: Missing or invalid auth token.
  - `402 Payment Required`: Expired subscription or unpaid trial.
  - `403 Forbidden`: Authenticated user lacks permission scope for this action (RBAC).
  - `404 Not Found`: Resource does not exist.
  - `500 Internal Error`: System failure or database query error.

## Edge Cases
- **Impersonation Requests**: When an admin impersonates a client, requests contain the header `X-Impersonate-Restaurant-Id`. The custom `impersonationMiddleware` overrides `req.user.restaurantId` to execute operations in the target tenant context safely.
- **Zod Error Detail Arrays**: When validation fails, the API returns a structured array of fields containing details of validation rules violated.

## Technical Notes
- Validators reside in `backend/src/validators/`.
- Error handler middleware is configured globally in `backend/src/server.ts`.

## Related Documents
- [Backend Architecture](./backend-architecture.md)
- [Security Overview](../security/security-overview.md)
