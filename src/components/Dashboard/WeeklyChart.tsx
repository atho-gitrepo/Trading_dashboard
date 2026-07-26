import React from 'react';
import { formatters } from '@/utils/formatters';

interface WeeklyData {
  day: string;
  pnl: number;
}

interface WeeklyChartProps {
  data: WeeklyData[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const maxPnl = React.useMemo(() => {
    const max = Math.max(...data.map(d => Math.abs(d.pnl)));
    return max > 0 ? max : 1;
  }, [data]);

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm">This Week</h3>
        {data.some(d => d.pnl !== 0) && <span className="text-xs text-gray-400">P&L by day</span>}
      </div>
      <div className="flex justify-between items-end h-32 gap-1">
        {data.map((item, index) => {
          const height = Math.abs(item.pnl) / maxPnl * 100;
          const isPositive = item.pnl >= 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full max-w-[32px] rounded-t transition-all duration-300 ${
                  isPositive ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  height: `${Math.max(height, 4)}%`,
                  minHeight: '4px'
                }}
              />
              <span className="text-xs text-gray-400 mt-1">{item.day}</span>
              {item.pnl !== 0 && (
                <span className={`text-[10px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {formatters.currencyShort(item.pnl)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};