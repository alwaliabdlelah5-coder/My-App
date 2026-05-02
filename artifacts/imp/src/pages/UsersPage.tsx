import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { UserCircle, Shield, Plus, MoreVertical, CheckCircle, XCircle, Search, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const roles = [
  { id: 1, name: 'SuperAdmin', color: 'bg-rose-50 text-rose-600 border-rose-100', desc: 'صلاحيات كاملة على النظام' },
  { id: 2, name: 'Admin', color: 'bg-orange-50 text-orange-600 border-orange-100', desc: 'صلاحيات إدارية موسعة' },
  { id: 3, name: 'Doctor', color: 'bg-blue-50 text-blue-600 border-blue-100', desc: 'الوصول لسجلات المرضى والمواعيد' },
  { id: 4, name: 'Accountant', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', desc: 'الوصول للنظام المالي' },
  { id: 5, name: 'LabTech', color: 'bg-purple-50 text-purple-600 border-purple-100', desc: 'إدخال نتائج المختبر' },
  { id: 6, name: 'Pharmacist', color: 'bg-teal-50 text-teal-600 border-teal-100', desc: 'صرف الوصفات وإدارة المخزون' },
];

const users = [
  { id: 1, name: 'أحمد محمد السالم', username: 'ahmed.admin', email: 'ahmed@hospital.ye', role: 'SuperAdmin', active: true, lastLogin: '2024-05-02 09:30' },
  { id: 2, name: 'د. خالد محمد عبدالله', username: 'dr.khalid', email: 'khalid@hospital.ye', role: 'Doctor', active: true, lastLogin: '2024-05-02 08:15' },
  { id: 3, name: 'أ. منى الحكيمي', username: 'mona.acc', email: 'mona@hospital.ye', role: 'Accountant', active: true, lastLogin: '2024-05-01 14:22' },
  { id: 4, name: 'أ. علي فهد ناصر', username: 'ali.lab', email: 'ali@hospital.ye', role: 'LabTech', active: false, lastLogin: '2024-04-28 11:00' },
  { id: 5, name: 'د. سارة أحمد يحيى', username: 'dr.sara', email: 'sara@hospital.ye', role: 'Doctor', active: true, lastLogin: '2024-05-02 10:05' },
];

const permissionsMatrix: Record<string, Record<string, boolean>> = {
  SuperAdmin: { patients: true, appointments: true, finance: true, reports: true, pharmacy: true, lab: true, inventory: true, users: true, settings: true },
  Admin: { patients: true, appointments: true, finance: true, reports: true, pharmacy: true, lab: true, inventory: true, users: false, settings: false },
  Doctor: { patients: true, appointments: true, finance: false, reports: false, pharmacy: false, lab: true, inventory: false, users: false, settings: false },
  Accountant: { patients: false, appointments: false, finance: true, reports: true, pharmacy: false, lab: false, inventory: true, users: false, settings: false },
  LabTech: { patients: true, appointments: false, finance: false, reports: false, pharmacy: false, lab: true, inventory: false, users: false, settings: false },
  Pharmacist: { patients: true, appointments: false, finance: false, reports: false, pharmacy: true, lab: false, inventory: true, users: false, settings: false },
};

const modules = ['patients', 'appointments', 'finance', 'reports', 'pharmacy', 'lab', 'inventory', 'users', 'settings'];
const moduleLabels: Record<string, string> = {
  patients: 'المرضى', appointments: 'المواعيد', finance: 'المالية',
  reports: 'التقارير', pharmacy: 'الصيدلية', lab: 'المختبر',
  inventory: 'المخزون', users: 'المستخدمون', settings: 'الإعدادات',
};

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => u.name.includes(search) || u.username.includes(search) || u.role.includes(search));

  const getRoleStyle = (role: string) => roles.find(r => r.name === role)?.color || 'bg-gray-100 text-gray-600';

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><UserCircle className="w-8 h-8 text-primary" />إدارة المستخدمين والصلاحيات</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40">Access Control & User Management</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 shadow-lg shadow-primary/25"><Plus className="w-5 h-5" />مستخدم جديد</button>
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm">
              {[['users', 'المستخدمون'], ['roles', 'الأدوار'], ['permissions', 'مصفوفة الصلاحيات']].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key as any)} className={cn("px-5 py-2 rounded-xl font-bold text-sm transition-all",
                  activeTab === key ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                )}>{label}</button>
              ))}
            </div>
            {activeTab === 'users' && (
              <div className="relative w-full md:w-72">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-11 pl-4 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
              </div>
            )}
          </div>

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead><tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                  <th className="px-8 py-5">المستخدم</th><th className="px-8 py-5">اسم الدخول</th>
                  <th className="px-8 py-5">الدور</th><th className="px-8 py-5">آخر دخول</th>
                  <th className="px-8 py-5 text-center">الحالة</th><th className="px-8 py-5"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((user, i) => (
                    <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={user.id} className="hover:bg-gray-50 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-110 transition-all">{user.name[0]}</div>
                          <div><p className="font-black text-gray-900">{user.name}</p><p className="text-[10px] text-gray-400 font-bold">{user.email}</p></div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-mono text-sm text-gray-500">@{user.username}</td>
                      <td className="px-8 py-5"><span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase border italic tracking-widest", getRoleStyle(user.role))}>{user.role}</span></td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-400 font-mono">{user.lastLogin}</td>
                      <td className="px-8 py-5 text-center">
                        <div className={cn("mx-auto w-fit flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase italic",
                          user.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                        )}>
                          {user.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {user.active ? 'نشط' : 'معطل'}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="flex gap-2">
                          <button className="p-2.5 hover:bg-primary/10 hover:text-primary text-gray-400 rounded-xl transition-all"><Lock className="w-4 h-4" /></button>
                          <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role, i) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} key={role.id}
                  className="p-6 bg-white border-2 border-gray-100 rounded-[2rem] hover:border-primary/20 transition-all shadow-sm group cursor-pointer hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("px-4 py-2 rounded-xl text-sm font-black border italic uppercase tracking-widest", role.color)}>{role.name}</div>
                    <Shield className="w-5 h-5 text-gray-200 group-hover:text-primary transition-all" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{role.desc}</p>
                  <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between text-[10px] font-black text-gray-400">
                    <span className="uppercase italic tracking-widest">{users.filter(u => u.role === role.name).length} مستخدمون</span>
                    <button className="text-primary hover:underline">تعديل الصلاحيات</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="p-8 overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest italic">الدور</th>
                    {modules.map(mod => (
                      <th key={mod} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{moduleLabels[mod]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Object.entries(permissionsMatrix).map(([role, perms], i) => (
                    <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} key={role} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-5 text-right">
                        <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black border italic uppercase tracking-widest", roles.find(r => r.name === role)?.color || "bg-gray-100")}>{role}</span>
                      </td>
                      {modules.map(mod => (
                        <td key={mod} className="px-4 py-5">
                          {perms[mod] ? (
                            <div className="flex justify-center"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
                          ) : (
                            <div className="flex justify-center"><XCircle className="w-5 h-5 text-gray-200" /></div>
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
