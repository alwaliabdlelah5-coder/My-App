'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Users, 
  Calendar, 
  Database, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  LogOut,
  Plus,
  Search,
  Bell,
  Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading, logout, signInWithGoogle } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Activity className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={signInWithGoogle} />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <nav className="w-20 lg:w-64 bg-gray-900/50 border-r border-white/5 flex flex-col items-center lg:items-start p-4 py-8">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block font-black text-xl italic tracking-tighter uppercase font-mono">
            IMP SYSTEM
          </span>
        </div>

        <div className="flex-1 w-full space-y-4">
          <NavItem icon={Plus} label="New Record" active />
          <NavItem icon={Calendar} label="Appointments" />
          <NavItem icon={Users} label="Patient Directory" />
          <NavItem icon={Database} label="Inventory" />
          <NavItem icon={ShieldCheck} label="Security" />
        </div>

        <div className="w-full pt-8 border-t border-white/5">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center lg:justify-start gap-4 p-3 rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-6 h-6" />
            <span className="hidden lg:block font-bold text-sm italic uppercase tracking-tighter">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-gray-900/30 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-xl">
          <div className="flex items-center gap-6 max-w-xl w-full">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="PROBE PATIENT DATABASE..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-xs font-mono tracking-widest focus:outline-none focus:border-blue-500/50 transition-all uppercase"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 uppercase">
            <button className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-blue-400 leading-none">MEDICAL STAFF</p>
                   <p className="text-xs font-black italic tracking-tighter mt-1">{user.user_metadata?.full_name || user.email}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gray-800 border border-white/10 overflow-hidden shadow-2xl relative">
                  {user.user_metadata?.avatar_url ? (
                    <Image 
                      src={user.user_metadata.avatar_url} 
                      alt="" 
                      fill
                      className="object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-500/10 text-blue-400">
                      <Users className="w-5 h-5" />
                    </div>
                  )}
               </div>
            </div>
          </div>
        </header>

        {/* Console / Dash */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Status Board */}
              <div className="lg:col-span-2 space-y-8">
                 <div className="flex items-end justify-between px-2">
                    <div>
                       <h2 className="text-3xl font-black italic tracking-tighter uppercase">Operations Console</h2>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2 italic">Real-time Clinical Synchronization • Node 042</p>
                    </div>
                    <div className="flex gap-2">
                       <PlatformIndicator icon={Smartphone} label="Android" status="online" />
                       <PlatformIndicator icon={Laptop} label="Windows" status="online" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard label="Daily Patients" value="128" trend="+12%" icon={Users} color="blue" />
                    <StatCard label="Applet Performance" value="99.9%" trend="stable" icon={Activity} color="green" />
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-sm font-black italic tracking-tighter uppercase flex items-center gap-3">
                          <Database className="w-4 h-4 text-blue-400" />
                          Subsurface Database Sync
                       </h3>
                       <span className="text-[10px] font-mono text-gray-500">LAST SYNC: 14:04:42</span>
                    </div>
                    
                    <div className="space-y-4">
                       <SyncItem label="Supabase Authentication" status="CONNECTED" />
                       <SyncItem label="PostgreSQL Instance" status="ACTIVE" />
                       <SyncItem label="GitHub Actions CI/CD" status="READY" />
                       <SyncItem label="Vercel Deployment" status="LIVE" />
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all" />
                 </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">
                 <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-600/20">
                    <h3 className="font-black italic tracking-tighter uppercase text-xl mb-4">Infrastructure Status</h3>
                    <p className="text-blue-100 text-xs font-medium leading-relaxed mb-8">
                       Your platform is automatically provisioned for Android, Windows, and Web via Vercel.
                       All data is synchronized across endpoints automatically using Supabase.
                    </p>
                    <button className="w-full bg-white text-blue-600 rounded-2xl py-3 font-black italic tracking-tighter uppercase text-xs hover:scale-105 active:scale-95 transition-all">
                       Deploy Updates
                    </button>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rotate-45 group-hover:scale-110 transition-all" />
                 </div>

                 <div className="bg-gray-900 border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-xs font-black italic tracking-tighter uppercase mb-6 text-gray-400">System Logs</h3>
                    <div className="space-y-4 font-mono text-[10px]">
                       <p className="text-gray-500 italic"><span className="text-blue-400 font-bold">[14:04:12]</span> SYS_INIT :: MULTI-PLATFORM STACK READY</p>
                       <p className="text-gray-500 italic"><span className="text-green-400 font-bold">[14:04:31]</span> SUPA_DB :: CONNECTION PERSISTED</p>
                       <p className="text-gray-500 italic"><span className="text-yellow-400 font-bold">[14:04:42]</span> VERCEL :: PRODUCTION BUILD LIVE</p>
                       <p className="text-gray-500 italic"><span className="text-purple-400 font-bold">[14:04:55]</span> GITHUB :: WORKFLOW SUCCESS</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-center lg:justify-start gap-4 p-3 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
      <Icon className="w-6 h-6" />
      <span className={`hidden lg:block font-extrabold text-sm italic uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {label}
      </span>
    </button>
  );
}

function PlatformIndicator({ icon: Icon, label, status }: { icon: any, label: string, status: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl py-1 px-3 flex items-center gap-2">
       <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
       <Icon className="w-3 h-3 text-gray-500" />
       <span className="text-[10px] font-black italic uppercase tracking-tighter text-gray-400">{label}</span>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: { label: string, value: string, trend: string, icon: any, color: 'blue' | 'green' }) {
  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20'
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:border-white/20 transition-all group">
       <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
             <Icon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-black italic uppercase ${trend.startsWith('+') ? 'text-green-400' : 'text-gray-500'}`}>
             {trend}
          </span>
       </div>
       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-3xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}

function SyncItem({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex items-center justify-between group">
       <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
       <div className="flex items-center gap-2">
          <div className="h-px w-24 bg-white/5 group-hover:bg-blue-500/20 transition-all" />
          <span className="text-[10px] font-black italic tracking-tighter text-blue-400 uppercase">{status}</span>
       </div>
    </div>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-950 font-sans">
      {/* Platform Branding */}
      <div className="hidden md:flex flex-col justify-between p-16 border-r border-white/5 relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                  <Activity className="w-7 h-7 text-white" />
               </div>
               <h1 className="text-4xl font-black italic tracking-tighter uppercase font-mono">IMP SYSTEM</h1>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-4 ml-1">Integrated Medical Platform</p>
         </div>

         <div className="relative z-10 space-y-12">
            <AuthBenefit 
              title="Multi-Platform Core" 
              desc="Compiled for Web, Android, and Windows from a single TypeScript origin."
              icon={Smartphone}
            />
            <AuthBenefit 
              title="Autonomous Infra" 
              desc="Automatic Supabase orchestration with Vercel and GitHub Action lifecycle management."
              icon={Database}
            />
            <div className="flex gap-6 pt-10 border-t border-white/5">
                <Laptop className="w-6 h-6 text-gray-700" />
                <Smartphone className="w-6 h-6 text-gray-700" />
                <ShieldCheck className="w-6 h-6 text-gray-700" />
            </div>
         </div>

         {/* Backdrop */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#1e3a8a_0%,_transparent_50%)] opacity-20" />
      </div>

      {/* Login Portal */}
      <div className="flex items-center justify-center p-8">
         <div className="max-w-md w-full space-y-12">
            <div>
               <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4">Command Portal</h2>
               <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-widest leading-loose">
                  Initialize medical session. Automatic database provisioning will trigger upon verification.
               </p>
            </div>

            <button 
              onClick={onLogin}
              className="w-full h-16 bg-white text-gray-900 rounded-3xl font-black italic tracking-tighter uppercase flex items-center justify-center gap-4 hover:bg-blue-500 hover:text-white transition-all shadow-2xl shadow-blue-600/10 active:scale-95 group"
            >
               <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center group-hover:bg-white transition-all">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white group-hover:fill-blue-600">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
               </div>
               Continue to Dashboard
            </button>

            <div className="pt-12 grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] opacity-40">
                   <p className="text-[10px] font-black italic text-blue-400 uppercase mb-2">Android</p>
                   <p className="text-[10px] font-bold text-gray-600 uppercase">Awaiting Build</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] opacity-40">
                   <p className="text-[10px] font-black italic text-blue-400 uppercase mb-2">Windows</p>
                   <p className="text-[10px] font-bold text-gray-600 uppercase">Awaiting Build</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function AuthBenefit({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div className="flex gap-6 max-w-sm">
       <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-blue-400" />
       </div>
       <div>
          <h4 className="font-black italic tracking-tighter uppercase text-white">{title}</h4>
          <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">{desc}</p>
       </div>
    </div>
  );
}
