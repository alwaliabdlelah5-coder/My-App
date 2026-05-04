import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

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

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from('drugs')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching pharmacy inventory:', error);
      } else {
        const mappedData = data.map((item: any) => ({
          ...item,
          scientificName: item.scientific_name,
          stock: item.quantity,
          expiry: item.expiry_date,
          price: `${item.price || 0} ر.ي`,
          brandNames: item.brand_names || [],
          isNearingExpiry: item.is_nearing_expiry
        }));
        setInventory(mappedData as Drug[]);
      }
      setLoading(false);
    };

    fetchInventory();

    const channel = supabase
      .channel('public:drugs_pharmacy')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drugs' }, () => {
        fetchInventory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStock = async (id: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('drugs')
        .update({ quantity: newStock })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return { inventory, loading, updateStock };
}
