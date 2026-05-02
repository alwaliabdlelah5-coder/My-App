'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

export function FirebaseSeeder() {
  const [seeding, setSeeding] = useState(false);
  const [complete, setComplete] = useState(false);
  const db = getDb();

  useEffect(() => {
    async function checkAndSeed() {
      if (!db) return;

      try {
        const patientsSnap = await getDocs(collection(db, 'patients'));
        if (patientsSnap.empty) {
          setSeeding(true);
          const batch = writeBatch(db);

          // Seed Patients
          const patients = [
            { name: 'عبدالعزيز العتيبي', fileNumber: 'P-1001', phone: '0501234567', status: 'active', gender: 'male', birthDate: '1985-05-20' },
            { name: 'مريم الصنعاني', fileNumber: 'P-1002', phone: '0559876543', status: 'active', gender: 'female', birthDate: '1992-11-12' },
            { name: 'ياسين منصور', fileNumber: 'P-1003', phone: '0562233445', status: 'active', gender: 'male', birthDate: '1978-08-05' }
          ];

          patients.forEach(p => {
            const ref = doc(collection(db, 'patients'));
            batch.set(ref, { ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          });

          // Seed Drugs
          const drugs = [
            { name: 'Augmentin 625mg', scientificName: 'Amoxicillin/Clavulanate', category: 'Antibiotic', stock: 50, price: '4500 ر.ي', expiry: '2025-12-01' },
            { name: 'Panadol Advance', scientificName: 'Paracetamol', category: 'Analgesic', stock: 120, price: '1200 ر.ي', expiry: '2026-06-15' },
            { name: 'Lipitor 20mg', scientificName: 'Atorvastatin', category: 'Statins', stock: 30, price: '8900 ر.ي', expiry: '2025-09-20' }
          ];

          drugs.forEach(d => {
            const ref = doc(collection(db, 'drugs'));
            batch.set(ref, d);
          });

          // Seed Appointments
          const appointments = [
            { patientName: 'عبدالعزيز العتيبي', patientId: 'mock-1', doctorName: 'د. خالد محمد', date: new Date().toISOString().split('T')[0], startTime: '09:00', status: 'waiting', type: 'كشف عام' },
            { patientName: 'سناء علي عبد الله', patientId: 'mock-2', doctorName: 'د. سارة أحمد', date: new Date().toISOString().split('T')[0], startTime: '10:30', status: 'confirmed', type: 'استشارة قلبية' }
          ];

          appointments.forEach(a => {
            const ref = doc(collection(db, 'appointments'));
            batch.set(ref, { ...a, createdAt: serverTimestamp() });
          });

          // Seed Transactions
          const txs = [
            { description: 'كشف مريض - عبدالعزيز العتيبي', type: 'income', amount: 5000, category: 'Consultation', method: 'cash', date: new Date().toISOString() },
            { description: 'شراء لوازم مخبرية', type: 'expense', amount: 12500, category: 'Supplies', method: 'transfer', date: new Date().toISOString() }
          ];

          txs.forEach(t => {
            const ref = doc(collection(db, 'transactions'));
            batch.set(ref, { ...t, createdAt: serverTimestamp() });
          });

          await batch.commit();
          setComplete(true);
        }
      } catch (error) {
        console.error("Seeding error:", error);
      } finally {
        setSeeding(false);
      }
    }

    checkAndSeed();
  }, [db]);

  if (seeding) return <div className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-2xl shadow-2xl z-50 font-black animate-bounce">Planting Seed Data...</div>;
  if (complete) return <div className="fixed bottom-4 right-4 bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl z-50 font-black transition-all">Database Seeded Successfully!</div>;
  
  return null;
}
