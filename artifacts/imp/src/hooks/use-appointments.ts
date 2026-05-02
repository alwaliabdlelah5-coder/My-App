import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName: string;
  date: string;
  startTime: string;
  duration?: number;
  type: string;
  status: 'confirmed' | 'waiting' | 'cancelled' | 'completed';
  createdAt?: any;
}

export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    try {
      let q = query(collection(db, 'appointments'), orderBy('startTime', 'asc'));
      if (date) {
        q = query(collection(db, 'appointments'), where('date', '==', date), orderBy('startTime', 'asc'));
      }
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
        setAppointments(data);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'appointments');
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
      setLoading(false);
    }
  }, [db, date]);

  const addAppointment = async (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'appointments'), { ...data, status: 'confirmed', createdAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  return { appointments, loading, addAppointment, updateAppointmentStatus };
}
