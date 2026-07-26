import { create } from 'zustand';
import { TradeSignal } from '@/types';
import { logger } from '@/utils/logger';

interface SignalStore {
  activeSignals: TradeSignal[];
  resolvedSignals: TradeSignal[];
  setActiveSignals: (signals: TradeSignal[]) => void;
  setResolvedSignals: (signals: TradeSignal[]) => void;
  clear: () => void;
}

export const useSignalStore = create<SignalStore>((set) => ({
  activeSignals: [],
  resolvedSignals: [],
  setActiveSignals: (signals) => {
    logger.debug(`Updating active signals: ${signals.length}`);
    set({ activeSignals: signals });
  },
  setResolvedSignals: (signals) => {
    logger.debug(`Updating resolved signals: ${signals.length}`);
    set({ resolvedSignals: signals });
  },
  clear: () => {
    set({ activeSignals: [], resolvedSignals: [] });
  },
}));
