import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type WatchlistState = {
  watchlistIds: string[];
  isWatchlisted: (coinId: string) => boolean;
  toggleWatchlist: (coinId: string) => void;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlistIds: [],
      isWatchlisted: (coinId) => get().watchlistIds.includes(coinId),
      toggleWatchlist: (coinId) =>
        set((state) => ({
          watchlistIds: state.watchlistIds.includes(coinId)
            ? state.watchlistIds.filter((id) => id !== coinId)
            : [...state.watchlistIds, coinId],
        })),
    }),
    {
      name: 'crypto-app-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
