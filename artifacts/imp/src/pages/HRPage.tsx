import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, DollarSign, Calendar, Clock, UserPlus, Check, X, MoreVertical, Edit2, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';

interface Employee {
  id: string; name: string; role: string; department: string;
  salary: string; phone: string; email: string; startDate: string;
  status: 'active' | 'inactive'; avatar: string;
}
interface LeaveRequest {
  id: string; employee: string; type: string; from: string;
  to: string; status: 'pending' | 'approved' | 'rejected'; days: number;
}

const INIT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'د. سارة خالد', role: 'طبيب عام', department: 'العيادة', salary: '350,000', phone: '777111222', email: 'sara@clinic.com', startDate: '2021-03-15', status: 'active', avatar: 'س' },
  { id: '2', name: 'أحمد علي حسن', role: 'ممرض أول', department: 'التمريض', salary: '180,000', phone: '770222333', email: 'ahmed@clinic.com', startDate: '2020-07-01', status: 'active', avatar: 'أ' },
  { id: '3', name: 'منى محمد الشرجبي', role: 'فني مختبر', department: 'المختبر', salary: '200,000', phone: '711333444', email: 'mona@clinic.com', startDate: '2022-01-10', status: 'active', avatar: 'م' },
  { id: '4', name: 'خالد عبدالله', role: 'موظف استقبال', department: 'الاستقبال', salary: '140,000', phone: '733444555', email: 'khalid@clinic.com', startDate: '2023-06-01', status: 'inactive', avatar: 'خ' },
];
const INIT_LEAVES: LeaveRequest[] = [
  { id: 'L1', employee: 'أحمد علي حسن', type: 'إجازة سنوية', from: '2024-05-10', to: '2024-05-20', status: 'pending', days: 10 },
  { id: 'L2', employee: 'منى محمد الشرجبي', type: 'إجازة مرضية', from: '2024-05-03', to: '2024-05-05', status: 'approved', days: 2 },
  { id: 'L3', employee: 'خالد عبدالله', type: 'إجازة اضطرارية', from: '2024-05-15', to: '2024-05-16', status: 'rejected', days: 1 },
];
const DEPARTMENTS = ['العيادة', 'التمريض', 'المختبر', 'الاستقبال', 'الصيدلية', 'الإدارة'];
const ROLES = ['طبيب عام', 'طبيب متخصص', 'ممرض أول', 'ممرض', 'فني مختبر', 'موظف استقبال', 'محاسب', 'مدير'];
const LEAVE_TYPES = ['إجازة سنوية', 'إجازة مرضية', 'إجازة اضطرارية', 'إجازة بدون راتب'];
const EMPTY_EMP = { name: '', role: ROLES[0], department: DEPARTMENTS[0], salary: '', phone: '', email: '', startDate: '', status: 'active' as const, avatar: '' };

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: any; color: string }) {
  return (
    <div className="bg-white p-7 rounded-3xl border shadow-sm flex items-center gap-5">
      <div className={cn("p-4 rounded-2xl", color)}><Icon className="w-6 h-6 text-white" /></div>
      <div><h4 className="text-2xl font-black text-gray-900">{value}</h4><p className="text-xs font-bold text-gray-500">{label}</p><p className="text-[10px] text-gray-300 font-bold">{sub}</p></div>
    </div>
  );
}

export default function HRPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'employees' | 'leaves' | 'payroll'>('employees');
  const [employees, setEmployees] = useState<Employee[]>(INIT_EMPLOYEES);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INIT_LEAVES);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_EMP);
  const [isAddingLeave, setIsAddingLeave] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ employee: INIT_EMPLOYEES[0].name, type: LEAVE_TYPES[0], from: '', to: '' });

  const handleAddEmployee = () => {
    if (!form.name || !form.phone) { toast('الرجاء إدخال الاسم والهاتف', 'error'); return; }
    setEmployees(prev => [{ ...form, id: String(Date.now()), avatar: form.name[0] }, ...prev]);
    toast(`تمت إضافة الموظف ${form.name} ✓`);
    setIsAdding(false); setForm(EMPTY_EMP);
  };
  const handleEditEmployee = () => {
    if (!form.name) { toast('الرجاء إدخال الاسم', 'error'); return; }
    setEmployees(prev => prev.map(e => e.id === editTarget!.id ? { ...e, ...form, avatar: form.name[0] } : e));
    toast('تم تحديث بيانات الموظف ✓');
    setEditTarget(null); setForm(EMPTY_EMP);
  };
  const handleDeleteEmployee = () => {
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget!.id));
    toast('تم حذف الموظف', 'info'); setDeleteTarget(null);
  };
  const handleLeaveAction = (id: string, action: 'approved' | 'rejected') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    toast(`تم ${action === 'approved' ? 'اعتماد' : 'رفض'} طلب الإجازة ✓`, action === 'approved' ? 'success' : 'info');
  };
  const handleAddLeave = () => {
    if (!leaveForm.from || !leaveForm.to) { toast('الرجاء تحديد فترة الإجازة', 'error'); return; }
    const diff = Math.ceil((new Date(leaveForm.to).getTime() - new Date(leaveForm.from).getTime()) / 86400000) + 1;
    setLeaves(prev => [{ id: String(Date.now()), ...leaveForm, status: 'pending', days: Math.max(1, diff) }, ...prev]);
    toast('تم تقديم طلب الإجازة بنجاح ✓');
    setIsAddingLeave(false);
  };
  const openEdit = (e: Employee) => {
    setEditTarget(e);
    setForm({ name: e.name, role: e.role, department: e.department, salary: e.salary, phone: e.phone, email: e.email, startDate: e.startDate, status: e.status, avatar: e.avatar });
    setOpenMenu(null);
  };

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Users className="w-8 h-8 text-primary" />الموارد البشرية</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest text-primary/40">Human Resources Management</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'leaves' && (
              <button onClick={() => setIsAddingLeave(true)} className="border border-primary text-primary px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all text-sm">
                <Calendar className="w-4 h-4" />طلب إجازة
              </button>
            )}
            <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/95 transition-all">
              <UserPlus className="w-5 h-5" />إضافة موظف
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="إجمالي الموظفين" value={String(employees.length)} sub={`${employees.filter(e => e.status === 'active').length} نشط`} icon={Users} color="bg-primary" />
          <StatCard label="كتلة الرواتب" value={`${employees.reduce((acc, e) => acc + (parseInt(e.salary.replace(/,/g, '')) || 0), 0).toLocaleString()}`} sub="ريال / شهر" icon={DollarSign} color="bg-emerald-500" />
          <StatCard label="طلبات إجازة" value={String(leaves.filter(l => l.status === 'pending').length)} sub="في الانتظار" icon={Calendar} color="bg-amber-500" />
          <StatCard label="ساعات العمل" value="782" sub="هذا الشهر" icon={Clock} color="bg-indigo-500" />
        </div>

        <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm w-fit">
          {([['employees', 'الموظفون'], ['leaves', 'الإجازات'], ['payroll', 'الرواتب']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
              activeTab === tab ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-primary"
            )}>{label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'employees' && (
            <motion.div key="employees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                    <th className="px-7 py-5">الموظف</th><th className="px-7 py-5">الوظيفة</th>
                    <th className="px-7 py-5">القسم</th><th className="px-7 py-5">الراتب</th>
                    <th className="px-7 py-5">الحالة</th><th className="px-7 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {employees.map((emp, i) => (
                    <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} key={emp.id} className="hover:bg-gray-50/70">
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm", emp.status === 'active' ? "bg-primary" : "bg-gray-300")}>{emp.avatar}</div>
                          <div><p className="font-bold text-gray-900">{emp.name}</p><p className="text-[10px] text-gray-400 font-bold">{emp.email}</p></div>
                        </div>
                      </td>
                      <td className="px-7 py-5"><span className="font-bold text-gray-700 text-sm">{emp.role}</span></td>
                      <td className="px-7 py-5"><span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black">{emp.department}</span></td>
                      <td className="px-7 py-5"><span className="font-black text-gray-900 text-lg">{emp.salary}</span> <span className="text-[10px] text-gray-400">ر.ي</span></td>
                      <td className="px-7 py-5">
                        <button onClick={() => { setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e)); toast('تم تغيير حالة الموظف'); }}
                          className={cn("px-3 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all hover:scale-105",
                            emp.status === 'active' ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          )}>{emp.status === 'active' ? 'نشط' : 'غير نشط'}</button>
                      </td>
                      <td className="px-7 py-5">
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === emp.id ? null : emp.id)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                          <AnimatePresence>
                            {openMenu === emp.id && (
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-36 overflow-hidden">
                                <button onClick={() => openEdit(emp)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5 text-blue-400" />تعديل</button>
                                <button onClick={() => { setDeleteTarget(emp); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" />حذف</button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'leaves' && (
            <motion.div key="leaves" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {leaves.map((leave, i) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} key={leave.id}
                  className="bg-white rounded-3xl border shadow-sm p-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-lg">{leave.employee[0]}</div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-gray-900">{leave.employee}</h3>
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-black">{leave.type}</span>
                        {leave.status === 'pending' && <span className="px-2.5 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black animate-pulse">معلق</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-bold">
                        <Calendar className="w-3 h-3" />{leave.from} → {leave.to}
                        <span className="text-gray-400">({leave.days} أيام)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {leave.status === 'pending' ? (
                      <>
                        <button onClick={() => handleLeaveAction(leave.id, 'approved')} className="flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl font-black text-xs hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all">
                          <Check className="w-4 h-4" />اعتماد
                        </button>
                        <button onClick={() => handleLeaveAction(leave.id, 'rejected')} className="flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                          <X className="w-4 h-4" />رفض
                        </button>
                      </>
                    ) : (
                      <span className={cn("px-5 py-2 rounded-2xl text-xs font-black border",
                        leave.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                      )}>{leave.status === 'approved' ? '✓ معتمد' : '✗ مرفوض'}</span>
                    )}
                  </div>
                </motion.div>
              ))}
              {leaves.length === 0 && <div className="text-center text-gray-300 py-16 font-bold">لا توجد طلبات إجازة</div>}
            </motion.div>
          )}

          {activeTab === 'payroll' && (
            <motion.div key="payroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-xl text-gray-900">كشف الرواتب الشهري</h3>
                <button onClick={() => {
                  const csv = ['الموظف,الوظيفة,الراتب الأساسي,الحالة', ...employees.map(e => `${e.name},${e.role},${e.salary},${e.status}`)].join('\n');
                  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
                  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'payroll.csv'; a.click();
                  toast('تم تصدير كشف الرواتب ✓');
                }} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all">
                  <Download className="w-4 h-4" />تصدير CSV
                </button>
              </div>
              <table className="w-full text-right">
                <thead><tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <th className="px-7 py-4">الموظف</th><th className="px-7 py-4">الراتب الأساسي</th><th className="px-7 py-4">البدلات (+20%)</th><th className="px-7 py-4">الخصومات (-5%)</th><th className="px-7 py-4">الصافي</th>
                </tr></thead>
                <tbody className="divide-y">
                  {employees.filter(e => e.status === 'active').map(emp => {
                    const base = parseInt(emp.salary.replace(/,/g, '')) || 0;
                    const all = Math.round(base * 0.2); const ded = Math.round(base * 0.05); const net = base + all - ded;
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50/70">
                        <td className="px-7 py-4"><p className="font-bold text-gray-900">{emp.name}</p><p className="text-[10px] text-gray-400">{emp.role}</p></td>
                        <td className="px-7 py-4 font-black text-gray-900">{base.toLocaleString()}</td>
                        <td className="px-7 py-4 font-bold text-emerald-600">+{all.toLocaleString()}</td>
                        <td className="px-7 py-4 font-bold text-rose-500">-{ded.toLocaleString()}</td>
                        <td className="px-7 py-4"><span className="font-black text-xl text-primary">{net.toLocaleString()}</span> <span className="text-[10px] text-gray-400">ر.ي</span></td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 border-t-2">
                    <td className="px-7 py-4 font-black text-gray-700">الإجمالي</td>
                    <td className="px-7 py-4 font-black">{employees.filter(e => e.status === 'active').reduce((s, e) => s + (parseInt(e.salary.replace(/,/g, '')) || 0), 0).toLocaleString()}</td>
                    <td colSpan={2}></td>
                    <td className="px-7 py-4 font-black text-xl text-primary">
                      {employees.filter(e => e.status === 'active').reduce((s, e) => {
                        const b = parseInt(e.salary.replace(/,/g, '')) || 0; return s + b + Math.round(b * 0.2) - Math.round(b * 0.05);
                      }, 0).toLocaleString()} ر.ي
                    </td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(isAdding || editTarget) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY_EMP); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-7 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">{editTarget ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h2>
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY_EMP); }} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-7 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2"><label className="text-sm font-bold text-gray-700">الاسم الكامل *</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="اسم الموظف" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">المسمى الوظيفي</label>
                    <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">القسم</label>
                    <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الهاتف *</label>
                    <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="777XXXXXX" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الراتب (ر.ي)</label>
                    <input value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="200,000" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                    <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@clinic.com" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">تاريخ التعيين</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
                </div>
              </div>
              <div className="p-7 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY_EMP); }} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={editTarget ? handleEditEmployee : handleAddEmployee} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">{editTarget ? 'حفظ التعديلات' : 'إضافة الموظف'}</button>
              </div>
            </motion.div>
          </div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8 text-rose-500" /></div>
              <p className="font-bold text-gray-700">حذف موظف <span className="text-rose-600">«{deleteTarget.name}»</span>؟</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteTarget(null)} className="px-6 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={handleDeleteEmployee} className="px-6 py-2.5 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600">حذف</button>
              </div>
            </motion.div>
          </div>
        )}
        {isAddingLeave && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingLeave(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">تقديم طلب إجازة</h2>
                <button onClick={() => setIsAddingLeave(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الموظف</label>
                  <select value={leaveForm.employee} onChange={e => setLeaveForm(p => ({ ...p, employee: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{employees.map(e => <option key={e.id}>{e.name}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">نوع الإجازة</label>
                  <select value={leaveForm.type} onChange={e => setLeaveForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">من تاريخ *</label>
                    <input type="date" value={leaveForm.from} onChange={e => setLeaveForm(p => ({ ...p, from: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
                  <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">إلى تاريخ *</label>
                    <input type="date" value={leaveForm.to} onChange={e => setLeaveForm(p => ({ ...p, to: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsAddingLeave(false)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={handleAddLeave} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">تقديم الطلب</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
