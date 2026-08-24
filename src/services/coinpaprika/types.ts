import { z } from 'zod';

import { coinSchema, tickerSchema, tickersSchema, usdQuoteSchema } from './schemas';

export type UsdQuote = z.infer<typeof usdQuoteSchema>;
export type MarketTicker = z.infer<typeof tickerSchema>;
export type MarketTickers = z.infer<typeof tickersSchema>;
export type CoinDetails = z.infer<typeof coinSchema>;
