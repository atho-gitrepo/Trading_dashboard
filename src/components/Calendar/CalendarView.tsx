import { useState } from 'react';
import { useSignals } from '../../hooks/useSignals';
import { useStats } from '../../hooks/useStats';

export const CalendarView = () => {
  const { activeSignals, resolvedSignals } = useSignals();
  const { dailyStats } = useStats(activeSignals, resolvedSignals);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getDayPnl = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const stat = dailyStats.find((d) => new Date(d.date).toDateString() === date.toDateString());
    return stat?.pnl || 0;
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) { days.push(<div key={`empty-${i}`} className="p-2" />); }

    for (let day = 1; day <= daysInMonth; day++) {
      const pnl = getDayPnl(day);
      days.push(
        <div key={day} className={`p-2 text-center rounded-lg ${pnl !== 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
          <div className="text-sm">{day}</div>
          {pnl !== 0 && <div className={`text-xs ${pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>{pnl > 0 ? '+' : ''}{(pnl / 1000).toFixed(1)}K</div>}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else { setCurrentMonth(currentMonth - 1); } }}
            className="p-2 hover:bg-gray-700 rounded-lg">←</button>
          <h2 className="text-lg font-semibold">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</h2>
          <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else { setCurrentMonth(currentMonth + 1); } }}
            className="p-2 hover:bg-gray-700 rounded-lg">→</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-center">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
      </div>
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="text-sm text-gray-400 mb-3">Your Month</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center"><p className="text-lg font-bold text-green-400">$0K</p><p className="text-xs text-gray-400">P&L</p></div>
          <div className="text-center"><p className="text-lg font-bold text-blue-400">0%</p><p className="text-xs text-gray-400">Win Rate</p></div>
          <div className="text-center"><p className="text-lg font-bold text-purple-400">0</p><p className="text-xs text-gray-400">Trades</p></div>
          <div className="text-center"><p className="text-lg font-bold text-yellow-400">0</p><p className="text-xs text-gray-400">Active</p></div>
        </div>
      </div>
    </div>
  );
};