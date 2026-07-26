import { useState } from 'react';
import { useSignals } from '../../hooks/useSignals';
import { formatters } from '../../utils/formatters';

const TradeCard = ({ signal }: any) => {
  const isPositive = (signal.pnl || 0) >= 0;
  const isActive = signal.status === 'ACTIVE' || signal.isActive;

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold">{signal.symbol}</span>
            <span className={`text-xs px-2 py-1 rounded ${signal.signal_type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {signal.signal_type}
            </span>
            {isActive && <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">ACTIVE</span>}
            {(signal.total_score || 0) > 0 && <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">Score: {signal.total_score}</span>}
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
            <span>Entry: ${signal.entry_price.toFixed(2)}</span>
            <span>SL: ${signal.stop_loss.toFixed(2)}</span>
            <span>TP: ${signal.take_profit.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{new Date(signal.entry_time).toLocaleString()}</p>
        </div>
        {signal.pnl !== undefined && (
          <div className="text-right">
            <p className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{formatters.currency(signal.pnl)}
            </p>
            <p className={`text-xs ${isPositive ? 'text-green-400/60' : 'text-red-400/60'}`}>
              {formatters.percent(signal.pnl_percent || 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TradeFilters = ({ activeFilter, onFilterChange, counts }: any) => {
  const filters = [
    { key: 'All', label: 'All', count: counts.total },
    { key: 'Active', label: 'Active', count: counts.active },
    { key: 'Winners', label: 'Winners', count: counts.winners },
    { key: 'Losers', label: 'Losers', count: counts.losers },
    { key: 'BreakEven', label: 'BE', count: counts.breakEven },
  ];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {filters.map(({ key, label, count }) => (
        <button key={key} onClick={() => onFilterChange(key)}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${activeFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
          {label} ({count})
        </button>
      ))}
    </div>
  );
};

export const TradesList = () => {
  const { activeSignals, resolvedSignals, loading } = useSignals();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const allSignals = [...activeSignals.map(s => ({ ...s, isActive: true })), ...resolvedSignals.map(s => ({ ...s, isActive: false }))];

  const filteredSignals = allSignals
    .filter((s) => {
      if (filter === 'Active') return s.isActive;
      if (filter === 'Winners') return (s.pnl || 0) > 0;
      if (filter === 'Losers') return (s.pnl || 0) < 0;
      if (filter === 'BreakEven') return (s.pnl || 0) === 0;
      return true;
    })
    .filter((s) => s.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime());

  const counts = {
    total: allSignals.length,
    active: allSignals.filter(s => s.isActive).length,
    winners: allSignals.filter(s => (s.pnl || 0) > 0).length,
    losers: allSignals.filter(s => (s.pnl || 0) < 0).length,
    breakEven: allSignals.filter(s => (s.pnl || 0) === 0).length,
  };

  if (loading) return <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trades</h1>
        <span className="text-sm text-gray-400">{allSignals.length} signals</span>
      </div>

      <div className="relative mb-4">
        <input type="text" placeholder="Search trades..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-lg pl-10" />
        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
      </div>

      <TradeFilters activeFilter={filter} onFilterChange={setFilter} counts={counts} />

      <div className="space-y-3">
        {filteredSignals.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center"><p className="text-gray-400">No signals found</p></div>
        ) : (
          filteredSignals.map((signal) => <TradeCard key={signal.doc_id} signal={signal} />)
        )}
      </div>
    </div>
  );
};