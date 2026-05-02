'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  where
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface Drug {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  stock: number;
  expiry: string;
  price: string;
  isNearingExpiry: boolean;
  brandNames: string[];
}

export function usePharmacy() {
  const [inventory, setInventory] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'drugs'),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Drug[];
        setInventory(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'drugs');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  const addDrug = async (data: Omit<Drug, 'id'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, 'drugs'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'drugs');
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'drugs', id);
      await updateDoc(docRef, { 
        stock: newStock,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `drugs/${id}`);
    }
  };

  return { inventory, loading, addDrug, updateStock };
}
