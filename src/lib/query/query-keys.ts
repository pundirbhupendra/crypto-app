export const queryKeys = {
  tickers: ['tickers'] as const,
  ticker: (coinId: string) => ['ticker', coinId] as const,
  coin: (coinId: string) => ['coin', coinId] as const,
};
