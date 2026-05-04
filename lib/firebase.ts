import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore as getFirestoreInstance } from 'firebase/firestore';

let authInstance: any = null;
let dbInstance: any = null;

export const getFirebaseAuth = () => {
  if (typeof window === 'undefined') return null;
  
  if (!authInstance) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    if (!firebaseConfig.apiKey) {
      return null;
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
  }
  return authInstance;
};

export const getFirestore = () => {
  if (typeof window === 'undefined') return null;

  if (!dbInstance) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    if (!firebaseConfig.apiKey) return null;

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestoreInstance(app);
  }
  return dbInstance;
};

export const getAuthInstance = getFirebaseAuth;
export const getDb = getFirestore;
