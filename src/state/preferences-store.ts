import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CurrencyCode = 'USD';

type PreferencesState = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'crypto-app-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
