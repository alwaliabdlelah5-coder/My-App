import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuthInstance, getDb } from '@/lib/firebase';

export type Role = 'admin' | 'doctor' | 'nurse' | 'lab_tech' | 'receptionist' | 'pharmacist';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /**
   * Development-only helper for seeding demo accounts.
   * Undefined in production — callers must guard with import.meta.env.DEV.
   * Roles are stored ONLY in localStorage (DEV convenience); they are NOT
   * written to Firestore because the Firestore rule restricts client-created
   * profiles to 'receptionist'. Elevated demo roles are therefore a DEV-only
   * local-state concern, not a Firestore security concern.
   */
  seedDemoAccount?: (email: string, password: string, name: string, role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const ROLE_LABELS: Record<Role, string> = {
  admin:        'مدير النظام',
  doctor:       'طبيب',
  nurse:        'ممرض',
  lab_tech:     'فني مختبر',
  receptionist: 'موظف استقبال',
  pharmacist:   'صيدلاني',
};

// localStorage keys — offline fallback and DEV demo roles only.
// Firestore is the authoritative role source; localStorage is never trusted
// when Firestore is reachable.
const LS_ROLE_KEY = (uid: string) => `imp_role_${uid}`;
const LS_NAME_KEY = (uid: string) => `imp_name_${uid}`;

async function fetchProfileFromFirestore(uid: string): Promise<{ role: Role; displayName: string } | null> {
  try {
    const db = getDb();
    if (!db) return null;
    const snap = await getDoc(doc(db, 'userProfiles', uid));
    if (snap.exists()) {
      const d = snap.data();
      return { role: (d.role as Role) ?? 'receptionist', displayName: d.displayName ?? '' };
    }
  } catch {
    // Firestore unavailable — caller falls back to localStorage
  }
  return null;
}

async function createFirestoreProfile(uid: string, displayName: string): Promise<void> {
  // Firestore rules enforce role == 'receptionist' on create.
  // Elevated roles must be set by an admin via Firebase Admin SDK.
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, 'userProfiles', uid), {
      role: 'receptionist',
      displayName,
      updatedAt: serverTimestamp(),
    });
  } catch {
    // Firestore unavailable — localStorage fallback already written
  }
}

async function resolveAuthUser(fbUser: User): Promise<AuthUser> {
  // Firestore is the authoritative source; localStorage is the offline fallback.
  const profile = await fetchProfileFromFirestore(fbUser.uid);
  if (profile) {
    // Keep localStorage in sync for offline resilience
    localStorage.setItem(LS_ROLE_KEY(fbUser.uid), profile.role);
    localStorage.setItem(LS_NAME_KEY(fbUser.uid), profile.displayName);
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: profile.displayName || fbUser.email,
      role: profile.role,
    };
  }
  // Firestore unavailable — use localStorage.
  // Note: localStorage role affects UI routing only. All actual data access
  // still requires Firebase Auth (enforced by Firestore rules server-side).
  const storedRole = localStorage.getItem(LS_ROLE_KEY(fbUser.uid)) as Role | null;
  const storedName = localStorage.getItem(LS_NAME_KEY(fbUser.uid));
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: storedName ?? fbUser.email,
    role: storedRole ?? 'receptionist',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser ? await resolveAuthUser(fbUser) : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase Auth غير متاح');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser(await resolveAuthUser(cred.user));
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  // seedDemoAccount is tree-shaken out of production builds by Vite.
  const seedDemoAccount = import.meta.env.DEV
    ? async (email: string, password: string, name: string, role: Role) => {
        const auth = getAuthInstance();
        if (!auth) throw new Error('Firebase Auth غير متاح');
        try {
          // Account may already exist from a prior DEV session
          const cred = await signInWithEmailAndPassword(auth, email, password);
          // Prefer the Firestore role (receptionist) if it exists; override with
          // the DEV-only localStorage demo role so the demo is usable.
          localStorage.setItem(LS_ROLE_KEY(cred.user.uid), role);
          localStorage.setItem(LS_NAME_KEY(cred.user.uid), name);
          setUser({ uid: cred.user.uid, email: cred.user.email, displayName: name, role });
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            // First run — create the Firebase Auth account
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            // Store demo role in localStorage only (not Firestore — rules restrict to 'receptionist')
            localStorage.setItem(LS_ROLE_KEY(cred.user.uid), role);
            localStorage.setItem(LS_NAME_KEY(cred.user.uid), name);
            // Attempt Firestore profile creation (will succeed with role='receptionist' per rules,
            // but localStorage demo role takes precedence for this DEV session)
            await createFirestoreProfile(cred.user.uid, name);
            setUser({ uid: cred.user.uid, email: cred.user.email, displayName: name, role });
          } else {
            throw err;
          }
        }
      }
    : undefined;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, seedDemoAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
