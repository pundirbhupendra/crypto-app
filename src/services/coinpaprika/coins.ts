import { requestJson } from './client';
import { coinSchema } from './schemas';

export async function getCoins() {
  const response = await requestJson('/coins');
  return coinSchema.array().parse(response);
}

export async function getCoinById(coinId: string) {
  const response = await requestJson(`/coins/${encodeURIComponent(coinId)}`);
  return coinSchema.parse(response);
}
