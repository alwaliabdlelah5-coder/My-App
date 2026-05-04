import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface Transaction {
  id: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  method: 'cash' | 'card' | 'transfer';
  transaction_date: string;
  created_at: string;
}

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data as Transaction[]);
      }
      setLoading(false);
    };

    fetchTransactions();

    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'transaction_date' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([data]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const getStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return {
      income,
      expense,
      net: income - expense
    };
  };

  return { transactions, loading, addTransaction, getStats };
}
