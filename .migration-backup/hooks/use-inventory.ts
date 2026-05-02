import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export function useInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  useEffect(() => {
    if (!db) return;

    try {
      const q = query(collection(db, 'drugs'), orderBy('name', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        setInventory(data);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'drugs');
      });

      return () => unsubscribe();
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'drugs');
    }
  }, [db]);

  return { inventory, loading };
}
