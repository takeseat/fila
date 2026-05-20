# WhatsApp Notification Flow

## Overview
This flow governs how guest notifications are generated, compiled, dispatched, and audited across waitlist transition triggers.

## Responsibilities
- Compile message templates with real-time variables.
- Manage opt-in validation checks.
- Audit outbound notifications in database logs.

## Architecture / Flow
1. **Trigger Event**: A guest action triggers a state change (e.g. hostess calls party -> status becomes `CALLED`).
2. **Opt-in & Settings Check**:
   - Check if guest `whatsappOptIn` is true.
   - Check if restaurant settings has enabled the specific notification.
3. **Template Interpolation**: Load text template from the database, substituting variables:
   - `{{customer_name}}`, `{{business_name}}`, `{{position}}`, `{{eta_minutes}}`.
4. **Provider Dispatch**: Dispatch payload containing recipient number and compiled message text to `WhatsAppProvider.sendText`.
5. **Log Generation**: Persist notification status and reference codes in `WhatsAppMessageLog`.

## Rules
- **No SMS Failover**: The application only uses WhatsApp notifications. If message dispatch fails, the system does not fallback to SMS.

## Edge Cases
- **Z-API Webhook Status Feeds**: If the recipient's phone is disconnected, the provider returns delivery failure payloads to the system webhook, updating `WhatsAppMessageLog.status` to `FAILED`.

## Technical Notes
- Controlled in `WhatsAppService` and executed asynchronously to prevent blocking API responses.

## Related Documents
- [WhatsApp Integration](../integrations/whatsapp.md)
- [Queue Rules](../business-rules/queue-rules.md)
