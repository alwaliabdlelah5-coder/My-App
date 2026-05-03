import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface Drug {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  stock: number;
  expiry: string;
  price: string;
  brandNames: string[];
  isNearingExpiry?: boolean;
}

export function usePharmacy() {
  const [inventory, setInventory] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'drugs'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Drug[];
      setInventory(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'drugs');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const updateStock = async (id: string, newStock: number) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'drugs', id), { stock: newStock });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `drugs/${id}`);
    }
  };

  return { inventory, loading, updateStock };
}
