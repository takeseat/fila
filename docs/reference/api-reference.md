# API Reference

## Overview
This document catalogs the REST API endpoints exposed by the TakeSeat backend, specifying payload properties and HTTP response structures.

## Responsibilities
- Document authentication route payloads.
- Detail operational waitlist control routes.
- Specify billing management callbacks.

## Architecture / Flow
- All administrative requests must supply a valid authentication header:
  `Authorization: Bearer <JWT_TOKEN>`
- All database-backed endpoints return JSON bodies.

## Rules

### Authentication

#### POST `/auth/login`
- **Description**: Authenticate operator credentials.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbG...",
    "refreshToken": "7f8...",
    "user": {
      "id": "usr_99",
      "email": "user@example.com",
      "role": "ADMIN"
    }
  }
  ```

---

### Waitlist Operations

#### POST `/queue`
- **Description**: Add a new guest party to the active waitlist.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "+5511999999999",
    "partySize": 4,
    "whatsappOptIn": true,
    "isPriority": false,
    "notes": "Near window"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "entry_123",
    "name": "John Doe",
    "partySize": 4,
    "status": "WAITING",
    "publicToken": "token-xyz"
  }
  ```

#### GET `/queue/:publicToken`
- **Description**: Fetch status metrics of a specific queue guest party. No Auth header required.
- **Response (200 OK)**:
  ```json
  {
    "name": "John Doe",
    "status": "WAITING",
    "position": 3,
    "etaMinutes": 45
  }
  ```

#### POST `/queue/:id/call`
- **Description**: Notify a guest party that their table is ready.
- **Response (200 OK)**:
  ```json
  {
    "id": "entry_123",
    "status": "CALLED",
    "calledAt": "2026-05-20T00:00:00.000Z"
  }
  ```

---

### Billing

#### GET `/billing/status`
- **Description**: Check restaurant subscription plan status.
- **Response (200 OK)**:
  ```json
  {
    "plan": "PRO",
    "subscriptionStatus": "TRIALING",
    "trialEndAt": "2026-05-27T00:00:00.000Z",
    "canAccessFeatures": true
  }
  ```

## Edge Cases
- **Expired Token Errors**: Expired JWT tokens will trigger an HTTP 401 Unauthorized response:
  ```json
  { "error": "Token expired" }
  ```

## Technical Notes
- REST API base path: `/api`.

## Related Documents
- [Security Overview](../security/security-overview.md)
- [Authentication Flow](../flows/authentication-flow.md)
