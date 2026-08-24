import { z } from 'zod';

export const usdQuoteSchema = z
  .object({
    price: z.number().nullable().optional(),
    volume_24h: z.number().nullable().optional(),
    volume_24h_change_24h: z.number().nullable().optional(),
    market_cap: z.number().nullable().optional(),
    market_cap_change_24h: z.number().nullable().optional(),
    percent_change_15m: z.number().nullable().optional(),
    percent_change_30m: z.number().nullable().optional(),
    percent_change_1h: z.number().nullable().optional(),
    percent_change_6h: z.number().nullable().optional(),
    percent_change_12h: z.number().nullable().optional(),
    percent_change_24h: z.number().nullable().optional(),
    percent_change_7d: z.number().nullable().optional(),
    percent_change_30d: z.number().nullable().optional(),
  })
  .passthrough();

export const tickerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    rank: z.number().nullable().optional(),
    circulating_supply: z.number().nullable().optional(),
    total_supply: z.number().nullable().optional(),
    max_supply: z.number().nullable().optional(),
    last_updated: z.string().nullable().optional(),
    quotes: z.object({
      USD: usdQuoteSchema,
    }),
  })
  .passthrough();

export const tickersSchema = z.array(tickerSchema);

export const coinTagSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .passthrough();

export const coinSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    rank: z.number().nullable().optional(),
    is_active: z.boolean().optional(),
    type: z.string().optional(),
    logo: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    tags: z.array(coinTagSchema).nullable().optional(),
    started_at: z.string().nullable().optional(),
    development_status: z.string().nullable().optional(),
    proof_type: z.string().nullable().optional(),
    org_structure: z.string().nullable().optional(),
  })
  .passthrough();
