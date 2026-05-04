import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  duration: number;
  type: string;
  status: 'confirmed' | 'waiting' | 'cancelled' | 'completed';
  createdAt?: string;
}

export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients (first_name, last_name)
        `)
        .order('appointment_date', { ascending: true });
      
      if (date) {
        // Handle date filtering in SQL if possible, or filter in JS
        // For simplicity, let's filter in JS if complex, but let's try SQL
        query = query.gte('appointment_date', `${date}T00:00:00Z`).lte('appointment_date', `${date}T23:59:59Z`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        const mappedData = data.map((a: any) => ({
          ...a,
          patientName: a.patients ? `${a.patients.first_name} ${a.patients.last_name}` : 'Unknown',
          date: new Date(a.appointment_date).toISOString().split('T')[0],
          startTime: new Date(a.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          duration: 30, // Default duration
          doctorName: 'General Doctor' // Default doctor name
        }));
        setAppointments(mappedData as Appointment[]);
      }
      setLoading(false);
    };

    fetchAppointments();

    const channel = supabase
      .channel('public:appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date]);

  const addAppointment = async (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{ ...data, status: 'confirmed' }]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return { appointments, loading, addAppointment, updateAppointmentStatus };
}
