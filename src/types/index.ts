export interface TradeSignal {
  doc_id: string;
  symbol: string;
  signal_type: 'BUY' | 'SELL';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  confidence: number;
  status: string;
  entry_time: string;
  exit_time?: string;
  timestamp: string;
  updated_at: string;
  total_score?: number;
  component_scores?: Record<string, number>;
  bb_position?: number;
  volume_ratio?: number;
  tdi_zone?: string;
  exit_price?: number;
  pnl?: number;
  pnl_percent?: number;
  resolved_at?: string;
  isActive?: boolean;
}

export interface DashboardStats {
  totalActive: number;
  totalResolved: number;
  totalProfitable: number;
  totalLosing: number;
  totalBreakEven: number;
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  avgScore: number;
}

export interface DailyStats {
  date: string;
  pnl: number;
  trades: number;
  wins: number;
  losses: number;
}