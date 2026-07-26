import { useMemo } from 'react';
import { TradeSignal, DashboardStats, DailyStats } from '../types';

export function useStats(activeSignals: TradeSignal[], resolvedSignals: TradeSignal[]) {
  const stats = useMemo<DashboardStats>(() => {
    const allResolved = resolvedSignals.filter(s => s.status !== 'ACTIVE');
    const profitable = allResolved.filter(s => s.status === 'PROFIT' || s.status === 'PARTIAL_PROFIT');
    const losing = allResolved.filter(s => s.status === 'LOSS' || s.status === 'PARTIAL_LOSS');
    const breakEven = allResolved.filter(s => s.status === 'BREAK_EVEN');
    
    const totalPnl = allResolved.reduce((sum, s) => sum + (s.pnl || 0), 0);
    const totalProfit = profitable.reduce((sum, s) => sum + (s.pnl || 0), 0);
    const totalLoss = losing.reduce((sum, s) => sum + Math.abs(s.pnl || 0), 0);
    const winRate = allResolved.length > 0 ? (profitable.length / allResolved.length) * 100 : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
    const avgScore = allResolved.length > 0 ? allResolved.reduce((sum, s) => sum + (s.total_score || 0), 0) / allResolved.length : 0;

    return {
      totalActive: activeSignals.length,
      totalResolved: allResolved.length,
      totalProfitable: profitable.length,
      totalLosing: losing.length,
      totalBreakEven: breakEven.length,
      totalPnl,
      winRate,
      profitFactor,
      avgScore,
    };
  }, [activeSignals, resolvedSignals]);

  const dailyStats = useMemo<DailyStats[]>(() => {
    const map = new Map<string, DailyStats>();
    resolvedSignals.forEach(s => {
      const date = s.exit_time ? new Date(s.exit_time).toDateString() : s.resolved_at ? new Date(s.resolved_at).toDateString() : new Date().toDateString();
      if (!map.has(date)) { map.set(date, { date, pnl: 0, trades: 0, wins: 0, losses: 0 }); }
      const daily = map.get(date)!;
      daily.pnl += s.pnl || 0;
      daily.trades += 1;
      if ((s.pnl || 0) > 0) daily.wins += 1;
      if ((s.pnl || 0) < 0) daily.losses += 1;
    });
    return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [resolvedSignals]);

  return { stats, dailyStats };
}