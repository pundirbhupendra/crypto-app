import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';

import { StateView } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { MarketTicker } from '@/services/coinpaprika/types';

import { CoinRow, CoinRowSeparator } from './coin-row';

export function CoinList({
  tickers,
  refreshing,
  onRefresh,
  emptyTitle = 'No coins found',
  emptyMessage = 'Try a different search or refresh the market data.',
}: {
  tickers: MarketTicker[];
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  return (
    <FlashList
      data={tickers}
      renderItem={({ item }) => <CoinRow ticker={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={CoinRowSeparator}
      ListEmptyComponent={<StateView title={emptyTitle} message={emptyMessage} />}
      contentContainerStyle={styles.contentContainer}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: Spacing.five,
  },
});
