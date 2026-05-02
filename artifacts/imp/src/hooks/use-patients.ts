import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export interface Patient {
  id: string;
  fileNumber: string;
  name: string;
  phone: string;
  email?: string;
  gender: string;
  age?: number;
  birthDate?: string;
  lastVisit?: string;
  status: 'active' | 'inactive';
  createdAt?: any;
  updatedAt?: any;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    try {
      const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Patient[];
        setPatients(data);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'patients');
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'patients');
      setLoading(false);
    }
  }, [db]);

  const addPatient = async (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'patients'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'patients');
    }
  };

  return { patients, loading, addPatient };
}
