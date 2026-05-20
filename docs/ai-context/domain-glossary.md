# Domain Glossary

## Overview
This glossary translates business, design, and technical definitions utilized across the TakeSeat codebase to align understanding between human developers and AI agents.

## Responsibilities
- Define terminology representing core database entities.
- Standardize calculations and acronym abbreviations.
- Document third-party integration service names.

## Architecture / Flow
`Business concept (e.g. Fila)` -> `Database representation (e.g. WaitlistEntry)` -> `UI Presentation (e.g. Waitlist Card)`.

## Rules
- **Restaurant (Tenant)**: The paying business entity hosting a queue. Mapped in code as `Restaurant` or `tenant`.
- **Waitlist (Fila de Espera)**: The active queue of guest parties waiting for a table.
- **Customer (Cliente)**: Persistent CRM profile, uniquely identified by country code + DDI + local phone number.
- **Waitlist Entry (Inscrição na Fila)**: A transient log mapping a customer's specific check-in event.
- **DDI**: Direct Distance Inward (country phone prefix, e.g. `+55` for Brazil).
- **Z-API**: Non-official WhatsApp gateway routing HTTP webhook dispatches to target devices.
- **Impersonation (Simulação/Impersonificação)**: administrative action allowing platform admins to manage a restaurant's dashboard without requesting their passwords.
- **Onboarding Wizard**: The initial setup form that completes missing restaurant variables (city, timezone) before unlocking the dashboard.
- **ETA (Estimated Time of Arrival / Tempo Estimado)**: Wait calculation computed as $(N+1) \times 15$ minutes, where $N$ is the number of active waiting parties in the queue.

## Edge Cases
- **Customer vs WaitlistEntry**: A `Customer` record is permanent. A `WaitlistEntry` is temporary and gets deleted or archived on completing terminal states.

## Technical Notes
- Term translations are managed in standard JSON files inside `frontend/src/locales/`.

## Related Documents
- [Features List](../product/features.md)
- [Queue Rules](../business-rules/queue-rules.md)
