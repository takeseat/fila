# WhatsApp Integration

## Overview
TakeSeat integrates with WhatsApp to notify queue guests of their registration, position movements, and table call actions. Communication is handled through a unified client provider abstraction interfacing with the Z-API gateway.

## Responsibilities
- **Outbound Dispatch**: Convert text notifications into JSON payloads and post them to Z-API endpoints.
- **Payload Normalization**: Sanitize phone numbers to comply with digit-only format requirements.
- **Rate-Limiting Controls**: Prevent spamming guests with redundant queue position update messages.

## Architecture / Flow
1. **Trigger Event**: A guest action changes waitlist status (e.g. hostess calls party -> `WaitlistService.callEntry`).
2. **Settings Audit**: Service checks `RestaurantWhatsAppSettings`:
   - Verify `isEnabled` is true.
   - Verify specific message types are enabled (`sendWelcome`, `sendPositionUpdates`, `sendTurnMessage`).
3. **Template Compilation**: Load text template from the database, substituting variables:
   - `{{customer_name}}`, `{{business_name}}`, `{{position}}`, `{{eta_minutes}}`.
4. **Provider Dispatch**: The service invokes the singleton provider `WhatsAppProvider.sendText(options)` which forwards to Z-API.
5. **Logs Generation**: Persist an entry in `WhatsAppMessageLog` containing the response message ID or failure codes.

## Rules
- **Environment Keys**: The integration relies on:
  - `ZAPI_BASE_URL`: API gateway endpoint.
  - `ZAPI_INSTANCE_ID`, `ZAPI_INSTANCE_TOKEN`, `ZAPI_CLIENT_TOKEN`: Authentication credentials.
- **Provider Isolation**: All service files must interact exclusively with the `IWhatsAppProvider` interface wrapper. Do not instantiate direct HTTP calls to Z-API outside the provider.
- **Opt-In Check**: The message handler must confirm `whatsappOptIn` is true on the specific waitlist entry before triggering the provider dispatch.

## Edge Cases
- **Duplicate Welcomes on Re-entry**: If a guest is removed and re-added to the waitlist on the same day, they will receive a new Welcome notification.
- **Position Update Limits**: Position messages are only dispatched if:
  - Position changes by at least `minPositionsChangeToNotify` (default 5).
  - Time elapsed since last notification exceeds `minSecondsBetweenUpdates` (default 5 minutes).

## Technical Notes
- The default provider is `ZApiWhatsAppProvider`, which strips non-numeric characters from the destination number prior to POST requests.

## Related Documents
- [Queue Rules](../business-rules/queue-rules.md)
- [Customer Rules](../business-rules/customer-rules.md)
