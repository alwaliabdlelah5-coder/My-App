import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Tablets, Search, Plus, AlertCircle, Package, TrendingUp, ArrowRight, Filter, MoreVertical, Clock, Edit2, Trash2, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';

interface Drug {
  id: string; name: string; scientificName: string; category: string;
  stock: number; expiry: string; price: string; isNearingExpiry: boolean; brandNames: string[];
}

const INITIAL_DRUGS: Drug[] = [
  { id: '1', name: 'أوجمنتين (Augmentin)', scientificName: 'Amoxicillin/Clavulanic acid', category: 'مضادات حيوية', stock: 45, expiry: '2024-06-15', price: '4500 ر.ي', isNearingExpiry: true, brandNames: ['أموكسيدار', 'موكسيلين'] },
  { id: '2', name: 'بنادول (Panadol)', scientificName: 'Paracetamol', category: 'مسكنات', stock: 120, expiry: '2026-10-20', price: '1200 ر.ي', isNearingExpiry: false, brandNames: ['سيتامول', 'براسيتامول'] },
  { id: '3', name: 'جلوكوفاج (Glucophage)', scientificName: 'Metformin', category: 'أدوية سكري', stock: 30, expiry: '2024-08-01', price: '3200 ر.ي', isNearingExpiry: false, brandNames: ['ميتفورمين اليمن'] },
  { id: '4', name: 'فولتارين (Voltaren)', scientificName: 'Diclofenac', category: 'مضادات التهاب', stock: 12, expiry: '2024-05-25', price: '2800 ر.ي', isNearingExpiry: true, brandNames: ['ديكلوفين'] },
  { id: '5', name: 'أموكسيل (Amoxil)', scientificName: 'Amoxicillin', category: 'مضادات حيوية', stock: 80, expiry: '2025-03-15', price: '2200 ر.ي', isNearingExpiry: false, brandNames: ['أموكسيكلاف'] },
];

const PATIENTS_LIST = ['سناء علي عبد الله (P-1001)', 'محمد حسن صالح (P-1002)', 'ليلى مرشد السعدي (P-1003)', 'جابر يحيى حسين (P-1004)'];
const CATEGORIES = ['مضادات حيوية', 'مسكنات', 'أدوية سكري', 'مضادات التهاب', 'أدوية قلب', 'فيتامينات', 'مراهم ومحاليل'];

const getStockColor = (stock: number) => {
  if (stock < 15) return 'bg-rose-500';
  if (stock < 40) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const emptyDrug = { name: '', scientificName: '', category: CATEGORIES[0], stock: 0, expiry: '', price: '', isNearingExpiry: false, brandNames: [] as string[], brandInput: '' };

export default function PharmacyPage() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<Drug[]>(INITIAL_DRUGS);
  const [activeTab, setActiveTab] = useState<'inventory' | 'dispensing'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [dispenseTarget, setDispenseTarget] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [dispenseAmount, setDispenseAmount] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<Drug | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Drug | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState(emptyDrug);
  const [dispensedLog, setDispensedLog] = useState<{ drug: string; patient: string; qty: number; time: string }[]>([]);

  const filteredInventory = inventory.filter(d =>
    !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => setForm(emptyDrug);

  const handleAdd = () => {
    if (!form.name || !form.scientificName) { toast('الرجاء إدخال اسم الدواء', 'error'); return; }
    const drug: Drug = { id: String(Date.now()), name: form.name, scientificName: form.scientificName, category: form.category, stock: form.stock, expiry: form.expiry, price: form.price ? `${form.price} ر.ي` : '0 ر.ي', isNearingExpiry: false, brandNames: form.brandNames };
    setInventory(prev => [drug, ...prev]);
    toast(`تمت إضافة ${form.name.split(' ')[0]} للمخزون ✓`);
    setIsAdding(false); resetForm();
  };

  const handleEdit = () => {
    if (!form.name) { toast('الرجاء إدخال اسم الدواء', 'error'); return; }
    setInventory(prev => prev.map(d => d.id === editTarget!.id ? { ...d, name: form.name, scientificName: form.scientificName, category: form.category, stock: form.stock, expiry: form.expiry, price: form.price ? `${form.price} ر.ي` : d.price } : d));
    toast('تم تحديث بيانات الدواء ✓');
    setEditTarget(null); resetForm();
  };

  const handleDelete = () => {
    setInventory(prev => prev.filter(d => d.id !== deleteTarget!.id));
    toast('تم حذف الدواء من المخزون', 'info');
    setDeleteTarget(null);
  };

  const handleConfirmDispense = () => {
    if (!selectedDrug || !dispenseTarget) { toast('الرجاء اختيار الدواء والمريض', 'error'); return; }
    if (selectedDrug.stock < dispenseAmount) { toast('المخزون غير كافٍ!', 'error'); return; }
    setInventory(prev => prev.map(d => d.id === selectedDrug.id ? { ...d, stock: d.stock - dispenseAmount } : d));
    setDispensedLog(prev => [{ drug: selectedDrug.name.split(' ')[0], patient: dispenseTarget.split(' ')[0], qty: dispenseAmount, time: new Date().toLocaleTimeString('ar') }, ...prev.slice(0, 9)]);
    toast(`تم صرف ${selectedDrug.name.split(' ')[0]} بنجاح لـ ${dispenseTarget.split(' ')[0]} ✓`);
    setActiveTab('inventory'); setSelectedDrug(null); setDispenseTarget(''); setDispenseAmount(1);
  };

  const openEdit = (drug: Drug) => {
    setEditTarget(drug);
    setForm({ name: drug.name, scientificName: drug.scientificName, category: drug.category, stock: drug.stock, expiry: drug.expiry, price: drug.price.replace(' ر.ي', ''), isNearingExpiry: drug.isNearingExpiry, brandNames: drug.brandNames, brandInput: '' });
    setOpenMenu(null);
  };

  const DrugForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2"><label className="text-sm font-bold text-gray-700">الاسم التجاري *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: بنادول (Panadol)" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
        <div className="space-y-1.5 col-span-2"><label className="text-sm font-bold text-gray-700">الاسم العلمي *</label>
          <input value={form.scientificName} onChange={e => setForm(p => ({ ...p, scientificName: e.target.value }))} placeholder="مثال: Paracetamol" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الفئة</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">المخزون</label>
          <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none" /></div>
        <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">السعر (ر.ي)</label>
          <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="4500" className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none" /></div>
      </div>
      <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">تاريخ الانتهاء</label>
        <input type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} className="w-full bg-gray-50 rounded-2xl p-3.5 text-sm font-medium border-none outline-none" /></div>
    </div>
  );

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Tablets className="w-8 h-8 text-primary" />إدارة الصيدلية</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40">Smart Pharmacy Management</p>
          </div>
          <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/25"><Plus className="w-5 h-5" />إضافة صنف جديد</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'إجمالي الأصناف', value: String(inventory.length), icon: Package, color: 'blue' },
            { name: 'وصفات صرفت اليوم', value: String(dispensedLog.length), icon: CheckCircle, color: 'emerald' },
            { name: 'أصناف قاربت الانتهاء', value: String(inventory.filter(d => d.isNearingExpiry).length), icon: AlertCircle, color: 'red' },
            { name: 'مخزون منخفض (<15)', value: String(inventory.filter(d => d.stock < 15).length), icon: TrendingUp, color: 'indigo' },
          ].map((stat, i) => (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={stat.name}
              className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group">
              <div className="relative z-10 flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl",
                  stat.color === 'blue' ? "bg-blue-50 text-blue-600" : stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                  stat.color === 'red' ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
                )}><stat.icon className="w-6 h-6" /></div>
                <div><h3 className="text-gray-500 font-bold text-xs uppercase tracking-tight">{stat.name}</h3><p className="text-2xl font-black text-gray-900">{stat.value}</p></div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm">
            {(['inventory', 'dispensing'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                activeTab === tab ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400 hover:text-primary"
              )}>{tab === 'inventory' ? 'المخزون' : 'صرف الأدوية'}</button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="ابحث عن دواء..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pr-11 pl-4 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm font-medium" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
          <AnimatePresence mode="wait">
            {activeTab === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest italic border-b">
                        <th className="px-8 py-5">الدواء</th><th className="px-8 py-5">المادة الفعالة</th>
                        <th className="px-8 py-5">المخزون</th><th className="px-8 py-5">السعر</th><th className="px-8 py-5">الانتهاء</th><th className="px-8 py-5">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInventory.map(drug => (
                        <tr key={drug.id} className="hover:bg-gray-50/80 transition-all group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm",
                                drug.isNearingExpiry ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-primary/5 text-primary border-primary/10"
                              )}><Package className="w-5 h-5" /></div>
                              <div>
                                <p className="font-black text-gray-900 tracking-tighter leading-none">{drug.name.split(' (')[0]}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{drug.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5"><p className="font-bold text-gray-500 italic text-sm">{drug.scientificName}</p></td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col gap-1.5">
                              <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all", getStockColor(drug.stock))} style={{ width: `${Math.min(drug.stock, 100)}%` }} />
                              </div>
                              <span className="text-sm font-black text-gray-900 font-mono">{drug.stock} <span className="text-[10px] text-gray-400">وحدة</span></span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="font-black text-xl text-primary tracking-tighter">{drug.price.split(' ')[0]}</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">YER/UNIT</p>
                          </td>
                          <td className="px-8 py-5">
                            <div className={cn("flex items-center gap-1 text-xs font-bold", drug.isNearingExpiry ? "text-rose-500" : "text-gray-400")}>
                              <Clock className="w-3 h-3" />{drug.expiry}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setActiveTab('dispensing'); setSelectedDrug(drug); }} className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition-all">صرف</button>
                              <div className="relative">
                                <button onClick={() => setOpenMenu(openMenu === drug.id ? null : drug.id)} className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-xl shadow-sm transition-all"><MoreVertical className="w-4 h-4" /></button>
                                <AnimatePresence>
                                  {openMenu === drug.id && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                      className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 w-36 overflow-hidden"
                                    >
                                      <button onClick={() => openEdit(drug)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5 text-blue-400" />تعديل</button>
                                      <button onClick={() => { setInventory(prev => prev.map(d => d.id === drug.id ? { ...d, stock: d.stock + 50 } : d)); toast(`تمت إضافة 50 وحدة لـ ${drug.name.split(' ')[0]} ✓`); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50"><Plus className="w-3.5 h-3.5" />إضافة مخزون</button>
                                      <button onClick={() => { setDeleteTarget(drug); setOpenMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" />حذف</button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredInventory.length === 0 && (
                        <tr><td colSpan={6} className="py-16 text-center text-gray-300 font-bold">لا توجد نتائج مطابقة</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            {activeTab === 'dispensing' && (
              <motion.div key="dispensing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">صرف وصفة طبية</h3>
                    {selectedDrug ? (
                      <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-black text-primary">{selectedDrug.name.split(' (')[0]}</p>
                          <p className="text-xs text-gray-400 font-bold">المخزون: {selectedDrug.stock} وحدة</p>
                        </div>
                        <button onClick={() => setSelectedDrug(null)} className="text-[10px] font-black text-rose-500 hover:underline">تغيير</button>
                      </div>
                    ) : (
                      <button onClick={() => setActiveTab('inventory')} className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl font-bold text-gray-400 hover:border-primary text-sm transition-all">
                        ← اختر دواء من المخزون
                      </button>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">المريض</label>
                      <select value={dispenseTarget} onChange={e => setDispenseTarget(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm font-medium outline-none">
                        <option value="">-- اختر المريض --</option>
                        {PATIENTS_LIST.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">الكمية</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setDispenseAmount(n => Math.max(1, n - 1))} className="w-10 h-10 rounded-xl bg-gray-100 font-black text-gray-700 hover:bg-gray-200">−</button>
                        <span className="w-16 text-center text-2xl font-black">{dispenseAmount}</span>
                        <button onClick={() => setDispenseAmount(n => n + 1)} className="w-10 h-10 rounded-xl bg-gray-100 font-black text-gray-700 hover:bg-gray-200">+</button>
                      </div>
                    </div>
                    <button onClick={handleConfirmDispense} disabled={!dispenseTarget || !selectedDrug}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 disabled:opacity-40 disabled:grayscale">
                      تأكيد الصرف
                    </button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">سجل الصرف اليوم</h4>
                    {dispensedLog.length === 0 && <p className="text-gray-300 font-bold text-sm">لا يوجد سجل بعد</p>}
                    {dispensedLog.map((log, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                        <div><p className="font-bold text-gray-900 text-sm">{log.drug} → {log.patient}</p><p className="text-[10px] text-gray-400">{log.time}</p></div>
                        <span className="font-black text-primary">×{log.qty}</span>
                      </div>
                    ))}
                    <div className="mt-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">الوصفات النشطة</h4>
                      {PATIENTS_LIST.slice(0, 3).map(p => (
                        <div key={p} className="p-3.5 bg-white border rounded-2xl flex items-center justify-between mb-2 cursor-pointer hover:border-primary/20 transition-all group" onClick={() => setDispenseTarget(p)}>
                          <p className="font-bold text-gray-800 text-sm">{p}</p>
                          <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-primary transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || editTarget) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAdding(false); setEditTarget(null); resetForm(); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-7 border-b flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">{editTarget ? 'تعديل بيانات الدواء' : 'إضافة صنف جديد'}</h2>
                <button onClick={() => { setIsAdding(false); setEditTarget(null); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-7"><DrugForm /></div>
              <div className="p-7 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => { setIsAdding(false); setEditTarget(null); resetForm(); }} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
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
              <p className="font-bold text-gray-700">حذف <span className="text-rose-600">«{deleteTarget.name.split(' (')[0]}»</span>؟</p>
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
