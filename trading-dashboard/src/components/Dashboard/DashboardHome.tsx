import React, { useMemo } from 'react';
import { useSignals } from '@/hooks/useSignals';
import { useStats } from '@/hooks/useStats';
import { useAuth } from '@/hooks/useAuth';
import { StatsCard } from './StatsCard';
import { WeeklyChart } from './WeeklyChart';
import { EmotionSelector } from './EmotionSelector';
import { LoadingSkeleton } from './LoadingSkeleton';
import { formatters } from '@/utils/formatters';
import { logger } from '@/utils/logger';
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor';

export const DashboardHome: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { activeSignals, resolvedSignals, loading: signalsLoading, error } = useSignals();
  const { stats, dailyStats } = useStats(activeSignals, resolvedSignals);

  logger.debug('DashboardHome rendered', {
    activeCount: activeSignals.length,
    resolvedCount: resolvedSignals.length,
  });

  const weeklyData = useMemo(() => {
    const today = new Date();
    const data = [] as Array<{ day: string; pnl: number }>;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayStat = dailyStats.find((daily) => new Date(daily.date).toDateString() === dateStr);
      data.push({
        day: date.getDate().toString(),
        pnl: dayStat?.pnl || 0,
      });
    }

    return data;
  }, [dailyStats]);

  if (authLoading || signalsLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading data</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 px-4 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <PerformanceMonitor componentName="DashboardHome">
      <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back{user?.displayName ? `, ${user.displayName}` : ''}</h1>
            <p className="text-gray-400 text-sm">Dashboard</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">Pro</button>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">Upgrade</button>
          </div>
        </div>

        <div className={`rounded-xl p-6 mb-6 transition-colors ${stats.totalPnl >= 0 ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}>
          <p className="text-sm text-gray-100">$ Total Gross P/L</p>
          <p className="text-3xl font-bold">{formatters.currency(stats.totalPnl)}</p>
          <p className="text-xs text-gray-200">All time</p>
          <div className="mt-2 flex gap-2">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">{stats.totalResolved} trades</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">{stats.winRate.toFixed(1)}% win rate</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="bg-gray-800 p-3 rounded-lg text-center text-sm hover:bg-gray-700 transition-colors">Mindset</button>
          <button className="bg-gray-800 p-3 rounded-lg text-center text-sm hover:bg-gray-700 transition-colors">Pre-Session</button>
          <button className="bg-gray-800 p-3 rounded-lg text-center text-sm hover:bg-gray-700 transition-colors">Post-Session</button>
        </div>

        <EmotionSelector />

        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm">Today - {new Date().toLocaleDateString()}</h3>
            <span className={`text-sm ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatters.currency(stats.totalPnl)}</span>
          </div>
          <p className="text-xs text-gray-400">From {stats.totalResolved} trades</p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-green-400">Wins: {stats.totalProfitable}</span>
            <span className="text-red-400">Losses: {stats.totalLosing}</span>
            <span className="text-yellow-400">BE: {stats.totalBreakEven}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Active: {stats.totalActive} | Avg Score: {stats.avgScore.toFixed(1)}</p>
        </div>

        <WeeklyChart data={weeklyData} />

        <div className="bg-gray-800 rounded-xl p-4 text-center mt-4">
          <p className="text-sm text-gray-400">{stats.totalActive > 0 ? `${stats.totalActive} active signal${stats.totalActive > 1 ? 's' : ''}` : 'No active signals'}</p>
          {stats.totalActive > 0 && <p className="text-xs text-blue-400 mt-1">Check Trades tab for details →</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <StatsCard label="P&L" value={formatters.currencyShort(stats.totalPnl)} className={stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'} />
          <StatsCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
          <StatsCard label="Active Signals" value={stats.totalActive.toString()} />
          <StatsCard label="Profit Factor" value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)} />
        </div>
      </div>
    </PerformanceMonitor>
  );
};
