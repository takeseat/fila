# Internationalization (i18n)

TakeSeat is designed to be multi-language ready, supporting global deployments.

## Tech Stack
- **Frontend**: `react-i18next` (standard application translation).
- **Backend**: `User` model stores preferred language (`en`, `pt-BR`, etc.) for email/communication (future).

## Structure
Locale files are located in `frontend/src/locales/{lang}/{namespace}.json`.

Supported Languages (MVP):
- `en` (English - Source)
- `pt-BR` (Portuguese Brazil)
- `es` (Spanish)

## Namespaces
Translations are split into logical chunks to avoid massive JSON files:
- `auth`: Login, Register, Errors.
- `common`: Buttons, Generic Labels (Save, Cancel).
- `waitlist`: Queue interface, statuses.
- `settings`: Configuration screens.
- `reports`: Analytics labels.
- `nav`: Sidebar/Menu items.
- `profile`: User settings.

## Adding a Language
1. Create folder `frontend/src/locales/{code}`.
2. Copy all JSON files from `en`.
3. Translated values.
4. Add `{code}` to supported languages list in `i18n.ts`.
