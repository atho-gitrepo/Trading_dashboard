export interface TradeSignal {
  doc_id: string;
  symbol: string;
  signal_type: 'BUY' | 'SELL';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  confidence: number;
  status: 'ACTIVE' | 'PROFIT' | 'LOSS' | 'CLOSED' | 'PARTIAL_PROFIT' | 'PARTIAL_LOSS' | 'BREAK_EVEN';
  entry_time: string;
  exit_time?: string;
  timestamp: string;
  updated_at: string;
  total_score?: number;
  component_scores?: Record<string, number>;
  bb_position?: number;
  volume_ratio?: number;
  tdi_zone?: string;
  tdi_zone_standardized?: string;
  strategy_version?: string;
  exit_price?: number;
  pnl?: number;
  pnl_percent?: number;
  fees?: number;
  bars_held?: number;
  age_minutes?: number;
  resolved_at?: string;
  original_doc_id?: string;
  rejection_reason?: string;
  isActive?: boolean;
}

export interface DashboardStats {
  totalActive: number;
  totalResolved: number;
  totalProfitable: number;
  totalLosing: number;
  totalBreakEven: number;
  totalHighScore: number;
  totalMediumScore: number;
  totalLowScore: number;
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

export interface EmotionState {
  feeling: 'Stressed' | 'Worried' | 'Neutral' | 'Calm' | 'Sharp';
  timestamp: Date;
  userId: string;
}

export interface FilterState {
  type: 'All' | 'Active' | 'Winners' | 'Losers' | 'BreakEven';
  search: string;
  sortBy: 'date' | 'pnl' | 'score';
  sortOrder: 'asc' | 'desc';
}
