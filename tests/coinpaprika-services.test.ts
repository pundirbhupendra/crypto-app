import { getTickers } from '@/services/coinpaprika/tickers';

describe('CoinPaprika services', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches and validates ticker responses', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'btc-bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            rank: 1,
            quotes: { USD: { price: 100 } },
          },
        ]),
        { status: 200 }
      )
    );

    await expect(getTickers()).resolves.toMatchObject([{ id: 'btc-bitcoin', symbol: 'BTC' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.coinpaprika.com/v1/tickers?quotes=USD',
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
  });

  it('rejects non-success responses before parsing', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 429 }));

    await expect(getTickers()).rejects.toMatchObject({ status: 429 });
  });
});