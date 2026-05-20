# System Context

## Overview
This document defines the boundaries of the TakeSeat waitlist platform, listing user actors, external integrations, and core system boundaries.

## Responsibilities
- Define actors (Guest Customers, Host Operators, Restaurant Admins).
- Establish communication boundaries with messaging gateways (Z-API).
- Delineate feature inclusions from system exclusions.

## Architecture / Flow
```mermaid
C4Context
    title TakeSeat System Context Diagram

    Person(customer, "Guest Customer", "A person who wants to join a restaurant waitlist.")
    Person(operator, "Hostess Operator", "Front desk staff managing guest queue status.")
    Person(admin, "Restaurant Admin", "Owner configuring settings and monitoring reports.")

    System(fila_system, "TakeSeat Platform", "Core software managing queue, CRM records, and updates.")

    System_Ext(whatsapp_zapi, "Z-API Gateway", "Third-party WhatsApp delivery proxy service.")

    Rel(customer, fila_system, "Monitors position (Web Mobile page)", "HTTPS")
    Rel(operator, fila_system, "Updates queue status (Web Desktop/Tablet)", "HTTPS")
    Rel(admin, fila_system, "Adjusts templates and views reports", "HTTPS")

    Rel(fila_system, whatsapp_zapi, "Issues notification requests", "HTTPS/REST")
    Rel(fila_system, customer, "Sends text alerts", "WhatsApp")
```

## Rules
- **Authentication Border**: Guests do not log in. Guest access is authorized exclusively via a secure obfuscated hash parameter within their waitlist tracking link.
- **Provider Decoupling**: All messaging requests route through Z-API interfaces. The core system remains platform-agnostic to facilitate transitioning to alternative providers (Meta Cloud API).

## Edge Cases
- **Unverified Phone Delivery**: Z-API requires a valid destination number digits sequence. Delivery to invalid numbers will fail silently or return error logs to the webhook listener.

## Technical Notes
- Integrates with Z-API endpoints using credentials stored in system variables.

## Related Documents
- [System Architecture Overview](../architecture/overview.md)
- [WhatsApp Integration](../integrations/whatsapp.md)
