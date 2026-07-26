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
  Firestore,
} from 'firebase/firestore';
import { TradeSignal } from '@/types';
import { logger } from '@/utils/logger';

const ACTIVE_COLLECTION = 'active_signals';
const RESOLVED_COLLECTION = 'resolved_signals';

export class FirebaseQueries {
  private static instance: FirebaseQueries;
  private db: Firestore;

  private constructor() {
    this.db = db;
  }

  static getInstance(): FirebaseQueries {
    if (!FirebaseQueries.instance) {
      FirebaseQueries.instance = new FirebaseQueries();
    }
    return FirebaseQueries.instance;
  }

  /**
   * Subscribe to active signals with real-time updates
   * Uses onSnapshot for efficient real-time updates
   */
  subscribeActiveSignals(
    onUpdate: (signals: TradeSignal[]) => void,
    onError: (error: Error) => void
  ): () => void {
    const q = query(
      collection(this.db, ACTIVE_COLLECTION),
      where('status', '==', 'ACTIVE'),
      orderBy('entry_time', 'desc')
    );

    logger.debug('Subscribing to active signals');

    return onSnapshot(q, {
      next: (snapshot) => {
        const signals = snapshot.docs.map(doc => ({
          doc_id: doc.id,
          ...doc.data(),
          isActive: true,
        })) as TradeSignal[];
        
        logger.debug(`Received ${signals.length} active signals`);
        onUpdate(signals);
      },
      error: (error) => {
        logger.error('Error in active signals subscription', error);
        onError(error);
      },
    });
  }

  /**
   * Subscribe to resolved signals with real-time updates
   * Limited to last 100 signals for performance
   */
  subscribeResolvedSignals(
    onUpdate: (signals: TradeSignal[]) => void,
    onError: (error: Error) => void
  ): () => void {
    const q = query(
      collection(this.db, RESOLVED_COLLECTION),
      orderBy('resolved_at', 'desc'),
      limit(100)
    );

    logger.debug('Subscribing to resolved signals');

    return onSnapshot(q, {
      next: (snapshot) => {
        const signals = snapshot.docs.map(doc => ({
          doc_id: doc.id,
          ...doc.data(),
          isActive: false,
        })) as TradeSignal[];
        
        logger.debug(`Received ${signals.length} resolved signals`);
        onUpdate(signals);
      },
      error: (error) => {
        logger.error('Error in resolved signals subscription', error);
        onError(error);
      },
    });
  }

  /**
   * Get a single signal by ID (from either collection)
   */
  async getSignalById(id: string): Promise<TradeSignal | null> {
    logger.debug(`Fetching signal by ID: ${id}`);
    
    try {
      // Check active first
      const activeDoc = await getDoc(doc(this.db, ACTIVE_COLLECTION, id));
      if (activeDoc.exists()) {
        return { doc_id: id, ...activeDoc.data(), isActive: true } as TradeSignal;
      }

      // Check resolved
      const resolvedDoc = await getDoc(doc(this.db, RESOLVED_COLLECTION, id));
      if (resolvedDoc.exists()) {
        return { doc_id: id, ...resolvedDoc.data(), isActive: false } as TradeSignal;
      }

      return null;
    } catch (error) {
      logger.error(`Failed to fetch signal ${id}`, error);
      return null;
    }
  }

  /**
   * Get signals by score threshold (client-side filtering for performance)
   */
  async getSignalsByScore(minScore: number): Promise<TradeSignal[]> {
    logger.debug(`Fetching signals with score >= ${minScore}`);
    
    try {
      const q = query(
        collection(this.db, ACTIVE_COLLECTION),
        where('status', '==', 'ACTIVE')
      );

      const snapshot = await getDocs(q);
      const signals: TradeSignal[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if ((data.total_score || 0) >= minScore) {
          signals.push({
            doc_id: doc.id,
            ...data,
            isActive: true,
          } as TradeSignal);
        }
      });

      logger.debug(`Found ${signals.length} signals with score >= ${minScore}`);
      return signals.sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
    } catch (error) {
      logger.error('Failed to fetch signals by score', error);
      return [];
    }
  }
}

export const firebaseQueries = FirebaseQueries.getInstance();