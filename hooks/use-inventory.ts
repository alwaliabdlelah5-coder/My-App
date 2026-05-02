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
  orderBy
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  pricePerUnit: number;
  lastRestocked?: any;
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'inventory'),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as InventoryItem[];
        setItems(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inventory');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'inventory', id);
      await updateDoc(docRef, { 
        quantity: newQuantity,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inventory/${id}`);
    }
  };

  const addItem = async (data: Omit<InventoryItem, 'id'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, 'inventory'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inventory');
    }
  };

  return { items, loading, updateQuantity, addItem };
}
