import React from 'react';
import { Redirect } from 'wouter';
import { useAuth, Role } from '@/contexts/AuthContext';
import { ShieldOff } from 'lucide-react';

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ component: Component, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect to login (handled in App)
  if (!user) {
    return <Redirect to="/" />;
  }

  // Role check — if allowedRoles specified and user's role is not included
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-12 max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldOff className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">وصول مرفوض</h2>
          <p className="text-gray-500 font-bold text-sm leading-relaxed">
            ليس لديك صلاحية للوصول إلى هذه الصفحة.
            <br />
            تواصل مع مدير النظام لطلب الوصول.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
            >
              العودة للرئيسية
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Component />;
}
