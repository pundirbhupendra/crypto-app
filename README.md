# Crypto App

A modern cross-platform cryptocurrency market browser built with React Native,
Expo, TypeScript, Expo Router, and the CoinPaprika REST API.

This project is a production-oriented learning app. It demonstrates a
feature-based architecture with Clean Architecture principles and an
MVVM-like presentation layer without adding unnecessary abstractions.

## Status

Implemented. The app provides markets, search, watchlist, and coin detail
workflows with loading, error, empty, refresh, persistence, and cross-platform
navigation states.

## Tech Stack

- Expo SDK 57
- React Native 0.86
- React 19
- TypeScript
- Expo Router
- Native `fetch`
- TanStack Query
- Redux Toolkit and React Redux
- Zod
- AsyncStorage
- FlashList
- CoinPaprika REST API

## Features

- Market list with the top ranked coins and market data
- Search for coins
- Watchlist for favorite coins
- Coin detail screen
- Loading, error, empty, and refresh states
- Local persisted watchlist and preferences

## Setup

If `node_modules` already exists, the initial dependency install has already
been completed. Run `npm install` again only after pulling new dependency
changes or if dependencies are missing.

```bash
npm install
```

Start the Expo development server:

```bash
npm run start
```

Run on a specific platform:

```bash
npm run android
npm run ios
npm run web
```

Run linting:

```bash
npm run lint
```

Run typechecking and tests:

```bash
npm run typecheck
npm test -- --runInBand
```

## Architecture

```txt
crypto-app/
|
+-- src/
|   +-- app/                         # Expo Router routes only
|   |   +-- _layout.tsx
|   |   +-- (tabs)/
|   |   |   +-- _layout.tsx
|   |   |   +-- index.tsx            # Markets
|   |   |   +-- search.tsx
|   |   |   +-- watchlist.tsx
|   |   +-- coin/
|   |       +-- [id].tsx             # Coin details
|   |
|   +-- features/
|   |   +-- markets/
|   |   +-- search/
|   |   +-- watchlist/
|   |   +-- coin-detail/
|   |
|   +-- services/
|   |   +-- coinpaprika/
|   |       +-- client.ts            # fetch, timeout, and errors
|   |       +-- coins.ts             # Coin endpoints
|   |       +-- tickers.ts           # Ticker endpoints
|   |       +-- types.ts             # Types inferred from schemas
|   |       +-- schemas.ts           # Zod response schemas
|   |
|   +-- state/
|   |   +-- store.tsx                # Redux store and persistence
|   |   +-- hooks.ts                 # Typed Redux hooks
|   |   +-- watchlist/               # Watchlist slice
|   |   +-- preferences/             # Preferences slice
|   |
|   +-- lib/
|   |   +-- query/
|   |       +-- query-client.ts      # TanStack Query client
|   |       +-- query-provider.tsx   # Query provider
|   |
|   +-- components/
|   |   +-- ui/                      # Reusable UI components
|   |
|   +-- utils/                       # Formatting helpers
|
+-- assets/
+-- tests/                            # Jest service and reducer tests
+-- docs/                             # Architecture and interview notes
+-- eas.json                          # EAS Build profiles
+-- README.md
+-- package.json
```

### State Boundaries

```text
Server state: CoinPaprika -> service -> TanStack Query -> feature hook -> screen
Client state: component -> typed dispatch -> Redux slice -> selector -> component
```

- TanStack Query owns CoinPaprika data, caching, request status, and refetching.
- Redux Toolkit owns watchlist IDs and user preferences.
- AsyncStorage persists only those non-sensitive local values.
- API communication and Zod parsing stay inside `src/services/coinpaprika`.
- Route files under `src/app` only compose feature screens.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the design rationale and
trade-offs.

## API

The app will use the CoinPaprika REST API directly from the client app.

Base URL:

```txt
https://api.coinpaprika.com/v1
```

Endpoints used by the service layer:

- `GET /coins`
- `GET /tickers`
- `GET /tickers/{id}`
- `GET /coins/{id}`

No API key is required for the first version.

## Learning Goals

This app is designed to practice modern React Native architecture:

- Feature-based project structure
- Server-state caching with TanStack Query
- Local persistent state with Redux Toolkit and AsyncStorage
- API response validation with Zod
- Reusable UI components
- Cross-platform routing with Expo Router
- Clean separation between routes, features, services, state, and UI

## Development Notes

- Keep `src/app` focused on routing.
- Put screen business logic inside `src/features`.
- Put API access and validation inside `src/services/coinpaprika`.
- Use TanStack Query for remote data and Redux Toolkit for local app state.
- Keep reusable components small and move them into `src/components/ui`.

## Testing And Delivery

Jest tests cover Redux reducer behavior and the CoinPaprika fetch/validation
boundary. The project also includes `eas.json` profiles for development,
preview, and production builds. GitHub Actions runs installation, typechecking,
tests, and linting on pushes and pull requests.

The app targets Android, iOS, and Web through Expo SDK 57. Platform-specific
behavior is isolated in platform files such as `app-tabs.web.tsx` where needed.

Useful reference:

- [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/)
