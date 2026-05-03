import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, onAuthStateChanged } from 'firebase/auth';

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
/**
 * Resolves with the signed-in user's UID once Firebase Auth reports a
 * non-anonymous, real user.  Components that need auth before running
 * (e.g. FirebaseSeeder) should await this promise.
 *
 * The promise intentionally does NOT resolve until a real user signs in,
 * so it remains pending while the login page is displayed.  When the user
 * completes the login flow, Firebase fires onAuthStateChanged, this promise
 * resolves, and any awaiting code proceeds with a valid auth session.
 */
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
          // Resolve once a real authenticated user is present.
          authReadyResolve(user.uid);
        }
        // When user is null (signed out), we do nothing — the login page
        // is shown by AuthContext and authReady stays pending until the
        // next successful sign-in.
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
