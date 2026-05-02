import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface Transaction {
  id: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  method: 'cash' | 'card' | 'transfer';
  date: any;
  createdAt: any;
}

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  useEffect(() => {
    if (!db) return;

    try {
      const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        setTransactions(data);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'transactions');
      });

      return () => unsubscribe();
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
    }
  }, [db]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'date' | 'createdAt'>) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'transactions'), {
        ...data,
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
    }
  };

  const getStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      net: income - expense
    };
  };

  return { transactions, loading, addTransaction, getStats };
}
