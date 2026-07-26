import React, { useState } from 'react';
import { logger } from '@/utils/logger';

const emotions = [
  { label: 'Stressed', emoji: '😰', color: 'hover:bg-red-500/20' },
  { label: 'Worried', emoji: '😟', color: 'hover:bg-orange-500/20' },
  { label: 'Neutral', emoji: '😐', color: 'hover:bg-gray-500/20' },
  { label: 'Calm', emoji: '😌', color: 'hover:bg-green-500/20' },
  { label: 'Sharp', emoji: '⚡', color: 'hover:bg-blue-500/20' },
] as const;

type Emotion = (typeof emotions)[number]['label'];

export const EmotionSelector: React.FC = () => {
  const [selected, setSelected] = useState<Emotion | null>(null);

  const handleSelect = (emotion: Emotion) => {
    setSelected(emotion);
    logger.info('Emotion selected', { emotion });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6">
      <h3 className="text-sm text-gray-400 mb-3">How are you feeling?</h3>
      <div className="grid grid-cols-5 gap-2">
        {emotions.map(({ label, emoji, color }) => (
          <button
            key={label}
            onClick={() => handleSelect(label)}
            className={`p-2 rounded-lg text-xs transition-all ${selected === label ? 'bg-blue-600 text-white' : `bg-gray-700 text-gray-300 ${color}`}`}
          >
            <div className="text-lg">{emoji}</div>
            <div className="mt-1">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
