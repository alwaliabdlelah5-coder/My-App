import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Search, Plus, Filter, MoreVertical, Phone, Mail, Calendar as CalendarIcon, ChevronLeft, ChevronRight, UserPlus, Edit2, Trash2, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePatients } from '@/hooks/use-patients';
import { useToast } from '@/components/Toast';

interface Patient {
  id: string; fileNumber: string; name: string; phone: string; email: string;
  gender: string; age: number; lastVisit: string; status: 'active' | 'inactive';
}

const seed: Patient[] = [
  { id: '1', fileNumber: 'P-1001', name: 'سناء علي عبد الله', phone: '777123456', email: 'sana@example.com', gender: 'أنثى', age: 28, lastVisit: '2024-05-01', status: 'active' },
  { id: '2', fileNumber: 'P-1002', name: 'محمد حسن صالح', phone: '770987654', email: 'mohammed@example.com', gender: 'ذكر', age: 45, lastVisit: '2024-04-28', status: 'active' },
  { id: '3', fileNumber: 'P-1003', name: 'ليلى مرشد السعدي', phone: '711223344', email: 'layla@example.com', gender: 'أنثى', age: 34, lastVisit: '2024-04-15', status: 'inactive' },
  { id: '4', fileNumber: 'P-1004', name: 'جابر يحيى حسين', phone: '733445566', email: 'jaber@example.com', gender: 'ذكر', age: 52, lastVisit: '2024-05-02', status: 'active' },
  { id: '5', fileNumber: 'P-1005', name: 'هند علي محمد', phone: '776655443', email: 'hind@example.com', gender: 'أنثى', age: 22, lastVisit: '2024-03-20', status: 'active' },
];

const emptyForm = { name: '', phone: '', gender: 'ذكر', age: 0, email: '', fileNumber: '', status: 'active' as const };

const ITEMS_PER_PAGE = 8;

function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-7 border-b flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-7">{children}</div>
        <div className="p-7 bg-gray-50 flex items-center justify-end gap-3">{footer}</div>
      </motion.div>
    </div>
  );
}

function PatientForm({ data, onChange }: { data: typeof emptyForm; onChange: (k: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الاسم *</label>
          <input value={data.name} onChange={e => onChange('name', e.target.value)} placeholder="مثال: يحيى صالح" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 border-none outline-none" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">رقم الهاتف *</label>
          <input value={data.phone} onChange={e => onChange('phone', e.target.value)} placeholder="777XXXXXX" dir="ltr" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 border-none outline-none" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الجنس</label>
          <select value={data.gender} onChange={e => onChange('gender', e.target.value)} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">
            <option>ذكر</option><option>أنثى</option></select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">العمر</label>
          <input type="number" value={data.age || ''} onChange={e => onChange('age', parseInt(e.target.value) || 0)} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الحالة</label>
          <select value={data.status} onChange={e => onChange('status', e.target.value)} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">
            <option value="active">نشط</option><option value="inactive">غير نشط</option></select></div>
      </div>
      <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
        <input value={data.email} onChange={e => onChange('email', e.target.value)} placeholder="example@gmail.com" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none" /></div>
    </div>
  );
}

export default function PatientsPage() {
  const { patients: livePatients, loading, addPatient } = usePatients();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(seed);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<null | 'add' | 'edit' | 'view' | 'delete'>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && livePatients.length > 0) setPatients(livePatients as Patient[]);
  }, [livePatients, loading]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = patients.filter(p => {
    const matchSearch = !searchQuery || p.name.includes(searchQuery) || p.phone.includes(searchQuery) || p.fileNumber.includes(searchQuery);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openAdd = () => { setForm(emptyForm); setModalMode('add'); };
  const openEdit = (p: Patient) => { setSelectedPatient(p); setForm({ name: p.name, phone: p.phone, gender: p.gender, age: p.age, email: p.email || '', fileNumber: p.fileNumber, status: p.status }); setModalMode('edit'); setOpenDropdown(null); };
  const openView = (p: Patient) => { setSelectedPatient(p); setModalMode('view'); setOpenDropdown(null); };
  const openDelete = (p: Patient) => { setSelectedPatient(p); setModalMode('delete'); setOpenDropdown(null); };

  const handleAdd = async () => {
    if (!form.name || !form.phone) { toast('الرجاء إدخال الاسم ورقم الهاتف', 'error'); return; }
    const fileNum = `P-${1000 + patients.length + 1}`;
    const newP: Patient = { id: String(Date.now()), fileNumber: fileNum, ...form, lastVisit: new Date().toISOString().split('T')[0] };
    setPatients(prev => [newP, ...prev]);
    await addPatient({ ...form, fileNumber: fileNum, lastVisit: newP.lastVisit });
    toast('تم إضافة المريض بنجاح ✓');
    setModalMode(null);
  };

  const handleEdit = () => {
    if (!form.name || !form.phone) { toast('الرجاء إدخال الاسم ورقم الهاتف', 'error'); return; }
    setPatients(prev => prev.map(p => p.id === selectedPatient!.id ? { ...p, ...form } : p));
    toast('تم تحديث بيانات المريض بنجاح ✓');
    setModalMode(null);
  };

  const handleDelete = () => {
    setPatients(prev => prev.filter(p => p.id !== selectedPatient!.id));
    toast('تم حذف المريض بنجاح', 'info');
    setModalMode(null);
  };

  const changeForm = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <Sidebar>
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Users className="w-8 h-8 text-primary" />إدارة المرضى</h1>
            <p className="text-gray-500 mt-1">عرض وتعديل بيانات المرضى والسجلات الطبية.</p>
          </div>
          <button onClick={openAdd} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/25">
            <UserPlus className="w-5 h-5" />إضافة مريض جديد
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="البحث بالاسم، الهاتف، أو رقم الملف..." value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
              {[['all', 'الكل'], ['active', 'نشط'], ['inactive', 'غير نشط']].map(([v, l]) => (
                <button key={v} onClick={() => { setFilterStatus(v as any); setPage(1); }}
                  className={cn("px-4 py-1.5 rounded-xl font-bold text-xs transition-all", filterStatus === v ? "bg-primary text-white shadow" : "text-gray-400")}>{l}</button>
              ))}
            </div>
            <div className="text-xs text-gray-400 font-medium whitespace-nowrap">عرض {filtered.length} من {patients.length} مريض</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-5">رقم الملف</th><th className="px-6 py-5">المريض</th>
                  <th className="px-6 py-5">معلومات التواصل</th><th className="px-6 py-5">الجنس / العمر</th>
                  <th className="px-6 py-5">آخر زيارة</th><th className="px-6 py-5 text-center">الحالة</th><th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {paged.map((patient, i) => (
                  <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} key={patient.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-primary font-bold">{patient.fileNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{patient.name[0]}</div>
                        <span className="font-bold text-gray-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600"><Phone className="w-3 h-3" />{patient.phone}</div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs"><Mail className="w-3 h-3" />{patient.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-gray-700">{patient.gender}</span><span className="text-gray-400 mx-2">/</span><span className="text-gray-500">{patient.age} سنة</span></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2 text-gray-600"><CalendarIcon className="w-3 h-3 text-gray-400" />{patient.lastVisit}</div></td>
                    <td className="px-6 py-4">
                      <button onClick={() => { setSelectedPatient(patient); setForm({ ...form, status: patient.status === 'active' ? 'inactive' : 'active' }); setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p)); toast(`تم تغيير حالة المريض`); }}
                        className={cn("mx-auto w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-all hover:scale-105",
                          patient.status === 'active' ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}>{patient.status === 'active' ? 'نشط' : 'غير نشط'}</button>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="relative" ref={openDropdown === patient.id ? dropdownRef : undefined}>
                        <button onClick={() => setOpenDropdown(openDropdown === patient.id ? null : patient.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                        <AnimatePresence>
                          {openDropdown === patient.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -5 }}
                              className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-40 overflow-hidden"
                            >
                              <button onClick={() => openView(patient)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"><Eye className="w-4 h-4 text-gray-400" />عرض الملف</button>
                              <button onClick={() => openEdit(patient)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"><Edit2 className="w-4 h-4 text-blue-400" />تعديل</button>
                              <button onClick={() => openDelete(patient)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"><Trash2 className="w-4 h-4" />حذف</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400 font-bold">لا توجد نتائج مطابقة</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-5 border-t flex items-center justify-between bg-gray-50/30">
            <span className="text-xs text-gray-500 font-medium">الصفحة {page} من {totalPages} • {filtered.length} مريض</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border bg-white disabled:opacity-40 hover:border-primary transition-all"><ChevronRight className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={cn("w-9 h-9 rounded-xl border font-bold text-sm transition-all", n === page ? "bg-primary text-white border-primary" : "bg-white hover:border-primary")}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border bg-white disabled:opacity-40 hover:border-primary transition-all"><ChevronLeft className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalMode === 'add' && (
          <Modal title="إضافة مريض جديد" onClose={() => setModalMode(null)}
            footer={<><button onClick={() => setModalMode(null)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button><button onClick={handleAdd} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold hover:bg-primary/95 shadow-lg shadow-primary/25">حفظ البيانات</button></>}>
            <PatientForm data={form} onChange={changeForm} />
          </Modal>
        )}
        {modalMode === 'edit' && selectedPatient && (
          <Modal title={`تعديل بيانات: ${selectedPatient.name}`} onClose={() => setModalMode(null)}
            footer={<><button onClick={() => setModalMode(null)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button><button onClick={handleEdit} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold hover:bg-primary/95 shadow-lg shadow-primary/25">حفظ التعديلات</button></>}>
            <PatientForm data={form} onChange={changeForm} />
          </Modal>
        )}
        {modalMode === 'view' && selectedPatient && (
          <Modal title="ملف المريض" onClose={() => setModalMode(null)}
            footer={<><button onClick={() => openEdit(selectedPatient)} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold">تعديل البيانات</button></>}>
            <div className="space-y-4">
              <div className="flex items-center gap-5 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">{selectedPatient.name[0]}</div>
                <div><h3 className="text-xl font-black text-gray-900">{selectedPatient.name}</h3><p className="text-primary font-bold text-sm">{selectedPatient.fileNumber}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['الهاتف', selectedPatient.phone], ['البريد', selectedPatient.email || '—'], ['الجنس', selectedPatient.gender], ['العمر', `${selectedPatient.age} سنة`], ['آخر زيارة', selectedPatient.lastVisit], ['الحالة', selectedPatient.status === 'active' ? 'نشط' : 'غير نشط']].map(([k, v]) => (
                  <div key={k} className="p-4 bg-gray-50 rounded-2xl"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">{k}</p><p className="font-bold text-gray-900">{v}</p></div>
                ))}
              </div>
            </div>
          </Modal>
        )}
        {modalMode === 'delete' && selectedPatient && (
          <Modal title="تأكيد الحذف" onClose={() => setModalMode(null)}
            footer={<><button onClick={() => setModalMode(null)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button><button onClick={handleDelete} className="bg-rose-500 text-white px-7 py-2.5 rounded-2xl font-bold hover:bg-rose-600">حذف نهائياً</button></>}>
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8 text-rose-500" /></div>
              <p className="font-bold text-gray-700">هل تريد حذف ملف المريض <span className="text-rose-600">«{selectedPatient.name}»</span> بشكل نهائي؟</p>
              <p className="text-sm text-gray-400">هذا الإجراء لا يمكن التراجع عنه.</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
