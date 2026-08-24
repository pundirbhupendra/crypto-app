const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const smallPriceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 6,
});

export function formatCurrency(value?: number | null) {
  if (typeof value !== 'number') {
    return '--';
  }

  return Math.abs(value) < 1 ? smallPriceFormatter.format(value) : priceFormatter.format(value);
}

export function formatCompactNumber(value?: number | null) {
  if (typeof value !== 'number') {
    return '--';
  }

  return compactNumberFormatter.format(value);
}

export function formatPercent(value?: number | null) {
  if (typeof value !== 'number') {
    return '--';
  }

  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
