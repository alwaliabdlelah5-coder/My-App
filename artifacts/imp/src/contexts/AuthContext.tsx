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
   * Undefined in production builds — callers must guard with import.meta.env.DEV.
   * The role comes from a hardcoded server-side map in LoginPage, never from user input.
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

// localStorage fallback keys — used only when Firestore is unavailable
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
    // Firestore unavailable — fall through to localStorage
  }
  return null;
}

async function saveProfileToFirestore(uid: string, role: Role, displayName: string): Promise<void> {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, 'userProfiles', uid), { role, displayName, updatedAt: serverTimestamp() });
  } catch {
    // Firestore unavailable — localStorage already written
  }
}

async function resolveAuthUser(fbUser: User): Promise<AuthUser> {
  // Firestore is the authoritative source for role
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
  // Firestore unavailable — use localStorage as read-only fallback
  // Note: localStorage is a UI convenience fallback only; Firestore rules
  // still gate all data access server-side regardless of this value.
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

  // seedDemoAccount is only included in development builds.
  // In production, Vite's dead-code elimination removes it entirely.
  const seedDemoAccount = import.meta.env.DEV
    ? async (email: string, password: string, name: string, role: Role) => {
        const auth = getAuthInstance();
        if (!auth) throw new Error('Firebase Auth غير متاح');
        try {
          // Try login first (account may already exist from a prior dev session)
          const cred = await signInWithEmailAndPassword(auth, email, password);
          setUser(await resolveAuthUser(cred.user));
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            // First run: create the account; role comes from hardcoded DEMO_ACCOUNTS, not user input
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            localStorage.setItem(LS_ROLE_KEY(cred.user.uid), role);
            localStorage.setItem(LS_NAME_KEY(cred.user.uid), name);
            await saveProfileToFirestore(cred.user.uid, role, name);
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
