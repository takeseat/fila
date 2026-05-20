# ADR 002: Internationalization Strategy

## Overview
This document outlines the hierarchy used to resolve locales (English, Portuguese, Spanish) across admin views and guest-facing status screens.

## Responsibilities
- Select the correct language preference for staff operators and guest clients.
- Provide a modular translation structure leveraging JSON dictionary files.

## Architecture / Flow
1. **LoggedIn Operator**: Resolve locale from the `User.language` DB column.
2. **Guest public screen**:
   - Evaluate the `?lang=` URL parameter.
   - Fall back to the host restaurant's default settings language.
   - Fall back to the browser's language (`navigator.language`).

## Rules
- Outbound WhatsApp notifications sent to guests must use the language configured by the restaurant profile, regardless of the active hostess interface locale.

## Edge Cases
- **Missing Translations**: When a translation key is missing in the Portuguese or Spanish dictionaries, the i18n manager must fallback gracefully to the English key definition.

## Technical Notes
- Implemented in React using `react-i18next` and backend query intercepts.

## Related Documents
- [Frontend Architecture](../frontend/frontend-architecture.md)
- [Features List](../product/features.md)
