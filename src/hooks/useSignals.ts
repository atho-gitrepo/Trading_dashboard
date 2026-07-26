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
    
    // Clear existing subscriptions
    unsubscribesRef.current.forEach(unsubscribe => unsubscribe());
    unsubscribesRef.current = [];

    // Subscribe to active signals
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

    // Subscribe to resolved signals
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

    // Cleanup subscriptions on unmount
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