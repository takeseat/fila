# Backend Architecture

## Overview
The TakeSeat backend is designed as a modular Serverless Monolith. In production, it runs inside an AWS Lambda function handled by `@vendia/serverless-express`, exposing standard REST endpoints mapped via Amazon API Gateway. In local development, it starts a persistent Node.js HTTP server.

## Responsibilities
- **Request Processing**: Host incoming REST API routes and map standard Express responses.
- **Tenant Context Scoping**: Dynamically associate request execution with the authenticated `restaurantId`.
- **Database Querying**: Retrieve and persist system records using Prisma ORM.
- **External Integration Abstraction**: Connect to WhatsApp (Z-API) and Stripe interfaces using modular providers.

## Architecture / Flow
- **Execution Flow**:
  1. API Gateway routes request `/{proxy+}` to Lambda -> `@vendia/serverless-express` converts AWS request schema to standard Express `req`/`res`.
  2. Middleware Layer parses headers, executes JWT token validation (`authenticate`), loads impersonation variables, and asserts subscription validity (`checkSubscriptionAccess`).
  3. Router Layer delegates request to the associated Controller (e.g. `/waitlist` -> `WaitlistController`).
  4. Controller Layer validates input data structures using Zod schemas and executes the domain Service (e.g., `WaitlistService`).
  5. Service Layer performs database operations via `PrismaClient` and triggers notifications before returning results.

## Rules
- **Layered Architecture Isolation**: Controllers must not contain SQL queries or Prisma commands directly. All data mutations, business checks, and notification dispatches must reside in the Service layer.
- **Strict Tenant Boundaries**: All query operations in Services must explicitly match `where: { restaurantId }`. Under no circumstances should data be returned without this condition, preventing cross-tenant security breaches.
- **Provider Pattern Conformity**: All integrations with WhatsApp APIs must implement the `IWhatsAppProvider` interface. Direct references to API endpoints inside services are forbidden.

## Edge Cases
- **AWS Lambda Execution Context Cold Starts**: DB connection limits must be managed carefully. Prisma connection pools must be configured to prevent exhausting MySQL connection limits when multiple Lambda instances scale up concurrently.
- **WebSocket Limits in Serverless**: Although `socket.io` websocket logic is defined, it is not used in the serverless environment because AWS Lambda is stateless and transient. Real-time updates rely instead on REST requests.

## Technical Notes
- Runtime: Node.js 20.x, built using TypeScript compiling to standard CommonJS (`dist/server.js`).
- Database ORM: Prisma Client matching MySQL compatibilities.

## Related Documents
- [API Patterns](./api-patterns.md)
- [Database Schema](../database/schema-overview.md)
- [Infrastructure Overview](../infrastructure/infra-overview.md)
