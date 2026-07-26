import React from 'react';
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor';

export const TradesList: React.FC = () => {
  return (
    <PerformanceMonitor componentName="TradesList">
      <div className="min-h-screen bg-gray-950 p-4 text-white pb-20">
        <h2 className="text-2xl font-semibold mb-4">Trades</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">EUR/USD #{item}</span>
                <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">PROFIT</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">Confidence 82% · 1:2 risk/reward</p>
            </div>
          ))}
        </div>
      </div>
    </PerformanceMonitor>
  );
};
