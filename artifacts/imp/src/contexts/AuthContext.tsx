import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  AuthError,
} from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';

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
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ROLE_KEY = (uid: string) => `imp_role_${uid}`;
const NAME_KEY = (uid: string) => `imp_name_${uid}`;

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'مدير النظام',
  doctor: 'طبيب',
  nurse: 'ممرض',
  lab_tech: 'فني مختبر',
  receptionist: 'موظف استقبال',
  pharmacist: 'صيدلاني',
};

function buildAuthUser(fbUser: User): AuthUser {
  const storedRole = localStorage.getItem(ROLE_KEY(fbUser.uid)) as Role | null;
  const storedName = localStorage.getItem(NAME_KEY(fbUser.uid));
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: storedName ?? fbUser.displayName ?? fbUser.email,
    role: storedRole ?? 'receptionist',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) { setLoading(false); return; }

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(buildAuthUser(fbUser));
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
    setUser(buildAuthUser(cred.user));
  };

  const register = async (email: string, password: string, name: string, role: Role) => {
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase Auth غير متاح');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem(ROLE_KEY(cred.user.uid), role);
    localStorage.setItem(NAME_KEY(cred.user.uid), name);
    setUser({ uid: cred.user.uid, email: cred.user.email, displayName: name, role });
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
