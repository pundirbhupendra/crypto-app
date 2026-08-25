# Interview Questions: CoinPaprika Crypto App

This guide uses the CoinPaprika React Native app as a learning project and an interview-preparation project. Answers describe the current implementation accurately; when a capability is not implemented, the question treats it as a design exercise rather than implying that it already exists. The guide covers Custom Hooks, REST APIs, and Offline support explicitly, including their current project status.

## How To Maintain This Guide

Add new questions to the smallest relevant level and preserve the structure below:

- **Question:** The interview prompt, represented by each `###` question heading.
- **Short answer:** A concise answer that can be spoken in an interview.
- **Detailed explanation:** The reasoning, trade-offs, and terminology.
- **Project example:** A concrete current file or an explicitly labeled proposed change.
- **Follow-up:** One realistic interviewer follow-up.

When the code changes, update the project examples and the capability notes in this introduction. Keep questions tied to an actual module, workflow, or architectural decision in this repository.

## 1. Beginner

### 1.1 What problem does React solve in this crypto app?

**Short answer:** React lets us describe the UI as a tree of components whose output changes when props or state change.

**Detailed explanation:** Instead of manually updating every price label or list row, we render components from data. React compares renders and applies the necessary updates. Components such as screens, rows, themed text, and state views each own a focused part of the UI.

**Project example:** `MarketsScreen` renders market data through `CoinList` and `CoinRow`. When query data changes, React renders the updated list from the new ticker array.

**Follow-up:** What causes a React component to render again?

### 1.2 What is the difference between React and React Native here?

**Short answer:** React provides the component and state model; React Native maps that model to native platform views, while React Native Web maps it to browser elements.

**Detailed explanation:** JSX and hooks come from React. React Native supplies components such as `View`, `Text`, `Pressable`, and `ScrollView`, which work across Android and iOS. Web support adds platform-specific behavior and files where browser navigation or styling differs.

**Project example:** `ThemedView` and `ThemedText` use React Native primitives, while `app-tabs.web.tsx` provides a web-specific tab implementation.

**Follow-up:** Why might a React Native component need a `.web.tsx` implementation?

### 1.3 What does Expo provide in this project?

**Short answer:** Expo provides the runtime, development tooling, platform modules, and build ecosystem used to run this React Native app.

**Detailed explanation:** Expo reduces the amount of native configuration needed for modules such as splash screens, status bars, images, and linking. `expo start` runs development targets, while EAS Build can produce platform binaries. Expo does not remove the need to understand React Native or platform behavior.

**Project example:** The root layout uses `expo-splash-screen` and `expo-status-bar`; the package is pinned to Expo SDK 57.

**Follow-up:** When would you need a development build instead of Expo Go?

### 1.4 How does Expo Router map this app's files to screens?

**Short answer:** Expo Router uses the file system as the navigation configuration.

**Detailed explanation:** Files under `src/app` become routes. Parentheses group routes without adding a URL segment, bracket syntax creates dynamic parameters, and layout files configure navigators around child routes. This keeps navigation close to screen ownership while retaining React Navigation underneath.

**Project example:** `src/app/(tabs)/index.tsx` is the Markets tab, `search.tsx` and `watchlist.tsx` are sibling tabs, and `src/app/coin/[id].tsx` is the dynamic coin-detail route.

**Follow-up:** What is the difference between `router.push`, `router.replace`, and `router.back`?

### 1.5 Why is TypeScript useful in this app?

**Short answer:** TypeScript catches invalid data usage and makes contracts between screens, services, and state stores explicit before runtime.

**Detailed explanation:** Types document function inputs and outputs, narrow optional route parameters, and make refactoring safer. TypeScript alone cannot verify that an external API response is truthful, so runtime validation is still needed at the network boundary.

**Project example:** `CurrencyCode` is restricted to `'USD'`, route params are typed as `{ id?: string }`, and service types are exported from `services/coinpaprika/types.ts`.

**Follow-up:** What can TypeScript fail to detect when data comes from an API?

### 1.6 What are React Hooks, and where are `useState` and `useEffect` used?

**Short answer:** Hooks let function components use state and lifecycle-related behavior; `useState` stores local interactive state and `useEffect` performs synchronization or side effects.

**Detailed explanation:** `useState` updates a component-local value and triggers a render. `useEffect` runs after rendering when its dependencies change and is appropriate for effects such as hiding a splash screen. Effects should not be used as a substitute for ordinary derived values or event handlers.

**Project example:** `SearchScreen` stores the search term with `useState`; `RootLayout` calls `SplashScreen.hideAsync()` from a `useEffect` after the layout mounts.

**Follow-up:** What belongs in an effect dependency array?

### 1.7 What is the difference between `useMemo` and `useCallback`?

**Short answer:** `useMemo` caches a computed value; `useCallback` caches a function reference.

**Detailed explanation:** Both are performance tools, not default requirements. They are useful when computation is meaningfully expensive or when stable identity prevents a memoized child or effect from doing unnecessary work. They also add dependency complexity, so a profiler or clear identity requirement should justify them.

**Project example:** `MarketsScreen`, `SearchScreen`, and `WatchlistScreen` use `useMemo` for filtering and limiting arrays. The current project does not use `useCallback`; adding it to every handler would not automatically improve performance.

**Follow-up:** When would `useMemo` make performance worse?

### 1.8 What is a custom hook?

**Short answer:** A custom hook packages reusable stateful or hook-based logic behind a domain-specific function.

**Detailed explanation:** A custom hook can compose React hooks while preserving the Rules of Hooks. It should expose a useful behavior rather than merely hide a few lines. Keeping data-fetching logic in a hook prevents screens from knowing query configuration details.

**Project example:** `useTickers` in `src/features/markets/hooks/use-tickers.ts` owns the TanStack Query call for the market ticker collection.

**Follow-up:** What rules must every custom hook follow?

### 1.9 What are loading, error, and empty states?

**Short answer:** They are explicit UI states for asynchronous or missing data, so the user is never left guessing what the screen is doing.

**Detailed explanation:** A loading state communicates progress, an error state explains recovery, and an empty state distinguishes “no matching data” from “request failed.” These states should be modeled from query and local state rather than inferred from a transient render.

**Project example:** `StateView` is reused for loading and error messages. `CoinList` accepts empty-state text, and `MarketsScreen` supplies a refetch action after a failed request.

**Follow-up:** How would you distinguish an empty search result from an empty API response?

## 2. Junior

### 2.1 How does the REST API integration work, and why use a service layer?

**Short answer:** The service layer turns domain operations into HTTP requests and keeps screens independent from URL construction and response parsing.

**Detailed explanation:** A REST API exposes resources through HTTP methods and resource-oriented URLs. A service boundary centralizes the base URL, timeout, query parameters, response validation, and error translation. This makes UI code easier to test and lets the API client change without rewriting screens.

**Project example:** `services/coinpaprika/client.ts` configures the native fetch boundary; `tickers.ts` exposes `getTickers` and `getTickerById`; `coins.ts` exposes `getCoinById`.

**Follow-up:** Where would you put authentication headers if CoinPaprika required them?

### 2.2 Why does this app use native `fetch` instead of Axios?

**Short answer:** `fetch` is built in but does not reject on HTTP error status, so the service must check `response.ok`, parse the body, and handle timeouts or aborts explicitly.

**Detailed explanation:** Axios provides an instance, base URL, timeout behavior, and structured error information. With `fetch`, a repository function might create an `AbortController`, call `fetch`, reject non-2xx responses, parse JSON, and pass the result to Zod. Either client can fit this app; consistency and testability matter more than the brand of HTTP client.

**Project example:** The current `client.ts` uses native `fetch`, `AbortController`, and a 15-second timeout. The service functions preserve stable signatures while keeping transport details out of screens.

**Follow-up:** Why is checking `response.ok` essential with `fetch`?

### 2.3 How does TanStack Query manage server state here?

**Short answer:** TanStack Query runs the request, tracks its status, caches results by query key, and exposes refetch and error information to the screen.

**Detailed explanation:** Server state is remote, asynchronous, shareable, and subject to staleness. Query keys identify records, while query functions retrieve them. The provider makes one `QueryClient` available to the route tree, avoiding duplicated request logic and ad hoc loading flags.

**Project example:** `AppQueryProvider` wraps the app. `useTickers` uses `queryKeys.tickers`, and coin detail uses separate ticker and coin keys for the selected ID.

**Follow-up:** What makes a query key correct and stable?

### 2.4 Explain the query caching and refetching choices in this project.

**Short answer:** Results are considered fresh for 60 seconds, retained for 10 minutes after becoming unused, retried once, and can be manually refetched from the UI.

**Detailed explanation:** `staleTime` controls when data is considered eligible for a refresh; `gcTime` controls how long inactive cache data is retained. These are different from persistence: the current query cache is not stored in AsyncStorage. A manual pull-to-refresh is useful when users expect current prices.

**Project example:** `query-client.ts` sets a 60-second `staleTime`, 10-minute `gcTime`, one retry, and disables window-focus refetching. `CoinList` supports pull-to-refresh and error views expose a retry action.

**Follow-up:** What would you change for a rapidly moving trading screen?

### 2.5 What is the difference between server state and client state in this app?

**Short answer:** Market and coin details come from the server and belong in TanStack Query; watchlist IDs, currency preference, and the active search term are client-controlled state.

**Detailed explanation:** Server state has request status, cache lifetime, synchronization, and possible conflicts with the source of truth. Client state represents local intent or UI state. Separating them prevents a global store from becoming a second, inconsistent API cache.

**Project example:** `watchlistSlice` and `preferencesSlice` use Redux Toolkit. `useQuery` owns ticker and coin data, while `SearchScreen` owns its input value with `useState`.

**Follow-up:** Where would a selected coin ID belong: query cache, Zustand, or route state?

### 2.6 Why does Redux Toolkit fit the watchlist, and how would Zustand compare?

**Short answer:** Redux Toolkit gives this learning project explicit slices, typed actions, and predictable reducers; Zustand would provide less ceremony for a small local store.

**Detailed explanation:** Redux Toolkit is valuable when a team benefits from slices, serializable actions, predictable reducers, DevTools, and established middleware patterns. Zustand is appropriate when a smaller surface and minimal ceremony matter more. Neither should replace TanStack Query for server caching.

**Project example:** `useWatchlistStore` exposes `isWatchlisted` and `toggleWatchlist`; `usePreferencesStore` stores the USD preference. A Redux Toolkit version would likely use separate slices and a persisted store configuration.

**Follow-up:** What state or team constraints would make you reconsider Redux Toolkit for Zustand?

### 2.7 How does Zod complement TypeScript?

**Short answer:** TypeScript checks code at compile time; Zod validates unknown API data at runtime and can produce inferred TypeScript types.

**Detailed explanation:** External JSON should be treated as untrusted input even when a TypeScript interface describes the expected shape. Zod schemas verify required fields, nested quotes, and types before data reaches UI code. Inference reduces duplicate type declarations, while error handling decides how validation failures are presented.

**Project example:** `schemas.ts` defines ticker, coin, and USD quote schemas; `types.ts` derives domain types from them. CoinPaprika service functions parse responses before returning them.

**Follow-up:** What should the app do when the API adds or removes a required field?

### 2.8 How is AsyncStorage used, and what are its limits?

**Short answer:** AsyncStorage persists small non-sensitive JSON values across launches; it is not an encrypted database or a replacement for server storage.

**Detailed explanation:** The Redux provider serializes selected slices and uses AsyncStorage to save them asynchronously. Reads and writes can be delayed or fail, so hydration and failure behavior matter. Secrets, tokens, and financial credentials should use a secure credential store instead.

**Project example:** `state/store.tsx` persists `crypto-app-preferences` and `crypto-app-watchlist` through AsyncStorage after Redux hydration.

**Follow-up:** How would you migrate persisted state after changing its shape?

### 2.9 Describe the feature-based architecture used here.

**Short answer:** Code is grouped by user capability, with each feature owning its screen, domain-specific components, and hooks.

**Detailed explanation:** Feature organization makes a workflow discoverable and limits unrelated coupling. Shared UI, constants, services, query infrastructure, and state remain in shared boundaries. It is not a license to duplicate every primitive; broadly reusable pieces should stay shared.

**Project example:** `features/markets` contains the markets screen, ticker hook, list, and row; `features/search`, `features/watchlist`, and `features/coin-detail` own their workflows.

**Follow-up:** When should a component move from a feature folder to shared components?

### 2.10 How does the presentation layer handle navigation and errors?

**Short answer:** Screens compose hooks and services into presentation states, and route components under `src/app` stay thin.

**Detailed explanation:** The route file maps a URL to a feature screen. The feature screen reads route parameters, invokes hooks, chooses loading/error/empty/content branches, and renders reusable UI. Error translation remains near the service boundary while user-facing recovery actions remain in presentation code.

**Project example:** `src/app/coin/[id].tsx` exports `CoinDetailScreen`; that screen runs ticker and coin queries and maps `getApiErrorMessage` to `StateView`.

**Follow-up:** What logic would you extract if `CoinDetailScreen` became difficult to test?

### 2.11 How would you add pagination to this app?

**Short answer:** First confirm that the API supports page or limit parameters, then use a query key containing the page or `useInfiniteQuery` for “load more,” while keeping list state and deduplication explicit.

**Detailed explanation:** The current app fetches the complete ticker collection and limits the rendered result with `useMemo`; that is not server pagination. For a large dataset, request pages from the API, expose `getNextPageParam`, flatten pages for the list, handle page-specific errors, and avoid duplicate IDs. Pull-to-refresh should reset or refetch from the first page.

**Project example:** `getTickers()` currently calls `/tickers?quotes=USD`, and Markets shows the top 100 valid-ranked coins. A proposed change would add pagination parameters to `tickers.ts` and replace `useQuery` with `useInfiniteQuery`.

**Follow-up:** How would you preserve search behavior across paginated results?

### 2.12 Why use FlashList instead of FlatList, and what performance risks remain?

**Short answer:** FlashList is designed for efficient large-list recycling, but row complexity, image work, subscriptions, and unnecessary renders still determine real performance.

**Detailed explanation:** `FlatList` is a solid built-in virtualized list, while FlashList can improve measurement and recycling for large or complex collections. Performance should be measured on representative Android and iOS devices. Stable keys, lightweight rows, selective Redux selectors, memoization only where justified, and server pagination all matter.

**Project example:** `CoinList` renders ticker rows with FlashList, separators, refresh control, and an empty component. `CoinRow` selects only the watchlist operations it needs.

**Follow-up:** What would you measure before replacing FlashList with another list library?

## 3. Senior

### 3.1 Which Clean Architecture principles are present, and where would you draw the boundaries?

**Short answer:** The app separates presentation, data access, validation, shared infrastructure, and local state, but it is a pragmatic layered design rather than a fully formal Clean Architecture implementation.

**Detailed explanation:** Useful principles here are dependency direction, single responsibility, stable domain-facing contracts, and isolating external frameworks at boundaries. Screens should depend on use-case or service contracts, not URL details. Introducing many interfaces or layers without a change in testability would add ceremony rather than value.

**Project example:** Feature screens depend on `useTickers` and CoinPaprika service functions; Zod schemas and native fetch are contained under `services/coinpaprika`; query setup is under `lib/query`.

**Follow-up:** What dependency direction would you enforce before supporting a second market-data provider?

### 3.2 Is this architecture MVVM-like? Explain the trade-off.

**Short answer:** It is MVVM-like: screens act as views, hooks and query/store composition act like view models, and services provide model/data operations, but there is no formal ViewModel class.

**Detailed explanation:** A view should focus on rendering and user events; a view model exposes state and commands in a view-friendly shape; services communicate with external data sources. Function components and hooks make this lightweight. The trade-off is that a large screen can still accumulate orchestration logic unless the view-model hook is deliberately extracted.

**Project example:** `useTickers` exposes query state to `MarketsScreen`, while `CoinDetailScreen` combines two queries and watchlist commands directly. A future `useCoinDetailViewModel` could expose one presentation model.

**Follow-up:** What signal tells you that the screen needs a dedicated view-model hook?

### 3.3 How would you introduce a repository pattern and dependency injection?

**Short answer:** Define a domain-facing repository contract, implement it with CoinPaprika, and inject the implementation into hooks or use cases so tests can provide a fake repository.

**Detailed explanation:** A repository hides transport, endpoint paths, parsing, and provider-specific details. Dependency injection can be as simple as passing a repository to a factory or as broad as using a context. The abstraction is justified when there are multiple providers, offline implementations, or a need for isolated tests; an interface around one trivial function may be unnecessary today.

**Project example:** Today `useTickers` imports `getTickers` directly. A future `TickerRepository` could expose `list()` and `getById()`, with `coinpaprikaTickerRepository` as the production implementation and an in-memory fake in tests.

**Follow-up:** How would you prevent the repository from leaking fetch or Zod types into the feature layer?

### 3.4 How would you design error handling across transport, validation, and UI?

**Short answer:** Normalize transport and validation failures at the service boundary, preserve actionable categories, and let the UI map categories to recovery actions without exposing raw internals.

**Detailed explanation:** Timeout, rate limit, unavailable network, HTTP status, malformed JSON, and schema mismatch have different remediation. Retry only transient failures and respect rate limits. Log diagnostic details in development or an observability system, but show a concise message to users. Never treat a failed request as an empty successful result.

**Project example:** `client.ts` maps rate-limit and timeout conditions, while `getApiErrorMessage` supplies a user-facing message to `StateView`. Zod parsing errors should remain distinguishable from a normal empty list.

**Follow-up:** Which errors should TanStack Query retry automatically?

### 3.5 How would you tune caching and refetching for live crypto prices?

**Short answer:** Choose freshness from product requirements, reduce redundant requests, and consider polling or streaming only where the value justifies battery, bandwidth, and rate-limit costs.

**Detailed explanation:** A 60-second stale window is reasonable for a learning market browser but not for execution-grade pricing. Shorter intervals increase freshness and load. Query focus behavior, pull-to-refresh, retry policy, request cancellation, and invalidation after mutations should be intentional. A production trading product would need stronger consistency guarantees and a provider contract that supports them.

**Project example:** The current QueryClient uses 60 seconds of freshness, 10 minutes of inactive retention, one retry, and no window-focus refetch. Markets supports manual refresh.

**Follow-up:** How would you prevent several screens from polling the same ticker endpoint independently?

### 3.6 How would you make the app work offline?

**Short answer:** Persist selected query data, expose hydration and stale-data indicators, queue or reconcile local mutations, and define what “offline” means for each workflow.

**Detailed explanation:** AsyncStorage already persists the watchlist and preferences, but it does not persist TanStack Query’s cache in this project. Query persistence could provide last-known markets and coin details, while network status controls retries and messaging. A watchlist mutation is local-first here, but server-backed actions would require conflict resolution and retry queues.

**Project example:** Current behavior can retain the watchlist offline but cannot show previously fetched market data after a cold start unless query persistence is added. A future implementation could persist only bounded, time-stamped ticker data.

**Follow-up:** How would you avoid showing dangerously stale prices as current?

### 3.7 What testing strategy would you add to this repository?

**Short answer:** Test pure formatting and selectors first, service parsing and error mapping next, then hook and screen workflows with mocked network and platform boundaries.

**Detailed explanation:** Unit tests should cover currency/percentage formatting, Zod rejection, query key construction, watchlist toggling, and filtering. Integration tests should verify loading, retry, empty, refresh, and navigation behavior. End-to-end tests should cover a user opening a coin, saving it, restarting, and viewing the watchlist. The repository currently has no test framework or test files, so setup is part of the work.

**Project example:** Tests cover `watchlist-slice.ts` and the CoinPaprika fetch boundary with a mocked `getTickers` response. Future tests should cover `format.ts`, `useTickers`, and `CoinList`; CoinPaprika should not be called directly in deterministic tests.

**Follow-up:** Which behavior would you test before visual snapshot tests?

### 3.8 How would you handle Web, Android, and iOS differences?

**Short answer:** Keep shared behavior in common modules, isolate unavoidable platform differences with platform files or capability checks, and validate navigation, storage, styling, and input behavior on each target.

**Detailed explanation:** Browser history and URL routing differ from native stacks. Storage, safe areas, keyboard behavior, fonts, network permissions, and list performance also vary. Platform-specific code should be narrow and should preserve the same user-facing contract whenever possible.

**Project example:** `app-tabs.web.tsx` is a web-specific implementation, while the root uses Expo Router and the shared feature screens use React Native primitives. The coin-detail Back action must handle a browser route opened without history.

**Follow-up:** How would you test a direct web URL to `/coin/btc-bitcoin`?

### 3.9 What security concerns exist in this app?

**Short answer:** Treat API responses and deep-link parameters as untrusted, avoid storing secrets in AsyncStorage, use HTTPS, limit sensitive logs, and protect the API from abuse.

**Detailed explanation:** Public market data is not a credential, but a future API key must not be committed or bundled as a secret. Validate route IDs and response shapes, enforce reasonable timeouts and limits, and consider certificate/network policies appropriate to the threat model. Client-side controls cannot protect a privileged backend; sensitive operations belong behind a server.

**Project example:** The CoinPaprika base URL uses HTTPS and Zod validates responses. `AsyncStorage` stores only watchlist IDs and the USD preference; it should not be used for tokens or private keys.

**Follow-up:** Where would you put a provider secret if the product later required authenticated requests?

### 3.10 What would a production EAS Build and CI/CD setup look like?

**Short answer:** Commit reproducible app configuration, define EAS profiles for development, preview, and production, and have CI lint, type-check, test, and build artifacts from trusted branches.

**Detailed explanation:** EAS Build creates signed Android and iOS binaries using profile-specific settings. CI should install from the lockfile, run static checks and tests, validate environment configuration, and build only after quality gates pass. Secrets belong in CI/EAS secret storage, not source control. OTA updates, app-store review, signing credentials, and rollback policy need explicit ownership.

**Project example:** This project has `expo start` scripts but no test script or CI workflow yet. A sensible next step is adding `typecheck`, `test`, and CI jobs before introducing production EAS profiles.

**Follow-up:** How would you keep a failed production build from reaching users?

### 3.11 How would you scale this app as the dataset and feature set grow?

**Short answer:** Move from full-list fetching to server pagination, normalize or partition cache keys where useful, keep feature boundaries, and measure network, memory, render, and storage costs.

**Detailed explanation:** Fetching and rendering only the top 100 is a presentation limit, not a data-scaling strategy. Large datasets need API-side filtering/pagination, bounded caches, incremental rendering, and cancellation of obsolete searches. More features may justify domain use cases and repositories, but architecture should follow real coupling and team needs.

**Project example:** `MarketsScreen` memoizes the top 100 and `SearchScreen` limits matches to 50 from the same ticker collection. A scalable design would request ranked pages and use a debounced, cancellable search endpoint if available.

**Follow-up:** What metrics would tell you whether the bottleneck is network, JavaScript, or rendering?

### 3.12 Which current implementation decisions would you revisit first?

**Short answer:** I would prioritize tests, route/platform correctness, pagination, query persistence or explicit offline behavior, and a documented CI pipeline before adding more abstractions.

**Detailed explanation:** These areas affect reliability and user experience across the whole app. `useCallback` should be added only after evidence of referential-identity problems. A repository abstraction should be introduced when provider swapping or test isolation demands it. The goal is to reduce operational risk while preserving the app’s simple feature-based structure.

**Project example:** Current known gaps are no test setup, no pagination, no fetch implementation, no `useCallback` usage, no offline query cache, and no CI/EAS workflow. Current strengths include Zod validation, query caching, persisted local state, FlashList, and explicit state views.

**Follow-up:** How would you prioritize those changes for a two-week engineering iteration?
