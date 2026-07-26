import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, className = 'text-white' }) => {
  return (
    <div className="bg-gray-800 p-3 rounded-lg">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-lg font-semibold ${className}`}>{value}</p>
    </div>
  );
};
