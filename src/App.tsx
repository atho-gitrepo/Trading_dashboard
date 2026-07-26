import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { TradesList } from './components/Trades/TradesList';
import { CalendarView } from './components/Calendar/CalendarView';
import { SuperTraderScore } from './components/Profile/SuperTraderScore';
import { BottomNav } from './components/Navigation/BottomNav';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="relative min-h-screen bg-gray-950">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/trades" element={<TradesList />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/profile" element={<SuperTraderScore />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;