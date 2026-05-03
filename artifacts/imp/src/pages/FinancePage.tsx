import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Plus, MoreVertical, Download, ArrowUpRight, ArrowDownRight, X, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/components/Toast';

interface Transaction {
  id: string; description: string; category: string; amount: number;
  type: 'income' | 'expense'; date: string; method: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'مدفوعات المرضى - عيادة', category: 'إيرادات العيادة', amount: 45000, type: 'income', date: '2024-05-01', method: 'نقد' },
  { id: '2', description: 'رواتب الموظفين', category: 'رواتب', amount: 870000, type: 'expense', date: '2024-05-01', method: 'تحويل بنكي' },
  { id: '3', description: 'تحاليل وفحوصات', category: 'إيرادات المختبر', amount: 28000, type: 'income', date: '2024-05-02', method: 'بطاقة' },
  { id: '4', description: 'شراء مستلزمات طبية', category: 'مشتريات', amount: 65000, type: 'expense', date: '2024-05-02', method: 'نقد' },
  { id: '5', description: 'صرف أدوية الصيدلية', category: 'إيرادات الصيدلية', amount: 32000, type: 'income', date: '2024-05-03', method: 'نقد' },
  { id: '6', description: 'فاتورة الكهرباء', category: 'مصاريف تشغيلية', amount: 12000, type: 'expense', date: '2024-05-03', method: 'نقد' },
];

const chartData = [
  { name: 'يناير', income: 350000, expense: 220000 },
  { name: 'فبراير', income: 420000, expense: 250000 },
  { name: 'مارس', income: 380000, expense: 210000 },
  { name: 'أبريل', income: 460000, expense: 280000 },
  { name: 'مايو', income: 390000, expense: 240000 },
  { name: 'يونيو', income: 510000, expense: 290000 },
];

const CATS_INCOME = ['إيرادات العيادة', 'إيرادات المختبر', 'إيرادات الصيدلية', 'إيرادات أخرى'];
const CATS_EXPENSE = ['رواتب', 'مشتريات', 'مصاريف تشغيلية', 'صيانة', 'إيجار', 'أخرى'];
const METHODS = ['نقد', 'بطاقة', 'تحويل بنكي'];
const EMPTY = { description: '', category: '', amount: 0, type: 'income' as const, date: new Date().toISOString().split('T')[0], method: 'نقد' };

export default function FinancePage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const filtered = transactions.filter(t => filterType === 'all' || t.type === filterType);

  const handleAdd = () => {
    if (!form.description || !form.amount) { toast('الرجاء إدخال الوصف والمبلغ', 'error'); return; }
    setTransactions(prev => [{ ...form, id: String(Date.now()) }, ...prev]);
    toast('تم إضافة المعاملة المالية ✓');
    setIsAdding(false); setForm(EMPTY);
  };
  const handleEdit = () => {
    if (!form.description || !form.amount) { toast('الرجاء إدخال الوصف والمبلغ', 'error'); return; }
    setTransactions(prev => prev.map(t => t.id === editTarget!.id ? { ...t, ...form } : t));
    toast('تم تحديث المعاملة ✓');
    setEditTarget(null); setForm(EMPTY);
  };
  const handleDelete = () => {
    setTransactions(prev => prev.filter(t => t.id !== deleteTarget!.id));
    toast('تم حذف المعاملة', 'info'); setDeleteTarget(null);
  };

  const exportCSV = () => {
    const csv = ['الوصف,الفئة,النوع,المبلغ,التاريخ,طريقة الدفع',
      ...transactions.map(t => `${t.description},${t.category},${t.type === 'income' ? 'إيراد' : 'مصروف'},${t.amount},${t.date},${t.method}`)
    ].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'finance.csv'; a.click();
    toast('تم تصدير التقرير المالي ✓');
  };

  const openEdit = (t: Transaction) => {
    setEditTarget(t);
    setForm({ description: t.description, category: t.category, amount: t.amount, type: t.type, date: t.date, method: t.method });
    setOpenMenu(null);
  };

  const TxForm = () => (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button onClick={() => setForm(p => ({ ...p, type: 'income', category: '' }))} className={cn("flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all",
          form.type === 'income' ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-transparent bg-gray-50 text-gray-400 hover:border-gray-200"
        )}><ArrowDownRight className="w-4 h-4" />إيراد</button>
        <button onClick={() => setForm(p => ({ ...p, type: 'expense', category: '' }))} className={cn("flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all",
          form.type === 'expense' ? "border-rose-500 bg-rose-50 text-rose-600" : "border-transparent bg-gray-50 text-gray-400 hover:border-gray-200"
        )}><ArrowUpRight className="w-4 h-4" />مصروف</button>
      </div>
      <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الوصف *</label>
        <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف المعاملة" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">المبلغ *</label>
          <input type="number" value={form.amount || ''} onChange={e => setForm(p => ({ ...p, amount: parseInt(e.target.value) || 0 }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">طريقة الدفع</label>
          <select value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{METHODS.map(m => <option key={m}>{m}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الفئة</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">
            <option value="">-- اختر الفئة --</option>
            {(form.type === 'income' ? CATS_INCOME : CATS_EXPENSE).map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">التاريخ</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
      </div>
    </div>
  );

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><CreditCard className="w-8 h-8 text-primary" />الإدارة المالية</h1>
            <p className="text-gray-500 mt-1 text-[10px] uppercase font-black tracking-widest">Financial Management System</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 shadow-sm">
              <Download className="w-4 h-4" />تصدير
            </button>
            <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/95">
              <Plus className="w-5 h-5" />معاملة جديدة
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'إجمالي الإيرادات', value: totalIncome.toLocaleString(), icon: ArrowDownRight, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'إجمالي المصروفات', value: totalExpense.toLocaleString(), icon: ArrowUpRight, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'صافي الربح', value: netProfit.toLocaleString(), icon: DollarSign, color: netProfit >= 0 ? 'text-primary' : 'text-rose-500', bg: netProfit >= 0 ? 'bg-primary/5' : 'bg-rose-50' },
          ].map((s, i) => (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={s.label}
              className="bg-white p-7 rounded-3xl border shadow-sm flex items-center gap-5">
              <div className={cn("p-4 rounded-2xl", s.bg)}><s.icon className={cn("w-6 h-6", s.color)} /></div>
              <div><p className="text-xs font-bold text-gray-400">{s.label}</p><p className={cn("text-2xl font-black", s.color)}>{s.value} <span className="text-xs text-gray-400 font-bold">ر.ي</span></p></div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h3 className="font-black text-lg text-gray-900 mb-6 italic tracking-tighter">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Cairo' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} ر.ي`]} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.5} fill="url(#inc)" name="الإيرادات" />
              <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#exp)" name="المصروفات" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50/40 flex items-center justify-between">
            <h3 className="font-black text-lg text-gray-900 italic tracking-tighter">سجل المعاملات</h3>
            <div className="flex gap-2 p-1 bg-white border rounded-2xl shadow-inner">
              {[['all', 'الكل'], ['income', 'إيرادات'], ['expense', 'مصاريف']].map(([v, l]) => (
                <button key={v} onClick={() => setFilterType(v as any)} className={cn("px-4 py-1.5 rounded-xl text-xs font-black transition-all",
                  filterType === v ? "bg-primary text-white" : "text-gray-400"
                )}>{l}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead><tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                <th className="px-7 py-4">الوصف</th><th className="px-7 py-4">الفئة</th>
                <th className="px-7 py-4">النوع</th><th className="px-7 py-4">المبلغ</th>
                <th className="px-7 py-4">التاريخ</th><th className="px-7 py-4">الدفع</th><th className="px-7 py-4"></th>
              </tr></thead>
              <tbody className="divide-y">
                {filtered.map((tx, i) => (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} key={tx.id} className="hover:bg-gray-50/70">
                    <td className="px-7 py-4 font-bold text-gray-900 text-sm">{tx.description}</td>
                    <td className="px-7 py-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black">{tx.category}</span></td>
                    <td className="px-7 py-4">
                      <span className={cn("flex items-center gap-1.5 text-xs font-black w-fit px-3 py-1 rounded-full",
                        tx.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {tx.type === 'income' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.type === 'income' ? 'إيراد' : 'مصروف'}
                      </span>
                    </td>
                    <td className="px-7 py-4"><span className={cn("font-black text-xl", tx.type === 'income' ? "text-emerald-500" : "text-rose-500")}>{tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString()}</span> <span className="text-[10px] text-gray-400">ر.ي</span></td>
                    <td className="px-7 py-4 text-xs text-gray-400 font-bold">{tx.date}</td>
                    <td className="px-7 py-4 text-xs text-gray-500 font-bold">{tx.method}</td>
                    <td className="px-7 py-4">
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === tx.id ? null : tx.id)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                        <AnimatePresence>
                          {openMenu === tx.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-36 overflow-hidden">
                              <button onClick={() => openEdit(tx)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5 text-blue-400" />تعديل</button>
                              <button onClick={() => { setDeleteTarget(tx); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" />حذف</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || editTarget) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-7 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">{editTarget ? 'تعديل المعاملة' : 'إضافة معاملة مالية'}</h2>
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY); }} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-7"><TxForm /></div>
              <div className="p-7 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY); }} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={editTarget ? handleEdit : handleAdd} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">{editTarget ? 'حفظ التعديلات' : 'إضافة'}</button>
              </div>
            </motion.div>
          </div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8 text-rose-500" /></div>
              <p className="font-bold text-gray-700">حذف «<span className="text-rose-600">{deleteTarget.description}</span>»؟</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteTarget(null)} className="px-6 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={handleDelete} className="px-6 py-2.5 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600">حذف</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
