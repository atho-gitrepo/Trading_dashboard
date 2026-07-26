import { db } from './config';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { TradeSignal } from '@/types';
import { logger } from '@/utils/logger';

const ACTIVE_COLLECTION = 'active_signals';
const RESOLVED_COLLECTION = 'resolved_signals';

export class FirebaseQueries {
  private static instance: FirebaseQueries;

  private constructor() {}

  static getInstance(): FirebaseQueries {
    if (!FirebaseQueries.instance) {
      FirebaseQueries.instance = new FirebaseQueries();
    }
    return FirebaseQueries.instance;
  }

  subscribeActiveSignals(
    onUpdate: (signals: TradeSignal[]) => void,
    onError: (error: Error) => void
  ): () => void {
    const q = query(
      collection(db, ACTIVE_COLLECTION),
      where('status', '==', 'ACTIVE'),
      orderBy('entry_time', 'desc')
    );

    return onSnapshot(q, {
      next: (snapshot) => {
        const signals = snapshot.docs.map(doc => ({
          doc_id: doc.id,
          ...doc.data(),
          isActive: true,
        })) as TradeSignal[];
        onUpdate(signals);
      },
      error: (error) => {
        logger.error('Active signals subscription error', error);
        onError(error);
      },
    });
  }

  subscribeResolvedSignals(
    onUpdate: (signals: TradeSignal[]) => void,
    onError: (error: Error) => void
  ): () => void {
    const q = query(
      collection(db, RESOLVED_COLLECTION),
      orderBy('resolved_at', 'desc'),
      limit(100)
    );

    return onSnapshot(q, {
      next: (snapshot) => {
        const signals = snapshot.docs.map(doc => ({
          doc_id: doc.id,
          ...doc.data(),
          isActive: false,
        })) as TradeSignal[];
        onUpdate(signals);
      },
      error: (error) => {
        logger.error('Resolved signals subscription error', error);
        onError(error);
      },
    });
  }
}

export const firebaseQueries = FirebaseQueries.getInstance();