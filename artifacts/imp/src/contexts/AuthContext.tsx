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
  /** Only for demo environment seeding — role is from a hardcoded server map, not user input */
  seedDemoAccount: (email: string, password: string, name: string, role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'مدير النظام',
  doctor: 'طبيب',
  nurse: 'ممرض',
  lab_tech: 'فني مختبر',
  receptionist: 'موظف استقبال',
  pharmacist: 'صيدلاني',
};

// Fallback keys — used when Firestore is unavailable (pre-existing permission issue)
const LS_ROLE_KEY = (uid: string) => `imp_role_${uid}`;
const LS_NAME_KEY = (uid: string) => `imp_name_${uid}`;

async function fetchRoleFromFirestore(uid: string): Promise<{ role: Role; displayName: string } | null> {
  try {
    const db = getDb();
    if (!db) return null;
    const snap = await getDoc(doc(db, 'userProfiles', uid));
    if (snap.exists()) {
      const data = snap.data();
      return { role: (data.role as Role) ?? 'receptionist', displayName: data.displayName ?? '' };
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
    await setDoc(doc(db, 'userProfiles', uid), {
      role,
      displayName,
      updatedAt: serverTimestamp(),
    });
  } catch {
    // Firestore unavailable — localStorage is the fallback
  }
}

async function resolveAuthUser(fbUser: User): Promise<AuthUser> {
  // Firestore is authoritative; localStorage is only a fallback
  const firestoreProfile = await fetchRoleFromFirestore(fbUser.uid);
  if (firestoreProfile) {
    // Keep localStorage in sync for offline resilience
    localStorage.setItem(LS_ROLE_KEY(fbUser.uid), firestoreProfile.role);
    localStorage.setItem(LS_NAME_KEY(fbUser.uid), firestoreProfile.displayName);
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: firestoreProfile.displayName || fbUser.email,
      role: firestoreProfile.role,
    };
  }
  // Firestore unavailable — use localStorage
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) { setLoading(false); return; }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const authUser = await resolveAuthUser(fbUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase Auth غير متاح');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const authUser = await resolveAuthUser(cred.user);
    setUser(authUser);
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  /**
   * seedDemoAccount — used ONLY for demo environment seeding from the login page.
   * The role comes from the hardcoded DEMO_ACCOUNTS map, not from any user-supplied input.
   * If the account already exists, it just logs in normally.
   */
  const seedDemoAccount = async (email: string, password: string, name: string, role: Role) => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase Auth غير متاح');
    try {
      // Attempt login first (account may already exist)
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const authUser = await resolveAuthUser(cred.user);
      setUser(authUser);
    } catch (loginErr: any) {
      if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
        // First time: create the demo account with the server-defined role
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem(LS_ROLE_KEY(cred.user.uid), role);
        localStorage.setItem(LS_NAME_KEY(cred.user.uid), name);
        await saveProfileToFirestore(cred.user.uid, role, name);
        setUser({ uid: cred.user.uid, email: cred.user.email, displayName: name, role });
      } else {
        throw loginErr;
      }
    }
  };

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
