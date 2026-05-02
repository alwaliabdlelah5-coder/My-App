'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  where,
  deleteDoc
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface QueueItem {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  priority: number;
  entryTime: any;
  startTime?: any;
  endTime?: any;
}

export function useQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'queue'),
      orderBy('priority', 'desc'),
      orderBy('entryTime', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QueueItem[];
        setQueue(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'queue');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  const addToQueue = async (data: Omit<QueueItem, 'id' | 'entryTime'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, 'queue'), {
        ...data,
        entryTime: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'queue');
    }
  };

  const updateQueueStatus = async (id: string, status: QueueItem['status']) => {
    if (!db) return;
    const updates: any = { status };
    if (status === 'in_progress') updates.startTime = serverTimestamp();
    if (status === 'completed') updates.endTime = serverTimestamp();
    
    try {
      const docRef = doc(db, 'queue', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `queue/${id}`);
    }
  };

  return { queue, loading, addToQueue, updateQueueStatus };
}
