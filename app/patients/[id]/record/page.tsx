'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Activity, 
  FileText, 
  Thermometer, 
  Droplets, 
  Wind, 
  Heart, 
  Pill, 
  TestTube, 
  History, 
  Plus, 
  Download,
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area 
} from 'recharts';

const vitalData = [
  { time: '08:00', bp: 120, heartRate: 72, temp: 36.6 },
  { time: '12:00', bp: 125, heartRate: 75, temp: 37.0 },
  { time: '16:00', bp: 118, heartRate: 68, temp: 36.8 },
  { time: '20:00', bp: 122, heartRate: 70, temp: 32.7 },
];

const medicalHistory = [
  { date: '2024-03-15', condition: 'التهاب الجيوب الأنفية', provider: 'د. خالد محسن', status: 'تعافى' },
  { date: '2023-11-20', condition: 'ارتفاع ضغط الدم', provider: 'د. سارة أحمد', status: 'مستمر' },
  { date: '2022-06-05', condition: 'حساسية الربيع', provider: 'د. يحيى حسن', status: 'موسمي' },
];

const prescriptions = [
  { name: 'Amoxicillin 500mg', dosage: 'حبة كل 8 ساعات', duration: '7 أيام', status: 'نشط' },
  { name: 'Lisinopril 10mg', dosage: 'حبة يومياً', duration: 'مستمر', status: 'نشط' },
  { name: 'Panadol Extra', dosage: 'عند اللزوم', duration: '-', status: 'مكتمل' },
];

const labResults = [
  { test: 'Complete Blood Count (CBC)', date: '2024-04-20', result: 'Normal', status: 'Final' },
  { test: 'Lipid Profile', date: '2024-04-20', result: 'High Cholesterol', status: 'Final' },
  { test: 'Blood Sugar (Fasting)', date: '2024-05-01', result: '95 mg/dL', status: 'Pending' },
];

export default function PatientRecordPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'history' | 'meds' | 'labs'>('overview');

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: FileText },
    { id: 'vitals', label: 'العلامات الحيوية', icon: Activity },
    { id: 'history', label: 'السجل الطبي', icon: History },
    { id: 'meds', label: 'الأدوية', icon: Pill },
    { id: 'labs', label: 'المختبر', icon: TestTube },
  ];

  return (
    <Sidebar>
      <div className="space-y-8 pb-12">
        {/* Patient Profile Header */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm p-10 flex flex-col md:flex-row items-center gap-10">
           <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-500 text-5xl font-black italic border-4 border-white shadow-xl shadow-indigo-100">
             S
           </div>
           <div className="flex-1 space-y-4 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                 <div>
                    <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter">سناء علي عبد الله</h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">File Number: P-1001 • Age: 28 • Male</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black italic text-xs shadow-lg shadow-gray-900/10 hover:bg-primary transition-all">
                       <Plus className="w-4 h-4" />
                       New Entry
                    </button>
                    <button className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                       <Download className="w-5 h-5 text-gray-400" />
                    </button>
                 </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <Tag label="B+" icon={Droplets} color="text-rose-500 bg-rose-50" />
                 <Tag label="72 kg" icon={Activity} color="text-emerald-500 bg-emerald-50" />
                 <Tag label="168 cm" icon={Target} color="text-indigo-500 bg-indigo-50" />
                 <Tag label="No Allergies" icon={AlertCircle} color="text-gray-400 bg-gray-50" />
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-[2rem] overflow-x-auto no-scrollbar">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex items-center gap-3 px-8 py-4 rounded-3xl text-sm font-black italic tracking-widest uppercase transition-all whitespace-nowrap",
                 activeTab === tab.id ? "bg-white text-gray-900 shadow-xl" : "text-gray-400 hover:text-gray-600"
               )}
             >
                <tab.icon className="w-4 h-4" />
                {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="min-h-[500px]"
           >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-8">
                      <div className="bg-white rounded-[2.5rem] border shadow-sm p-10">
                         <h3 className="text-2xl font-black italic tracking-tighter uppercase font-mono mb-8 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-emerald-500" />
                            Recent Activity
                         </h3>
                         <div className="space-y-6">
                            {[1, 2, 3].map((_, i) => (
                               <div key={i} className="flex gap-6 pb-6 border-b last:border-0 border-gray-50">
                                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                                     <Clock className="w-6 h-6 text-indigo-500" />
                                  </div>
                                  <div className="space-y-1 flex-1">
                                     <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-gray-900">Patient Consultation</h4>
                                        <span className="text-[10px] font-black text-gray-300 uppercase italic">MAY 02, 2024</span>
                                     </div>
                                     <p className="text-sm text-gray-500 leading-relaxed">
                                        Routine checkup for blood pressure monitoring. Patient reports slight improvement in sleep patterns.
                                     </p>
                                     <div className="flex items-center gap-2 mt-3">
                                        <span className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-400 rounded uppercase">DR. KHaled MOHSIN</span>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-500 rounded uppercase">Completed</span>
                                     </div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <div className="bg-rose-500 rounded-[2.5rem] p-10 text-white shadow-xl shadow-rose-100">
                         <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                            <AlertCircle className="w-6 h-6" />
                            Critical Alerts
                         </h3>
                         <div className="space-y-4">
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                               <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60">Allergy</p>
                               <p className="font-black italic">Penicillin Sensitivity</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                               <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60">Chronic</p>
                               <p className="font-black italic">Stage 1 Hypertension</p>
                            </div>
                         </div>
                      </div>
                      <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white">
                         <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6">Quick Stats</h3>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Visits This Year</span>
                               <span className="text-2xl font-black text-primary">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Prescriptions</span>
                               <span className="text-2xl font-black text-primary">05</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Lab Reports</span>
                               <span className="text-2xl font-black text-primary">08</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'vitals' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-white rounded-[2.5rem] border shadow-sm p-10">
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase font-mono mb-10">Blood Pressure History</h3>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={vitalData}>
                               <defs>
                                  <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }} />
                               <YAxis domain={['low', 'auto']} hide />
                               <Tooltip 
                                 content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                       return (
                                          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl font-black italic text-xs tracking-widest uppercase">
                                             {payload[0].value} mmHg
                                          </div>
                                       );
                                    }
                                    return null;
                                 }}
                               />
                               <Area 
                                 type="monotone" 
                                 dataKey="bp" 
                                 stroke="#818cf8" 
                                 strokeWidth={4} 
                                 fillOpacity={1} 
                                 fill="url(#colorBp)" 
                               />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                   <div className="bg-white rounded-[2.5rem] border shadow-sm p-10">
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase font-mono mb-10">Heart Rate Tracking</h3>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }} />
                               <YAxis hide />
                               <Tooltip 
                                 content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                       return (
                                          <div className="bg-rose-500 text-white p-4 rounded-2xl shadow-xl font-black italic text-xs tracking-widest uppercase">
                                             {payload[0].value} BPM
                                          </div>
                                       );
                                    }
                                    return null;
                                 }}
                               />
                               <Line 
                                 type="monotone" 
                                 dataKey="heartRate" 
                                 stroke="#f43f5e" 
                                 strokeWidth={4} 
                                 dot={{ r: 6, fill: '#f43f5e', strokeWidth: 4, stroke: '#fff' }}
                                 activeDot={{ r: 8 }}
                               />
                            </LineChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="bg-white rounded-[2.5rem] border shadow-sm p-10">
                   <div className="flex items-center justify-between mb-10 pb-8 border-b">
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase font-mono">Clinical History</h3>
                      <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-2 border-indigo-100 px-6 py-2 rounded-xl hover:bg-indigo-50 transition-all">
                        + Add Record
                      </button>
                   </div>
                   <div className="space-y-4">
                      {medicalHistory.map((item, i) => (
                        <div key={i} className="p-8 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-between group hover:border-gray-200 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400">
                                 <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                 <h4 className="font-black text-lg text-gray-900 italic tracking-tighter">{item.condition}</h4>
                                 <div className="flex items-center gap-4 mt-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.provider}</span>
                                 </div>
                              </div>
                           </div>
                           <span className={cn(
                             "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest",
                             item.status === 'تعافى' ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
                           )}>
                              {item.status}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'meds' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 bg-white rounded-[2.5rem] border shadow-sm p-10">
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase font-mono mb-10">Current Prescriptions</h3>
                      <div className="space-y-4">
                         {prescriptions.map((med, i) => (
                           <div key={i} className="p-8 bg-indigo-50/30 border border-indigo-100/50 rounded-[2rem] flex items-center justify-between group hover:bg-indigo-50 transition-all">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                                    <Pill className="w-7 h-7" />
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-black text-xl text-indigo-900 italic tracking-tighter">{med.name}</h4>
                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest italic">{med.dosage} • {med.duration}</p>
                                 </div>
                              </div>
                              <button className="p-4 bg-white rounded-2xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                                 <Plus className="w-5 h-5" />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-gray-50 rounded-[2.5rem] p-10 flex flex-col items-center text-center justify-center space-y-6">
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-gray-300 border shadow-sm">
                         <Droplets className="w-12 h-12" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black italic tracking-tighter text-gray-900">Pharmacy Pick-up</h4>
                         <p className="text-sm text-gray-500 mt-2 font-medium">Next refill scheduled for May 15, 2024 at Al-Amal Pharmacy.</p>
                      </div>
                      <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs">
                        Refill All Meds
                      </button>
                   </div>
                </div>
              )}

              {activeTab === 'labs' && (
                <div className="bg-white rounded-[2.5rem] border shadow-sm p-10">
                   <h3 className="text-2xl font-black italic tracking-tighter uppercase font-mono mb-10">Laboratory Results</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {labResults.map((lab, i) => (
                        <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] border hover:border-indigo-200 transition-all cursor-pointer">
                           <div className="flex items-center justify-between mb-6">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">{lab.date}</span>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[8px] font-black uppercase italic tracking-widest",
                                lab.status === 'Final' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                              )}>
                                 {lab.status}
                              </span>
                           </div>
                           <h4 className="text-xl font-black text-gray-900 italic tracking-tighter mb-2">{lab.test}</h4>
                           <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-indigo-500 italic">{lab.result}</span>
                              <Download className="w-4 h-4 text-gray-300 ml-auto" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </motion.div>
        </AnimatePresence>
      </div>
    </Sidebar>
  );
}

function Tag({ label, icon: Icon, color }: { label: string, icon: any, color: string }) {
  return (
    <div className={cn("px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black italic tracking-widest uppercase", color)}>
       <Icon className="w-3 h-3" />
       {label}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-primary/20 transition-all flex flex-col gap-6">
       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
          <Icon className="w-6 h-6 text-primary group-hover:text-white transition-all shadow-sm" />
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-2">{label}</p>
          <h4 className="text-3xl font-black text-gray-900 tracking-tighter font-mono leading-none">{value}</h4>
       </div>
    </div>
  );
}
