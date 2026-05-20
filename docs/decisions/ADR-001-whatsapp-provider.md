# ADR 001: WhatsApp Provider Pattern

## Overview
This document records the architectural decision to decouple outbound messaging integrations from specific providers using a Strategy/Provider pattern interface.

## Responsibilities
- Define a uniform service interface for dispatching text alerts.
- Support swappable message transport implementations (Z-API, Meta Cloud API) without impacting business logic.

## Architecture / Flow
`WaitlistService` -> Calls interface method `IWhatsAppProvider.sendText` -> Invokes active injected subclass (`ZApiWhatsAppProvider`) -> Issues API request.

## Rules
- All business services must interact solely with the `IWhatsAppProvider` interface abstraction.
- Subclass implementations must handle vendor-specific request layouts and response parsing internally.

## Edge Cases
- **Development Mocking**: In non-production environments, a `MockWhatsAppProvider` can be resolved to log dispatches in terminal consoles instead of issuing real billing requests.

## Technical Notes
- Current active subclass in production: `ZApiWhatsAppProvider`.

## Related Documents
- [WhatsApp Integration](../integrations/whatsapp.md)
- [System Components](../architecture/components.md)
