import { useState, useEffect, useCallback, useRef } from 'react';
import { TradeSignal } from '@/types';
import { firebaseQueries } from '@/firebase/queries';
import { logger } from '@/utils/logger';

interface UseSignalsResult {
  activeSignals: TradeSignal[];
  resolvedSignals: TradeSignal[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useSignals(): UseSignalsResult {
  const [activeSignals, setActiveSignals] = useState<TradeSignal[]>([]);
  const [resolvedSignals, setResolvedSignals] = useState<TradeSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribesRef = useRef<(() => void)[]>([]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    
    unsubscribesRef.current.forEach(unsubscribe => unsubscribe());
    unsubscribesRef.current = [];

    const unsubscribeActive = firebaseQueries.subscribeActiveSignals(
      (signals) => {
        setActiveSignals(signals);
        setLoading(false);
        logger.debug(`Active signals updated: ${signals.length}`);
      },
      (err) => {
        logger.error('Active signals subscription error', err);
        setError(err);
        setLoading(false);
      }
    );
    unsubscribesRef.current.push(unsubscribeActive);

    const unsubscribeResolved = firebaseQueries.subscribeResolvedSignals(
      (signals) => {
        setResolvedSignals(signals);
        logger.debug(`Resolved signals updated: ${signals.length}`);
      },
      (err) => {
        logger.error('Resolved signals subscription error', err);
        setError(err);
      }
    );
    unsubscribesRef.current.push(unsubscribeResolved);
  }, []);

  useEffect(() => {
    refresh();
    return () => {
      unsubscribesRef.current.forEach(unsubscribe => unsubscribe());
    };
  }, [refresh]);

  return {
    activeSignals,
    resolvedSignals,
    loading,
    error,
    refresh,
  };
}