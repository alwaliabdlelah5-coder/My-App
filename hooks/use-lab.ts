import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface LabTest {
  id: string;
  test_name: string;
  category?: string;
  status: string;
  ordered_at: string;
  result?: string;
}

export function useLab() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      const { data, error } = await supabase
        .from('laboratory_tests')
        .select('*')
        .order('ordered_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching lab tests:', error);
      } else {
        setTests(data as LabTest[]);
      }
      setLoading(false);
    };

    fetchTests();

    const channel = supabase
      .channel('public:laboratory_tests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'laboratory_tests' }, () => {
        fetchTests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { tests, loading };
}
