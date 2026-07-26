interface TradeFiltersProps {
  activeFilter: 'All' | 'Active' | 'Winners' | 'Losers' | 'BreakEven';
  onFilterChange: (filter: 'All' | 'Active' | 'Winners' | 'Losers' | 'BreakEven') => void;
  counts: { total: number; active: number; winners: number; losers: number; breakEven: number };
}

export const TradeFilters = ({ activeFilter, onFilterChange, counts }: TradeFiltersProps) => {
  const filters = [
    { key: 'All' as const, label: 'All', count: counts.total },
    { key: 'Active' as const, label: 'Active', count: counts.active },
    { key: 'Winners' as const, label: 'Winners', count: counts.winners },
    { key: 'Losers' as const, label: 'Losers', count: counts.losers },
    { key: 'BreakEven' as const, label: 'BE', count: counts.breakEven },
  ];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
            activeFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
};