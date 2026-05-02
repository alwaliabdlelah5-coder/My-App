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

export interface Patient {
  id: string;
  fileNumber: string;
  name: string;
  phone: string;
  email?: string;
  gender: string;
  age: number;
  lastVisit?: string;
  status: 'active' | 'inactive';
  createdAt?: any;
  updatedAt?: any;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'patients'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const patientsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Patient[];
        setPatients(patientsList);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'patients');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, 'patients'), {
        ...patientData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'patients');
    }
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'patients', id);
      await updateDoc(docRef, {
        ...patientData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `patients/${id}`);
    }
  };

  return { patients, loading, addPatient, updatePatient };
}

export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db || !id) return;

    const unsubscribe = onSnapshot(doc(db, 'patients', id), 
      (docSnap) => {
        if (docSnap.exists()) {
          setPatient({ id: docSnap.id, ...docSnap.data() } as Patient);
        } else {
          setPatient(null);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `patients/${id}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, id]);

  return { patient, loading };
}
