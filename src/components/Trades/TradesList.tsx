import React, { useState } from 'react';
import { useSignals } from '@/hooks/useSignals';
import { useStats } from '@/hooks/useStats';
import { TradeCard } from './TradeCard';
import { TradeFilters } from './TradeFilters';
import { formatters } from '@/utils/formatters';

export const TradesList: React.FC = () => {
  const { activeSignals, resolvedSignals, loading } = useSignals();
  const { stats } = useStats(activeSignals, resolvedSignals);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Winners' | 'Losers' | 'BreakEven'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const allSignals = React.useMemo(() => {
    const active = activeSignals.map(s => ({ ...s, isActive: true }));
    const resolved = resolvedSignals.map(s => ({ ...s, isActive: false }));
    return [...active, ...resolved];
  }, [activeSignals, resolvedSignals]);

  const filteredSignals = React.useMemo(() => {
    let signals = allSignals;

    switch (filter) {
      case 'Active':
        signals = signals.filter(s => s.isActive);
        break;
      case 'Winners':
        signals = signals.filter(s => (s.pnl || 0) > 0);
        break;
      case 'Losers':
        signals = signals.filter(s => (s.pnl || 0) < 0);
        break;
      case 'BreakEven':
        signals = signals.filter(s => (s.pnl || 0) === 0);
        break;
      default:
        break;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      signals = signals.filter(s => 
        s.symbol.toLowerCase().includes(term) ||
        s.doc_id.toLowerCase().includes(term)
      );
    }

    return signals.sort((a, b) => {
      const timeA = new Date(a.entry_time || 0).getTime();
      const timeB = new Date(b.entry_time || 0).getTime();
      return timeB - timeA;
    });
  }, [allSignals, filter, searchTerm]);

  const counts = {
    total: allSignals.length,
    active: allSignals.filter(s => s.isActive).length,
    winners: allSignals.filter(s => (s.pnl || 0) > 0).length,
    losers: allSignals.filter(s => (s.pnl || 0) < 0).length,
    breakEven: allSignals.filter(s => (s.pnl || 0) === 0).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trades</h1>
        <span className="text-sm text-gray-400">{allSignals.length} signals</span>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search trades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-lg pl-10"
        />
        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
      </div>

      <TradeFilters activeFilter={filter} onFilterChange={setFilter} counts={counts} />

      <div className="space-y-3">
        {filteredSignals.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">No signals found</p>
          </div>
        ) : (
          filteredSignals.map((signal) => (
            <TradeCard key={signal.doc_id} signal={signal} />
          ))
        )}
      </div>
    </div>
  );
};