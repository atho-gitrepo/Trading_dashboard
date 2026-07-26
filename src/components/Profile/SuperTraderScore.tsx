import React from 'react';
import { useSignals } from '@/hooks/useSignals';
import { useStats } from '@/hooks/useStats';

export const SuperTraderScore: React.FC = () => {
  const { activeSignals, resolvedSignals } = useSignals();
  const { stats } = useStats(activeSignals, resolvedSignals);

  const getScoreLabel = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-green-400' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-400' };
    if (score >= 65) return { label: 'Fair', color: 'text-yellow-400' };
    if (score >= 50) return { label: 'Needs Work', color: 'text-orange-400' };
    return { label: 'Improving', color: 'text-red-400' };
  };

  const scoreInfo = getScoreLabel(stats.avgScore);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-2">SuperTrader Score</h1>
      <p className="text-gray-400 text-sm mb-6">
        Your win rate, discipline, and consistency — one number.
      </p>

      <div className="bg-gray-800 rounded-xl p-6 text-center mb-6">
        <p className="text-5xl font-bold text-blue-400">{stats.avgScore.toFixed(1)}</p>
        <p className={`text-lg ${scoreInfo.color} mt-2`}>{scoreInfo.label}</p>
        <div className="flex justify-center gap-4 mt-3 text-sm text-gray-400">
          <span>{stats.totalResolved} trades</span>
          <span>{stats.winRate.toFixed(1)}% win rate</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.winRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-400">Win Rate</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">Profit Factor</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.totalActive}</p>
          <p className="text-xs text-gray-400">Active Signals</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.totalResolved}</p>
          <p className="text-xs text-gray-400">Total Trades</p>
        </div>
      </div>
    </div>
  );
};