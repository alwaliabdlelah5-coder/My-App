import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FlaskConical, Search, Plus, Clock, Beaker, Dna, Microscope, FileText, ChevronLeft, TrendingUp, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';

const testCategories = [
  { id: 'heme', name: 'أمراض الدم', icon: Beaker, count: 12 },
  { id: 'bio', name: 'كيمياء حيوية', icon: FlaskConical, count: 8 },
  { id: 'micro', name: 'الأحياء الدقيقة', icon: Microscope, count: 5 },
  { id: 'immuno', name: 'المناعة', icon: Dna, count: 4 },
];

const DOCTORS = ['د. خالد محمد', 'د. سارة أحمد', 'د. علي يحيى', 'د. أحمد المحمدي'];
const PATIENTS_LIST = ['محمد حسن صالح', 'سناء علي عبد الله', 'ليلى مرشد السعدي', 'جابر يحيى حسين', 'هند علي محمد'];

const TEST_DEFINITIONS: Record<string, { name: string; parameters: { id: number; name: string; unit: string; normalRange: string }[] }> = {
  heme: { name: 'CBC (صورة دم كاملة)', parameters: [
    { id: 1, name: 'WBC', unit: 'x10^3/µL', normalRange: '4.5 - 11.0' },
    { id: 2, name: 'RBC', unit: 'x10^6/µL', normalRange: '4.7 - 6.1' },
    { id: 3, name: 'Hemoglobin', unit: 'g/dL', normalRange: '14 - 18' },
    { id: 4, name: 'Platelets', unit: 'x10^3/µL', normalRange: '150 - 450' },
    { id: 5, name: 'Hematocrit', unit: '%', normalRange: '42 - 54' },
  ]},
  bio: { name: 'Liver Function Test', parameters: [
    { id: 6, name: 'ALT', unit: 'U/L', normalRange: '7 - 56' },
    { id: 7, name: 'AST', unit: 'U/L', normalRange: '10 - 40' },
    { id: 8, name: 'Bilirubin', unit: 'mg/dL', normalRange: '0.1 - 1.2' },
    { id: 9, name: 'Albumin', unit: 'g/dL', normalRange: '3.5 - 5.0' },
  ]},
  micro: { name: 'Culture & Sensitivity', parameters: [
    { id: 10, name: 'Organism', unit: '', normalRange: 'Negative' },
    { id: 11, name: 'WBC', unit: 'cells/µL', normalRange: '0 - 5' },
  ]},
  immuno: { name: 'Thyroid Function', parameters: [
    { id: 12, name: 'TSH', unit: 'mIU/L', normalRange: '0.4 - 4.0' },
    { id: 13, name: 'T3', unit: 'ng/dL', normalRange: '80 - 200' },
    { id: 14, name: 'T4', unit: 'µg/dL', normalRange: '5.0 - 12.0' },
  ]},
};

interface LabOrder {
  id: string; patient: string; test: string; doctor: string;
  status: 'pending' | 'in-progress' | 'completed'; urgent: boolean;
  time: string; testId: string; results?: Record<string, string>; notes?: string;
  completedAt?: string;
}

const INITIAL_ORDERS: LabOrder[] = [
  { id: 'L-501', patient: 'محمد حسن صالح', test: 'CBC (صورة دم كاملة)', doctor: 'د. خالد محمد', status: 'pending', urgent: true, time: '15 د', testId: 'heme' },
  { id: 'L-502', patient: 'سناء مصلح', test: 'T3, T4, TSH (هرمونات)', doctor: 'د. سارة أحمد', status: 'in-progress', urgent: false, time: '40 د', testId: 'immuno' },
  { id: 'L-503', patient: 'علي فهد سالم', test: 'Liver Function (وظائف كبد)', doctor: 'د. خالد محمد', status: 'pending', urgent: false, time: '1 ساعة', testId: 'bio' },
];

function LabParameterInput({ label, unit, range, value, onChange }: { label: string; unit: string; range: string; value: string; onChange: (val: string) => void }) {
  const getStatus = (val: string, r: string) => {
    if (!val || !r.includes(' - ')) return 'normal';
    const [min, max] = r.split(' - ').map(Number);
    const num = Number(val);
    if (isNaN(num)) return 'normal';
    if (num < min) return 'low';
    if (num > max) return 'high';
    return 'normal';
  };
  const status = getStatus(value, range);
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-32 shrink-0"><p className="font-black text-gray-900 text-base italic leading-none">{label}</p><p className="text-[10px] text-gray-400 font-black uppercase italic mt-1 tracking-tighter">{unit}</p></div>
      <div className="flex-1 relative">
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="0.00"
          className={cn("w-full bg-white border-2 px-4 py-3 rounded-xl font-black outline-none transition-all",
            status === 'low' ? "border-rose-100 text-rose-500 focus:border-rose-500" :
            status === 'high' ? "border-amber-100 text-amber-500 focus:border-amber-500" :
            "border-gray-50 text-gray-900 focus:border-primary"
          )} />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {status === 'low' && <TrendingUp className="w-4 h-4 text-rose-500 rotate-180" />}
          {status === 'high' && <TrendingUp className="w-4 h-4 text-amber-500" />}
          <span className={cn("text-[10px] font-black uppercase italic tracking-widest",
            status === 'normal' && value ? "text-emerald-500" : status !== 'normal' ? "text-rose-500" : "text-gray-200"
          )}>{value ? status : ''}</span>
        </div>
      </div>
      <div className="w-24 text-center shrink-0">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Normal Range</p>
        <p className="text-[10px] font-black text-gray-500 font-mono tracking-tighter">{range}</p>
      </div>
    </div>
  );
}

export default function LabPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [orders, setOrders] = useState<LabOrder[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder>(INITIAL_ORDERS[0]);
  const [results, setResults] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({ patient: PATIENTS_LIST[0], doctor: DOCTORS[0], testId: 'heme', urgent: false });

  const pendingOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const handleSelectOrder = (order: LabOrder) => {
    setSelectedOrder(order);
    setResults(order.results || {});
    setNotes(order.notes || '');
  };

  const handleSaveResults = () => {
    const hasResults = Object.values(results).some(v => v);
    if (!hasResults) { toast('الرجاء إدخال قيمة واحدة على الأقل', 'error'); return; }
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
      ...o, status: 'completed', results, notes, completedAt: new Date().toLocaleString('ar')
    } : o));
    toast(`تم اعتماد نتائج الفحص وإصدار التقرير ✓`);
    const remaining = pendingOrders.filter(o => o.id !== selectedOrder.id);
    if (remaining.length > 0) { setSelectedOrder(remaining[0]); setResults({}); setNotes(''); }
  };

  const handleAddOrder = () => {
    if (!newOrder.patient) { toast('الرجاء اختيار المريض', 'error'); return; }
    const testDef = TEST_DEFINITIONS[newOrder.testId];
    const id = `L-${500 + orders.length + 1}`;
    setOrders(prev => [...prev, {
      id, patient: newOrder.patient, test: testDef.name, doctor: newOrder.doctor,
      status: 'pending', urgent: newOrder.urgent, time: 'الآن', testId: newOrder.testId
    }]);
    toast(`تم إنشاء طلب تحليل جديد: ${testDef.name} ✓`);
    setIsAddingOrder(false);
    setNewOrder({ patient: PATIENTS_LIST[0], doctor: DOCTORS[0], testId: 'heme', urgent: false });
  };

  const currentTest = TEST_DEFINITIONS[selectedOrder?.testId || 'heme'] || TEST_DEFINITIONS['heme'];
  const activeOrders = activeTab === 'pending' ? pendingOrders : completedOrders;

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><FlaskConical className="w-8 h-8 text-primary" />المختبر والتحاليل</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest text-primary/40">Laboratory Information System</p>
          </div>
          <button onClick={() => setIsAddingOrder(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/25">
            <Plus className="w-5 h-5" />طلب فحص جديد
          </button>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto py-2">
          {testCategories.map((cat, i) => (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={cat.id}
              className="bg-white p-6 rounded-[2rem] border shadow-sm min-w-[200px] flex items-center gap-4 hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all"><cat.icon className="w-6 h-6" /></div>
              <div><h3 className="font-bold text-gray-900 whitespace-nowrap">{cat.name}</h3>
                <p className="text-xs text-gray-400 font-bold">{orders.filter(o => o.testId === cat.id && o.status !== 'completed').length} قيد العمل</p></div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm flex flex-col overflow-hidden min-h-[600px]">
          <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase font-mono">Laboratory Test Queue</h2>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('pending')} className={cn("px-6 py-2 bg-white border rounded-xl font-bold text-sm transition-all shadow-sm", activeTab === 'pending' ? "text-primary border-primary" : "text-gray-500")}>طلبات نشطة ({pendingOrders.length})</button>
              <button onClick={() => setActiveTab('history')} className={cn("px-6 py-2 bg-white border rounded-xl font-bold text-sm transition-all shadow-sm", activeTab === 'history' ? "text-primary border-primary" : "text-gray-500")}>مكتملة ({completedOrders.length})</button>
            </div>
          </div>

          <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              {activeOrders.length === 0 && (
                <div className="text-center py-16 text-gray-300"><FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-bold">لا توجد طلبات</p></div>
              )}
              {activeOrders.map((order, i) => (
                <motion.div key={order.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  onClick={() => handleSelectOrder(order)}
                  className={cn("p-5 bg-gray-50 border rounded-3xl group hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer",
                    selectedOrder?.id === order.id && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 bg-white rounded-2xl border flex items-center justify-center shadow-sm",
                      order.status === 'completed' ? "text-emerald-500" : "text-primary"
                    )}>
                      {order.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-gray-900">{order.test}</h3>
                        {order.urgent && <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full uppercase">عاجل</span>}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{order.patient} • {order.doctor}</p>
                      {order.status === 'completed' && <p className="text-[10px] text-emerald-500 font-bold mt-0.5">✓ {order.completedAt}</p>}
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-primary shrink-0" />
                </motion.div>
              ))}
            </div>

            {activeTab === 'pending' && selectedOrder && (
              <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-8 space-y-7 shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-2xl text-gray-900 italic tracking-tighter">{selectedOrder.test}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{selectedOrder.patient} • {selectedOrder.doctor}</p>
                  </div>
                  <span className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest animate-pulse",
                    selectedOrder.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-primary text-white"
                  )}>{selectedOrder.status === 'completed' ? 'Completed' : 'Live Entry'}</span>
                </div>
                <div className="space-y-4">
                  {currentTest.parameters.map(param => (
                    <LabParameterInput key={param.id} label={param.name} unit={param.unit} range={param.normalRange}
                      value={results[param.name] || ''} onChange={val => setResults(prev => ({ ...prev, [param.name]: val }))} />
                  ))}
                </div>
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">ملاحظات الفني</h4>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-gray-50 border rounded-2xl p-4 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-sm h-20 placeholder:italic" placeholder="أضف ملاحظات فني المختبر هنا..." />
                </div>
                <button onClick={handleSaveResults}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-gray-900/10">
                  اعتماد النتيجة وإصدار تقرير
                </button>
              </div>
            )}
            {activeTab === 'history' && selectedOrder && selectedOrder.status === 'completed' && (
              <div className="bg-emerald-50/50 rounded-[2rem] border-2 border-emerald-100 p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <h3 className="font-black text-xl text-gray-900">نتائج {selectedOrder.test}</h3>
                </div>
                <p className="text-sm font-bold text-gray-500">{selectedOrder.patient} • {selectedOrder.completedAt}</p>
                <div className="space-y-3">
                  {currentTest.parameters.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-white rounded-2xl">
                      <span className="font-black text-gray-700 text-sm italic">{p.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-900">{selectedOrder.results?.[p.name] || '—'} <span className="text-[10px] text-gray-400">{p.unit}</span></span>
                        <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-400 rounded font-black italic">طبيعي: {p.normalRange}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedOrder.notes && <div className="p-4 bg-white rounded-2xl"><p className="text-xs font-bold text-gray-400 uppercase mb-2">ملاحظات</p><p className="text-sm text-gray-700">{selectedOrder.notes}</p></div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAddingOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingOrder(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">طلب فحص مختبري جديد</h2>
                <button onClick={() => setIsAddingOrder(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">المريض</label>
                  <select value={newOrder.patient} onChange={e => setNewOrder(p => ({ ...p, patient: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">{PATIENTS_LIST.map(p => <option key={p}>{p}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الطبيب الآمر</label>
                  <select value={newOrder.doctor} onChange={e => setNewOrder(p => ({ ...p, doctor: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">{DOCTORS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">نوع التحليل</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TEST_DEFINITIONS).map(([id, def]) => (
                      <button key={id} onClick={() => setNewOrder(p => ({ ...p, testId: id }))}
                        className={cn("p-3 rounded-2xl text-xs font-bold text-right border-2 transition-all",
                          newOrder.testId === id ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-gray-50 text-gray-600 hover:border-gray-200"
                        )}>{def.name.split(' ')[0]}</button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 p-3 bg-rose-50 rounded-2xl cursor-pointer">
                  <input type="checkbox" checked={newOrder.urgent} onChange={e => setNewOrder(p => ({ ...p, urgent: e.target.checked }))} className="w-4 h-4 rounded accent-rose-500" />
                  <span className="text-sm font-bold text-rose-600">طلب عاجل</span>
                </label>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsAddingOrder(false)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={handleAddOrder} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">إنشاء الطلب</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
