import { coinpaprikaClient } from './client';
import { coinSchema } from './schemas';

export async function getCoinById(coinId: string) {
  const response = await coinpaprikaClient.get(`/coins/${coinId}`);
  return coinSchema.parse(response.data);
}
