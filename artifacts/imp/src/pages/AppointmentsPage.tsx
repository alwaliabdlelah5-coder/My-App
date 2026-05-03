import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Calendar as CalendarIcon, Clock, User, Plus, ChevronRight, Filter, MoreVertical, CheckCircle2, XCircle, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppointments } from '@/hooks/use-appointments';
import { useToast } from '@/components/Toast';

interface AppEntry {
  id: string; patient: string; doctor: string; service: string;
  time: string; status: 'confirmed' | 'waiting' | 'cancelled' | 'completed';
  type: 'new' | 'follow_up' | 'urgent'; date?: string;
}

const INITIAL: AppEntry[] = [
  { id: '1', patient: 'عبدالعزيز العتيبي', doctor: 'د. سارة خالد', service: 'استشارة عامة', time: '10:00 AM', status: 'confirmed', type: 'new' },
  { id: '2', patient: 'مريم الصنعاني', doctor: 'د. علي يحيى', service: 'فحص دوري', time: '10:30 AM', status: 'waiting', type: 'follow_up' },
  { id: '3', patient: 'ياسين منصور', doctor: 'د. أحمد المحمدي', service: 'متابعة سكري', time: '11:15 AM', status: 'cancelled', type: 'urgent' },
  { id: '4', patient: 'هناء محمد', doctor: 'د. سارة خالد', service: 'استشارة أطفال', time: '12:00 PM', status: 'confirmed', type: 'new' },
  { id: '5', patient: 'سالم علي الغامدي', doctor: 'د. علي يحيى', service: 'متابعة ضغط', time: '01:00 PM', status: 'waiting', type: 'follow_up' },
];

const DOCTORS = ['د. سارة خالد', 'د. علي يحيى', 'د. أحمد المحمدي', 'د. خالد محمد'];
const SERVICES = ['استشارة عامة', 'فحص دوري', 'متابعة سكري', 'استشارة أطفال', 'متابعة ضغط', 'كشف قلبية', 'أمراض نساء'];

const statusConfig: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'مؤكد', className: 'bg-emerald-50 text-emerald-500' },
  waiting: { label: 'انتظار', className: 'bg-amber-50 text-amber-500' },
  cancelled: { label: 'ملغي', className: 'bg-gray-100 text-gray-400' },
  completed: { label: 'مكتمل', className: 'bg-blue-50 text-blue-500' },
};

const typeConfig: Record<string, string> = {
  urgent: 'bg-rose-500 text-white',
  new: 'bg-emerald-100 text-emerald-700',
  follow_up: 'bg-blue-100 text-blue-700',
};

function InsightItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-xl"><Icon className="w-5 h-5 text-primary" /></div>
        <span className="text-sm font-bold text-white/50">{label}</span>
      </div>
      <span className="text-lg font-black text-white">{value}</span>
    </div>
  );
}

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [appointments, setAppointments] = useState<AppEntry[]>(INITIAL);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth] = useState(new Date());
  const dateString = selectedDate.toISOString().split('T')[0];
  const { appointments: liveApps, loading } = useAppointments(dateString);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<AppEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppEntry | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState({ patient: '', doctor: DOCTORS[0], service: SERVICES[0], time: '09:00 AM', type: 'new' as const, status: 'confirmed' as const });

  React.useEffect(() => {
    if (!loading && liveApps.length > 0) {
      setAppointments(liveApps.map(a => ({ id: a.id, patient: a.patientName, doctor: a.doctorName, service: a.type, time: a.startTime, status: a.status as any, type: 'new' as const })));
    }
  }, [liveApps, loading]);

  const handleAdd = () => {
    if (!form.patient) { toast('الرجاء إدخال اسم المريض', 'error'); return; }
    const entry: AppEntry = { ...form, id: String(Date.now()) };
    setAppointments(prev => [entry, ...prev]);
    toast('تم حجز الموعد بنجاح ✓');
    setIsAdding(false);
    setForm({ patient: '', doctor: DOCTORS[0], service: SERVICES[0], time: '09:00 AM', type: 'new', status: 'confirmed' });
  };

  const handleEdit = () => {
    if (!form.patient) { toast('الرجاء إدخال اسم المريض', 'error'); return; }
    setAppointments(prev => prev.map(a => a.id === editTarget!.id ? { ...a, ...form } : a));
    toast('تم تحديث الموعد بنجاح ✓');
    setEditTarget(null);
  };

  const handleDelete = () => {
    setAppointments(prev => prev.filter(a => a.id !== deleteTarget!.id));
    toast('تم حذف الموعد', 'info');
    setDeleteTarget(null);
  };

  const changeStatus = (id: string, status: AppEntry['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast(`تم تغيير حالة الموعد إلى: ${statusConfig[status].label}`);
    setOpenMenu(null);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const today = new Date().getDate();

  const AppForm = ({ data, onChange }: { data: typeof form; onChange: (k: string, v: any) => void }) => (
    <div className="space-y-4">
      <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">اسم المريض *</label>
        <input value={data.patient} onChange={e => onChange('patient', e.target.value)} placeholder="أدخل اسم المريض" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الطبيب</label>
          <select value={data.doctor} onChange={e => onChange('doctor', e.target.value)} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">{DOCTORS.map(d => <option key={d}>{d}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الخدمة</label>
          <select value={data.service} onChange={e => onChange('service', e.target.value)} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">{SERVICES.map(s => <option key={s}>{s}</option>)}</select></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الوقت</label>
          <select value={data.time} onChange={e => onChange('time', e.target.value)} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">
            {['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM'].map(t => <option key={t}>{t}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">نوع الزيارة</label>
          <select value={data.type} onChange={e => onChange('type', e.target.value)} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">
            <option value="new">زيارة جديدة</option><option value="follow_up">متابعة</option><option value="urgent">عاجل</option></select></div>
      </div>
    </div>
  );

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><CalendarIcon className="w-8 h-8 text-primary" />إدارة المواعيد والجدولة</h1>
            <p className="text-gray-500 mt-1 font-bold">تنظيم حجوزات المرضى، متابعة الحالات، وتنبيهات الحضور.</p>
          </div>
          <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary/95 transition-all shadow-xl shadow-primary/20 group">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />حجز موعد جديد
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-lg italic tracking-tighter">{currentMonth.toLocaleString('ar', { month: 'long', year: 'numeric' })}</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['S','M','T','W','T','F','S'].map((d, i) => <span key={`${d}-${i}`} className="text-[10px] font-black text-gray-300 uppercase">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <button key={i} onClick={() => { const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1); setSelectedDate(d); }}
                    className={cn("aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all",
                      i + 1 === selectedDate.getDate() && selectedDate.getMonth() === currentMonth.getMonth() ? "bg-primary text-white shadow-lg shadow-primary/25" :
                      i + 1 === today ? "border-2 border-primary text-primary" : "hover:bg-gray-50 text-gray-700"
                    )}>{i + 1}</button>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
              <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-4">Daily Insights</h4>
              <div className="space-y-6">
                <InsightItem label="إجمالي المواعيد" value={String(appointments.length)} icon={CalendarIcon} />
                <InsightItem label="في الانتظار" value={String(appointments.filter(a => a.status === 'waiting').length)} icon={Clock} />
                <InsightItem label="مؤكدة" value={String(appointments.filter(a => a.status === 'confirmed').length)} icon={CheckCircle2} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden min-h-[600px] flex flex-col">
              <div className="p-8 border-b bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm">
                  {(['day','week','month'] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)} className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all",
                      viewMode === mode ? "bg-primary text-white shadow-md" : "text-gray-400"
                    )}>{mode === 'day' ? 'اليوم' : mode === 'week' ? 'الأسبوع' : 'الشهر'}</button>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-500">{appointments.length} موعد</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {appointments.map((app, i) => (
                  <motion.div key={app.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-6 flex items-center justify-between hover:bg-gray-50/80 transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center min-w-[50px]">
                        <span className="text-lg font-black text-gray-900 tracking-tighter">{app.time.split(' ')[0]}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase">{app.time.split(' ')[1]}</span>
                      </div>
                      <div className="w-1.5 h-10 rounded-full bg-gray-100 group-hover:bg-primary transition-all" />
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-gray-900 tracking-tighter">{app.patient}</h3>
                          <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase italic tracking-widest", typeConfig[app.type])}>{app.type === 'urgent' ? 'عاجل' : app.type === 'new' ? 'جديد' : 'متابعة'}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase flex items-center gap-2">
                          <User className="w-3 h-3 text-primary" />{app.doctor} • {app.service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === app.id ? null : app.id)}
                          className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2", statusConfig[app.status].className)}>
                          {app.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                          {app.status === 'waiting' && <Clock className="w-3 h-3" />}
                          {app.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                          {app.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          {statusConfig[app.status].label}
                        </button>
                        <AnimatePresence>
                          {openMenu === app.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-36 overflow-hidden"
                            >
                              {Object.entries(statusConfig).map(([s, c]) => (
                                <button key={s} onClick={() => changeStatus(app.id, s as any)} className={cn("w-full px-4 py-2.5 text-xs font-black text-right transition-all hover:bg-gray-50", app.status === s ? "text-primary" : "text-gray-600")}>{c.label}</button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === `${app.id}-more` ? null : `${app.id}-more`)} className="p-2.5 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-sm">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        <AnimatePresence>
                          {openMenu === `${app.id}-more` && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-36 overflow-hidden"
                            >
                              <button onClick={() => { setEditTarget(app); setForm({ patient: app.patient, doctor: app.doctor, service: app.service, time: app.time, type: app.type, status: app.status }); setOpenMenu(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5" />تعديل</button>
                              <button onClick={() => { setDeleteTarget(app); setOpenMenu(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" />حذف</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {appointments.length === 0 && (
                  <div className="flex-1 flex items-center justify-center py-24 text-gray-300 font-bold">لا توجد مواعيد</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || editTarget) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAdding(false); setEditTarget(null); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-7 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">{editTarget ? 'تعديل الموعد' : 'حجز موعد جديد'}</h2>
                <button onClick={() => { setIsAdding(false); setEditTarget(null); }} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-7">
                <AppForm data={form} onChange={(k, v) => setForm(p => ({ ...p, [k]: v }))} />
              </div>
              <div className="p-7 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => { setIsAdding(false); setEditTarget(null); }} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={editTarget ? handleEdit : handleAdd} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">{editTarget ? 'حفظ التعديلات' : 'تأكيد الحجز'}</button>
              </div>
            </motion.div>
          </div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8 text-rose-500" /></div>
              <p className="font-bold text-gray-700">حذف موعد <span className="text-rose-600">«{deleteTarget.patient}»</span>؟</p>
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
