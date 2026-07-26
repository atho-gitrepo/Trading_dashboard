import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-7 w-32 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-800 rounded mt-1 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-16 bg-gray-800 rounded animate-pulse" />
          <div className="h-9 w-16 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-32 bg-gray-800 rounded-xl mb-6 animate-pulse" />
      <div className="h-24 bg-gray-800 rounded-xl mb-6 animate-pulse" />
      <div className="h-28 bg-gray-800 rounded-xl mb-6 animate-pulse" />
      <div className="h-40 bg-gray-800 rounded-xl mb-4 animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
};
