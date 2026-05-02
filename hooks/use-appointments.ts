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
  where
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

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
  createdAt?: any;
}

export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db) return;

    let q = query(
      collection(db, 'appointments'),
      orderBy('startTime', 'asc')
    );

    if (date) {
      q = query(
        collection(db, 'appointments'),
        where('date', '==', date),
        orderBy('startTime', 'asc')
      );
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        setAppointments(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'appointments');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, date]);

  const addAppointment = async (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'appointments', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  return { appointments, loading, addAppointment, updateAppointmentStatus };
}
