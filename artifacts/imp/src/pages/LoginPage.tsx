import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ChevronDown, AlertCircle, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth, Role, ROLE_LABELS } from '@/contexts/AuthContext';

const ROLES: Role[] = ['admin', 'doctor', 'nurse', 'lab_tech', 'receptionist', 'pharmacist'];

const DEMO_ACCOUNTS = [
  { email: 'admin@clinic.com', password: 'clinic123', role: 'admin' as Role, name: 'د. أحمد محمد' },
  { email: 'doctor@clinic.com', password: 'clinic123', role: 'doctor' as Role, name: 'د. سارة خالد' },
  { email: 'nurse@clinic.com', password: 'clinic123', role: 'nurse' as Role, name: 'أحمد علي حسن' },
  { email: 'lab@clinic.com', password: 'clinic123', role: 'lab_tech' as Role, name: 'منى محمد' },
  { email: 'reception@clinic.com', password: 'clinic123', role: 'receptionist' as Role, name: 'خالد عبدالله' },
  { email: 'pharmacy@clinic.com', password: 'clinic123', role: 'pharmacist' as Role, name: 'فاطمة علي' },
];

export default function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('receptionist');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const translateError = (code: string) => {
    const map: Record<string, string> = {
      'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
      'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل)',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/too-many-requests': 'محاولات كثيرة، حاول لاحقاً',
    };
    return map[code] ?? 'حدث خطأ، حاول مجدداً';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('الاسم مطلوب'); setLoading(false); return; }
        await register(email, password, name.trim(), role);
      }
    } catch (err: any) {
      setError(translateError(err.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demo: typeof DEMO_ACCOUNTS[0]) => {
    setError('');
    setLoading(true);
    try {
      try {
        await login(demo.email, demo.password);
      } catch {
        await register(demo.email, demo.password, demo.name, demo.role);
      }
    } catch (err: any) {
      setError(translateError(err.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-5xl flex gap-8 items-center">

        {/* Left branding panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col flex-1 gap-8"
        >
          <div>
            <div className="text-6xl font-black text-primary italic tracking-tighter mb-2">
              IMP <span className="text-gray-200 font-normal text-4xl">v2.0</span>
            </div>
            <p className="text-gray-500 font-bold text-lg leading-relaxed">
              النظام الطبي المتكامل<br />
              <span className="text-gray-400 text-sm font-normal">Integrated Medical Platform</span>
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: '🏥', label: 'إدارة المرضى والسجلات الطبية' },
              { icon: '📅', label: 'جدولة المواعيد والقوائم الحية' },
              { icon: '💊', label: 'الصيدلية والمخزون الدوائي' },
              { icon: '🔬', label: 'المختبر والتقارير المخبرية' },
              { icon: '💼', label: 'الموارد البشرية والرواتب' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 p-3 bg-white/70 rounded-2xl border border-gray-100 backdrop-blur">
                <span className="text-2xl">{f.icon}</span>
                <span className="font-bold text-gray-700 text-sm">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">حسابات تجريبية سريعة</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(d => (
                <button
                  key={d.email}
                  onClick={() => quickLogin(d)}
                  disabled={loading}
                  className="text-right p-2 bg-white rounded-xl border border-blue-100 hover:border-primary hover:shadow-md transition-all group"
                >
                  <p className="text-xs font-black text-gray-800 group-hover:text-primary">{d.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{ROLE_LABELS[d.role]}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-gray-100 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-5 font-black text-sm tracking-tight transition-all ${
                  tab === t ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'login' ? (
                  <span className="flex items-center justify-center gap-2"><LogIn className="w-4 h-4" />تسجيل الدخول</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" />إنشاء حساب</span>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {tab === 'login' ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
              </h2>
              <p className="text-gray-400 text-sm mt-1 font-bold">
                {tab === 'login' ? 'سجّل دخولك للوصول إلى النظام' : 'أدخل بياناتك لإنشاء حسابك'}
              </p>
            </div>

            {/* Name (register only) */}
            <AnimatePresence>
              {tab === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="الاسم الكامل"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:border-primary outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@clinic.com"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pr-12 pl-12 text-sm font-bold focus:border-primary outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role (register only) */}
            <AnimatePresence>
              {tab === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">الدور الوظيفي</label>
                  <div className="relative">
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as Role)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pr-4 pl-10 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <p className="text-sm font-bold text-rose-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-tight"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                tab === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'
              )}
            </button>

            {/* Demo note for mobile */}
            <div className="lg:hidden pt-2 border-t">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">حسابات تجريبية</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.slice(0, 4).map(d => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => quickLogin(d)}
                    disabled={loading}
                    className="text-right p-2 bg-blue-50 rounded-xl border border-blue-100 hover:border-primary transition-all"
                  >
                    <p className="text-xs font-black text-gray-800">{d.name}</p>
                    <p className="text-[10px] text-gray-400">{ROLE_LABELS[d.role]}</p>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
