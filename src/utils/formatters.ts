export const formatters = {
  currency: (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },

  currencyShort: (value: number): string => {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) {
      return `${value >= 0 ? '+' : '-'}$${(abs / 1_000_000).toFixed(1)}M`;
    }
    if (abs >= 1_000) {
      return `${value >= 0 ? '+' : '-'}$${(abs / 1_000).toFixed(1)}K`;
    }
    return formatters.currency(value);
  },

  percent: (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  },
};