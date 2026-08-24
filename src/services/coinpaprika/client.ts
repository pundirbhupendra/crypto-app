import { create, isAxiosError } from 'axios';

export const coinpaprikaClient = create({
  baseURL: 'https://api.coinpaprika.com/v1',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

export function getApiErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (error.response?.status === 429) {
      return 'CoinPaprika rate limit reached. Please try again later.';
    }
    if (error.response?.status) {
      return `CoinPaprika request failed (${error.response.status}).`;
    }
    if (error.code === 'ECONNABORTED') {
      return 'CoinPaprika request timed out.';
    }
  }

  return 'Unable to load market data. Check your connection and try again.';
}
