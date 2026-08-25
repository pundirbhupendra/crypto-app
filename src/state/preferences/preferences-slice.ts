import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CurrencyCode = 'USD';

type PreferencesState = {
  currency: CurrencyCode;
};

const initialState: PreferencesState = {
  currency: 'USD',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<CurrencyCode>) => {
      state.currency = action.payload;
    },
    hydratePreferences: (state, action: PayloadAction<PreferencesState>) => {
      state.currency = action.payload.currency;
    },
  },
});

export const { hydratePreferences, setCurrency } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
