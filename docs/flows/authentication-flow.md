# Authentication Flow

## Overview
This document describes the user access flows for administrative staff logging into the dashboard and guest customers accessing public tracking pages.

## Responsibilities
- Issue secure JSON Web Tokens (JWT) for authenticated operator sessions.
- Authorize read-only guest tracking views using obfuscated endpoint tokens.

## Architecture / Flow
- **Staff Login Flow**:
  1. Operator submits email and password via `POST /auth/login`.
  2. Backend looks up email, evaluates bcrypt password hash, and checks if user profile is active.
  3. Backend generates short-lived JWT Access Token and long-lived Refresh Token.
  4. Frontend stores tokens, intercepts Axios requests to inject authorization headers, and initializes the layout language matching `user.language`.
- **Guest Tracking Link Flow**:
  1. Guest navigates to link delivered in WhatsApp notification (e.g., `/queue/abcd-1234`).
  2. UI requests page info using `GET /queue/:publicToken`.
  3. Backend parses token, checks database for associated `WaitlistEntry`, and returns wait metrics if valid.

## Rules
- **Access Privilege Limits**: Guests do not log in. Their access token allows read-only visibility for their specific waitlist record. Guests cannot query other queue entries or mutate queue statuses.

## Edge Cases
- **Revoking Active Users**: When a manager toggles a user to inactive (`isActive = false`), the session JWT remains valid until expiration. Future refresh token requests are immediately rejected.

## Technical Notes
- Signature algorithm: HMAC-SHA256.

## Related Documents
- [Security Overview](../security/security-overview.md)
- [API Patterns](../backend/api-patterns.md)
