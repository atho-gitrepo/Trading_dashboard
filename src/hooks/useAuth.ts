import { useState, useEffect } from 'react';
import { auth } from '@/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { logger } from '@/utils/logger';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      logger.debug(`Auth state changed: ${user ? 'Signed in' : 'Signed out'}`);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}