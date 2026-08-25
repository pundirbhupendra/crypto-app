import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { hydratePreferences, preferencesReducer } from './preferences/preferences-slice';
import { hydrateWatchlist, watchlistReducer } from './watchlist/watchlist-slice';

const WATCHLIST_STORAGE_KEY = 'crypto-app-watchlist';
const PREFERENCES_STORAGE_KEY = 'crypto-app-preferences';

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    preferences: preferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function AppStateProvider({ children }: PropsWithChildren) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function hydrate() {
      const entries = await AsyncStorage.multiGet([WATCHLIST_STORAGE_KEY, PREFERENCES_STORAGE_KEY]);
      const watchlist = entries.find(([key]) => key === WATCHLIST_STORAGE_KEY)?.[1];
      const preferences = entries.find(([key]) => key === PREFERENCES_STORAGE_KEY)?.[1];

      if (watchlist) {
        const parsedWatchlist: unknown = JSON.parse(watchlist);
        if (Array.isArray(parsedWatchlist)) {
          store.dispatch(hydrateWatchlist(parsedWatchlist.filter((id): id is string => typeof id === 'string')));
        }
      }

      if (preferences) {
        const parsedPreferences: unknown = JSON.parse(preferences);
        if (
          parsedPreferences &&
          typeof parsedPreferences === 'object' &&
          'currency' in parsedPreferences &&
          parsedPreferences.currency === 'USD'
        ) {
          store.dispatch(hydratePreferences({ currency: 'USD' }));
        }
      }

      if (isActive) {
        setIsHydrated(true);
      }
    }

    void hydrate().catch(() => {
      if (isActive) {
        setIsHydrated(true);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    return store.subscribe(() => {
      const state = store.getState();
      void AsyncStorage.multiSet([
        [WATCHLIST_STORAGE_KEY, JSON.stringify(state.watchlist.watchlistIds)],
        [PREFERENCES_STORAGE_KEY, JSON.stringify(state.preferences)],
      ]);
    });
  }, [isHydrated]);

  return <Provider store={store}>{children}</Provider>;
}
