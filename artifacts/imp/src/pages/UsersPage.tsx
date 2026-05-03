import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { UserCircle, Shield, Plus, MoreVertical, Search, Lock, Unlock, Edit2, Trash2, X, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';

type Role = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'lab_tech' | 'pharmacist';

interface User {
  id: string; name: string; email: string; role: Role;
  department: string; active: boolean; lastLogin: string; avatar: string;
}

const INIT_USERS: User[] = [
  { id: '1', name: 'محمد أحمد علي', email: 'admin@clinic.com', role: 'admin', department: 'الإدارة', active: true, lastLogin: 'منذ 5 دقائق', avatar: 'م' },
  { id: '2', name: 'د. سارة خالد', email: 'sara@clinic.com', role: 'doctor', department: 'العيادة', active: true, lastLogin: 'منذ 20 دقيقة', avatar: 'س' },
  { id: '3', name: 'أحمد علي حسن', email: 'ahmed@clinic.com', role: 'nurse', department: 'التمريض', active: true, lastLogin: 'منذ ساعة', avatar: 'أ' },
  { id: '4', name: 'منى محمد الشرجبي', email: 'mona@clinic.com', role: 'lab_tech', department: 'المختبر', active: false, lastLogin: 'منذ يومين', avatar: 'م' },
  { id: '5', name: 'خالد عبدالله', email: 'khalid@clinic.com', role: 'receptionist', department: 'الاستقبال', active: true, lastLogin: 'منذ 3 ساعات', avatar: 'خ' },
];

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string }> = {
  admin: { label: 'مدير النظام', color: 'text-rose-600', bg: 'bg-rose-50' },
  doctor: { label: 'طبيب', color: 'text-blue-600', bg: 'bg-blue-50' },
  nurse: { label: 'ممرض', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  receptionist: { label: 'استقبال', color: 'text-amber-600', bg: 'bg-amber-50' },
  lab_tech: { label: 'فني مختبر', color: 'text-purple-600', bg: 'bg-purple-50' },
  pharmacist: { label: 'صيدلاني', color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

const DEPARTMENTS = ['الإدارة', 'العيادة', 'التمريض', 'المختبر', 'الاستقبال', 'الصيدلية'];
const ROLES = Object.keys(ROLE_CONFIG) as Role[];

const PERMISSIONS: Record<Role, Record<string, boolean>> = {
  admin: { patients: true, appointments: true, clinic: true, lab: true, pharmacy: true, inventory: true, finance: true, hr: true, reports: true, settings: true, users: true },
  doctor: { patients: true, appointments: true, clinic: true, lab: true, pharmacy: false, inventory: false, finance: false, hr: false, reports: true, settings: false, users: false },
  nurse: { patients: true, appointments: true, clinic: false, lab: true, pharmacy: false, inventory: false, finance: false, hr: false, reports: false, settings: false, users: false },
  receptionist: { patients: true, appointments: true, clinic: false, lab: false, pharmacy: false, inventory: false, finance: false, hr: false, reports: false, settings: false, users: false },
  lab_tech: { patients: false, appointments: false, clinic: false, lab: true, pharmacy: false, inventory: false, finance: false, hr: false, reports: true, settings: false, users: false },
  pharmacist: { patients: false, appointments: false, clinic: false, lab: false, pharmacy: true, inventory: true, finance: false, hr: false, reports: true, settings: false, users: false },
};

const PERM_LABELS: Record<string, string> = {
  patients: 'المرضى', appointments: 'المواعيد', clinic: 'العيادة', lab: 'المختبر',
  pharmacy: 'الصيدلية', inventory: 'المخزون', finance: 'المالية', hr: 'الموارد البشرية',
  reports: 'التقارير', settings: 'الإعدادات', users: 'إدارة المستخدمين',
};

const EMPTY_FORM = { name: '', email: '', role: 'receptionist' as Role, department: DEPARTMENTS[0], password: '' };

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(INIT_USERS);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User>(INIT_USERS[0]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = users.filter(u => !search || u.name.includes(search) || u.email.includes(search));

  const handleAdd = () => {
    if (!form.name || !form.email) { toast('الرجاء إدخال الاسم والبريد الإلكتروني', 'error'); return; }
    if (!form.email.includes('@')) { toast('البريد الإلكتروني غير صحيح', 'error'); return; }
    const u: User = { ...form, id: String(Date.now()), active: true, lastLogin: 'لم يسجل بعد', avatar: form.name[0] };
    setUsers(prev => [u, ...prev]);
    toast(`تم إضافة المستخدم ${form.name} ✓`);
    setIsAdding(false); setForm(EMPTY_FORM);
  };

  const handleEdit = () => {
    if (!form.name || !form.email) { toast('الرجاء إدخال الاسم والبريد الإلكتروني', 'error'); return; }
    setUsers(prev => prev.map(u => u.id === editTarget!.id ? { ...u, ...form, avatar: form.name[0] } : u));
    if (selectedUser.id === editTarget!.id) setSelectedUser(prev => ({ ...prev, ...form, avatar: form.name[0] }));
    toast('تم تحديث بيانات المستخدم ✓');
    setEditTarget(null); setForm(EMPTY_FORM);
  };

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteTarget!.id));
    toast('تم حذف المستخدم', 'info'); setDeleteTarget(null);
  };

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    const user = users.find(u => u.id === id);
    toast(user?.active ? `تم تعطيل حساب ${user.name}` : `تم تفعيل حساب ${user?.name}`, 'info');
  };

  const openEdit = (u: User) => {
    setEditTarget(u);
    setForm({ name: u.name, email: u.email, role: u.role, department: u.department, password: '' });
    setOpenMenu(null);
  };

  const UserForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2"><label className="text-sm font-bold text-gray-700">الاسم الكامل *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="اسم المستخدم" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
        <div className="space-y-1.5 col-span-2"><label className="text-sm font-bold text-gray-700">البريد الإلكتروني *</label>
          <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="user@clinic.com" dir="ltr" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الدور</label>
          <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">
            {ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">القسم</label>
          <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
        {isAdding && (
          <div className="space-y-1.5 col-span-2"><label className="text-sm font-bold text-gray-700">كلمة المرور</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" dir="ltr" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
        )}
      </div>
    </div>
  );

  return (
    <Sidebar>
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><UserCircle className="w-8 h-8 text-primary" />إدارة المستخدمين</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest text-primary/40">User Access & Permissions</p>
          </div>
          <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/95 transition-all">
            <Plus className="w-5 h-5" />مستخدم جديد
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7">
          <div className="space-y-5">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث عن مستخدم..." className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <table className="w-full text-right">
                <thead><tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <th className="px-6 py-4">المستخدم</th><th className="px-6 py-4">الدور</th>
                  <th className="px-6 py-4">آخر دخول</th><th className="px-6 py-4">الحالة</th><th className="px-6 py-4"></th>
                </tr></thead>
                <tbody className="divide-y">
                  {filtered.map((user, i) => (
                    <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} key={user.id}
                      className={cn("hover:bg-gray-50/70 transition-all cursor-pointer", selectedUser.id === user.id && "bg-primary/5")}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                            user.active ? `${ROLE_CONFIG[user.role].bg} ${ROLE_CONFIG[user.role].color}` : "bg-gray-100 text-gray-400"
                          )}>{user.avatar}</div>
                          <div><p className="font-bold text-gray-900 text-sm">{user.name}</p><p className="text-[10px] text-gray-400 font-mono">{user.email}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", ROLE_CONFIG[user.role].bg, ROLE_CONFIG[user.role].color)}>
                          {ROLE_CONFIG[user.role].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-bold">{user.lastLogin}</td>
                      <td className="px-6 py-4">
                        <button onClick={e => { e.stopPropagation(); toggleActive(user.id); }} className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black transition-all",
                          user.active ? "bg-emerald-50 text-emerald-600 hover:bg-rose-50 hover:text-rose-600" : "bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
                        )}>
                          {user.active ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {user.active ? 'نشط' : 'معطل'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === user.id ? null : user.id); }} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                          <AnimatePresence>
                            {openMenu === user.id && (
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-40 overflow-hidden">
                                <button onClick={e => { e.stopPropagation(); openEdit(user); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5 text-blue-400" />تعديل البيانات</button>
                                <button onClick={e => { e.stopPropagation(); toggleActive(user.id); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50">
                                  {user.active ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                  {user.active ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                                </button>
                                <button onClick={e => { e.stopPropagation(); toast(`تم إعادة تعيين كلمة مرور ${user.name}`); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50"><Key className="w-3.5 h-3.5" />إعادة كلمة المرور</button>
                                <button onClick={e => { e.stopPropagation(); setDeleteTarget(user); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" />حذف المستخدم</button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-300 font-bold">لا توجد نتائج</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-5 sticky top-24">
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className={cn("p-6 text-white relative overflow-hidden", selectedUser.active ? "bg-primary" : "bg-gray-400")}>
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-10" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black">{selectedUser.avatar}</div>
                  <div>
                    <h3 className="font-black text-xl">{selectedUser.name}</h3>
                    <p className="text-white/70 text-xs font-bold">{ROLE_CONFIG[selectedUser.role].label}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Shield className="w-3 h-3" />صلاحيات الوصول</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PERM_LABELS).map(([key, label]) => {
                    const hasPerm = PERMISSIONS[selectedUser.role]?.[key] ?? false;
                    return (
                      <div key={key} className={cn("flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold",
                        hasPerm ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-300 line-through"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", hasPerm ? "bg-emerald-500" : "bg-gray-200")} />
                        {label}
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 border-t space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-400 font-bold">البريد</span><span className="font-bold text-gray-700">{selectedUser.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-bold">القسم</span><span className="font-bold text-gray-700">{selectedUser.department}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-bold">آخر دخول</span><span className="font-bold text-gray-700">{selectedUser.lastLogin}</span></div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button onClick={() => openEdit(selectedUser)} className="flex-1 py-2.5 bg-primary/10 text-primary rounded-2xl font-black text-xs hover:bg-primary hover:text-white transition-all">تعديل</button>
                  <button onClick={() => toggleActive(selectedUser.id)} className={cn("flex-1 py-2.5 rounded-2xl font-black text-xs transition-all", selectedUser.active ? "bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white")}>
                    {selectedUser.active ? 'تعطيل' : 'تفعيل'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || editTarget) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY_FORM); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-7 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">{editTarget ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}</h2>
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY_FORM); }} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-7"><UserForm /></div>
              <div className="p-7 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY_FORM); }} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={editTarget ? handleEdit : handleAdd} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">{editTarget ? 'حفظ التعديلات' : 'إنشاء الحساب'}</button>
              </div>
            </motion.div>
          </div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8 text-rose-500" /></div>
              <p className="font-bold text-gray-700">حذف مستخدم <span className="text-rose-600">«{deleteTarget.name}»</span>؟</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteTarget(null)} className="px-6 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={handleDelete} className="px-6 py-2.5 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600">حذف</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
