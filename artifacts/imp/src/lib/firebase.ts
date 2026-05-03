import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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

let authReadyResolve: (uid: string | null) => void;
export const authReady: Promise<string | null> = new Promise((resolve) => {
  authReadyResolve = resolve;
});

const getInstances = () => {
  if (typeof window === 'undefined') return { db: null, auth: null };
  if (!app) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      auth = getAuth(app);

      onAuthStateChanged(auth, (user) => {
        if (user) {
          authReadyResolve(user.uid);
        } else {
          signInAnonymously(auth!).catch((err) => {
            console.error('Anonymous sign-in failed:', err);
            authReadyResolve(null);
          });
        }
      });
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      authReadyResolve(null);
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
