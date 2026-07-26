import { useState } from 'react';

const emotions = ['😰 Stressed', '😟 Worried', '😐 Neutral', '😌 Calm', '⚡ Sharp'];

export const EmotionSelector = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6">
      <h3 className="text-sm text-gray-400 mb-3">How are you feeling?</h3>
      <div className="grid grid-cols-5 gap-2">
        {emotions.map((emotion) => (
          <button
            key={emotion}
            onClick={() => setSelected(emotion)}
            className={`p-2 rounded-lg text-xs transition-all ${
              selected === emotion ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {emotion}
          </button>
        ))}
      </div>
    </div>
  );
};