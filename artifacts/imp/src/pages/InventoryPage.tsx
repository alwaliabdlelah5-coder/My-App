import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Package, Search, Plus, AlertCircle, Filter, MoreVertical, ArrowUpDown, ArrowDown, ArrowUp, TrendingUp, Boxes } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInventory } from '@/hooks/use-inventory';

const initialItems = [
  { id: '1', name: 'قفازات طبية معقمة', category: 'مستلزمات', stock: 500, unit: 'علبة', minStock: 50, location: 'المستودع A', status: 'normal', supplier: 'مؤسسة الطب اليمني' },
  { id: '2', name: 'كمامات N95', category: 'حماية', stock: 120, unit: 'قطعة', minStock: 200, location: 'المستودع A', status: 'low', supplier: 'شركة الواقي' },
  { id: '3', name: 'حقن مصل فيزيولوجي 500ml', category: 'سوائل', stock: 80, unit: 'قنينة', minStock: 100, location: 'المستودع B', status: 'low', supplier: 'المعمل الدوائي' },
  { id: '4', name: 'ضمادات شاش معقمة', category: 'جرح', stock: 1200, unit: 'قطعة', minStock: 300, location: 'المستودع A', status: 'normal', supplier: 'مؤسسة الطب اليمني' },
  { id: '5', name: 'أجهزة قياس ضغط دم', category: 'أجهزة', stock: 8, unit: 'جهاز', minStock: 5, location: 'المستودع B', status: 'normal', supplier: 'شركة الأجهزة الطبية' },
];

const getStatusStyle = (status: string) => {
  if (status === 'critical') return "bg-rose-500 text-white";
  if (status === 'low') return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
};

export default function InventoryPage() {
  const { items: liveItems, loading, addItem, updateItemStock } = useInventory();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', unit: 'قطعة', stock: 0, minStock: 10, location: 'المستودع A', supplier: '' });

  const displayItems = loading ? initialItems : (liveItems.length > 0 ? liveItems : initialItems);
  const filteredItems = displayItems.filter(item =>
    item.name.includes(search) || item.category.includes(search) || item.supplier?.includes(search)
  ).sort((a, b) => {
    const valA = (a as any)[sortField]; const valB = (b as any)[sortField];
    return sortDir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const lowStockCount = displayItems.filter(i => i.status === 'low' || i.status === 'critical').length;

  const SortBtn = ({ field }: { field: string }) => (
    <button onClick={() => { if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortField(field); setSortDir('asc'); } }} className="ml-1 text-gray-300 hover:text-gray-600">
      {sortField === field ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 inline" /> : <ArrowDown className="w-3 h-3 inline" />) : <ArrowUpDown className="w-3 h-3 inline" />}
    </button>
  );

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Package className="w-8 h-8 text-primary" />إدارة المخزون العام</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40">Central Inventory Management System</p>
          </div>
          <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 shadow-lg shadow-primary/25">
            <Plus className="w-5 h-5" />إضافة صنف
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي الأصناف', value: String(displayItems.length), icon: Boxes, color: 'blue' },
            { label: 'أصناف المخزون المنخفض', value: String(lowStockCount), icon: AlertCircle, color: 'amber' },
            { label: 'إجمالي الوحدات', value: displayItems.reduce((s, i) => s + i.stock, 0).toLocaleString(), icon: Package, color: 'indigo' },
            { label: 'حركة هذا الأسبوع', value: '38 معاملة', icon: TrendingUp, color: 'emerald' },
          ].map((s, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={s.label}
              className="bg-white p-6 rounded-3xl border shadow-sm hover:border-primary/20 transition-all"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                s.color === 'blue' ? "bg-blue-50 text-blue-600" : s.color === 'amber' ? "bg-amber-50 text-amber-600" :
                s.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
              )}><s.icon className="w-6 h-6" /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="بحث باسم الصنف، الفئة، المورد..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pr-11 pl-4 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm font-medium" />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-50 shadow-sm"><Filter className="w-4 h-4" />تصفية</button>
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                  <th className="px-8 py-5">الصنف <SortBtn field="name" /></th>
                  <th className="px-8 py-5">الفئة <SortBtn field="category" /></th>
                  <th className="px-8 py-5">المخزون <SortBtn field="stock" /></th>
                  <th className="px-8 py-5">الحد الأدنى</th>
                  <th className="px-8 py-5">الموقع</th>
                  <th className="px-8 py-5">المورد</th>
                  <th className="px-8 py-5 text-center">الحالة</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item, i) => (
                  <motion.tr initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={item.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-all"><Package className="w-5 h-5" /></div>
                        <span className="font-bold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5"><span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase italic">{item.category}</span></td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2"><span className="font-black text-2xl text-gray-900 font-mono">{item.stock}</span><span className="text-xs text-gray-400">{item.unit}</span></div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full"><div className={cn("h-full rounded-full", item.status === 'critical' ? "bg-rose-500" : item.status === 'low' ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min((item.stock / (item.minStock * 3)) * 100, 100)}%` }} /></div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-400 font-mono">{item.minStock} {item.unit}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-600">{item.location}</td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">{item.supplier}</td>
                    <td className="px-8 py-5 text-center"><span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-wide", getStatusStyle(item.status))}>{item.status === 'low' ? 'منخفض' : item.status === 'critical' ? 'حرج' : 'طبيعي'}</span></td>
                    <td className="px-8 py-5 text-left">
                      <div className="flex gap-2">
                        <button onClick={() => updateItemStock(item.id, item.stock + 10)} className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-all">+10</button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b"><h2 className="text-xl font-black text-gray-900">إضافة صنف جديد</h2></div>
            <div className="p-8 space-y-4">
              {[['اسم الصنف *', 'name', 'text'], ['الفئة', 'category', 'text'], ['المورد', 'supplier', 'text'], ['الكمية الأولية', 'stock', 'number'], ['الحد الأدنى', 'minStock', 'number']].map(([label, key, type]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{label}</label>
                  <input type={type} value={(newItem as any)[key]} onChange={e => setNewItem(p => ({ ...p, [key]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                </div>
              ))}
            </div>
            <div className="p-8 bg-gray-50 flex justify-end gap-4">
              <button onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
              <button onClick={async () => { if (!newItem.name) return; await addItem({ ...newItem, status: newItem.stock < newItem.minStock ? 'low' : 'normal' }); setIsAdding(false); }} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/25">حفظ</button>
            </div>
          </motion.div>
        </div>
      )}
    </Sidebar>
  );
}
