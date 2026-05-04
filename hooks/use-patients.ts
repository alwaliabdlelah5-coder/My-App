import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface Patient {
  id: string;
  fileNumber: string;
  name: string;
  phone: string;
  email?: string;
  gender: string;
  birthDate: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching patients:', error);
      } else {
        const mappedData = data.map((p: any) => ({
          ...p,
          name: `${p.first_name} ${p.last_name}`,
          birthDate: p.date_of_birth,
          phone: p.phone || '',
          fileNumber: p.id.slice(0, 8).toUpperCase(), // Mocking file number from ID if not in DB
          status: 'active' as const
        }));
        setPatients(mappedData as Patient[]);
      }
      setLoading(false);
    };

    fetchPatients();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchPatients();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addPatient = async (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('patients')
        .insert([data]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return { patients, loading, addPatient };
}
