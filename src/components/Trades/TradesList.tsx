import { useState } from 'react';
import { useSignals } from '@/hooks/useSignals';
import { TradeCard } from './TradeCard';
import { TradeFilters } from './TradeFilters';

export const TradesList = () => {
  const { activeSignals, resolvedSignals, loading } = useSignals();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Winners' | 'Losers' | 'BreakEven'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const allSignals = [...activeSignals.map(s => ({ ...s, isActive: true })), ...resolvedSignals.map(s => ({ ...s, isActive: false }))];

  const filteredSignals = allSignals
    .filter(s => {
      if (filter === 'Active') return s.isActive;
      if (filter === 'Winners') return (s.pnl || 0) > 0;
      if (filter === 'Losers') return (s.pnl || 0) < 0;
      if (filter === 'BreakEven') return (s.pnl || 0) === 0;
      return true;
    })
    .filter(s => s.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime());

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
          filteredSignals.map((signal) => <TradeCard key={signal.doc_id} signal={signal} />)
        )}
      </div>
    </div>
  );
};