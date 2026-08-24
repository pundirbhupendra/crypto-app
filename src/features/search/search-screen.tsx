import { useMemo, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';
import { StateView } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CoinList } from '@/features/markets/components/coin-list';
import { useTickers } from '@/features/markets/hooks/use-tickers';
import { getApiErrorMessage } from '@/services/coinpaprika/client';

const SEARCH_LIMIT = 50;

export function SearchScreen() {
  const theme = useTheme();
  const tickersQuery = useTickers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return (
      tickersQuery.data
        ?.filter((ticker) =>
          `${ticker.name} ${ticker.symbol}`.toLowerCase().includes(query)
        )
        .slice(0, SEARCH_LIMIT) ?? []
    );
  }, [searchTerm, tickersQuery.data]);

  return (
    <Screen>
      <AppHeader title="Search" subtitle="Find coins by name or symbol." />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={setSearchTerm}
        placeholder="Search Bitcoin, ETH, Solana..."
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        value={searchTerm}
      />

      {tickersQuery.isLoading ? (
        <StateView title="Preparing search" message="Loading the market list first." />
      ) : tickersQuery.isError ? (
        <StateView
          title="Search unavailable"
          message={getApiErrorMessage(tickersQuery.error)}
          actionLabel="Try again"
          onAction={() => tickersQuery.refetch()}
        />
      ) : searchTerm.trim().length === 0 ? (
        <StateView title="Start typing" message="Search uses the latest loaded CoinPaprika ticker data." />
      ) : (
        <CoinList
          tickers={filteredTickers}
          refreshing={tickersQuery.isRefetching}
          onRefresh={() => tickersQuery.refetch()}
          emptyTitle="No matching coins"
          emptyMessage="Try another coin name or ticker symbol."
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: Spacing.three,
    fontSize: 16,
    marginBottom: Spacing.three,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
});
