import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Package, Search, Plus, AlertCircle, MoreVertical, TrendingUp, Boxes, Edit2, Trash2, X, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';

interface InventoryItem {
  id: string; name: string; category: string; supplier: string;
  stock: number; minStock: number; unit: string; price: string; lastOrder: string;
}

const INITIAL: InventoryItem[] = [
  { id: '1', name: 'قفازات طبية (M)', category: 'مستلزمات', supplier: 'شركة المدينة', stock: 45, minStock: 100, unit: 'علبة', price: '1500', lastOrder: '2024-04-01' },
  { id: '2', name: 'حقن 5ml', category: 'مستلزمات', supplier: 'شركة الجمهورية', stock: 250, minStock: 200, unit: 'قطعة', price: '200', lastOrder: '2024-04-10' },
  { id: '3', name: 'كمامات طبية', category: 'مستلزمات', supplier: 'شركة المدينة', stock: 180, minStock: 150, unit: 'علبة', price: '800', lastOrder: '2024-03-15' },
  { id: '4', name: 'شاش طبي معقم', category: 'ضمادات', supplier: 'شركة الأمل', stock: 20, minStock: 50, unit: 'لفة', price: '500', lastOrder: '2024-04-05' },
  { id: '5', name: 'محاقن إنسولين', category: 'مستلزمات', supplier: 'شركة الجمهورية', stock: 80, minStock: 60, unit: 'قطعة', price: '350', lastOrder: '2024-04-08' },
];

const CATEGORIES = ['مستلزمات', 'ضمادات', 'أجهزة', 'مخبرية', 'عمليات', 'أدوات'];
const SUPPLIERS = ['شركة المدينة', 'شركة الجمهورية', 'شركة الأمل', 'شركة الصحة', 'شركة اليمن الطبية'];
const EMPTY = { name: '', category: CATEGORIES[0], supplier: SUPPLIERS[0], stock: 0, minStock: 0, unit: 'قطعة', price: '', lastOrder: new Date().toISOString().split('T')[0] };

export default function InventoryPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockAmt, setRestockAmt] = useState(50);

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.includes(search));
  const lowStock = items.filter(i => i.stock < i.minStock).length;

  const handleAdd = () => {
    if (!form.name) { toast('الرجاء إدخال اسم الصنف', 'error'); return; }
    setItems(prev => [{ ...form, id: String(Date.now()) }, ...prev]);
    toast(`تمت إضافة ${form.name} للمخزون ✓`);
    setIsAdding(false); setForm(EMPTY);
  };
  const handleEdit = () => {
    if (!form.name) { toast('الرجاء إدخال اسم الصنف', 'error'); return; }
    setItems(prev => prev.map(i => i.id === editTarget!.id ? { ...i, ...form } : i));
    toast('تم تحديث بيانات الصنف ✓');
    setEditTarget(null); setForm(EMPTY);
  };
  const handleDelete = () => {
    setItems(prev => prev.filter(i => i.id !== deleteTarget!.id));
    toast('تم حذف الصنف', 'info'); setDeleteTarget(null);
  };
  const handleRestock = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: i.stock + restockAmt, lastOrder: new Date().toISOString().split('T')[0] } : i));
    toast(`تمت إضافة ${restockAmt} وحدة للمخزون ✓`);
    setRestockId(null);
  };
  const openEdit = (item: InventoryItem) => {
    setEditTarget(item);
    setForm({ name: item.name, category: item.category, supplier: item.supplier, stock: item.stock, minStock: item.minStock, unit: item.unit, price: item.price, lastOrder: item.lastOrder });
    setOpenMenu(null);
  };

  const ItemForm = () => (
    <div className="space-y-4">
      <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">اسم الصنف *</label>
        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="اسم الصنف أو المستلزم" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الفئة</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">المورد</label>
          <select value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none">{SUPPLIERS.map(s => <option key={s}>{s}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">المخزون الحالي</label>
          <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الحد الأدنى</label>
          <input type="number" value={form.minStock} onChange={e => setForm(p => ({ ...p, minStock: parseInt(e.target.value) || 0 }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">وحدة القياس</label>
          <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">السعر (ر.ي)</label>
          <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="1500" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm border-none outline-none" /></div>
      </div>
    </div>
  );

  return (
    <Sidebar>
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Boxes className="w-8 h-8 text-primary" />المخزون والمستلزمات</h1>
            <p className="text-gray-500 mt-1 text-[10px] uppercase font-black tracking-widest">Inventory Management System</p>
          </div>
          <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/95">
            <Plus className="w-5 h-5" />إضافة صنف
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'إجمالي الأصناف', value: items.length, icon: Boxes, color: 'bg-primary text-white' },
            { label: 'مخزون كافٍ', value: items.filter(i => i.stock >= i.minStock).length, icon: Package, color: 'bg-emerald-500 text-white' },
            { label: 'مخزون منخفض', value: lowStock, icon: AlertCircle, color: lowStock > 0 ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400' },
            { label: 'إجمالي القيمة', value: `${items.reduce((s, i) => s + (parseInt(i.price) * i.stock || 0), 0).toLocaleString()} ر.ي`, icon: TrendingUp, color: 'bg-indigo-500 text-white' },
          ].map((stat, i) => (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} key={stat.label}
              className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl", stat.color.split(' ')[0])}><stat.icon className={cn("w-6 h-6", stat.color.split(' ')[1])} /></div>
              <div><p className="text-xs font-bold text-gray-500">{stat.label}</p><p className="text-2xl font-black text-gray-900">{stat.value}</p></div>
            </motion.div>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن صنف..." className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead><tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
              <th className="px-7 py-4">الصنف</th><th className="px-7 py-4">المورد</th>
              <th className="px-7 py-4">المخزون</th><th className="px-7 py-4">السعر</th>
              <th className="px-7 py-4">آخر طلب</th><th className="px-7 py-4"></th>
            </tr></thead>
            <tbody className="divide-y">
              {filtered.map((item, i) => {
                const isLow = item.stock < item.minStock;
                return (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} key={item.id} className="hover:bg-gray-50/80">
                    <td className="px-7 py-4">
                      <div className="flex items-center gap-3">
                        {isLow && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                        <div><p className="font-bold text-gray-900">{item.name}</p><p className="text-[10px] text-gray-400 font-bold">{item.category}</p></div>
                      </div>
                    </td>
                    <td className="px-7 py-4 text-sm font-bold text-gray-500">{item.supplier}</td>
                    <td className="px-7 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-black text-lg", isLow ? "text-rose-500" : "text-gray-900")}>{item.stock}</span>
                          <span className="text-xs text-gray-400">{item.unit}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", item.stock < item.minStock * 0.5 ? "bg-rose-500" : item.stock < item.minStock ? "bg-amber-500" : "bg-emerald-500")}
                            style={{ width: `${Math.min(100, Math.round(item.stock / item.minStock * 100))}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-4"><span className="font-black text-primary">{parseInt(item.price).toLocaleString()}</span><span className="text-[10px] text-gray-400 ml-1">ر.ي</span></td>
                    <td className="px-7 py-4 text-xs text-gray-400 font-bold">{item.lastOrder}</td>
                    <td className="px-7 py-4">
                      <div className="flex items-center gap-2">
                        {restockId === item.id ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => setRestockAmt(n => Math.max(10, n - 10))} className="w-7 h-7 rounded-lg bg-gray-100 font-black text-sm hover:bg-gray-200">−</button>
                            <span className="font-black text-sm w-8 text-center">{restockAmt}</span>
                            <button onClick={() => setRestockAmt(n => n + 10)} className="w-7 h-7 rounded-lg bg-gray-100 font-black text-sm hover:bg-gray-200">+</button>
                            <button onClick={() => handleRestock(item.id)} className="px-3 py-1 bg-primary text-white rounded-xl font-bold text-xs">تأكيد</button>
                            <button onClick={() => setRestockId(null)} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-xl font-bold text-xs">إلغاء</button>
                          </div>
                        ) : (
                          <button onClick={() => { setRestockId(item.id); setRestockAmt(50); }} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all">
                            <ArrowUp className="w-3 h-3" />تجديد
                          </button>
                        )}
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                          <AnimatePresence>
                            {openMenu === item.id && (
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-36 overflow-hidden">
                                <button onClick={() => openEdit(item)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5 text-blue-400" />تعديل</button>
                                <button onClick={() => { setDeleteTarget(item); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" />حذف</button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-gray-300 font-bold">لا توجد أصناف</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || editTarget) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-7 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">{editTarget ? 'تعديل الصنف' : 'إضافة صنف جديد'}</h2>
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY); }} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-7"><ItemForm /></div>
              <div className="p-7 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => { setIsAdding(false); setEditTarget(null); setForm(EMPTY); }} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={editTarget ? handleEdit : handleAdd} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">{editTarget ? 'حفظ التعديلات' : 'إضافة للمخزون'}</button>
              </div>
            </motion.div>
          </div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8 text-rose-500" /></div>
              <p className="font-bold text-gray-700">حذف «<span className="text-rose-600">{deleteTarget.name}</span>»؟</p>
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
