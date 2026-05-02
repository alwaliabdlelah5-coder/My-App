import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

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

export function useQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    try {
      const q = query(collection(db, 'queue'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QueueItem[];
        setQueue(data);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'queue');
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'queue');
      setLoading(false);
    }
  }, [db]);

  const addToQueue = async (data: Omit<QueueItem, 'id' | 'createdAt' | 'status'>) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'queue'), { ...data, status: 'waiting', createdAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'queue');
    }
  };

  const updateQueueStatus = async (id: string, status: QueueItem['status']) => {
    if (!db) return;
    try {
      const updateData: any = { status };
      if (status === 'in_progress') updateData.startTime = serverTimestamp();
      await updateDoc(doc(db, 'queue', id), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `queue/${id}`);
    }
  };

  return { queue, loading, addToQueue, updateQueueStatus };
}
