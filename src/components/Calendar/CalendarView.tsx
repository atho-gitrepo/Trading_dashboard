import React from 'react';
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor';

export const CalendarView: React.FC = () => {
  return (
    <PerformanceMonitor componentName="CalendarView">
      <div className="min-h-screen bg-gray-950 p-4 text-white pb-20">
        <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
        <div className="rounded-xl bg-gray-900 p-4">Daily trade calendar placeholder</div>
      </div>
    </PerformanceMonitor>
  );
};
