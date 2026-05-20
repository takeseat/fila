# Frontend Architecture

## Overview
The TakeSeat frontend is a single-page React application built on Vite and TypeScript. It is optimized for mobile browser viewports, providing hostesses with operational tools to manage restaurant guest flows.

## Responsibilities
- **App Routing & Guards**: Establish public, private, and subscription-protected routes.
- **Visual Presentation**: Render the UI using styled HTML/CSS following design tokens.
- **Localisation & Localization**: Handle translation switching across English, Portuguese (Brazil), and Spanish namespaces.
- **Client Networking**: Formulate API requests and sync local UI state via Axios and TanStack Query.

## Architecture / Flow
- **Entrypoint**: `src/main.tsx` initializes React, the `LanguageContext`, the React Query Client, and renders `App.tsx`.
- **Global Contexts**:
  - `AuthContext`: Manages JWT access tokens, active tenant ID, and user details.
  - `ImpersonationContext`: Enables administrators to act on behalf of another restaurant tenant.
  - `LanguageContext`: Synchronizes translation locales via `react-i18next`.
- **View Layer**: Components are divided into `components` (common UI widgets, inputs, and shell layouts) and `pages` (full views representing routes like `/waitlist`, `/reports`, `/settings`).

## Rules
- **Directory Layout Structure**:
  - `src/components`: UI primitives (dialogs, tables, shells, layouts).
  - `src/contexts`: Global application contexts (auth, i18n, impersonation).
  - `src/hooks`: Global React hooks (auth, subscription limits).
  - `src/pages`: Individual page views.
  - `src/locales`: Localization files sorted as `{lang}/{namespace}.json`.
- **Language Detection**: The system uses `i18next-browser-languagedetector` to automatically determine language preference, syncing it with the backend preferred locale.
- **Routing Protection hierarchy**:
  - Public routes: `/auth` (Login/Register).
  - Authenticated private routes: `/onboarding`, `/verify-email`.
  - Subscription-gated routes: `/waitlist`, `/reports`, `/settings`.

## Edge Cases
- **Chrome Mobile Viewport Resizing**: Native browser control bars hiding/showing on scroll can distort layouts. The application root locks the viewport height to `h-dvh` and wraps sub-views in a single-scroll `PageShell` container to prevent jitter.
- **Language Key Fallback**: If a localized text key is missing in Portuguese or Spanish, the i18n engine falls back to English.

## Technical Notes
- Styling: Done primarily through custom Tailwind CSS utility rules.
- HTTP Requests: Configured with standard headers via an Axios interceptor that injects the active JWT `Authorization` header.

## Related Documents
- [State Management](./state-management.md)
- [Design System Overview](../design-system/overview.md)
- [Security Overview](../security/security-overview.md)
