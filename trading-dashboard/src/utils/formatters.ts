import { format, formatDistanceToNow, parseISO } from 'date-fns';

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

  date: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d, yyyy h:mm a');
  },

  dateShort: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d');
  },

  timeAgo: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  },

  scoreGrade: (score: number): { label: string; color: string } => {
    if (score >= 85) return { label: 'A', color: 'text-green-400' };
    if (score >= 75) return { label: 'B', color: 'text-blue-400' };
    if (score >= 65) return { label: 'C', color: 'text-yellow-400' };
    if (score >= 50) return { label: 'D', color: 'text-orange-400' };
    return { label: 'F', color: 'text-red-400' };
  },

  statusColor: (status: string): string => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-yellow-500/20 text-yellow-400',
      PROFIT: 'bg-green-500/20 text-green-400',
      'PARTIAL_PROFIT': 'bg-green-500/20 text-green-400',
      LOSS: 'bg-red-500/20 text-red-400',
      'PARTIAL_LOSS': 'bg-red-500/20 text-red-400',
      'BREAK_EVEN': 'bg-gray-500/20 text-gray-400',
      CLOSED: 'bg-gray-500/20 text-gray-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  },
};
