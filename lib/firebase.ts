import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore as getFirestoreInstance } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

let authInstance: any = null;
let dbInstance: any = null;

export const getFirebaseAuth = () => {
  if (typeof window === 'undefined') return null;
  
  if (!authInstance) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
  }
  return authInstance;
};

export const getFirestore = () => {
  if (typeof window === 'undefined') return null;

  if (!dbInstance) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Using firestoreDatabaseId from config if available as per instructions
    dbInstance = getFirestoreInstance(app, (firebaseConfig as any).firestoreDatabaseId);
  }
  return dbInstance;
};

export const getAuthInstance = getFirebaseAuth;
export const getDb = getFirestore;
