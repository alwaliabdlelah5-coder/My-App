import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Clock, CheckCircle2, Play, Timer, User, Activity, Plus, X, Wifi, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQueue, QueueItem } from '@/hooks/use-queue';
import { useToast } from '@/components/Toast';

const DOCTORS = ['د. سارة خالد', 'د. علي يحيى', 'د. أحمد المحمدي', 'د. خالد محمد'];

function StatCard({ label, value, icon: Icon, color, bg }: { label: string; value: string; icon: any; color: string; bg: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-primary/20 transition-all">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", bg)}><Icon className={cn("w-7 h-7", color)} /></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic group-hover:text-primary transition-colors">{label}</p>
      <h4 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{value}</h4>
    </div>
  );
}

function QueueItemCard({ item, active, completed, onStatusChange }: { item: QueueItem; active?: boolean; completed?: boolean; onStatusChange?: (id: string, status: QueueItem['status']) => void }) {
  const shortId = item.id.slice(-4).toUpperCase();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn("p-6 rounded-3xl border-2 transition-all flex flex-col gap-4",
        active ? "bg-blue-50/30 border-blue-100 shadow-lg" :
        completed ? "bg-gray-50/50 border-transparent opacity-60 grayscale" : "bg-white border-gray-50 shadow-sm hover:border-primary/20"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black",
            Number(item.priority) >= 3 ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-500"
          )}>{shortId}</div>
          <span className="text-xs font-black text-gray-400 font-mono tracking-widest">#{shortId}</span>
        </div>
        {!completed && onStatusChange && (
          <div className="flex gap-1">
            {active ? (
              <button onClick={() => onStatusChange(item.id, 'completed')}
                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all">
                إتمام
              </button>
            ) : (
              <button onClick={() => onStatusChange(item.id, 'in_progress')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all">
                استدعاء
              </button>
            )}
          </div>
        )}
      </div>
      <div>
        <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-none mb-1">{item.patientName}</h4>
        <p className="text-[10px] font-bold text-gray-400 italic flex items-center gap-2 uppercase">
          <User className="w-3 h-3 text-primary" />{item.doctorName || 'غير محدد'}
        </p>
      </div>
      <div className="pt-4 border-t border-dashed flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-gray-300" />
          <span className="text-[10px] font-black text-gray-400 italic">{item.type || 'كشف'}</span>
        </div>
        {active ? (
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Live Consult</span>
          </div>
        ) : (
          <div className={cn("p-1.5 rounded-full",
            Number(item.priority) >= 3 ? "bg-rose-500 shadow-lg shadow-rose-500/25" :
            Number(item.priority) === 2 ? "bg-amber-500 shadow-lg shadow-amber-500/25" : "bg-emerald-500 shadow-lg shadow-emerald-500/25"
          )} />
        )}
      </div>
    </motion.div>
  );
}

function EmptyColumn({ label, color }: { label: string; color: string }) {
  return (
    <div className={cn("border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 opacity-40", color)}>
      <p className="text-xs font-black uppercase tracking-widest">{label}</p>
      <p className="text-[10px] text-gray-400">لا يوجد مرضى حالياً</p>
    </div>
  );
}

export default function QueuePage() {
  const { toast } = useToast();
  const { queue, loading, updateQueueStatus, addToQueue } = useQueue();
  const [activeDoctor, setActiveDoctor] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ patient: '', doctor: DOCTORS[0], priority: 2 });

  const doctors = ['All', ...Array.from(new Set(queue.map(q => q.doctorName).filter(Boolean) as string[]))];
  const filteredQueue = activeDoctor === 'All' ? queue : queue.filter(q => q.doctorName === activeDoctor);
  const waiting = filteredQueue.filter(q => q.status === 'waiting');
  const inProgress = filteredQueue.filter(q => q.status === 'in_progress');
  const completed = filteredQueue.filter(q => q.status === 'completed');

  const handleAdd = async () => {
    if (!form.patient) { toast('الرجاء إدخال اسم المريض', 'error'); return; }
    try {
      await addToQueue({ patientName: form.patient, doctorName: form.doctor, type: 'كشف', priority: form.priority });
      toast(`تمت إضافة ${form.patient} لقائمة الانتظار ✓`);
      setIsAdding(false);
      setForm({ patient: '', doctor: DOCTORS[0], priority: 2 });
    } catch {
      toast('حدث خطأ أثناء الإضافة', 'error');
    }
  };

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="المرضى في الانتظار" value={String(queue.filter(q => q.status === 'waiting').length)} icon={Users} color="text-amber-500" bg="bg-amber-50" />
          <StatCard label="قيد الكشف" value={String(queue.filter(q => q.status === 'in_progress').length)} icon={Play} color="text-blue-500" bg="bg-blue-50" />
          <StatCard label="المتوسط الزمني" value="18 min" icon={Timer} color="text-emerald-500" bg="bg-emerald-50" />
          <StatCard label="إجمالي من تم فحصهم" value={String(queue.filter(q => q.status === 'completed').length)} icon={CheckCircle2} color="text-primary" bg="bg-primary/5" />
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase font-mono flex items-center gap-3">
                Live Patient Flow
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <Wifi className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Real-time</span>
                </span>
              </h2>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest italic">Real-time queue monitoring & priority management</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 p-1 bg-white border rounded-2xl shadow-inner flex-wrap">
                {doctors.map(doc => (
                  <button key={doc} onClick={() => setActiveDoctor(doc)} className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all",
                    activeDoctor === doc ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                  )}>{doc === 'All' ? 'الكل' : doc}</button>
                ))}
              </div>
              <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-5 py-2.5 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-all text-sm">
                <Plus className="w-4 h-4" />إضافة
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest">جاري التحميل...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[400px]">
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-black text-xs uppercase tracking-widest text-amber-500 italic">Waiting Room ({waiting.length})</h3>
                  <div className="w-8 h-1 bg-amber-200 rounded-full" />
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {waiting.length === 0
                      ? <EmptyColumn label="غرفة الانتظار" color="border-amber-200 text-amber-400" />
                      : waiting.map(item => (
                          <QueueItemCard key={item.id} item={item} onStatusChange={updateQueueStatus} />
                        ))
                    }
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-black text-xs uppercase tracking-widest text-blue-500 italic">In Consultations ({inProgress.length})</h3>
                  <div className="w-8 h-1 bg-blue-200 rounded-full" />
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {inProgress.length === 0
                      ? <EmptyColumn label="قيد الكشف" color="border-blue-200 text-blue-400" />
                      : inProgress.map(item => (
                          <QueueItemCard key={item.id} item={item} active onStatusChange={updateQueueStatus} />
                        ))
                    }
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-black text-xs uppercase tracking-widest text-emerald-500 italic">Completed ({completed.length})</h3>
                  <div className="w-8 h-1 bg-emerald-200 rounded-full" />
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {completed.length === 0
                      ? <EmptyColumn label="المكتملون" color="border-emerald-200 text-emerald-400" />
                      : completed.map(item => (
                          <QueueItemCard key={item.id} item={item} completed onStatusChange={updateQueueStatus} />
                        ))
                    }
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-7 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">إضافة مريض للقائمة</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-7 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">اسم المريض *</label>
                  <input value={form.patient} onChange={e => setForm(p => ({ ...p, patient: e.target.value }))} placeholder="أدخل اسم المريض"
                    className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">الطبيب</label>
                  <select value={form.doctor} onChange={e => setForm(p => ({ ...p, doctor: e.target.value }))}
                    className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">
                    {DOCTORS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">الأولوية</label>
                  <div className="flex gap-3">
                    {[['1', 'عادية', 'bg-emerald-50 text-emerald-600'], ['2', 'متوسطة', 'bg-amber-50 text-amber-600'], ['3', 'عاجلة', 'bg-rose-50 text-rose-600']].map(([v, l, cls]) => (
                      <button key={v} onClick={() => setForm(p => ({ ...p, priority: Number(v) }))}
                        className={cn("flex-1 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2",
                          form.priority === Number(v) ? `${cls} border-current` : "border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-7 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={handleAdd} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">إضافة للقائمة</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
