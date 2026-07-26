import React from 'react';
import { TradeSignal } from '@/types';
import { formatters } from '@/utils/formatters';

interface TradeCardProps {
  signal: TradeSignal & { isActive?: boolean };
}

export const TradeCard: React.FC<TradeCardProps> = ({ signal }) => {
  const isPositive = (signal.pnl || 0) >= 0;
  const isActive = signal.status === 'ACTIVE' || signal.isActive;

  const getStatusColor = () => {
    if (isActive) return 'bg-yellow-500/20 text-yellow-400';
    if (signal.status === 'PROFIT' || signal.status === 'PARTIAL_PROFIT') return 'bg-green-500/20 text-green-400';
    if (signal.status === 'LOSS' || signal.status === 'PARTIAL_LOSS') return 'bg-red-500/20 text-red-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border-l-4 border-l-transparent relative">
      {isActive && (
        <div className="absolute -top-1 right-3">
          <span className="text-xs px-2 py-0.5 bg-yellow-500/30 text-yellow-400 rounded-full">
            ACTIVE
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold">{signal.symbol}</span>
            <span className={`text-xs px-2 py-1 rounded ${
              signal.signal_type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {signal.signal_type}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor()}`}>
              {signal.status}
            </span>
            {(signal.total_score || 0) > 0 && (
              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                Score: {signal.total_score}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
            <span>Entry: ${signal.entry_price.toFixed(2)}</span>
            <span>SL: ${signal.stop_loss.toFixed(2)}</span>
            <span>TP: ${signal.take_profit.toFixed(2)}</span>
            {signal.exit_price && <span>Exit: ${signal.exit_price.toFixed(2)}</span>}
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            {formatters.date(signal.entry_time)}
            {signal.exit_time && ` → ${formatters.date(signal.exit_time)}`}
          </p>
        </div>
        
        <div className="text-right ml-4">
          {signal.pnl !== undefined && (
            <div>
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
    </div>
  );
};