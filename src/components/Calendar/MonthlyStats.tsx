import { useSignals } from '@/hooks/useSignals';
import { useStats } from '@/hooks/useStats';

export const MonthlyStats = () => {
  const { activeSignals, resolvedSignals } = useSignals();
  const { stats } = useStats(activeSignals, resolvedSignals);

  const items = [
    { label: 'P&L', value: `$${(stats.totalPnl / 1000).toFixed(1)}K`, color: stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400' },
    { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%`, color: stats.winRate >= 50 ? 'text-green-400' : 'text-yellow-400' },
    { label: 'Trades', value: stats.totalResolved, color: 'text-blue-400' },
    { label: 'Active', value: stats.totalActive, color: 'text-yellow-400' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="text-sm text-gray-400 mb-3">Your Month</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => (
          <div key={index} className="text-center">
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};