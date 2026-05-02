
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

import { useAppointments } from '@/hooks/use-appointments';

const initialAppointments = [
  { id: '1', patient: 'عبدالعزيز العتيبي', doctor: 'د. سارة خالد', service: 'استشارة عامة', time: '10:00 AM', status: 'confirmed', type: 'new' },
  { id: '2', patient: 'مريم الصنعاني', doctor: 'د. علي يحيى', service: 'فحص دوري', time: '10:30 AM', status: 'waiting', type: 'follow_up' },
  { id: '3', patient: 'ياسين منصور', doctor: 'د. أحمد المحمدي', service: 'متابعة سكري', time: '11:15 AM', status: 'cancelled', type: 'urgent' },
  { id: '4', patient: 'هناء محمد', doctor: 'د. سارة خالد', service: 'استشارة أطفال', time: '12:00 PM', status: 'confirmed', type: 'new' },
];

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateString = selectedDate.toISOString().split('T')[0];
  const { appointments: liveApps, loading } = useAppointments(dateString);

  const displayAppointments = loading ? initialAppointments : (liveApps.length > 0 ? liveApps.map(a => ({
    id: a.id,
    patient: a.patientName,
    doctor: a.doctorName,
    service: a.type,
    time: a.startTime,
    status: a.status,
    type: a.type
  })) : initialAppointments);

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              إدارة المواعيد والجدولة
            </h1>
            <p className="text-gray-500 mt-1 font-bold">تنظيم حجوزات المرضى، متابعة الحالات، وتنبيهات الحضور.</p>
          </div>
          <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary/95 transition-all shadow-xl shadow-primary/20 group">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            حجز موعد جديد
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* Calendar Picker Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-lg italic tracking-tighter">May 2026</h3>
                  <div className="flex gap-2">
                     <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                     <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
                  </div>
               </div>
               <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={`${d}-${i}`} className="text-[10px] font-black text-gray-300 uppercase">{d}</span>
                  ))}
               </div>
               <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <button 
                      key={i}
                      className={cn(
                        "aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all",
                        i + 1 === 2 ? "bg-primary text-white shadow-lg shadow-primary/25" : "hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
               <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-4">Daily Insights</h4>
               <div className="space-y-6">
                  <InsightItem label="إجمالي مواعيد اليوم" value="48" icon={CalendarIcon} />
                  <InsightItem label="حالات الانتظار" value="12" icon={Clock} />
                  <InsightItem label="نسبة الحضور" value="92%" icon={CheckCircle2} />
               </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-6">
             <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <div className="p-8 border-b bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm">
                      <button 
                        onClick={() => setViewMode('day')}
                        className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", viewMode === 'day' ? "bg-primary text-white shadow-md" : "text-gray-400")}
                      >
                        اليوم
                      </button>
                      <button 
                        onClick={() => setViewMode('week')}
                        className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", viewMode === 'week' ? "bg-primary text-white shadow-md" : "text-gray-400")}
                      >
                        الأسبوع
                      </button>
                      <button 
                        onClick={() => setViewMode('month')}
                        className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", viewMode === 'month' ? "bg-primary text-white shadow-md" : "text-gray-400")}
                      >
                        الشهر
                      </button>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-6 py-2 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all">
                        <Filter className="w-4 h-4" />
                        تصفية
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                   <div className="divide-y divide-gray-100">
                      {displayAppointments.map((app, i) => (
                        <motion.div 
                          key={app.id} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 flex items-center justify-between hover:bg-gray-50/80 transition-all group"
                        >
                           <div className="flex items-center gap-8">
                              <div className="flex flex-col items-center">
                                 <span className="text-xl font-black text-gray-900 tracking-tighter">{app.time.split(' ')[0]}</span>
                                 <span className="text-[10px] font-black text-gray-400 uppercase">{app.time.split(' ')[1]}</span>
                              </div>
                              <div className="w-1.5 h-12 rounded-full bg-gray-100 group-hover:bg-primary transition-all" />
                              <div>
                                 <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-gray-900 tracking-tighter">{app.patient}</h3>
                                    <span className={cn(
                                       "px-2 py-0.5 rounded-md text-[8px] font-black uppercase italic tracking-widest",
                                       app.type === 'urgent' ? "bg-rose-500 text-white" : 
                                       app.type === 'new' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                       {app.type}
                                    </span>
                                 </div>
                                 <p className="text-xs font-bold text-gray-400 mt-1 uppercase flex items-center gap-2">
                                    <User className="w-3 h-3 text-primary" />
                                    {app.doctor} • {app.service}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <span className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2",
                                app.status === 'confirmed' ? "bg-emerald-50 text-emerald-500" : 
                                app.status === 'waiting' ? "bg-amber-50 text-amber-500" : "bg-gray-100 text-gray-400"
                              )}>
                                 {app.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                                 {app.status === 'waiting' && <Clock className="w-3 h-3" />}
                                 {app.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                 {app.status}
                              </span>
                              <button className="p-3 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-sm">
                                 <MoreVertical className="w-5 h-5 text-gray-400" />
                              </button>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function InsightItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex items-center justify-between py-1 px-1">
       <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 rounded-xl">
             <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-bold text-white/50">{label}</span>
       </div>
       <span className="text-lg font-black text-white">{value}</span>
    </div>
  );
}
