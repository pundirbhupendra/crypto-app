const API_BASE_URL = 'https://api.coinpaprika.com/v1';
const REQUEST_TIMEOUT_MS = 15000;

export class CoinPaprikaRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'CoinPaprikaRequestError';
  }
}

export async function requestJson(path: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new CoinPaprikaRequestError(`CoinPaprika request failed (${response.status}).`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CoinPaprikaRequestError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new CoinPaprikaRequestError('CoinPaprika request timed out.', undefined, 'TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof CoinPaprikaRequestError) {
    if (error.status === 429) {
      return 'CoinPaprika rate limit reached. Please try again later.';
    }
    if (error.code === 'TIMEOUT') {
      return 'CoinPaprika request timed out.';
    }
    if (error.status) {
      return `CoinPaprika request failed (${error.status}).`;
    }
  }

  return 'Unable to load market data. Check your connection and try again.';
}
