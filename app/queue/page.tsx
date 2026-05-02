
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Users, 
  Clock, 
  ArrowUp, 
  CheckCircle2, 
  Play, 
  Timer, 
  User, 
  MoreVertical,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const queue = [
  { id: 'Q-101', patient: 'يحيى صالح', doctor: 'د. سارة خالد', status: 'waiting', priority: 1, waitingTime: '15 min' },
  { id: 'Q-102', patient: 'هناء محمد', doctor: 'د. علي يحيى', status: 'in_progress', priority: 2, waitingTime: '45 min' },
  { id: 'Q-103', patient: 'عبدالله ناصر', doctor: 'د. سارة خالد', status: 'waiting', priority: 3, waitingTime: '5 min' },
  { id: 'Q-104', patient: 'منيرة أحمد', doctor: 'د. أحمد المحمدي', status: 'completed', priority: 1, waitingTime: '30 min' },
  { id: 'Q-105', patient: 'سالم الدوسري', doctor: 'د. علي يحيى', status: 'waiting', priority: 1, waitingTime: '2 min' },
];

export default function QueuePage() {
  const [activeDoctor, setActiveDoctor] = useState('All');
  
  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Statistics Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <StatCard label="المرضى في الانتظار" value="12" icon={Users} color="text-amber-500" bg="bg-amber-50" />
           <StatCard label="قيد الكشف" value="4" icon={Play} color="text-blue-500" bg="bg-blue-50" />
           <StatCard label="المتوسط الزمني" value="18 min" icon={Timer} color="text-emerald-500" bg="bg-emerald-50" />
           <StatCard label="إجمالي من تم فحصهم" value="145" icon={CheckCircle2} color="text-primary" bg="bg-primary/5" />
        </div>

        {/* Live Queue Board */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm flex flex-col overflow-hidden min-h-[700px]">
           <div className="p-8 border-b bg-gray-50/50 flex flex-col lg:flex-row justify-between items-center gap-6">
              <div>
                 <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase font-mono">Live Patient Flow</h2>
                 <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest italic">Real-time queue monitoring & priority management</p>
              </div>
              <div className="flex gap-2 p-1 bg-white border rounded-2xl shadow-inner group">
                 {['All', 'د. سارة خالد', 'د. علي يحيى', 'د. أحمد المحمدي'].map(doc => (
                    <button 
                      key={doc}
                      onClick={() => setActiveDoctor(doc)}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                        activeDoctor === doc ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                       {doc}
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Waiting List Column */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="font-black text-xs uppercase tracking-widest text-amber-500 italic">Waiting Room (8)</h3>
                    <div className="w-8 h-1 bg-amber-200 rounded-full" />
                 </div>
                 <div className="space-y-4">
                    {queue.filter(q => q.status === 'waiting').map((item, i) => (
                      <QueueItem key={item.id} item={item} />
                    ))}
                 </div>
              </div>

              {/* In Progress Column */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="font-black text-xs uppercase tracking-widest text-blue-500 italic">In Consultations (3)</h3>
                    <div className="w-8 h-1 bg-blue-200 rounded-full" />
                 </div>
                 <div className="space-y-4">
                    {queue.filter(q => q.status === 'in_progress').map((item, i) => (
                      <QueueItem key={item.id} item={item} active />
                    ))}
                 </div>
              </div>

              {/* Recently Completed */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="font-black text-xs uppercase tracking-widest text-emerald-500 italic">Completed Today (145)</h3>
                    <div className="w-8 h-1 bg-emerald-200 rounded-full" />
                 </div>
                 <div className="space-y-4">
                    {queue.filter(q => q.status === 'completed').map((item, i) => (
                      <QueueItem key={item.id} item={item} completed />
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Sidebar>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: { label: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-primary/20 transition-all">
       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", bg)}>
          <Icon className={cn("w-7 h-7", color)} />
       </div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic group-hover:text-primary transition-colors">{label}</p>
       <h4 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{value}</h4>
    </div>
  );
}

function QueueItem({ item, active, completed }: { item: any, active?: boolean, completed?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 group cursor-pointer",
        active ? "bg-blue-50/30 border-blue-100 shadow-lg" : 
        completed ? "bg-gray-50/50 border-transparent opacity-60 grayscale" : "bg-white border-gray-50 shadow-sm hover:border-primary/20"
      )}
    >
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={cn(
               "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black",
               item.priority === 3 ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-500"
             )}>
                {item.id.split('-')[1]}
             </div>
             <span className="text-xs font-black text-gray-400 font-mono tracking-widest">{item.id}</span>
          </div>
          {!completed && (
            <div className="flex gap-1">
               <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-all"><ArrowUp className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all"><MoreVertical className="w-4 h-4" /></button>
            </div>
          )}
       </div>

       <div>
          <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-none mb-1">{item.patient}</h4>
          <p className="text-[10px] font-bold text-gray-400 italic flex items-center gap-2 uppercase">
             <User className="w-3 h-3 text-primary" />
             {item.doctor}
          </p>
       </div>

       <div className="pt-4 border-t border-dashed flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Clock className="w-3 h-3 text-gray-300" />
             <span className="text-[10px] font-black text-gray-400 italic">{item.waitingTime} in queue</span>
          </div>
          {active ? (
            <div className="flex items-center gap-2">
               <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Live Consult</span>
            </div>
          ) : (
            <div className={cn(
              "p-1.5 rounded-full",
              item.priority === 3 ? "bg-rose-500 shadow-lg shadow-rose-500/25" : 
              item.priority === 2 ? "bg-amber-500 shadow-lg shadow-amber-500/25" : "bg-emerald-500 shadow-lg shadow-emerald-500/25"
            )} />
          )}
       </div>
    </motion.div>
  );
}
