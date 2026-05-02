'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Tablets, 
  Search, 
  Trash2, 
  Plus, 
  AlertCircle, 
  Package, 
  TrendingUp, 
  ArrowRight,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

import { usePharmacy, type Drug } from '@/hooks/use-pharmacy';
import { useFinance } from '@/hooks/use-finance';

const pharmacyStats = [
  { name: 'إجمالي الأصناف', value: '425', icon: Package, color: 'blue' },
  { name: 'وصفات صرفت اليوم', value: '18', icon: Tablets, color: 'emerald' },
  { name: 'أصناف قاربت الانتهاء', value: '14', icon: AlertCircle, color: 'red' },
  { name: 'المبيعات اليومية', value: '85,400 ر.ي', icon: TrendingUp, color: 'indigo' },
];

const initialInventory: Drug[] = [
  { id: '1', name: 'أوجمنتين (Augmentin)', scientificName: 'Amoxicillin/Clavulanic acid', category: 'مضادات حيوية', stock: 45, expiry: '2024-06-15', price: '4500 ر.ي', isNearingExpiry: true, brandNames: ['أموكسيدار', 'موكسيلين'] },
  { id: '2', name: 'بنادول (Panadol)', scientificName: 'Paracetamol', category: 'مسكنات', stock: 120, expiry: '2026-10-20', price: '1200 ر.ي', isNearingExpiry: false, brandNames: ['سيتامول', 'براسيتامول'] },
  { id: '3', name: 'جلوكوفاج (Glucophage)', scientificName: 'Metformin', category: 'أدوية سكري', stock: 30, expiry: '2024-08-01', price: '3200 ر.ي', isNearingExpiry: false, brandNames: ['ميتفورمين اليمن'] },
  { id: '4', name: 'فولتارين (Voltaren)', scientificName: 'Diclofenac', category: 'مضادات التهاب', stock: 12, expiry: '2024-05-25', price: '2800 ر.ي', isNearingExpiry: true, brandNames: ['ديكلوفين'] },
];

const getStockColor = (stock: number) => {
  if (stock < 15) return "bg-rose-500";
  if (stock < 40) return "bg-amber-500";
  return "bg-emerald-500";
};

export default function PharmacyPage() {
  const { inventory: liveInventory, loading, updateStock } = usePharmacy();
  const { addTransaction } = useFinance();
  const [activeTab, setActiveTab] = useState<'inventory' | 'dispensing' | 'alerts'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [dispenseTarget, setDispenseTarget] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [dispenseAmount, setDispenseAmount] = useState(1);

  const displayInventory = loading ? initialInventory : (liveInventory.length > 0 ? liveInventory : initialInventory);

  const filteredInventory = displayInventory.filter(drug => 
    drug.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    drug.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmDispense = async () => {
    if (!selectedDrug || !dispenseTarget) {
      alert('الرجاء اختيار الدواء والمريض');
      return;
    }

    if (selectedDrug.stock < dispenseAmount) {
      alert('المخزون غير كافٍ');
      return;
    }

    try {
      // 1. Update Stock
      await updateStock(selectedDrug.id, selectedDrug.stock - dispenseAmount);

      // 2. Add Finance Transaction
      const priceVal = parseInt(selectedDrug.price.replace(/[^\d]/g, '')) || 0;
      await addTransaction({
        type: 'income',
        category: 'الصيدلية',
        amount: priceVal * dispenseAmount,
        description: `صرف ${selectedDrug.name} لـ ${dispenseTarget}`,
        method: 'cash'
      });

      alert('تم صرف الدواء بنجاح وتسجيل العملية المالية');
      setActiveTab('inventory');
      setSelectedDrug(null);
      setDispenseTarget('');
      setDispenseAmount(1);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء الصرف');
    }
  };

  const handleDispense = () => {
    if (!selectedDrug || !dispenseTarget) return;
    alert(`تم صرف ${selectedDrug.name} للمريض ${dispenseTarget}`);
    setSelectedDrug(null);
    setDispenseTarget('');
  };

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Tablets className="w-8 h-8 text-primary" />
              إدارة الصيدلية
            </h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40 block">Smart Pharmacy Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/25">
              <Plus className="w-5 h-5" />
              إضافة صنف جديد
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pharmacyStats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={stat.name}
              className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                  stat.color === 'red' ? "bg-red-50 text-red-600" :
                  "bg-indigo-50 text-indigo-600"
                )}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-500 font-bold text-xs uppercase tracking-tight">{stat.name}</h3>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
            </motion.div>
          ))}
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center bg-white border rounded-2xl p-1 shadow-sm w-full md:w-auto">
            {['inventory', 'dispensing', 'alerts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                  activeTab === tab ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400 hover:text-primary"
                )}
              >
                {tab === 'inventory' ? 'المخزون' : tab === 'dispensing' ? 'صرف الأدوية' : 'تنبيهات الصلاحية'}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="ابحث عن دواء (اسم علمي أو تجاري)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pr-11 pl-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
          <AnimatePresence mode="wait">
            {activeTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
              >
                <div className="p-8 border-b bg-gray-50/50 flex flex-col lg:flex-row justify-between gap-6">
                   <div className="relative flex-1 max-w-xl">
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="بحث باسم الدواء العلمي أو التجاري (أموكسيدار، بنادول...)"
                        className="w-full pr-12 pl-4 py-4 bg-white border-2 border-gray-100 rounded-[1.5rem] focus:border-primary outline-none font-bold text-[16px] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                   <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-600 hover:border-primary transition-all shadow-sm">
                         <Filter className="w-5 h-5" />
                         تصفية الفئات
                      </button>
                      <button className="bg-primary text-white p-3 rounded-2xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/25">
                         <Plus className="w-6 h-6" />
                      </button>
                   </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest italic border-b">
                        <th className="px-8 py-5">الدواء التجاري</th>
                        <th className="px-8 py-5">المادة الفعالة (العلمي)</th>
                        <th className="px-8 py-5 text-center">البدائل المتوفرة</th>
                        <th className="px-8 py-5">المخزون (Batch)</th>
                        <th className="px-8 py-5">السعر (ر.ي)</th>
                        <th className="px-8 py-5">العمليات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInventory.map((drug) => (
                        <tr key={drug.id} className="hover:bg-gray-50/80 transition-all group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm",
                                  drug.isNearingExpiry ? "bg-rose-50 text-rose-500" : "bg-primary/5 text-primary"
                                )}>
                                   <Package className="w-6 h-6" />
                                </div>
                                <div>
                                   <p className="font-black text-gray-900 text-lg tracking-tighter leading-none">{drug.name.split(' (')[0]}</p>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">CAT: {drug.category}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="font-bold text-gray-500 italic text-sm">{drug.scientificName}</p>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className="flex flex-wrap justify-center gap-1.5 min-w-[150px]">
                                {drug.brandNames.map(brand => (
                                  <span key={brand} className="text-[9px] font-black bg-gray-100/50 text-gray-400 px-2 py-0.5 rounded-lg border border-gray-100 uppercase italic">
                                     {brand}
                                  </span>
                                ))}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-col gap-2">
                                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                   <div className={cn("h-full rounded-full transition-all", getStockColor(drug.stock))} style={{ width: `${Math.min(drug.stock, 100)}%` }} />
                                </div>
                                <div className="flex justify-between items-center w-32">
                                   <span className="text-[10px] font-black text-gray-400 uppercase italic">{drug.stock} Units</span>
                                   <div className={cn("flex items-center gap-1", drug.isNearingExpiry ? "text-rose-500" : "text-gray-400")}>
                                      <Clock className="w-3 h-3" />
                                      <span className="text-[9px] font-bold">{drug.expiry}</span>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="font-black text-xl text-primary tracking-tighter">{drug.price.split(' ')[0]}</p>
                             <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">YER PER UNIT</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => { setActiveTab('dispensing'); setSelectedDrug(drug); }}
                                  className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                  صرف
                                </button>
                                <button className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-xl shadow-sm transition-all">
                                   <MoreVertical className="w-5 h-5" />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'dispensing' && (
              <motion.div
                key="dispensing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-12 text-center space-y-6 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-primary/20">
                  <Tablets className="w-10 h-10 text-primary" />
                </div>
                <div className="max-w-md">
                   <h3 className="text-2xl font-black text-gray-900">
                    {selectedDrug ? `صرف ${selectedDrug.name}` : 'صرف وصفة طبية'}
                   </h3>
                  <p className="text-gray-500 mt-2 font-medium">أدخل رقم المريض أو اسم المريض لعرض الأدوية الموصوفة والبدائل المتاحة.</p>
                </div>
                
                <div className="w-full max-w-lg space-y-4">
                  <input 
                    type="text" 
                    placeholder="اسم المريض أو رقم الهوية..." 
                    value={dispenseTarget}
                    onChange={(e) => setDispenseTarget(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-center"
                  />
                  {selectedDrug && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between">
                       <span className="font-bold text-primary">{selectedDrug.name}</span>
                       <button onClick={() => setSelectedDrug(null)} className="text-[10px] uppercase font-black text-rose-500">إلغاء</button>
                    </div>
                  )}
                  <button 
                    onClick={handleConfirmDispense}
                    disabled={!dispenseTarget || (!selectedDrug)}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 disabled:grayscale"
                  >
                    تأكيد الصرف
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t w-full max-w-2xl">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-6">الوصفات النشطة اليوم</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-gray-100 rounded-2xl text-right flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                         <div>
                            <p className="font-bold text-gray-900">سناء علي عبد الله</p>
                            <p className="text-[9px] text-gray-400 uppercase">File: P-1001 • Dr. Ahmed</p>
                         </div>
                         <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-primary" />
                      </div>
                      <div className="p-4 bg-white border border-gray-100 rounded-2xl text-right flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                         <div>
                            <p className="font-bold text-gray-900">محمد حسن صالح</p>
                            <p className="text-[9px] text-gray-400 uppercase">File: P-1002 • Dr. Khaled</p>
                         </div>
                         <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-primary" />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Sidebar>
  );
}
