
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Filter, 
  Download,
  Calendar,
  Wallet,
  Receipt,
  PieChart
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Sat', income: 45000, expense: 25000 },
  { name: 'Sun', income: 52000, expense: 28000 },
  { name: 'Mon', income: 38000, expense: 22000 },
  { name: 'Tue', income: 65000, expense: 32000 },
  { name: 'Wed', income: 48000, expense: 26000 },
  { name: 'Thu', income: 59000, expense: 29000 },
  { name: 'Fri', income: 12000, expense: 15000 },
];

const transactions = [
  { id: 'INV-001', entry: 'كشف مريض - عبدالعزيز العتيبي', type: 'income', amount: '5,000 ر.ي', date: '10:45 PM', method: 'نقداً' },
  { id: 'INV-002', entry: 'شراء لوازم مخبرية', type: 'expense', amount: '12,500 ر.ي', date: '09:30 PM', method: 'تحويل' },
  { id: 'INV-003', entry: 'صرف وصفة طبية - مريم الصنعاني', type: 'income', amount: '8,200 ر.ي', date: '08:15 PM', method: 'نقداً' },
  { id: 'INV-004', entry: 'كشف مريض - ياسين منصور', type: 'income', amount: '4,500 ر.ي', date: '07:45 PM', method: 'بطاقة' },
];

export default function FinancePage() {
  return (
    <Sidebar>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter">
              <DollarSign className="w-8 h-8 text-primary" />
              FINANCIAL ACCOUNTS
            </h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
              Real-time revenue monitoring & invoice management
            </p>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-600 hover:border-primary transition-all shadow-sm">
                <Download className="w-5 h-5" />
                تحميل الكشف
             </button>
             <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-primary transition-all shadow-xl shadow-gray-900/10">
                <Plus className="w-5 h-5" />
                سند صرف جديد
             </button>
          </div>
        </div>

        {/* Financial Snapshots */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <FinanceStat label="صافي الدخل (اليوم)" value="128,450" icon={TrendingUp} trend="+12.5%" isIncrease />
           <FinanceStat label="المصروفات التشغيلية" value="42,100" icon={Wallet} trend="+2.1%" isIncrease={false} />
           <FinanceStat label="الفواتير المعلقة" value="15,800" icon={Receipt} trend="-4.2%" isIncrease />
           <FinanceStat label="الرصيد النقدي" value="1,245,000" icon={CreditCard} trend="+5.8%" isIncrease />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
           <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-xl italic tracking-tighter">Revenue Analysis</h3>
                 <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase italic">
                       <div className="w-2 h-2 rounded-full bg-primary" /> Income
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase italic">
                       <div className="w-2 h-2 rounded-full bg-gray-200" /> Expense
                    </span>
                 </div>
              </div>
              <div className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={8}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis 
                         dataKey="name" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                       />
                       <YAxis hide />
                       <Tooltip 
                         cursor={{ fill: 'transparent' }} 
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
                       <Bar dataKey="income" fill="#2ecc71" radius={[8, 8, 0, 0]} />
                       <Bar dataKey="expense" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                 <div className="relative z-10">
                    <PieChart className="w-10 h-10 mb-6" />
                    <h4 className="text-2xl font-black tracking-tighter italic">Operational Costs</h4>
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">Breakdown by Department</p>
                    <div className="mt-8 space-y-4">
                       <CostProgress label="Pharmacy & Drugs" percent={65} />
                       <CostProgress label="Clinic Supplies" percent={20} />
                       <CostProgress label="Staff Payroll" percent={15} />
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
              </div>
           </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
           <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-black text-xl italic tracking-tighter uppercase">Recent Audit Trail</h3>
              <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline italic">View Ledger</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-right">
                 <thead>
                    <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest italic border-b">
                       <th className="px-8 py-5">المستند</th>
                       <th className="px-8 py-5">البيان / العملية</th>
                       <th className="px-8 py-5">طريقة الدفع</th>
                       <th className="px-8 py-5">الوقت</th>
                       <th className="px-8 py-5 text-left">القيمة (ر.ي)</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {transactions.map((t, i) => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-all group">
                         <td className="px-8 py-6">
                            <span className="font-black text-gray-400 font-mono text-xs">{t.id}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className={cn(
                                 "w-10 h-10 rounded-xl flex items-center justify-center border",
                                 t.type === 'income' ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-rose-50 text-rose-500 border-rose-100"
                               )}>
                                  {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                               </div>
                               <span className="font-black text-gray-900 tracking-tighter">{t.entry}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase italic tracking-widest">{t.method}</span>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-xs font-bold text-gray-400 italic font-mono">{t.date}</span>
                         </td>
                         <td className="px-8 py-6 text-left">
                            <span className={cn(
                              "font-black text-lg tracking-tighter",
                              t.type === 'income' ? "text-emerald-500" : "text-rose-500"
                            )}>
                               {t.type === 'income' ? '+' : '-'}{t.amount}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </Sidebar>
  );
}

function FinanceStat({ label, value, icon: Icon, trend, isIncrease }: { label: string, value: string, icon: any, trend: string, isIncrease: boolean }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-primary/20 transition-all">
       <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
             <Icon className="w-6 h-6 text-primary group-hover:text-white transition-all" />
          </div>
          <span className={cn(
            "text-[10px] font-black italic px-2 py-1 rounded-lg",
            isIncrease ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
          )}>{trend}</span>
       </div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1">{label}</p>
       <h4 className="text-2xl font-black text-gray-900 tracking-tighter font-mono">{value} <span className="text-xs font-bold text-gray-300">YER</span></h4>
    </div>
  );
}

function CostProgress({ label, percent }: { label: string, percent: number }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest italic">
          <span>{label}</span>
          <span>{percent}%</span>
       </div>
       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
       </div>
    </div>
  );
}
