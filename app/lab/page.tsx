'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  FlaskConical, 
  Search, 
  Plus, 
  Clock, 
  User, 
  Beaker, 
  Dna, 
  Microscope,
  FileText,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const testCategories = [
  { id: 'heme', name: 'أمراض الدم', icon: Beaker, count: 12 },
  { id: 'bio', name: 'كيمياء حيوية', icon: FlaskConical, count: 8 },
  { id: 'micro', name: 'الأحياء الدقيقة', icon: Microscope, count: 5 },
  { id: 'immuno', name: 'المناعة', icon: Dna, count: 4 },
];

const pendingOrders = [
  { id: 'L-501', patient: 'محمد حسن صالح', test: 'CBC (صورة دم كاملة)', doctor: 'د. خالد محمد', status: 'pending', urgent: true, time: '15 د' },
  { id: 'L-502', patient: 'سناء مصلح', test: 'T3, T4, TSH (هرمونات)', doctor: 'د. سارة أحمد', status: 'in-progress', urgent: false, time: '40 د', testId: 'bio' },
  { id: 'L-503', patient: 'علي فهد سالم', test: 'Liver Function (وظائف كبد)', doctor: 'د. خالد محمد', status: 'pending', urgent: false, time: '1 ساعة', testId: 'bio' },
];

const testDefinitions: Record<string, any> = {
  'heme': {
    name: 'CBC (صورة دم كاملة)',
    parameters: [
      { id: 1, name: 'WBC', unit: 'x10^3/µL', normalRange: '4.5 - 11.0' },
      { id: 2, name: 'RBC', unit: 'x10^6/µL', normalRange: '4.7 - 6.1' },
      { id: 3, name: 'Hemoglobin', unit: 'g/dL', normalRange: '14 - 18' },
      { id: 4, name: 'Platelets', unit: 'x10^3/µL', normalRange: '150 - 450' },
    ]
  },
  'bio': {
    name: 'Liver Function Test',
    parameters: [
      { id: 5, name: 'ALT', unit: 'U/L', normalRange: '7 - 56' },
      { id: 6, name: 'AST', unit: 'U/L', normalRange: '10 - 40' },
      { id: 7, name: 'Bilirubin', unit: 'mg/dL', normalRange: '0.1 - 1.2' },
    ]
  }
};

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'catalog' | 'history'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<any>(pendingOrders[0]);
  const [results, setResults] = useState<Record<string, string>>({});

  const currentTest = testDefinitions[selectedOrder?.testId === 'heme' ? 'heme' : 'bio'] || testDefinitions['heme'];

  const handleSubmit = () => {
    alert('تم حفظ النتائج بنجاح وإرسال التقرير للأرشفة');
  };

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-primary" />
              المختبر والتحاليل
            </h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest text-primary/40">Laboratory Information System</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/25">
            <Plus className="w-5 h-5" />
            طلب فحص جديد
          </button>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
          {testCategories.map((cat, i) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={cat.id}
              className="bg-white p-6 rounded-[2rem] border shadow-sm min-w-[200px] flex items-center gap-4 hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <cat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 whitespace-nowrap">{cat.name}</h3>
                <p className="text-xs text-gray-400 font-bold">{cat.count} فحص قيد العمل</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lab Results Feed */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm flex flex-col overflow-hidden min-h-[600px]">
          <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
             <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase font-mono">Laboratory Test Queue</h2>
             <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={cn(
                    "px-6 py-2 bg-white border rounded-xl font-bold text-sm transition-all shadow-sm",
                    activeTab === 'pending' ? "text-primary border-primary" : "text-gray-500"
                  )}
                >
                  طلبات نشطة
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    "px-6 py-2 bg-white border rounded-xl font-bold text-sm transition-all shadow-sm",
                    activeTab === 'history' ? "text-primary border-primary" : "text-gray-500"
                  )}
                >
                  مكتملة
                </button>
             </div>
          </div>

          <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
             {/* List of active requests */}
             <div className="space-y-4">
                {pendingOrders.map((order, i) => (
                  <motion.div 
                    key={order.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedOrder(order)}
                    className={cn(
                      "p-6 bg-gray-50 border rounded-3xl group hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer",
                      selectedOrder?.id === order.id && "border-primary bg-primary/5"
                    )}
                  >
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-all">
                          <FileText className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-black text-lg text-gray-900">{order.test}</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Patient: {order.patient} • {order.doctor}</p>
                       </div>
                     </div>
                     <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-primary" />
                  </motion.div>
                ))}
             </div>

             {/* Detailed Parameters Entry Form */}
             <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-8 space-y-8 shadow-inner">
                <div className="flex items-center justify-between">
                   <div>
                      <h3 className="font-black text-2xl text-gray-900 italic tracking-tighter">{selectedOrder?.test || 'Select Test'}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Entering Parameters Results</p>
                   </div>
                   <span className="px-4 py-1 bg-primary text-white rounded-full text-[10px] font-black uppercase italic tracking-widest animate-pulse">Live Entry</span>
                </div>
                
                <div className="space-y-4">
                   {currentTest.parameters.map((param: any) => (
                     <LabParameterInput 
                       key={param.id}
                       label={param.name} 
                       unit={param.unit} 
                       range={param.normalRange} 
                       value={results[param.name] || ''}
                       onChange={(val) => setResults(prev => ({ ...prev, [param.name]: val }))}
                     />
                   ))}
                </div>

                <div className="pt-6 border-t space-y-4">
                   <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Technical Remarks</h4>
                   <textarea 
                     className="w-full bg-gray-50 border rounded-2xl p-4 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-sm h-24 placeholder:italic"
                     placeholder="أضف ملاحظات فني المختبر هنا..."
                   />
                </div>

                <button 
                  onClick={handleSubmit}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-gray-900/10"
                >
                   اعتماد النتيجة وإصدار تقرير
                </button>
             </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function LabParameterInput({ label, unit, range, value, onChange }: { label: string, unit: string, range: string, value: string, onChange: (val: string) => void }) {
  // Simple heuristic for status
  const getStatus = (val: string, r: string) => {
    if (!val) return 'normal';
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
       <div className="w-32">
          <p className="font-black text-gray-900 text-base italic leading-none">{label}</p>
          <p className="text-[10px] text-gray-400 font-black uppercase italic mt-1 tracking-tighter">{unit}</p>
       </div>
       <div className="flex-1 relative">
          <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className={cn(
              "w-full bg-white border-2 px-4 py-3 rounded-xl font-black outline-none transition-all group-hover:shadow-md",
              status === 'low' ? "border-rose-100 text-rose-500 focus:border-rose-500" :
              status === 'high' ? "border-amber-100 text-amber-500 focus:border-amber-500" :
              "border-gray-50 text-gray-900 focus:border-primary"
            )}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
             {status === 'low' && <TrendingUp className="w-4 h-4 text-rose-500 rotate-180" />}
             {status === 'high' && <TrendingUp className="w-4 h-4 text-amber-500" />}
             <span className={cn(
               "text-[10px] font-black uppercase italic tracking-widest",
               status === 'normal' ? "text-emerald-500" : "text-rose-500"
             )}>{status}</span>
          </div>
       </div>
       <div className="w-24 text-center">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Normal Range</p>
          <p className="text-[10px] font-black text-gray-500 font-mono tracking-tighter">{range}</p>
       </div>
    </div>
  );
}
