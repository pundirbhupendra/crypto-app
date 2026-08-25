import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type WatchlistState = {
  watchlistIds: string[];
};

const initialState: WatchlistState = {
  watchlistIds: [],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    toggleWatchlist: (state, action: PayloadAction<string>) => {
      const coinIndex = state.watchlistIds.indexOf(action.payload);

      if (coinIndex === -1) {
        state.watchlistIds.push(action.payload);
      } else {
        state.watchlistIds.splice(coinIndex, 1);
      }
    },
    hydrateWatchlist: (state, action: PayloadAction<string[]>) => {
      state.watchlistIds = action.payload;
    },
  },
});

export const { hydrateWatchlist, toggleWatchlist } = watchlistSlice.actions;
export const watchlistReducer = watchlistSlice.reducer;
