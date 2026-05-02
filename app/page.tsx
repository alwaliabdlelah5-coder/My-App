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
  ClipboardList
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

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
          <div className="lg:col-span-2 space-y-6">
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

            {/* Quick Actions / Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-bold text-2xl">إجمالي التقارير</h3>
                  <p className="mt-2 text-white/80 opacity-90 leading-relaxed font-light">
                    تم إنشاء ومراجعة 124 تقريراً طبياً اليوم بنسبة زيادة 15٪ عن الأسبوع الماضي.
                  </p>
                  <button className="mt-6 bg-white text-primary px-6 py-2.5 rounded-2xl font-bold text-sm tracking-tight hover:bg-gray-100 transition-all flex items-center gap-2">
                    عرض التحليلات
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
                <Activity className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">كفاءة الأداء</h3>
                  <p className="text-gray-500 text-sm mt-1">متوسط وقت انتظار المريض انخفض بمعدل 4 دقائق هذا الشهر.</p>
                </div>
                <div className="flex gap-2 font-bold text-emerald-600">
                  <span className="text-2xl tracking-tighter">94%</span>
                  <Activity className="w-5 h-5 self-center" />
                </div>
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            {/* Real-time Queue */}
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between bg-orange-50/50">
                <h2 className="font-bold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-orange-500" />
                  قائمة الانتظار
                </h2>
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">8 حالات</span>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { name: 'علي فهد سالم', time: '12 دقيقة', type: 'عادي' },
                  { name: 'جابر يحيى', time: '5 دقائق', type: 'عاجل' },
                  { name: 'هند علي محمد', time: '3 دقائق', type: 'عادي' },
                  { name: 'سناء مصلح', time: 'دقيقة واحدة', type: 'VIP' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">منذ {item.time}</p>
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-lg",
                      item.type === 'عاجل' ? "bg-red-50 text-red-500" :
                      item.type === 'VIP' ? "bg-indigo-50 text-indigo-500" :
                      "bg-orange-50 text-orange-500"
                    )}>
                      {item.type}
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 py-3 text-sm font-bold text-gray-400 hover:text-primary transition-colors border-t border-dashed">
                  عرض القائمة الكاملة
                </button>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="bg-gray-900 rounded-3xl p-6 text-white space-y-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold tracking-tight">تنبيهات المخزون</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mt-4">
                  هناك 3 دُفعات من <span className="text-blue-400 font-bold">&quot;الأوجمنتين&quot;</span> ستنتهي صلاحيتها الأسبوع القادم. يرجى مراجعة الصيدلية.
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase">عاجل</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">PROXIMITY</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
