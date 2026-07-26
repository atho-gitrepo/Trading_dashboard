import { useState, useEffect, useCallback, useRef } from 'react';
import { TradeSignal } from '../types';
import { firebaseQueries } from '../firebase/queries';

export function useSignals() {
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
      (signals: TradeSignal[]) => {
        setActiveSignals(signals);
        setLoading(false);
      },
      (err: Error) => {
        setError(err);
        setLoading(false);
      }
    );
    unsubscribesRef.current.push(unsubscribeActive);

    const unsubscribeResolved = firebaseQueries.subscribeResolvedSignals(
      (signals: TradeSignal[]) => {
        setResolvedSignals(signals);
      },
      (err: Error) => {
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

  return { activeSignals, resolvedSignals, loading, error, refresh };
}