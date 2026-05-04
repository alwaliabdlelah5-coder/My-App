import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Patient } from './use-patients';

export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching patient:', error);
        setPatient(null);
      } else {
        setPatient(data as Patient);
      }
      setLoading(false);
    };

    fetchPatient();

    const channel = supabase
      .channel(`public:patients:id=${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'patients',
        filter: `id=eq.${id}`
      }, () => {
        fetchPatient();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { patient, loading };
}
