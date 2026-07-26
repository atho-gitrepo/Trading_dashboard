import { useSignals } from '../../hooks/useSignals';
import { useStats } from '../../hooks/useStats';

export const SuperTraderScore = () => {
  const { activeSignals, resolvedSignals } = useSignals();
  const { stats } = useStats(activeSignals, resolvedSignals);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-2">SuperTrader Score</h1>
      <p className="text-gray-400 text-sm mb-6">Your win rate, discipline, and consistency — one number.</p>

      <div className="bg-gray-800 rounded-xl p-6 text-center mb-6">
        <p className="text-5xl font-bold text-blue-400">{stats.avgScore.toFixed(1)}</p>
        <p className="text-gray-400 mt-2">{stats.totalResolved} trades • {stats.winRate.toFixed(1)}% win rate</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.winRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-400">Win Rate</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Profit Factor</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.totalActive}</p>
          <p className="text-xs text-gray-400">Active</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.totalResolved}</p>
          <p className="text-xs text-gray-400">Total Trades</p>
        </div>
      </div>
    </div>
  );
};