import { useMemo } from 'react';

import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';
import { StateView } from '@/components/ui/state-view';
import { CoinList } from '@/features/markets/components/coin-list';
import { useTickers } from '@/features/markets/hooks/use-tickers';
import { getApiErrorMessage } from '@/services/coinpaprika/client';
import { useAppSelector } from '@/state/hooks';

export function WatchlistScreen() {
  const tickersQuery = useTickers();
  const watchlistIds = useAppSelector((state) => state.watchlist.watchlistIds);

  const watchlistTickers = useMemo(() => {
    const watchlistSet = new Set(watchlistIds);
    return tickersQuery.data?.filter((ticker) => watchlistSet.has(ticker.id)) ?? [];
  }, [tickersQuery.data, watchlistIds]);

  return (
    <Screen>
      <AppHeader title="Watchlist" subtitle="Your saved coins stay on this device." />

      {tickersQuery.isLoading ? (
        <StateView title="Loading watchlist" message="Matching your saved coins with live market data." />
      ) : tickersQuery.isError ? (
        <StateView
          title="Watchlist unavailable"
          message={getApiErrorMessage(tickersQuery.error)}
          actionLabel="Try again"
          onAction={() => tickersQuery.refetch()}
        />
      ) : (
        <CoinList
          tickers={watchlistTickers}
          refreshing={tickersQuery.isRefetching}
          onRefresh={() => tickersQuery.refetch()}
          emptyTitle="No saved coins yet"
          emptyMessage="Save coins from Markets or Search and they will appear here."
        />
      )}
    </Screen>
  );
}
