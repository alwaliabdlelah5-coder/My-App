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

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  results?: any;
  requestedAt: any;
  completedAt?: any;
}

export function useLab() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = getFirebase();

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'lab_tests'),
      orderBy('requestedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LabTest[];
        setLabTests(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'lab_tests');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  const requestTest = async (data: Omit<LabTest, 'id' | 'requestedAt'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, 'lab_tests'), {
        ...data,
        requestedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'lab_tests');
    }
  };

  const updateResults = async (id: string, results: any) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'lab_tests', id);
      await updateDoc(docRef, { 
        results,
        status: 'completed',
        completedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `lab_tests/${id}`);
    }
  };

  return { labTests, loading, requestTest, updateResults };
}
