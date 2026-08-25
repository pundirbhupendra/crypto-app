import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { MarketTicker } from '@/services/coinpaprika/types';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { toggleWatchlist } from '@/state/watchlist/watchlist-slice';
import { formatCompactNumber, formatCurrency, formatPercent } from '@/utils/format';

export function CoinRow({ ticker }: { ticker: MarketTicker }) {
  const dispatch = useAppDispatch();
  const isWatchlisted = useAppSelector((state) => state.watchlist.watchlistIds.includes(ticker.id));
  const quote = ticker.quotes.USD;
  const change = quote.percent_change_24h ?? 0;
  const isPositive = change >= 0;

  return (
    <Link href={{ pathname: '/coin/[id]', params: { id: ticker.id } } as unknown as Href} asChild>
      <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={styles.rankBadge}>
          <ThemedText type="code">#{ticker.rank ?? '-'}</ThemedText>
        </View>

        <View style={styles.identity}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {ticker.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {ticker.symbol}
          </ThemedText>
        </View>

        <View style={styles.marketData}>
          <ThemedText type="smallBold" style={styles.alignRight}>
            {formatCurrency(quote.price)}
          </ThemedText>
          <ThemedText type="small" style={[styles.alignRight, isPositive ? styles.positive : styles.negative]}>
            {formatPercent(change)}
          </ThemedText>
          <ThemedText type="code" themeColor="textSecondary" style={styles.alignRight}>
            MC {formatCompactNumber(quote.market_cap)}
          </ThemedText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
          onPress={(event) => {
            event.stopPropagation();
            dispatch(toggleWatchlist(ticker.id));
          }}
          style={({ pressed }) => [styles.watchButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold">{isWatchlisted ? 'Saved' : 'Save'}</ThemedText>
        </Pressable>
      </Pressable>
    </Link>
  );
}

export function CoinRowSeparator() {
  return <ThemedView type="backgroundElement" style={styles.separator} />;
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 76,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.72,
  },
  rankBadge: {
    alignItems: 'center',
    borderRadius: Spacing.two,
    justifyContent: 'center',
    minWidth: 46,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  identity: {
    flex: 1,
    minWidth: 0,
  },
  marketData: {
    alignItems: 'flex-end',
    minWidth: 112,
  },
  alignRight: {
    textAlign: 'right',
  },
  positive: {
    color: '#168A4A',
  },
  negative: {
    color: '#C2413B',
  },
  watchButton: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
