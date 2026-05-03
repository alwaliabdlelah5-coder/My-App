import { useState, useEffect, useRef } from 'react';

export interface QueueItem {
  id: string;
  patientId?: string;
  patientName: string;
  doctorName?: string;
  type?: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  priority: number | string;
  startTime?: any;
  createdAt: any;
}

const API_BASE = '/api';

export function useQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const url = `${API_BASE}/queue/events`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener('snapshot', (e) => {
      const data = JSON.parse((e as MessageEvent).data) as QueueItem[];
      setQueue(data);
      setLoading(false);
    });

    es.addEventListener('added', (e) => {
      const item = JSON.parse((e as MessageEvent).data) as QueueItem;
      setQueue((prev) => [...prev, item]);
    });

    es.addEventListener('updated', (e) => {
      const updated = JSON.parse((e as MessageEvent).data) as QueueItem;
      setQueue((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    });

    es.addEventListener('deleted', (e) => {
      const { id } = JSON.parse((e as MessageEvent).data);
      setQueue((prev) => prev.filter((item) => item.id !== id));
    });

    es.onerror = () => {
      setLoading(false);
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);

  const addToQueue = async (data: Omit<QueueItem, 'id' | 'createdAt' | 'status'>) => {
    const res = await fetch(`${API_BASE}/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add to queue');
  };

  const updateQueueStatus = async (id: string, status: QueueItem['status']) => {
    const res = await fetch(`${API_BASE}/queue/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update queue status');
  };

  return { queue, loading, addToQueue, updateQueueStatus };
}
