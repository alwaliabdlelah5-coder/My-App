import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Plus, Filter, MoreVertical, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFinance } from '@/hooks/use-finance';

const chartData = [
  { day: 'السبت', income: 45000, expense: 12000 },
  { day: 'الأحد', income: 62000, expense: 18000 },
  { day: 'الاثنين', income: 38000, expense: 9000 },
  { day: 'الثلاثاء', income: 71000, expense: 22000 },
  { day: 'الأربعاء', income: 55000, expense: 15000 },
  { day: 'الخميس', income: 84000, expense: 28000 },
  { day: 'الجمعة', income: 23000, expense: 7000 },
];

const initialTransactions = [
  { id: '1', description: 'كشف مريض - عبدالعزيز العتيبي', type: 'income', category: 'استشارة', amount: 5000, method: 'cash', date: '2024-05-02' },
  { id: '2', description: 'تحاليل مختبرية - دفعة', type: 'income', category: 'مختبر', amount: 12500, method: 'transfer', date: '2024-05-02' },
  { id: '3', description: 'شراء لوازم طبية', type: 'expense', category: 'مستلزمات', amount: 8200, method: 'transfer', date: '2024-05-01' },
  { id: '4', description: 'رواتب الموظفين', type: 'expense', category: 'رواتب', amount: 45000, method: 'transfer', date: '2024-04-30' },
  { id: '5', description: 'إيرادات الصيدلية', type: 'income', category: 'صيدلية', amount: 18700, method: 'cash', date: '2024-05-02' },
];

function AddTransactionModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (t: any) => void }) {
  const [form, setForm] = useState({ description: '', type: 'income', category: 'استشارة', amount: '', method: 'cash' });
  return !isOpen ? null : (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b"><h2 className="text-xl font-black text-gray-900">إضافة معاملة مالية</h2></div>
        <div className="p-8 space-y-4">
          <input type="text" placeholder="وصف المعاملة..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold">
              <option value="income">إيراد</option><option value="expense">مصروف</option>
            </select>
            <select value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))} className="bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold">
              <option value="cash">كاش</option><option value="transfer">تحويل</option><option value="insurance">تأمين</option>
            </select>
          </div>
          <input type="number" placeholder="المبلغ (ريال يمني)" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="p-8 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
          <button onClick={() => { if (!form.description || !form.amount) return; onAdd({ ...form, amount: parseFloat(form.amount), id: String(Date.now()), date: new Date().toISOString().split('T')[0] }); onClose(); }} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/25">حفظ</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function FinancePage() {
  const { transactions: liveTxs, loading, addTransaction, getStats } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const stats = getStats();
  const [localTxs, setLocalTxs] = useState<any[]>([]);

  const displayTxs = loading ? initialTransactions : (liveTxs.length > 0 ? liveTxs : initialTransactions);
  const allTxs = [...displayTxs, ...localTxs];

  const handleAdd = async (t: any) => { await addTransaction(t); setLocalTxs(p => [t, ...p]); };

  const totalIncome = stats.income || allTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = stats.expenses || allTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><CreditCard className="w-8 h-8 text-primary" />الإدارة المالية</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40">Financial Operations Center</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 shadow-sm"><Download className="w-4 h-4" />تصدير</button>
            <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 shadow-lg shadow-primary/25"><Plus className="w-5 h-5" />معاملة جديدة</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'إجمالي الإيرادات', value: totalIncome.toLocaleString(), icon: TrendingUp, color: 'emerald', badge: '+12%' },
            { label: 'إجمالي المصروفات', value: totalExpense.toLocaleString(), icon: TrendingDown, color: 'rose', badge: '-3%' },
            { label: 'صافي الربح', value: netProfit.toLocaleString(), icon: DollarSign, color: 'blue', badge: '+18%' },
          ].map((s, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={s.label}
              className="bg-white p-8 rounded-[2.5rem] border shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  s.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : s.color === 'rose' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                )}><s.icon className="w-7 h-7" /></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{s.label}</h3>
                <p className="text-3xl font-black text-gray-900 mt-2 tracking-tighter italic font-mono">{s.value} ر.ي</p>
                <div className={cn("flex items-center gap-1 mt-4 text-[10px] font-black",
                  s.color === 'rose' ? "text-rose-500" : "text-emerald-500"
                )}>
                  {s.color !== 'rose' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.badge} عن الأسبوع الماضي
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-xl font-black italic tracking-tighter uppercase font-mono">Revenue vs. Expenses</h2><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">هذا الأسبوع</p></div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any, n: string) => [`${Number(v).toLocaleString()} ر.ي`, n === 'income' ? 'إيرادات' : 'مصروفات']} labelStyle={{ fontWeight: 900, fontSize: 10 }} />
                <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={2} fill="url(#incomeGrad)" dot={{ fill: '#2563eb', strokeWidth: 0, r: 4 }} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" dot={{ fill: '#f43f5e', strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="font-black text-xl italic tracking-tighter uppercase font-mono">Transaction Ledger</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-gray-500 text-sm hover:bg-gray-50"><Filter className="w-4 h-4" />تصفية</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                  <th className="px-8 py-5">الوصف</th><th className="px-8 py-5">الفئة</th>
                  <th className="px-8 py-5">طريقة الدفع</th><th className="px-8 py-5">التاريخ</th>
                  <th className="px-8 py-5 text-center">المبلغ</th><th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allTxs.map((tx: any, i: number) => (
                  <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={tx.id} className="hover:bg-gray-50/80 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                          tx.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>{tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}</div>
                        <span className="font-bold text-gray-900 text-sm">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6"><span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase italic">{tx.category}</span></td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-500 capitalize">{tx.method}</td>
                    <td className="px-8 py-6 text-sm font-mono text-gray-400">{tx.date}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={cn("text-xl font-black tracking-tighter", tx.type === 'income' ? "text-emerald-600" : "text-rose-500")}>
                        {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} ر.ي
                      </span>
                    </td>
                    <td className="px-8 py-6 text-left"><button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-4 h-4 text-gray-400" /></button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddTransactionModal isOpen={isAdding} onClose={() => setIsAdding(false)} onAdd={handleAdd} />
    </Sidebar>
  );
}
