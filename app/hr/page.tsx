
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  FileText, 
  Search,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const employees = [
  { id: '1', name: 'د. أحمد المحمدي', role: 'طبيب استشاري', type: 'دائم', salary: '1200$', joinDate: '2023-01-15', status: 'active' },
  { id: '2', name: 'ليلى سالم', role: 'ممرض رئيسي', type: 'دائم', salary: '800$', joinDate: '2023-03-20', status: 'active' },
  { id: '3', name: 'محمد علي', role: 'محاسب', type: 'عقد مؤقت', salary: '600$', joinDate: '2024-02-10', status: 'active' },
  { id: '4', name: 'سارة خالد', role: 'فني مختبر', type: 'دائم', salary: '750$', joinDate: '2023-11-05', status: 'on_leave' },
];

export default function HRPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              شؤون الموظفين (HR)
            </h1>
            <p className="text-gray-500 mt-1 font-bold">إدارة الكوادر الطبية والإدارية، الرواتب، والعقود.</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/25">
            <UserPlus className="w-5 h-5" />
            إضافة موظف جديد
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="إجمالي الموظفين" value="24" icon={Users} color="blue" />
          <StatCard title="إجمالي الرواتب" value="18,400$" icon={DollarSign} color="emerald" />
          <StatCard title="طلبات الإجازة" value="3" icon={Calendar} color="amber" />
          <StatCard title="عقود تنتهي قريباً" value="2" icon={FileText} color="rose" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="بحث عن موظف بالاسم أو الوظيفة..."
                className="w-full pr-12 pl-4 py-3 bg-white border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
               <button className="px-6 py-3 bg-white border rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-all">تصفية</button>
               <button className="px-6 py-3 bg-white border rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-all">تصدير PDF</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest italic">
                  <th className="px-8 py-4">الموظف</th>
                  <th className="px-8 py-4">المسمى الوظيفي</th>
                  <th className="px-8 py-4">نوع العقد</th>
                  <th className="px-8 py-4">الراتب</th>
                  <th className="px-8 py-4">تاريخ الانضمام</th>
                  <th className="px-8 py-4">الحالة</th>
                  <th className="px-8 py-4">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/80 transition-all group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase shadow-sm border border-primary/5">
                          {emp.name.split(' ')[1]?.charAt(0) || emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-lg leading-none">{emp.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">ID: EMP-{emp.id.padStart(3, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="font-bold text-gray-700">{emp.role}</span>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-500">{emp.type}</td>
                    <td className="px-8 py-6 text-emerald-600 font-black">{emp.salary}</td>
                    <td className="px-8 py-6 text-gray-500 font-bold">{emp.joinDate}</td>
                    <td className="px-8 py-6 text-gray-500">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest",
                         emp.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                       )}>
                         {emp.status === 'active' ? 'نشط' : 'إجازة'}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <button className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links / Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <HRModuleCard 
             title="إدارة الرواتب" 
             desc="احتساب الرواتب، المكافآت، والخصومات الشهرية." 
             icon={DollarSign}
             color="emerald"
           />
           <HRModuleCard 
             title="الإجازات والحضور" 
             desc="تتبع الحضور اليومي وطلبات الإجازات السنوية." 
             icon={Clock}
             color="blue"
           />
           <HRModuleCard 
             title="الصلاحيات (RBAC)" 
             desc="تحديد أدوار المستخدمين والتحكم في الوصول." 
             icon={Shield}
             color="indigo"
           />
        </div>
      </div>
    </Sidebar>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-500 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-500 border-emerald-100",
    amber: "bg-amber-50 text-amber-500 border-amber-100",
    rose: "bg-rose-50 text-rose-500 border-rose-100"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex items-center gap-6"
    >
      <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 shadow-sm", colors[color])}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">{title}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

function HRModuleCard({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    indigo: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/20"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-primary/10 hover:shadow-xl hover:shadow-primary/5 transition-all group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center ring-4 shadow-inner mb-6", colors[color])}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
        {title}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-[-4px] md:group-hover:translate-x-[4px]" />
      </h3>
      <p className="text-gray-500 mt-2 font-bold leading-relaxed">{desc}</p>
    </div>
  );
}
