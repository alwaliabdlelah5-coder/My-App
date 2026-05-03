import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Activity, FileBarChart, FileText, PieChart, TrendingUp, Download, Calendar, RefreshCw, BarChart2, Users, DollarSign, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Legend } from 'recharts';
import { useToast } from '@/components/Toast';

const monthlyData = [
  { month: 'يناير', patients: 120, income: 350000, labTests: 80 },
  { month: 'فبراير', patients: 145, income: 420000, labTests: 95 },
  { month: 'مارس', patients: 132, income: 380000, labTests: 88 },
  { month: 'أبريل', patients: 168, income: 460000, labTests: 112 },
  { month: 'مايو', patients: 155, income: 390000, labTests: 102 },
  { month: 'يونيو', patients: 190, income: 510000, labTests: 130 },
];

const pieData = [
  { name: 'عيادة عامة', value: 40, color: '#3b82f6' },
  { name: 'تخصصات', value: 25, color: '#8b5cf6' },
  { name: 'مختبر', value: 20, color: '#10b981' },
  { name: 'صيدلية', value: 15, color: '#f59e0b' },
];

const reportTypes = [
  { id: 'patients', icon: Users, label: 'تقرير المرضى', desc: 'إحصائيات الزيارات والتشخيصات', color: 'blue' },
  { id: 'finance', icon: DollarSign, label: 'التقرير المالي', desc: 'الإيرادات والمصروفات والأرباح', color: 'emerald' },
  { id: 'lab', icon: FlaskConical, label: 'تقرير المختبر', desc: 'التحاليل المنجزة والنتائج', color: 'purple' },
  { id: 'performance', icon: Activity, label: 'الأداء التشغيلي', desc: 'معدل الإنجاز وكفاءة الموارد', color: 'amber' },
];

const PERIODS = ['هذا الأسبوع', 'هذا الشهر', 'الربع الأول', 'هذه السنة', 'مخصص'];

function KpiCard({ label, value, change, icon: Icon, color }: { label: string; value: string; change: string; icon: any; color: string }) {
  const colorMap: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', purple: 'bg-purple-50 text-purple-600', amber: 'bg-amber-50 text-amber-600' };
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", colorMap[color])}><Icon className="w-5 h-5" /></div>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{change}</span>
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs font-bold text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [activeReport, setActiveReport] = useState('patients');
  const [period, setPeriod] = useState('هذا الشهر');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (reportId: string) => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1000));
    setGenerating(false);
    toast(`تم إنشاء التقرير بنجاح ✓`, 'success');
  };

  const handleExportPDF = () => {
    toast('جاري إنشاء ملف PDF...', 'info');
    setTimeout(() => toast('تم تصدير التقرير بصيغة PDF ✓'), 1500);
  };

  const handleExportCSV = () => {
    const data = monthlyData.map(r => `${r.month},${r.patients},${r.income},${r.labTests}`);
    const csv = ['الشهر,المرضى,الإيرادات,التحاليل', ...data].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'report.csv'; a.click();
    toast('تم تصدير التقرير بصيغة CSV ✓');
  };

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><FileBarChart className="w-8 h-8 text-primary" />التقارير والإحصائيات</h1>
            <p className="text-gray-500 mt-1 text-[10px] uppercase font-black tracking-widest">Advanced Analytics & Reporting</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={period} onChange={e => setPeriod(e.target.value)} className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20">
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-lg">
              <Download className="w-4 h-4" />PDF
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-5 py-2.5 bg-white border text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 shadow-sm">
              <Download className="w-4 h-4" />CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard label="إجمالي المرضى" value="910" change="+12%" icon={Users} color="blue" />
          <KpiCard label="الإيرادات الشهرية" value="510,000 ر.ي" change="+8%" icon={DollarSign} color="emerald" />
          <KpiCard label="تحاليل مختبر" value="607" change="+15%" icon={FlaskConical} color="purple" />
          <KpiCard label="معدل الإشغال" value="78%" change="+3%" icon={Activity} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reportTypes.map((rt, i) => {
            const colorMap: Record<string, string> = {
              blue: 'bg-blue-50 text-blue-600 border-blue-100',
              emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              purple: 'bg-purple-50 text-purple-600 border-purple-100',
              amber: 'bg-amber-50 text-amber-600 border-amber-100',
            };
            return (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} key={rt.id}
                className={cn("bg-white p-6 rounded-3xl border shadow-sm cursor-pointer hover:border-primary/20 transition-all group",
                  activeReport === rt.id && "border-primary bg-primary/5"
                )}
                onClick={() => setActiveReport(rt.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-2xl", colorMap[rt.color].split(' ').slice(0, 2).join(' '))}><rt.icon className="w-5 h-5" /></div>
                  {activeReport === rt.id && <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">نشط</span>}
                </div>
                <h3 className="font-black text-gray-900 mb-1">{rt.label}</h3>
                <p className="text-xs text-gray-400 font-medium mb-4">{rt.desc}</p>
                <button onClick={e => { e.stopPropagation(); handleGenerate(rt.id); }} disabled={generating}
                  className="w-full py-2.5 bg-gray-50 text-gray-600 rounded-2xl font-bold text-xs hover:bg-primary hover:text-white transition-all group-hover:border-primary flex items-center justify-center gap-2 disabled:opacity-50">
                  {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  {generating ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 bg-white rounded-3xl border shadow-sm p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl text-gray-900 italic tracking-tighter">Monthly Patient Visits</h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{period}</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Cairo' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [v, '']} />
                <Bar dataKey="patients" fill="#3b82f6" radius={[8, 8, 0, 0]} name="المرضى" />
                <Bar dataKey="labTests" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="التحاليل" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-7 space-y-5">
            <h3 className="font-black text-xl text-gray-900 italic tracking-tighter">Service Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RPieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, '']} />
              </RPieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="font-bold text-gray-700">{item.name}</span></div>
                  <span className="font-black text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-7 space-y-5">
          <h3 className="font-black text-xl text-gray-900 italic tracking-tighter">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Cairo' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} ر.ي`, 'الإيرادات']} />
              <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fill="url(#revGrad)" name="الإيرادات" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Sidebar>
  );
}
