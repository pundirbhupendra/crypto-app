import { useMemo } from 'react';

import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';
import { StateView } from '@/components/ui/state-view';
import { getApiErrorMessage } from '@/services/coinpaprika/client';

import { CoinList } from './components/coin-list';
import { useTickers } from './hooks/use-tickers';

const MARKET_LIMIT = 100;

export function MarketsScreen() {
  const tickersQuery = useTickers();
  const marketTickers = useMemo(
    () => tickersQuery.data?.filter((ticker) => ticker.rank && ticker.rank > 0).slice(0, MARKET_LIMIT) ?? [],
    [tickersQuery.data]
  );

  return (
    <Screen>
      <AppHeader title="Markets" subtitle="Top crypto assets ranked by CoinPaprika market data." />

      {tickersQuery.isLoading ? (
        <StateView title="Loading markets" message="Fetching the latest prices from CoinPaprika." />
      ) : tickersQuery.isError ? (
        <StateView
          title="Markets unavailable"
          message={getApiErrorMessage(tickersQuery.error)}
          actionLabel="Try again"
          onAction={() => tickersQuery.refetch()}
        />
      ) : (
        <CoinList
          tickers={marketTickers}
          refreshing={tickersQuery.isRefetching}
          onRefresh={() => tickersQuery.refetch()}
        />
      )}
    </Screen>
  );
}
