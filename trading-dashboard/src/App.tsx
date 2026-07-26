import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardHome } from '@/components/Dashboard/DashboardHome';
import { TradesList } from '@/components/Trades/TradesList';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { SuperTraderScore } from '@/components/Profile/SuperTraderScore';
import { BottomNav } from '@/components/Navigation/BottomNav';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/trades" element={<TradesList />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/profile" element={<SuperTraderScore />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
