import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Patient } from './use-patients';

export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const db = getDb();

  useEffect(() => {
    if (!db || !id) return;

    const unsubscribe = onSnapshot(doc(db, 'patients', id), (snapshot) => {
      if (snapshot.exists()) {
        setPatient({ id: snapshot.id, ...snapshot.data() } as Patient);
      } else {
        setPatient(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `patients/${id}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, id]);

  return { patient, loading };
}
