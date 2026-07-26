import React from 'react';
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor';

export const SuperTraderScore: React.FC = () => {
  return (
    <PerformanceMonitor componentName="SuperTraderScore">
      <div className="min-h-screen bg-gray-950 p-4 text-white pb-20">
        <h2 className="text-2xl font-semibold mb-4">Super Trader Score</h2>
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 p-6">
          <p className="text-sm uppercase tracking-[0.2em]">Current score</p>
          <p className="mt-3 text-5xl font-bold">92</p>
          <p className="mt-2 text-sm">Consistency and discipline are trending upward.</p>
        </div>
      </div>
    </PerformanceMonitor>
  );
};
