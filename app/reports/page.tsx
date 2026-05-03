'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  FileBox, 
  Download, 
  ExternalLink,
  Target,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const visitData = [
  { month: 'Jan', visits: 450, revenue: 850000 },
  { month: 'Feb', visits: 520, revenue: 980000 },
  { month: 'Mar', visits: 480, revenue: 910000 },
  { month: 'Apr', visits: 610, revenue: 1150000 },
  { month: 'May', visits: 590, revenue: 1100000 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'run' | 'scheduled'>('run');

  const scheduledReports = [
    { id: 1, name: 'تقرير المبيعات اليومي', cron: '0 20 * * *', recipients: ['admin@medical.ye', 'finance@medical.ye'], status: 'active' },
    { id: 2, name: 'تنبيهات انتهاء المخزون', cron: '0 8 * * 1', recipients: ['pharmacy@medical.ye'], status: 'active' },
    { id: 3, name: 'إحصائيات أداء الأطباء', cron: '0 0 1 * *', recipients: ['director@medical.ye'], status: 'paused' },
  ];

  return (
    <Sidebar>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter uppercase font-mono">
                Reports & Insights
              </h1>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
                Advanced performance metrics & report scheduling
              </p>
           </div>
           <div className="flex items-center gap-3 bg-white border-2 border-gray-100 p-2 rounded-3xl shadow-sm">
              <button 
                onClick={() => setActiveTab('run')}
                className={cn(
                  "px-8 py-3 rounded-2xl text-xs font-black italic tracking-widest uppercase transition-all",
                  activeTab === 'run' ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-900"
                )}
              >
                تشغيل التقارير
              </button>
              <button 
                onClick={() => setActiveTab('scheduled')}
                className={cn(
                  "px-8 py-3 rounded-2xl text-xs font-black italic tracking-widest uppercase transition-all",
                  activeTab === 'scheduled' ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-900"
                )}
              >
                التقارير المجدولة
              </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
           {activeTab === 'run' ? (
             <motion.div
               key="run"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-8"
             >
                {/* Global Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <MetricCard label="إجمالي الزيارات" value="2,845" icon={Users} trend="+14%" isPositive={true} />
                   <MetricCard label="معدل بقاء المريض" value="78%" icon={Activity} trend="+2%" isPositive={true} />
                   <MetricCard label="متوسط الفاتورة" value="12,500" icon={Zap} trend="-5%" isPositive={false} />
                   <MetricCard label="نسبة رضا العملاء" value="4.8/5" icon={Target} trend="+0.2" isPositive={true} />
                </div>

                {/* Dynamic Data Visuals */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
                   <div className="bg-white rounded-[2.5rem] border shadow-sm p-10 flex flex-col">
                      <div className="flex items-center justify-between mb-10">
                         <h3 className="font-black text-2xl italic tracking-tighter uppercase font-mono">Growth vs Revenue</h3>
                         <button className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all"><Download className="w-5 h-5" /></button>
                      </div>
                      <div className="flex-1 h-[400px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitData}>
                               <defs>
                                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.2}/>
                                     <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }} />
                               <YAxis hide />
                               <Tooltip 
                                 content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                       return (
                                          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl font-black italic text-xs tracking-widest uppercase">
                                             {payload[0].value?.toLocaleString()} YER
                                          </div>
                                       );
                                    }
                                    return null;
                                 }}
                               />
                               <Area 
                                 type="monotone" 
                                 dataKey="revenue" 
                                 stroke="#2ecc71" 
                                 strokeWidth={4} 
                                 fillOpacity={1} 
                                 fill="url(#colorRevenue)" 
                               />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                      <div className="relative z-10 flex flex-col h-full">
                         <FileBox className="w-12 h-12 text-primary mb-8" />
                         <h4 className="text-3xl font-black italic tracking-tighter leading-none mb-4">Export Reports</h4>
                         <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] italic mb-10 leading-relaxed">
                            Generate professional documents in PDF, Excel, or JSON formats for regulatory compliance.
                         </p>
                         
                         <div className="space-y-4 flex-1">
                            <ExportAction label="Daily Operations Log" format="PDF" onClick={() => alert('Generating Daily Operations Log (PDF)...')} />
                            <ExportAction label="Inventory Valuation" format="Excel" onClick={() => alert('Exporting Inventory Valuation to XLSX...')} />
                            <ExportAction label="Financial Ledger 2026" format="PDF" onClick={() => alert('Preparing Financial Ledger report...')} />
                            <ExportAction label="Staff Performance" format="JSON" onClick={() => alert('Compiling Staff Performance data...')} />
                         </div>

                         <button 
                           onClick={() => alert('Archiving and downloading monthly report bundle...')}
                           className="mt-10 w-full py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl"
                         >
                            <Download className="w-5 h-5" />
                            Download Archive
                         </button>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                   </div>
                </div>
             </motion.div>
           ) : (
             <motion.div
               key="scheduled"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-white rounded-[2.5rem] border shadow-sm p-10 min-h-[600px]"
             >
                <div className="flex items-center justify-between mb-10 pb-8 border-b">
                   <div>
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase font-mono">Automated Delivery</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Manage recurring report triggers & recipients</p>
                   </div>
                   <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black italic tracking-tighter shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                      + Schedule New Report
                   </button>
                </div>

                <div className="space-y-4">
                   {scheduledReports.map(report => (
                     <div key={report.id} className="p-8 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-6">
                           <div className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center border-2",
                             report.status === 'active' ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-gray-100 border-gray-200 text-gray-400"
                           )}>
                              <Globe className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="font-black text-lg text-gray-900 italic tracking-tighter">{report.name}</h4>
                              <div className="flex items-center gap-4 mt-1">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> {report.cron}
                                 </p>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> {report.recipients.join(', ')}
                                 </p>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-3 bg-white border rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
                              <ExternalLink className="w-4 h-4" />
                           </button>
                           <button className="p-3 bg-white border rounded-xl text-gray-400 hover:text-rose-500 transition-all shadow-sm">
                              <Download className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Performance Board */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm p-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <PerformanceStat label="Clinic Utilization" percent={82} color="text-primary" />
              <PerformanceStat label="Pharmacy Turn Rate" percent={64} color="text-blue-500" />
              <PerformanceStat label="Lab Accuracy" percent={99} color="text-emerald-500" />
           </div>
        </div>
      </div>
    </Sidebar>
  );
}

function MetricCard({ label, value, icon: Icon, trend, isPositive }: { label: string, value: string, icon: any, trend: string, isPositive: boolean }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-primary/20 transition-all flex flex-col gap-6">
       <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
             <Icon className="w-6 h-6 text-primary group-hover:text-white transition-all shadow-sm" />
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black italic tracking-widest uppercase flex items-center gap-1",
            isPositive ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
          )}>
             {trend} <TrendingUp className={cn("w-3 h-3", !isPositive && "rotate-180")} />
          </div>
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-2">{label}</p>
          <h4 className="text-3xl font-black text-gray-900 tracking-tighter font-mono leading-none">{value}</h4>
       </div>
    </div>
  );
}

function ExportAction({ label, format, onClick }: { label: string, format: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl transition-all cursor-pointer group",
        onClick ? "hover:bg-white/10 active:scale-95" : ""
      )}
    >
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all">
             <Download className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm tracking-tighter italic">{label}</span>
       </div>
       <span className="text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded italic">{format}</span>
    </div>
  );
}

function PerformanceStat({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
       <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
             <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
             <circle 
               cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
               strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * percent) / 100}
               className={cn("transition-all duration-1000", color)}
             />
          </svg>
          <span className="absolute font-black text-xl italic tracking-tighter text-gray-900">{percent}%</span>
       </div>
       <div>
          <h5 className="font-black text-lg text-gray-900 italic tracking-tighter leading-none mb-1">{label}</h5>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-primary transition-colors">
            Analyze Data <ExternalLink className="w-3 h-3" />
          </button>
       </div>
    </div>
  );
}
