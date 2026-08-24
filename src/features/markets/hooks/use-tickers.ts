import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query/query-keys';
import { getTickers } from '@/services/coinpaprika/tickers';

export function useTickers() {
  return useQuery({
    queryKey: queryKeys.tickers,
    queryFn: getTickers,
  });
}
