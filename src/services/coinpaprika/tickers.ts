import { coinpaprikaClient } from './client';
import { tickerSchema, tickersSchema } from './schemas';

export async function getTickers() {
  const response = await coinpaprikaClient.get('/tickers', {
    params: { quotes: 'USD' },
  });

  return tickersSchema.parse(response.data);
}

export async function getTickerById(coinId: string) {
  const response = await coinpaprikaClient.get(`/tickers/${coinId}`, {
    params: { quotes: 'USD' },
  });

  return tickerSchema.parse(response.data);
}
