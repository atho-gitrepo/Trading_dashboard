import { db } from './config';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { TradeSignal } from '../types';

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

  subscribeActiveSignals(onUpdate: (signals: TradeSignal[]) => void, onError: (error: Error) => void): () => void {
    const q = query(collection(db, ACTIVE_COLLECTION), where('status', '==', 'ACTIVE'), orderBy('entry_time', 'desc'));

    return onSnapshot(q, {
      next: (snapshot) => {
        const signals = snapshot.docs.map(doc => ({ doc_id: doc.id, ...doc.data(), isActive: true })) as TradeSignal[];
        onUpdate(signals);
      },
      error: onError,
    });
  }

  subscribeResolvedSignals(onUpdate: (signals: TradeSignal[]) => void, onError: (error: Error) => void): () => void {
    const q = query(collection(db, RESOLVED_COLLECTION), orderBy('resolved_at', 'desc'), limit(100));

    return onSnapshot(q, {
      next: (snapshot) => {
        const signals = snapshot.docs.map(doc => ({ doc_id: doc.id, ...doc.data(), isActive: false })) as TradeSignal[];
        onUpdate(signals);
      },
      error: onError,
    });
  }
}

export const firebaseQueries = FirebaseQueries.getInstance();