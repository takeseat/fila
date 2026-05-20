# Product Vision

## Overview
TakeSeat is a modern, responsive, and serverless queue management SaaS designed for high-turnover establishments (such as restaurants, bistros, and bars). It eliminates physical waiting lines, reduces customer walk-away rates, and optimizes front-of-house operations.

## Responsibilities
The product is responsible for:
- Providing an intuitive mobile-first hostess panel to manage party queue entries.
- Offloading physical queues to a virtual waiting room with automated notifications.
- Informing customers dynamically of their position and estimated waiting time.
- Collecting wait metrics to help administrators optimize table turnover.

## Architecture / Flow
1. **Entry**: Customer arrives at the establishment; the hostess records their name, party size, and phone number.
2. **Waiting Room**: Customer receives a WhatsApp notification with a link to their real-time position page. They are free to walk around nearby.
3. **Seating Call**: When a table is ready, the hostess triggers a call action, notifying the customer to return.
4. **Seated**: Customer is seated, ending their wait cycle, and their history is logged for CRM and analytics.

## Rules
- **Mobile-First Orientation**: Front-of-house operators run the interface on tablets or mobile phones, while customers check their status solely on their mobile browsers. 
- **LATAM Optimization**: The default country DDI is "+55" (Brazil), with phone number formats pre-formatted to handle local carrier changes (such as 9-digit mobile numbering). However, the system is multi-language and supports standard international formats.
- **SaaS Plan Alignment**: Advanced notification features and text personalization are gated behind the paid PRO plan. Trial status expires after 7 days, prompting the business to configure billing.

## Edge Cases
- **No-Show Customers**: If a customer does not return within the establishment's custom threshold after being called, the entry status is marked as `NO_SHOW`.
- **Dynamic Viewport Variations**: The customer's mobile view must adapt seamlessly to varying mobile browser UI frames (like Chrome and Safari's address bar collapses) using dynamic viewport sizing (`dvh`).

## Technical Notes
- Built using React on the frontend and an Express REST API served via AWS Lambda.
- Direct database modeling through Prisma, utilizing Aurora Serverless v2 for scale.

## Related Documents
- [Features List](./features.md)
- [Queue Rules](../business-rules/queue-rules.md)
- [System Context](../ai-context/system-context.md)
