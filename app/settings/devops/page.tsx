'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Shield, 
  Cpu, 
  Globe, 
  Database, 
  Github, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  Activity,
  Server
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function SettingsDevOpsPage() {
  const workflows = [
    { name: 'Database Migration', status: 'success', time: '2m ago', icon: Database },
    { name: 'Firebase Hosting', status: 'success', time: '1h ago', icon: Globe },
    { name: 'Android Build', status: 'failed', time: '3h ago', icon: Cpu },
  ];

  return (
    <Sidebar>
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase font-mono">DevOps & Infrastructure</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 italic">System Environment Management & CI/CD Status</p>
           </div>
           <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-500 rounded-xl text-[10px] font-black uppercase italic tracking-widest border border-emerald-100">
                Production Environment
              </span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatusCard label="Server Status" value="Operational" icon={Server} color="text-emerald-500" />
           <StatusCard label="Database Sync" value="99.9% Latency" icon={Database} color="text-indigo-500" />
           <StatusCard label="Security Level" value="Hardened" icon={Shield} color="text-rose-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* CI/CD Pipeline */}
           <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <h3 className="text-xl font-black italic tracking-tighter uppercase font-mono mb-8 flex items-center gap-3">
                 <Github className="w-6 h-6" />
                 GitHub Actions
              </h3>
              <div className="space-y-4">
                 {workflows.map((wf) => (
                   <div key={wf.name} className="flex items-center justify-between p-6 bg-gray-50 rounded-[1.5rem] border border-transparent hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                            <wf.icon className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-black text-gray-900 italic tracking-tighter">{wf.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase italic">{wf.time}</p>
                         </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest",
                        wf.status === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                      )}>
                         {wf.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                         {wf.status}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Environment Config Terminal */}
           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <h3 className="text-xl font-black italic tracking-tighter uppercase font-mono mb-8 flex items-center gap-3">
                 <Terminal className="w-6 h-6 text-primary" />
                 Active Config
              </h3>
              <div className="font-mono text-xs space-y-3 opacity-80">
                 <p className="text-primary italic font-black"># System Environment Variables</p>
                 <p><span className="text-gray-500">API_URL:</span> &quot;https://api.medical.ye&quot;</p>
                 <p><span className="text-gray-500">DB_TYPE:</span> &quot;postgresql&quot;</p>
                 <p><span className="text-gray-500">FLAVOR:</span> &quot;production&quot;</p>
                 <p><span className="text-gray-500">FIREBASE_ID:</span> &quot;medical-center-prod&quot;</p>
                 <div className="pt-6">
                    <p className="text-emerald-400 font-bold tracking-widest">{" >>> CONNECTION SECURE "}</p>
                    <p className="text-gray-600">{" >>> FETCHING NEW MIGRATIONS... "}</p>
                 </div>
              </div>
              <div className="absolute bottom-0 right-0 p-8 opacity-10">
                 <Activity className="w-32 h-32" />
              </div>
           </div>
        </div>
      </div>
    </Sidebar>
  );
}

function StatusCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col gap-6">
       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50", color)}>
          <Icon className="w-7 h-7" />
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{label}</p>
          <h4 className="text-2xl font-black text-gray-900 italic tracking-tighter">{value}</h4>
       </div>
    </div>
  );
}
