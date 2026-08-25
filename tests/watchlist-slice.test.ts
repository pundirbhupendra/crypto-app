import { hydrateWatchlist, toggleWatchlist, watchlistReducer } from '@/state/watchlist/watchlist-slice';

describe('watchlistReducer', () => {
  it('adds and removes a coin without storing server data', () => {
    const added = watchlistReducer(undefined, toggleWatchlist('btc-bitcoin'));
    const removed = watchlistReducer(added, toggleWatchlist('btc-bitcoin'));

    expect(added.watchlistIds).toEqual(['btc-bitcoin']);
    expect(removed.watchlistIds).toEqual([]);
  });

  it('hydrates only the persisted client-state payload', () => {
    const state = watchlistReducer(undefined, hydrateWatchlist(['btc-bitcoin', 'eth-ethereum']));

    expect(state.watchlistIds).toEqual(['btc-bitcoin', 'eth-ethereum']);
  });
});