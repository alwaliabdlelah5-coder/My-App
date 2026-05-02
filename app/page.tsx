'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Clock,
  ArrowDownRight,
  Plus,
  ClipboardList,
  Stethoscope,
  Package,
  CreditCard,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const stats = [
  { 
    name: 'المرضى اليوم', 
    value: '42', 
    trend: '+12%', 
    trendUp: true, 
    icon: Users,
    color: 'blue'
  },
  { 
    name: 'المواعيد القادمة', 
    value: '24', 
    trend: '3 غياب', 
    trendUp: false, 
    icon: Calendar,
    color: 'emerald'
  },
  { 
    name: 'الإيرادات اليومية', 
    value: '12,450 ر.ي', 
    trend: '+8%', 
    trendUp: true, 
    icon: TrendingUp,
    color: 'indigo'
  },
  { 
    name: 'حالات في الانتظار', 
    value: '8', 
    trend: 'متوسط 15 د', 
    trendUp: true, 
    icon: Clock,
    color: 'orange'
  },
];

const upcomingAppointments = [
  { id: 1, name: 'سناء علي عبد الله', time: '10:30 ص', type: 'استشارة قلبية', doctor: 'د. خالد محمد', status: 'منتظر' },
  { id: 2, name: 'محمد حسن صالح', time: '11:00 ص', type: 'فحص عام', doctor: 'د. سارة أحمد', status: 'مؤكد' },
  { id: 3, name: 'ليلى مرشد السعدي', time: '11:15 ص', type: 'متابعة سكري', doctor: 'د. خالد محمد', status: 'مؤكد' },
];

const growthData = [
  { day: 'Sat', patients: 12 },
  { day: 'Sun', patients: 18 },
  { day: 'Mon', patients: 15 },
  { day: 'Tue', patients: 22 },
  { day: 'Wed', patients: 30 },
  { day: 'Thu', patients: 25 },
  { day: 'Fri', patients: 10 },
];

export default function Dashboard() {
  return (
    <Sidebar>
      <div className="space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase font-mono">
              Command Center
            </h1>
            <p className="text-gray-500 mt-1 font-bold italic uppercase text-[10px] tracking-[0.2em]">
              Welcome back, Dr. Ahmed • Hospital Performance Overview
            </p>
          </motion.div>
          <div className="flex gap-4">
             <button className="bg-white border-2 border-gray-100 text-gray-900 px-8 py-3 rounded-2xl font-black italic tracking-tighter shadow-sm hover:border-primary transition-all">
                View Schedule
             </button>
             <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 italic tracking-tighter">
                <Plus className="w-5 h-5" />
                CREATE APPOINTMENT
             </button>
          </div>
        </div>

        {/* Quick Access Hub */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
           <QuickAction icon={Users} label="المرضى" href="/patients" color="bg-blue-50 text-blue-600" />
           <QuickAction icon={Calendar} label="المواعيد" href="/appointments" color="bg-emerald-50 text-emerald-600" />
           <QuickAction icon={Stethoscope} label="العيادات" href="/clinic" color="bg-purple-50 text-purple-600" />
           <QuickAction icon={Package} label="المخزون" href="/inventory" color="bg-amber-50 text-amber-600" />
           <QuickAction icon={Activity} label="المختبر" href="/lab" color="bg-rose-50 text-rose-600" />
           <QuickAction icon={CreditCard} label="المالية" href="/finance" color="bg-indigo-50 text-indigo-600" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.name}
              className="bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                  stat.color === 'blue' ? "bg-blue-50 text-blue-600 shadow-blue-100" :
                  stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 shadow-emerald-100" :
                  stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 shadow-indigo-100" :
                  "bg-orange-50 text-orange-600 shadow-orange-100"
                )}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black italic uppercase px-3 py-1 rounded-full",
                  stat.trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-8 relative z-10">
                <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest italic">{stat.name}</h3>
                <p className="text-4xl font-black text-gray-900 mt-1 tracking-tighter italic font-mono">{stat.value}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50/50 rounded-full group-hover:bg-primary/5 transition-all" />
            </motion.div>
          ))}
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black italic tracking-tighter uppercase font-mono">Patient Flow Analytics</h3>
                  <div className="flex gap-2">
                     <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase italic">
                        <div className="w-2 h-2 rounded-full bg-primary" /> Daily Load
                     </span>
                  </div>
               </div>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={growthData}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                        />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl font-black italic text-xs tracking-widest uppercase animate-in fade-in zoom-in-95 duration-200">
                                  {payload[0].value} PATIENTS
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="patients" radius={[10, 10, 10, 10]} barSize={40}>
                           {growthData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 4 ? '#2563eb' : '#f1f5f9'} 
                                className="transition-all hover:opacity-80"
                              />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="font-bold text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  المواعيد القادمة (اليوم)
                </h2>
                <button className="text-primary font-bold text-sm hover:underline">عرض الكل</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">اسم المريض</th>
                      <th className="px-6 py-4 text-xs">نوع الزيارة</th>
                      <th className="px-6 py-4">الوقت</th>
                      <th className="px-6 py-4">الطبيب</th>
                      <th className="px-6 py-4 text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {upcomingAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-900">{app.name}</td>
                        <td className="px-6 py-4 text-gray-500">{app.type}</td>
                        <td className="px-6 py-4 font-medium text-primary">{app.time}</td>
                        <td className="px-6 py-4 text-gray-600">{app.doctor}</td>
                        <td className="px-6 py-4 text-center">
                          <div className={cn(
                            "mx-auto w-fit px-3 py-1 rounded-full text-xs font-bold",
                            app.status === 'منتظر' ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
                          )}>
                            {app.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            {/* Real-time Queue */}
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between bg-orange-50/50">
                <h2 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest italic text-orange-600">
                  <ClipboardList className="w-4 h-4" />
                  قائمة الانتظار
                </h2>
                <span className="bg-orange-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider italic">8 CASES</span>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { name: 'علي فهد سالم', time: '12 دقيقة', type: 'عادي' },
                  { name: 'جابر يحيى', time: '5 دقائق', type: 'عاجل' },
                  { name: 'هند علي محمد', time: '3 دقائق', type: 'عادي' },
                  { name: 'سناء مصلح', time: 'دقيقة واحدة', type: 'VIP' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-[1.5rem] transition-all cursor-pointer border border-transparent hover:border-gray-100 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 truncate tracking-tighter italic leading-none">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Wait: {item.time}</p>
                    </div>
                    <div className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded italic uppercase tracking-widest transition-all",
                      item.type === 'عاجل' ? "bg-rose-500 text-white" :
                      item.type === 'VIP' ? "bg-indigo-500 text-white" :
                      "bg-orange-500 text-white"
                    )}>
                      {item.type}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-dashed">
                  <Link href="/queue">
                    <button className="w-full py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2 group">
                      MANAGE FULL QUEUE
                      <ChevronLeft className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-4 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-black italic tracking-tighter text-xl">Stock Alert</h3>
                </div>
                <p className="text-sm text-white/40 leading-relaxed mt-6 font-bold uppercase tracking-tight italic">
                  Critical shortage detected for <span className="text-primary">&quot;Augmentin 625mg&quot;</span>. Only 12 units remaining in central pharmacy.
                </p>
                <div className="flex gap-2 mt-8">
                  <span className="text-[10px] bg-rose-500/20 text-rose-500 px-3 py-1 rounded-lg font-black uppercase italic tracking-widest border border-rose-500/30">Immediate Action</span>
                  <span className="text-[10px] bg-white/5 text-white/40 px-3 py-1 rounded-lg font-black uppercase italic tracking-widest border border-white/5">PROXIMITY</span>
                </div>
                <Link href="/pharmacy" className="block mt-10">
                  <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black italic tracking-tighter uppercase text-sm hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20">
                    Restock Inventory
                  </button>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function QuickAction({ icon: Icon, label, href, color }: { icon: any, label: string, href: string, color: string }) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-white p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-4 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 group border border-transparent"
      >
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", color)}>
          <Icon className="w-7 h-7" />
        </div>
        <span className="text-sm font-black text-gray-900 italic tracking-tighter uppercase">{label}</span>
      </motion.button>
    </Link>
  );
}
