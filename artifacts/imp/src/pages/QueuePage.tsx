import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Clock, ArrowUp, CheckCircle2, Play, Timer, User, MoreVertical, Activity, Plus, X, ArrowRight, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQueue } from '@/hooks/use-queue';
import { useToast } from '@/components/Toast';

interface QueueEntry {
  id: string; patient: string; doctor: string;
  status: 'waiting' | 'in_progress' | 'completed';
  priority: number; waitingTime: string;
}

const INITIAL: QueueEntry[] = [
  { id: 'Q-101', patient: 'يحيى صالح', doctor: 'د. سارة خالد', status: 'waiting', priority: 2, waitingTime: '15 min' },
  { id: 'Q-102', patient: 'هناء محمد', doctor: 'د. علي يحيى', status: 'in_progress', priority: 2, waitingTime: '45 min' },
  { id: 'Q-103', patient: 'عبدالله ناصر', doctor: 'د. سارة خالد', status: 'waiting', priority: 3, waitingTime: '5 min' },
  { id: 'Q-104', patient: 'منيرة أحمد', doctor: 'د. أحمد المحمدي', status: 'completed', priority: 2, waitingTime: '30 min' },
  { id: 'Q-105', patient: 'سالم الدوسري', doctor: 'د. علي يحيى', status: 'waiting', priority: 1, waitingTime: '2 min' },
];

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

export default function QueuePage() {
  const { toast } = useToast();
  const { queue: liveQueue, loading } = useQueue();
  const [queue, setQueue] = useState<QueueEntry[]>(INITIAL);
  const [activeDoctor, setActiveDoctor] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ patient: '', doctor: DOCTORS[0], priority: 2 });
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && liveQueue.length > 0) {
      setQueue(liveQueue.map(q => ({
        id: q.id, patient: q.patientName, doctor: q.doctorName || 'غير محدد',
        status: q.status as any, priority: Number(q.priority) || 2, waitingTime: 'Real-time'
      })));
    }
  }, [liveQueue, loading]);

  const filtered = activeDoctor === 'All' ? queue : queue.filter(q => q.doctor === activeDoctor);

  const moveStatus = (id: string, newStatus: QueueEntry['status']) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    const labels: Record<string, string> = { in_progress: 'قيد الكشف', completed: 'مكتمل', waiting: 'انتظار' };
    toast(`تم تحديث الحالة إلى: ${labels[newStatus]}`);
    setOpenMenu(null);
  };

  const raisePriority = (id: string) => {
    setQueue(prev => {
      const idx = prev.findIndex(q => q.id === id);
      if (idx <= 0) return prev;
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
    toast('تم رفع أولوية المريض ↑');
  };

  const handleAdd = () => {
    if (!form.patient) { toast('الرجاء إدخال اسم المريض', 'error'); return; }
    const id = `Q-${100 + queue.length + 1}`;
    setQueue(prev => [...prev, { id, patient: form.patient, doctor: form.doctor, status: 'waiting', priority: form.priority, waitingTime: '0 min' }]);
    toast(`تمت إضافة ${form.patient} لقائمة الانتظار ✓`);
    setIsAdding(false);
    setForm({ patient: '', doctor: DOCTORS[0], priority: 2 });
  };

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
    toast('تم إزالة المريض من القائمة', 'info');
    setOpenMenu(null);
  };

  const QueueCard = ({ item }: { item: QueueEntry }) => {
    const isActive = item.status === 'in_progress';
    const isDone = item.status === 'completed';
    return (
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={cn("p-6 rounded-3xl border-2 transition-all flex flex-col gap-4",
          isActive ? "bg-blue-50/30 border-blue-100 shadow-lg" :
          isDone ? "bg-gray-50/50 border-transparent opacity-60" : "bg-white border-gray-50 shadow-sm hover:border-primary/20"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black",
              item.priority === 3 ? "bg-rose-500 text-white" : item.priority === 2 ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-500"
            )}>{item.id.replace('Q-', '')}</div>
            <span className="text-xs font-black text-gray-400 font-mono tracking-widest">{item.id}</span>
          </div>
          {!isDone && (
            <div className="flex gap-1">
              {item.status === 'waiting' && (
                <button onClick={() => raisePriority(item.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-all" title="رفع الأولوية">
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              <div className="relative">
                <button onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all"><MoreVertical className="w-4 h-4" /></button>
                <AnimatePresence>
                  {openMenu === item.id && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-44 overflow-hidden"
                    >
                      {item.status === 'waiting' && (
                        <button onClick={() => moveStatus(item.id, 'in_progress')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50">
                          <Play className="w-3.5 h-3.5" />بدء الكشف
                        </button>
                      )}
                      {item.status === 'in_progress' && (
                        <button onClick={() => moveStatus(item.id, 'completed')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50">
                          <CheckCircle2 className="w-3.5 h-3.5" />إنهاء الكشف
                        </button>
                      )}
                      {item.status === 'in_progress' && (
                        <button onClick={() => moveStatus(item.id, 'waiting')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50">
                          <StopCircle className="w-3.5 h-3.5" />إرجاع للانتظار
                        </button>
                      )}
                      <button onClick={() => removeFromQueue(item.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50">
                        <X className="w-3.5 h-3.5" />إزالة من القائمة
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-none mb-1">{item.patient}</h4>
          <p className="text-[10px] font-bold text-gray-400 italic flex items-center gap-2 uppercase"><User className="w-3 h-3 text-primary" />{item.doctor}</p>
        </div>
        <div className="pt-4 border-t border-dashed flex items-center justify-between">
          <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-gray-300" /><span className="text-[10px] font-black text-gray-400 italic">{item.waitingTime}</span></div>
          {isActive ? (
            <div className="flex items-center gap-2"><Activity className="w-3 h-3 text-blue-500 animate-pulse" /><span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Live</span></div>
          ) : (
            <div className={cn("p-1.5 rounded-full",
              item.priority === 3 ? "bg-rose-500 shadow-lg shadow-rose-500/25" :
              item.priority === 2 ? "bg-amber-400 shadow-lg shadow-amber-400/25" : "bg-emerald-500 shadow-lg shadow-emerald-500/25"
            )} />
          )}
        </div>
        {item.status === 'waiting' && (
          <button onClick={() => moveStatus(item.id, 'in_progress')}
            className="w-full py-2.5 bg-primary/10 text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
            <Play className="w-3.5 h-3.5" />بدء الكشف
          </button>
        )}
        {item.status === 'in_progress' && (
          <button onClick={() => moveStatus(item.id, 'completed')}
            className="w-full py-2.5 bg-emerald-500/10 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />إنهاء الكشف
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="في الانتظار" value={String(queue.filter(q => q.status === 'waiting').length)} icon={Users} color="text-amber-500" bg="bg-amber-50" />
          <StatCard label="قيد الكشف" value={String(queue.filter(q => q.status === 'in_progress').length)} icon={Play} color="text-blue-500" bg="bg-blue-50" />
          <StatCard label="المتوسط الزمني" value="18 min" icon={Timer} color="text-emerald-500" bg="bg-emerald-50" />
          <StatCard label="تم فحصهم" value={String(queue.filter(q => q.status === 'completed').length)} icon={CheckCircle2} color="text-primary" bg="bg-primary/5" />
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase font-mono">Live Patient Flow</h2>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest italic">Real-time queue monitoring & priority management</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 p-1 bg-white border rounded-2xl shadow-inner flex-wrap">
                {['All', ...DOCTORS.slice(0, 3)].map(doc => (
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

          <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[400px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-amber-500 italic">Waiting ({filtered.filter(q => q.status === 'waiting').length})</h3>
                <div className="w-8 h-1 bg-amber-200 rounded-full" />
              </div>
              <div className="space-y-3">{filtered.filter(q => q.status === 'waiting').map(item => <QueueCard key={item.id} item={item} />)}</div>
              {filtered.filter(q => q.status === 'waiting').length === 0 && (
                <div className="text-center py-8 text-gray-300 font-bold text-sm">لا يوجد مرضى</div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-blue-500 italic">Consulting ({filtered.filter(q => q.status === 'in_progress').length})</h3>
                <div className="w-8 h-1 bg-blue-200 rounded-full" />
              </div>
              <div className="space-y-3">{filtered.filter(q => q.status === 'in_progress').map(item => <QueueCard key={item.id} item={item} />)}</div>
              {filtered.filter(q => q.status === 'in_progress').length === 0 && (
                <div className="text-center py-8 text-gray-300 font-bold text-sm">لا يوجد كشوفات نشطة</div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-emerald-500 italic">Completed ({filtered.filter(q => q.status === 'completed').length})</h3>
                <div className="w-8 h-1 bg-emerald-200 rounded-full" />
              </div>
              <div className="space-y-3">{filtered.filter(q => q.status === 'completed').map(item => <QueueCard key={item.id} item={item} />)}</div>
            </div>
          </div>
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
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">اسم المريض *</label>
                  <input value={form.patient} onChange={e => setForm(p => ({ ...p, patient: e.target.value }))} placeholder="أدخل اسم المريض" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الطبيب</label>
                  <select value={form.doctor} onChange={e => setForm(p => ({ ...p, doctor: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">{DOCTORS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الأولوية</label>
                  <div className="flex gap-3">
                    {[['1', 'عادية', 'bg-emerald-50 text-emerald-600'], ['2', 'متوسطة', 'bg-amber-50 text-amber-600'], ['3', 'عاجلة', 'bg-rose-50 text-rose-600']].map(([v, l, cls]) => (
                      <button key={v} onClick={() => setForm(p => ({ ...p, priority: Number(v) }))} className={cn("flex-1 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2",
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
