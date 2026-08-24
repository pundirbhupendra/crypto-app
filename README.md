# Crypto App

A modern cross-platform cryptocurrency market browser built with React Native,
Expo, TypeScript, Expo Router, and the CoinPaprika REST API.

This project is a production-style learning app. The current codebase started
from the default Expo template, and the starter UI will be replaced with a
feature-based crypto app architecture.

## Status

In progress. The app foundation is set up with Expo SDK 57, React Native,
TypeScript, Expo Router, and strict TypeScript configuration. The next step is
to replace the demo screens with real crypto market features.

## Tech Stack

- Expo SDK 57
- React Native 0.86
- React 19
- TypeScript
- Expo Router
- Axios
- TanStack Query
- Zustand
- Zod
- CoinPaprika REST API

## Features Planned

- Market list with ranked coins and live market data
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

## Planned Architecture

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
|   |       +-- client.ts            # Axios instance
|   |       +-- coins.ts             # Coin endpoints
|   |       +-- tickers.ts           # Ticker endpoints
|   |       +-- types.ts             # API TypeScript types
|   |       +-- schemas.ts           # Zod response schemas
|   |
|   +-- state/
|   |   +-- watchlist-store.ts       # Zustand watchlist store
|   |   +-- preferences-store.ts     # Zustand preferences store
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
+-- README.md
+-- package.json
```

## API

The app will use the CoinPaprika REST API directly from the client app.

Base URL:

```txt
https://api.coinpaprika.com/v1
```

Planned endpoints:

- `GET /coins`
- `GET /tickers`
- `GET /tickers/{id}`
- `GET /coins/{id}`

No API key is required for the first version.

## Learning Goals

This app is designed to practice modern React Native architecture:

- Feature-based project structure
- Server-state caching with TanStack Query
- Local persistent state with Zustand
- API response validation with Zod
- Reusable UI components
- Cross-platform routing with Expo Router
- Clean separation between routes, features, services, state, and UI

## Development Notes

- Keep `src/app` focused on routing.
- Put screen business logic inside `src/features`.
- Put API access and validation inside `src/services/coinpaprika`.
- Use TanStack Query for remote data and Zustand for local app state.
- Keep reusable components small and move them into `src/components/ui`.

Useful reference:

- [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/)
