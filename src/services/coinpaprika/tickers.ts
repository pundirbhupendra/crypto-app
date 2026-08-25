import { requestJson } from './client';
import { tickerSchema, tickersSchema } from './schemas';

export async function getTickers() {
  const response = await requestJson('/tickers?quotes=USD');

  return tickersSchema.parse(response);
}

export async function getTickerById(coinId: string) {
  const response = await requestJson(`/tickers/${encodeURIComponent(coinId)}?quotes=USD`);

  return tickerSchema.parse(response);
}
