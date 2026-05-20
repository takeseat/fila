# State Management

## Overview
TakeSeat separates local UI states (form inputs, toggle flags) from server-side states (active waitlist entries, tenant profile data) using a combined strategy of React Context and TanStack (React) Query.

## Responsibilities
- **Server Syncing**: Fetch, cache, and update server resources using declarative Query hooks.
- **Cache Invalidation**: Automatically trigger stale-state cache refetches when updates occur (mutations).
- **Global Contexts**: Manage small, stable, cross-component states (Authentication, Impersonation, Language).

## Architecture / Flow
1. **Initial Mount**: Component runs a query hook (e.g., `useQuery({ queryKey: ['waitlist'] })`) -> returns loading state and cache data.
2. **Action Dispatch**: User submits a form -> triggers mutation hook (e.g., `useMutation`) -> POST/PUT Axios request to backend.
3. **Invalidation**: On mutation success, the hook executes `queryClient.invalidateQueries({ queryKey: ['waitlist'] })`.
4. **Re-fetch**: React Query marks the cache as stale and issues background fetches, causing connected components to re-render.

## Rules
- **Server State Gating**: All remote API endpoints must be managed via React Query. Do not keep local duplicate state variables of server datasets using `useState` hooks.
- **Key Conventions**: Maintain standardized query key arrays:
  - `['waitlist']`: List of active queue entries.
  - `['customers']`: Customer list and histories.
  - `['settings']`: WhatsApp templates and restaurant profiles.
  - `['users']`: Team accounts.
- **Mutations Side-Effects**: Always implement toast indicators (using `react-hot-toast`) on mutations (`onSuccess`, `onError`) to provide instant user feedback.

## Edge Cases
- **Stale Cache Handling**: When a hostess runs the app on a mobile device and leaves it in the background, reactivation must trigger automatic focus refetches (`refetchOnWindowFocus: true`).
- **Websocket Real-Time Updates**: Although `socket.io-client` configuration exists in `src/lib/socket.ts`, it is currently not integrated to auto-invalidate React Query caches. The app relies on explicit user actions or query polling/refetches to sync.

## Technical Notes
- Controlled in `frontend/src/lib/react-query` or `src/App.tsx`.
- Impersonation token storage is maintained in `localStorage` to persist administrator sessions across reloads.

## Related Documents
- [Frontend Architecture](./frontend-architecture.md)
- [Design System Patterns](../design-system/patterns.md)
