'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: any;
  method: 'cash' | 'card' | 'transfer';
  referenceId?: string; // e.g. Patient ID or Invoice ID
}

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'finance'),
      orderBy('date', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        setTransactions(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'finance');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'date'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, 'finance'), {
        ...data,
        date: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'finance');
    }
  };

  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income: totalIncome,
      expense: totalExpense,
      net: totalIncome - totalExpense
    };
  };

  return { transactions, loading, addTransaction, getStats };
}
