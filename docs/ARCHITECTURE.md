# Architecture Notes

This app intentionally uses a small, production-oriented architecture that is easy to inspect while learning.

## Boundaries

- **Routes:** Files under `src/app` only map Expo Router URLs to feature screens. Keeping them thin prevents navigation concerns from absorbing business logic.
- **Features:** `src/features` owns user workflows, presentation components, and view-model-like custom hooks. This keeps changes discoverable by capability rather than by technical type alone.
- **Server state:** TanStack Query owns CoinPaprika data, request status, caching, and refetching. Redux is not used as a second API cache because server state has different freshness and synchronization rules.
- **Client state:** Redux Toolkit owns watchlist IDs and preferences. Slices provide predictable reducers and action history; Zustand would be a reasonable smaller-app alternative, but Redux was selected here to demonstrate explicit client-state flow and scale to more coordinated UI state.
- **Services:** `src/services/coinpaprika` contains native `fetch`, URL construction, timeout/error normalization, and Zod parsing. A repository interface is intentionally deferred until a second provider or a stronger testing seam justifies it.
- **Persistence:** AsyncStorage persists only non-sensitive local state. SecureStore or a server-side session would be more appropriate for credentials and tokens.

## Data Flows

```text
Screen -> custom hook -> TanStack Query -> CoinPaprika service -> fetch -> REST API
Component -> typed dispatch -> Redux slice -> selector -> component
```

## Validation And Testing

TypeScript provides compile-time contracts, while Zod validates unknown API responses at runtime. Jest tests cover reducer behavior and the service boundary. Feature and end-to-end tests should be added as workflows become more complex.

## Platform Notes

Shared React Native primitives target Android, iOS, and Web. Platform-specific behavior stays in platform files such as `app-tabs.web.tsx`; browser history and native navigation should be tested separately.