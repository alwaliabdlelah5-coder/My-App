import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface QueueItem {
  id: string;
  patientId?: string;
  patientName: string;
  doctorName?: string;
  type: string;
  status: 'waiting' | 'in_consultation' | 'finished' | 'cancelled';
  priority: number;
  arrival_time?: string;
}

export function useQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      const { data, error } = await supabase
        .from('clinic_queue')
        .select(`
          *,
          patients (name)
        `)
        .order('arrival_time', { ascending: true });
      
      if (error) {
        console.error('Error fetching queue:', error);
      } else {
        // Map data if needed
        const mappedData = data.map((item: any) => ({
          ...item,
          patientName: item.patients?.name || 'Unknown'
        }));
        setQueue(mappedData as QueueItem[]);
      }
      setLoading(false);
    };

    fetchQueue();

    const channel = supabase
      .channel('public:clinic_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_queue' }, () => {
        fetchQueue();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addToQueue = async (data: Omit<QueueItem, 'id' | 'arrival_time' | 'status'>) => {
    try {
      const { error } = await supabase
        .from('clinic_queue')
        .insert([{
          patient_id: data.patientId,
          status: 'waiting',
          priority: data.priority || 0
        }]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  const updateQueueStatus = async (id: string, status: QueueItem['status']) => {
    try {
      const { error } = await supabase
        .from('clinic_queue')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  return { queue, loading, addToQueue, updateQueueStatus };
}
