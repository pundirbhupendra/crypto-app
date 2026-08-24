import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Screen } from '@/components/ui/screen';
import { StateView } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { queryKeys } from '@/lib/query/query-keys';
import { getApiErrorMessage } from '@/services/coinpaprika/client';
import { getCoinById } from '@/services/coinpaprika/coins';
import { getTickerById } from '@/services/coinpaprika/tickers';
import { useWatchlistStore } from '@/state/watchlist-store';
import { formatCompactNumber, formatCurrency, formatPercent } from '@/utils/format';

export function CoinDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const coinId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isWatchlisted = useWatchlistStore((state) => (coinId ? state.isWatchlisted(coinId) : false));
  const toggleWatchlist = useWatchlistStore((state) => state.toggleWatchlist);

  const tickerQuery = useQuery({
    queryKey: queryKeys.ticker(coinId ?? ''),
    queryFn: () => getTickerById(coinId ?? ''),
    enabled: Boolean(coinId),
  });

  const coinQuery = useQuery({
    queryKey: queryKeys.coin(coinId ?? ''),
    queryFn: () => getCoinById(coinId ?? ''),
    enabled: Boolean(coinId),
  });

  const ticker = tickerQuery.data;
  const coin = coinQuery.data;
  const quote = ticker?.quotes.USD;

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold">Back</ThemedText>
        </Pressable>
        {coinId ? (
          <Pressable
            onPress={() => toggleWatchlist(coinId)}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold">{isWatchlisted ? 'Saved' : 'Save'}</ThemedText>
          </Pressable>
        ) : null}
      </View>

      {!coinId ? (
        <StateView title="Coin not found" message="Open a coin from Markets, Search, or Watchlist." />
      ) : tickerQuery.isLoading || coinQuery.isLoading ? (
        <StateView title="Loading coin" message="Fetching price and project details." />
      ) : tickerQuery.isError || coinQuery.isError ? (
        <StateView
          title="Coin unavailable"
          message={getApiErrorMessage(tickerQuery.error ?? coinQuery.error)}
          actionLabel="Try again"
          onAction={() => {
            tickerQuery.refetch();
            coinQuery.refetch();
          }}
        />
      ) : ticker && coin && quote ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle">{coin.name}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {coin.symbol} {coin.rank ? `#${coin.rank}` : ''}
            </ThemedText>
            <ThemedText type="title" style={styles.price}>
              {formatCurrency(quote.price)}
            </ThemedText>
            <ThemedText style={(quote.percent_change_24h ?? 0) >= 0 ? styles.positive : styles.negative}>
              {formatPercent(quote.percent_change_24h)} over 24h
            </ThemedText>
          </ThemedView>

          <View style={styles.statsGrid}>
            <StatCard label="Market cap" value={formatCompactNumber(quote.market_cap)} />
            <StatCard label="Volume 24h" value={formatCompactNumber(quote.volume_24h)} />
            <StatCard label="Circulating" value={formatCompactNumber(ticker.circulating_supply)} />
            <StatCard label="Total supply" value={formatCompactNumber(ticker.total_supply)} />
          </View>

          <ThemedView type="backgroundElement" style={styles.section}>
            <ThemedText type="smallBold">About</ThemedText>
            <ThemedText themeColor="textSecondary">
              {coin.description?.trim() || 'CoinPaprika does not provide a description for this asset yet.'}
            </ThemedText>
          </ThemedView>

          {coin.tags?.length ? (
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="smallBold">Tags</ThemedText>
              <View style={styles.tags}>
                {coin.tags.slice(0, 8).map((tag) => (
                  <ThemedView key={tag.id} style={styles.tag}>
                    <ThemedText type="code">{tag.name}</ThemedText>
                  </ThemedView>
                ))}
              </View>
            </ThemedView>
          ) : null}
        </ScrollView>
      ) : null}
    </Screen>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.statCard}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Spacing.three,
  },
  navButton: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  header: {
    gap: Spacing.one,
  },
  price: {
    fontSize: 40,
    lineHeight: 46,
    marginTop: Spacing.two,
  },
  positive: {
    color: '#168A4A',
  },
  negative: {
    color: '#C2413B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statCard: {
    borderRadius: Spacing.three,
    flexBasis: '48%',
    flexGrow: 1,
    gap: Spacing.one,
    padding: Spacing.three,
  },
  section: {
    borderRadius: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tag: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
});
