import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Activity, FileBarChart, FileText, PieChart, TrendingUp, Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const reportDefinitions = [
  { id: 'revenue', name: 'تقرير الإيرادات اليومية', desc: 'ملخص الإيرادات حسب القسم', icon: TrendingUp, color: 'emerald', format: ['PDF', 'EXCEL', 'CSV'] },
  { id: 'visits', name: 'تقرير زيارات المرضى', desc: 'عدد الزيارات حسب الطبيب والتخصص', icon: Activity, color: 'blue', format: ['PDF', 'EXCEL'] },
  { id: 'prescriptions', name: 'تقرير الوصفات الطبية', desc: 'أكثر الأدوية وصفاً واستهلاكاً', icon: FileText, color: 'indigo', format: ['PDF', 'CSV'] },
  { id: 'inventory', name: 'تقرير المخزون', desc: 'الحركة والأرصدة ونقاط إعادة الطلب', icon: FileBarChart, color: 'amber', format: ['EXCEL', 'CSV'] },
];

const revenueData = [
  { name: 'العيادات', value: 42000, fill: '#2563eb' },
  { name: 'المختبر', value: 18500, fill: '#10b981' },
  { name: 'الصيدلية', value: 25000, fill: '#f59e0b' },
  { name: 'الأشعة', value: 12800, fill: '#8b5cf6' },
];

const weeklyData = [
  { day: 'السبت', visits: 12, revenue: 45000 }, { day: 'الأحد', visits: 18, revenue: 62000 },
  { day: 'الاثنين', visits: 15, revenue: 38000 }, { day: 'الثلاثاء', visits: 22, revenue: 71000 },
  { day: 'الأربعاء', visits: 30, revenue: 55000 }, { day: 'الخميس', visits: 25, revenue: 84000 },
  { day: 'الجمعة', visits: 10, revenue: 23000 },
];

const topDoctors = [
  { name: 'د. خالد محمد', visits: 48, revenue: 240000 },
  { name: 'د. سارة أحمد', visits: 42, revenue: 185000 },
  { name: 'د. علي يحيى', visits: 35, revenue: 162000 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-xl text-xs font-black">
        <p className="text-gray-400 italic mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(reportDefinitions[0]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Activity className="w-8 h-8 text-primary" />التقارير والإحصاءات</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40">Analytics & Reporting Engine</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm">
              {[['today', 'اليوم'], ['week', 'الأسبوع'], ['month', 'الشهر']].map(([key, label]) => (
                <button key={key} onClick={() => setDateRange(key as any)} className={cn("px-4 py-2 rounded-xl font-bold text-xs transition-all",
                  dateRange === key ? "bg-primary text-white shadow-md" : "text-gray-400"
                )}>{label}</button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-50 shadow-sm"><RefreshCw className="w-4 h-4" />تحديث</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportDefinitions.map((rep, i) => (
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={rep.id} onClick={() => setSelectedReport(rep)}
              className={cn("p-6 rounded-3xl border text-right transition-all hover:shadow-xl hover:-translate-y-1 group",
                selectedReport.id === rep.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "bg-white border-gray-100 shadow-sm"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all group-hover:scale-110",
                rep.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : rep.color === 'blue' ? "bg-blue-50 text-blue-600" :
                rep.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
              )}><rep.icon className="w-6 h-6" /></div>
              <p className="font-black text-gray-900 text-sm">{rep.name}</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1 italic">{rep.desc}</p>
              <div className="flex flex-wrap gap-1 mt-4">
                {rep.format.map(f => <span key={f} className="text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded font-black italic uppercase border border-gray-100">{f}</span>)}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase font-mono">Weekly Performance</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">الزيارات والإيرادات اليومية</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-primary/25"><Download className="w-4 h-4" />تصدير</button>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 900 }} />
                  <Line yAxisId="left" type="monotone" dataKey="visits" name="الزيارات" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 5, strokeWidth: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="الإيرادات" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <h2 className="font-black text-xl italic tracking-tighter uppercase font-mono mb-4">Revenue Mix</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={revenueData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {revenueData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} ر.ي`]} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {revenueData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} /><span className="text-xs font-bold text-gray-500">{d.name}</span></div>
                    <span className="text-xs font-black text-gray-900">{d.value.toLocaleString()} ر.ي</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
              <h3 className="font-black text-xs uppercase tracking-widest text-primary mb-4">Top Performing Doctors</h3>
              <div className="space-y-4">
                {topDoctors.map((doc, i) => (
                  <div key={doc.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-500 font-mono w-4">{i + 1}</span>
                      <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-xs">{doc.name[3]}</div>
                      <span className="font-bold text-sm text-white/80">{doc.name}</span>
                    </div>
                    <span className="text-sm font-black text-primary">{doc.visits} زيارة</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
