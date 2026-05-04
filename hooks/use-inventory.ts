import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface InventoryItem {
  id: string;
  name: string;
  scientific_name?: string;
  category?: string;
  dosage_form?: string;
  strength?: string;
  quantity: number;
  min_quantity: number;
  price: number;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
  status: 'active' | 'low' | 'repair';
  stock: number;
  minStock: number;
  unit: string;
  location?: string;
  lastMaintained?: string;
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from('drugs')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching inventory:', error);
      } else {
        const mappedData = data.map((item: any) => ({
          ...item,
          stock: item.quantity,
          minStock: item.min_quantity,
          unit: item.dosage_form || 'Unit',
          location: 'Main Pharmacy',
          lastMaintained: '2024-05-01',
          status: item.quantity <= item.min_quantity ? 'low' : 'active'
        }));
        setInventory(mappedData as InventoryItem[]);
      }
      setLoading(false);
    };

    fetchInventory();

    const channel = supabase
      .channel('public:drugs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drugs' }, () => {
        fetchInventory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('drugs')
        .insert([item]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return { inventory, loading, addItem };
}
