import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, UserPlus, Clock, Calendar, CheckCircle, XCircle, MoreVertical, Search, Briefcase, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const employees = [
  { id: 1, name: 'د. خالد محمد عبدالله', role: 'طبيب عام', department: 'العيادة العامة', type: 'doctor', salary: 180000, status: 'active', rating: 4.8, joinDate: '2020-01-15' },
  { id: 2, name: 'د. سارة أحمد يحيى', role: 'أخصائية قلب', department: 'عيادة القلب', type: 'doctor', salary: 220000, status: 'active', rating: 4.9, joinDate: '2019-08-01' },
  { id: 3, name: 'أ. منى عبدالرحمن', role: 'ممرضة أولى', department: 'العيادة العامة', type: 'nurse', salary: 80000, status: 'active', rating: 4.5, joinDate: '2021-03-20' },
  { id: 4, name: 'أ. علي محمد ناصر', role: 'فني مختبر', department: 'المختبر', type: 'tech', salary: 90000, status: 'on_leave', rating: 4.2, joinDate: '2022-06-10' },
  { id: 5, name: 'أ. هدى صالح محمد', role: 'موظفة استقبال', department: 'الاستقبال', type: 'staff', salary: 65000, status: 'active', rating: 4.6, joinDate: '2021-09-01' },
];

const leaveRequests = [
  { id: 1, employee: 'د. خالد محمد', type: 'اعتيادية', from: '2024-05-10', to: '2024-05-15', days: 5, status: 'pending' },
  { id: 2, employee: 'أ. منى عبدالرحمن', type: 'مرضية', from: '2024-05-03', to: '2024-05-05', days: 3, status: 'approved' },
  { id: 3, employee: 'أ. علي محمد ناصر', type: 'اعتيادية', from: '2024-05-01', to: '2024-05-07', days: 7, status: 'approved' },
];

const typeColors: Record<string, string> = {
  doctor: 'bg-blue-50 text-blue-600', nurse: 'bg-pink-50 text-pink-600',
  tech: 'bg-indigo-50 text-indigo-600', staff: 'bg-amber-50 text-amber-600'
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-3 h-3", i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
      ))}
      <span className="text-xs font-black text-gray-400 ml-1 italic">{rating}</span>
    </div>
  );
}

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'leaves' | 'payroll'>('employees');
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e => e.name.includes(search) || e.role.includes(search) || e.department.includes(search));

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Briefcase className="w-8 h-8 text-primary" />شؤون الموظفين</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40">Human Resources Management</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 shadow-lg shadow-primary/25"><UserPlus className="w-5 h-5" />إضافة موظف</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي الموظفين', value: employees.length, icon: Users, color: 'blue' },
            { label: 'في الخدمة', value: employees.filter(e => e.status === 'active').length, icon: CheckCircle, color: 'emerald' },
            { label: 'في إجازة', value: employees.filter(e => e.status === 'on_leave').length, icon: Calendar, color: 'amber' },
            { label: 'طلبات إجازة معلقة', value: leaveRequests.filter(l => l.status === 'pending').length, icon: Clock, color: 'rose' },
          ].map((s, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={s.label}
              className="bg-white p-6 rounded-3xl border shadow-sm"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                s.color === 'blue' ? "bg-blue-50 text-blue-600" : s.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                s.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
              )}><s.icon className="w-6 h-6" /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-4xl font-black text-gray-900 mt-1 tracking-tighter font-mono">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm">
              {[['employees', 'الموظفون'], ['leaves', 'طلبات الإجازات'], ['payroll', 'كشف الرواتب']].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key as any)} className={cn("px-5 py-2 rounded-xl font-bold text-sm transition-all",
                  activeTab === key ? "bg-primary text-white shadow-md" : "text-gray-400"
                )}>{label}</button>
              ))}
            </div>
            {activeTab === 'employees' && (
              <div className="relative w-full md:w-72">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-11 pl-4 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
              </div>
            )}
          </div>

          {activeTab === 'employees' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead><tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">الموظف</th><th className="px-8 py-5">المسمى الوظيفي</th>
                  <th className="px-8 py-5">القسم</th><th className="px-8 py-5">الراتب</th>
                  <th className="px-8 py-5">التقييم</th><th className="px-8 py-5 text-center">الحالة</th><th className="px-8 py-5"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((emp, i) => (
                    <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={emp.id} className="hover:bg-gray-50 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm", typeColors[emp.type] || "bg-gray-100")}>{emp.name[0]}</div>
                          <div><p className="font-black text-gray-900">{emp.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase italic">منذ {emp.joinDate}</p></div>
                        </div>
                      </td>
                      <td className="px-8 py-5"><span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase italic", typeColors[emp.type])}>{emp.role}</span></td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-600">{emp.department}</td>
                      <td className="px-8 py-5 font-black text-xl text-gray-900 font-mono">{emp.salary.toLocaleString()} ر.ي</td>
                      <td className="px-8 py-5"><StarRating rating={emp.rating} /></td>
                      <td className="px-8 py-5 text-center">
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase italic",
                          emp.status === 'active' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>{emp.status === 'active' ? 'في الخدمة' : 'إجازة'}</span>
                      </td>
                      <td className="px-8 py-5 text-left"><button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-4 h-4 text-gray-400" /></button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="p-8 space-y-4">
              {leaveRequests.map((req, i) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={req.id}
                  className="p-6 rounded-3xl border flex items-center justify-between hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">{req.employee[0]}</div>
                    <div>
                      <p className="font-black text-lg text-gray-900">{req.employee}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{req.type} • {req.from} إلى {req.to} ({req.days} أيام)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic",
                      req.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    )}>{req.status === 'pending' ? 'قيد المراجعة' : 'مقبول'}</span>
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="p-2.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-xl transition-all"><CheckCircle className="w-5 h-5" /></button>
                        <button className="p-2.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl transition-all"><XCircle className="w-5 h-5" /></button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-primary/20"><Briefcase className="w-10 h-10 text-primary" /></div>
              <h3 className="text-xl font-black text-gray-900">إجمالي الرواتب الشهرية</h3>
              <p className="text-5xl font-black text-primary mt-4 font-mono tracking-tighter">{employees.reduce((s, e) => s + e.salary, 0).toLocaleString()} ر.ي</p>
              <p className="text-sm text-gray-500 mt-2 font-bold">لـ {employees.length} موظفين</p>
              <button className="mt-8 bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-105 transition-all">إصدار كشف الرواتب</button>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
