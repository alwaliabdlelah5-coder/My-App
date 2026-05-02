import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

interface FirebaseConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId: string;
}

import rawConfig from '../firebase-applet-config.json';
const firebaseConfig = rawConfig as FirebaseConfig;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

const getInstances = () => {
  if (typeof window === 'undefined') return { db: null, auth: null };
  if (!app) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      auth = getAuth(app);
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }
  return { db, auth };
};

export const getDb = () => getInstances().db;
export const getAuthInstance = () => getInstances().auth;

export function getFirebase() {
  const { db, auth } = getInstances();
  return { db, auth, isMock: !db };
}
