# WhatsApp Integration

A centralized implementation connecting TakeSeat to the Meta Cloud API (WhatsApp Business Platform).

## Architecture

- **Global Integration**: One single WABA (WhatsApp Business Account) and Phone Number used for all restaurants.
- **Backend-Only**: Credentials (`WHATSAPP_API_TOKEN`) are securely stored in backend env vars. No frontend exposure.

## Environment Configuration

To enable the integration, the following environment variables must be defined in `backend/.env`:

```env
WHATSAPP_API_TOKEN="your-meta-access-token"
WHATSAPP_PHONE_ID="your-phone-number-id"
WHATSAPP_VERIFY_TOKEN="your-webhook-verify-token"
```

## Features

### Configuration (Per Restaurant)
Restaurants can toggle the feature and specific message types in **Settings > WhatsApp**.
1.  **Welcome Message**: Sent immediately upon joining the queue.
2.  **Position Updates**: Sent when queue position improves.
    - *Rate Limited*: Configurable `minSeconds` and `minPositionChange` to prevent spam.
3.  **Your Turn**: Sent when status changes to `CALLED`.

### Templates
Messages are text-based (no complex HSM for now) using string replacement.
- **Variables**: `{{customer_name}}`, `{{business_name}}`, `{{position}}`, `{{eta_minutes}}`.
- **i18n**: System attempts to use restaurant's language for default templates.

### Webhooks
- Endpoint: `POST /whatsapp-webhook`
- Purpose: Receives message status updates (`sent`, `delivered`, `read`, `failed`).
- Logs: Updates `WhatsAppMessageLog` table for audit trails.
- **Verification**: Meta verifies the webhook using `WHATSAPP_VERIFY_TOKEN`.

## Persistent Opt-In

Compliance is handled via a **persistent customer preference**.

### Data Model
- **Customer Entity**: Stores `whatsappOptIn` (Boolean), `whatsappOptInAt` (Timestamp), and `whatsappOptInSource` (Source of change).
- **Snapshot**: Each `WaitlistEntry` stores a snapshot of the opt-in status at the time of entry for historical auditing.

### Behavior
1.  **New Customers**:
    - Default to `true` (Opt-in) if the restaurant has WhatsApp enabled.
    - Default to `false` if WhatsApp is disabled.
2.  **Existing Customers**:
    - The system remembers their last choice.
    - If they previously opted out, the checkbox will be unchecked by default.
    - Updates to the checkbox in the "Add to Queue" modal **permanently update** the customer's profile.
3.  **Customer Management**:
    - Admins can manually toggle "WhatsApp Authorization" in the Customer Edit modal (`/customers`).

### Logic Flow
- **Opt-In Source**:
    - `QUEUE_ENTRY`: Changed during the waitlist add flow.
    - `CRM`: Changed via the Customer Management admin panel.
    - `IMPORT`: Imported via CSV (defaults to false unless specified).
