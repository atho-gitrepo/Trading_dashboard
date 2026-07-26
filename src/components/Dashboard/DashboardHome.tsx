import { useSignals } from '../../hooks/useSignals';
import { useStats } from '../../hooks/useStats';
import { useAuth } from '../../hooks/useAuth';
import { StatsCard } from './StatsCard';
import { WeeklyChart } from './WeeklyChart';
import { EmotionSelector } from './EmotionSelector';
import { LoadingSkeleton } from './LoadingSkeleton';
import { formatters } from '../../utils/formatters';

export const DashboardHome = () => {
  const { user, loading: authLoading } = useAuth();
  const { activeSignals, resolvedSignals, loading: signalsLoading, error } = useSignals();
  const { stats, dailyStats } = useStats(activeSignals, resolvedSignals);

  const weeklyData = dailyStats.slice(-7).map((d: { date: string; pnl: number }) => ({
    day: new Date(d.date).getDate().toString(),
    pnl: d.pnl,
  }));

  if (authLoading || signalsLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading data</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome{user?.displayName ? `, ${user.displayName}` : ''}</h1>
          <p className="text-gray-400 text-sm">Dashboard</p>
        </div>
      </div>

      <div className={`rounded-xl p-6 mb-6 ${
        stats.totalPnl >= 0 ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'
      }`}>
        <p className="text-sm text-gray-100">Total P/L</p>
        <p className="text-3xl font-bold">{formatters.currency(stats.totalPnl)}</p>
        <div className="mt-2 flex gap-2">
          <span className="text-xs bg-black/20 px-2 py-1 rounded">{stats.totalResolved} trades</span>
          <span className="text-xs bg-black/20 px-2 py-1 rounded">{stats.winRate.toFixed(1)}% win rate</span>
        </div>
      </div>

      <EmotionSelector />

      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm">Today</h3>
          <span className={`text-sm ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatters.currency(stats.totalPnl)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">From {stats.totalResolved} trades</p>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="text-green-400">Wins: {stats.totalProfitable}</span>
          <span className="text-red-400">Losses: {stats.totalLosing}</span>
          <span className="text-yellow-400">BE: {stats.totalBreakEven}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Active: {stats.totalActive} | Avg Score: {stats.avgScore.toFixed(1)}</p>
      </div>

      <WeeklyChart data={weeklyData} />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <StatsCard 
          label="P&L" 
          value={formatters.currencyShort(stats.totalPnl)} 
          className={stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}
        />
        <StatsCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
        <StatsCard label="Active" value={stats.totalActive.toString()} />
        <StatsCard label="Profit Factor" value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)} />
      </div>
    </div>
  );
};