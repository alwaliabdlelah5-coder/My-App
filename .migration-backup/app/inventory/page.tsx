'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  Settings, 
  Box, 
  ArrowUpRight,
  ArrowDownRight,
  Download,
  MoreVertical,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Supplies' | 'Equipment' | 'Consumables';
  stock: number;
  minStock: number;
  unit: string;
  location: string;
  lastMaintained?: string;
  status: 'good' | 'low' | 'repair';
}

const inventoryData: InventoryItem[] = [
  { id: 'INV-001', name: 'جهاز تخطيط القلب (ECG)', category: 'Equipment', stock: 4, minStock: 2, unit: 'أجهزة', location: 'قسم الطوارئ', lastMaintained: '2024-03-10', status: 'good' },
  { id: 'INV-002', name: 'حقن طبية 5ml', category: 'Supplies', stock: 120, minStock: 500, unit: 'كرتون', location: 'المخزن الرئيسي', status: 'low' },
  { id: 'INV-003', name: 'جوانتيات طبية (L)', category: 'Consumables', stock: 850, minStock: 200, unit: 'عبوة', location: 'المخزن الصغير', status: 'good' },
  { id: 'INV-004', name: 'جهاز MRI 3T', category: 'Equipment', stock: 1, minStock: 1, unit: 'أجهزة', location: 'قسم الأشعة', lastMaintained: '2023-12-01', status: 'repair' },
  { id: 'INV-005', name: 'شاش معقم', category: 'Supplies', stock: 45, minStock: 100, unit: 'رول', location: 'المخزن الرئيسي', status: 'low' },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'supplies' | 'equipment'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = item.name.includes(searchQuery) || item.id.includes(searchQuery);
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'supplies') return matchesSearch && (item.category === 'Supplies' || item.category === 'Consumables');
    if (activeTab === 'equipment') return matchesSearch && item.category === 'Equipment';
    return matchesSearch;
  });

  return (
    <Sidebar>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter uppercase font-mono">
                Asset & Inventory
              </h1>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
                Centralized medical supplies & equipment management
              </p>
           </div>
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black italic text-xs shadow-lg shadow-gray-900/10 hover:bg-primary transition-all uppercase tracking-widest">
                 <Plus className="w-5 h-5" />
                 Add Asset
              </button>
           </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <MetricCard label="Total Assets" value="1,248" icon={Box} trend="+3%" isPositive />
           <MetricCard label="Low Stock Items" value="14" icon={AlertTriangle} trend="+2" isPositive={false} />
           <MetricCard label="Equipment value" value="2.4M$" icon={TrendingUp} trend="+12k" isPositive />
           <MetricCard label="Maintenance Pending" value="3" icon={Settings} trend="-1" isPositive />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-4 rounded-[2.5rem] border shadow-sm">
           <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl w-full lg:w-auto">
              <button 
                onClick={() => setActiveTab('all')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-black italic tracking-widest uppercase transition-all",
                  activeTab === 'all' ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                All Assets
              </button>
              <button 
                onClick={() => setActiveTab('supplies')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-black italic tracking-widest uppercase transition-all",
                  activeTab === 'supplies' ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Supplies
              </button>
              <button 
                onClick={() => setActiveTab('equipment')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-black italic tracking-widest uppercase transition-all",
                  activeTab === 'equipment' ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Equipment
              </button>
           </div>

           <div className="relative flex-1 max-w-lg w-full lg:w-auto">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, ID or location..."
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           <div className="flex items-center gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border rounded-2xl text-xs font-black italic text-gray-400 hover:text-gray-900 transition-all">
                <Filter className="w-4 h-4" />
                Advanced
              </button>
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border rounded-2xl text-xs font-black italic text-gray-400 hover:text-gray-900 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
           </div>
        </div>

        {/* Assets Ledger */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-right">
                 <thead>
                    <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                       <th className="px-8 py-5">Asset Detail</th>
                       <th className="px-8 py-5">Classification</th>
                       <th className="px-8 py-5 text-center">Current Stock</th>
                       <th className="px-8 py-5">Facility Location</th>
                       <th className="px-8 py-5">Maintenance/Status</th>
                       <th className="px-8 py-5"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    <AnimatePresence mode="popLayout">
                       {filteredItems.map((item, i) => (
                         <motion.tr 
                           layout
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           transition={{ delay: i * 0.05 }}
                           key={item.id} 
                           className="group hover:bg-gray-50/50 transition-colors"
                         >
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-sm",
                                    item.status === 'low' ? "bg-rose-50 border-rose-100 text-rose-500" : 
                                    item.status === 'repair' ? "bg-amber-50 border-amber-100 text-amber-500" : 
                                    "bg-emerald-50 border-emerald-100 text-emerald-500"
                                  )}>
                                     {item.category === 'Equipment' ? <Stethoscope className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                                  </div>
                                  <div>
                                     <h4 className="font-black text-gray-900 text-lg italic tracking-tighter leading-none">{item.name}</h4>
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">ID: {item.id}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className="px-4 py-1.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase italic tracking-widest">
                                  {item.category}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <div className="space-y-1">
                                  <p className={cn(
                                    "text-xl font-black italic tracking-tighter",
                                    item.stock <= item.minStock ? "text-rose-500" : "text-gray-900"
                                  )}>
                                     {item.stock.toLocaleString()} {item.unit}
                                  </p>
                                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.1em]">Threshold: {item.minStock}</p>
                               </div>
                            </td>
                            <td className="px-8 py-6 font-bold text-gray-600 italic">
                               {item.location}
                            </td>
                            <td className="px-8 py-6">
                               {item.category === 'Equipment' ? (
                                 <div className="space-y-1">
                                    <p className="text-[11px] font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-1.5">
                                       <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                       Last: {item.lastMaintained}
                                    </p>
                                    <span className={cn(
                                      "text-[9px] font-black uppercase px-2 py-0.5 rounded italic",
                                      item.status === 'repair' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                    )}>
                                       {item.status === 'repair' ? 'Under Maintenance' : 'Operational'}
                                    </span>
                                 </div>
                               ) : (
                                 <div className={cn(
                                   "w-fit px-4 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest",
                                   item.status === 'low' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                                 )}>
                                    {item.status === 'low' ? 'Urgent Reorder' : 'Supply Steady'}
                                 </div>
                               )}
                            </td>
                            <td className="px-8 py-6">
                               <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                                  <MoreVertical className="w-5 h-5" />
                               </button>
                            </td>
                         </motion.tr>
                       ))}
                    </AnimatePresence>
                 </tbody>
              </table>
           </div>
        </div>

        {/* Restocking Predictor */}
        <div className="bg-gray-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden group">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4 max-w-xl text-center md:text-right">
                 <h3 className="text-3xl font-black italic tracking-tighter leading-none">Smart Supply Predictor</h3>
                 <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] italic leading-relaxed">
                    AI-Powered inventory forecasting predicts supply exhaustion based on current clinical throughput & seasonal trends.
                 </p>
                 <div className="flex flex-wrap justify-center md:justify-end gap-3 pt-4">
                    <PredictionBadge label="ECG Paper - Low in 4 days" type="alert" />
                    <PredictionBadge label="Sterile Gloves - Stable (32d)" type="normal" />
                 </div>
              </div>
              <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                 Generate Order List
              </button>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:scale-150 transition-all duration-1000" />
        </div>
      </div>
    </Sidebar>
  );
}

function MetricCard({ label, value, icon: Icon, trend, isPositive }: { label: string, value: string, icon: any, trend: string, isPositive: boolean }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-primary/20 transition-all flex flex-col gap-6">
       <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
             <Icon className="w-6 h-6 text-primary group-hover:text-white transition-all shadow-sm" />
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black italic tracking-widest uppercase flex items-center gap-1",
            isPositive ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
          )}>
             {trend} {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </div>
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-2">{label}</p>
          <h4 className="text-3xl font-black text-gray-900 tracking-tighter font-mono leading-none">{value}</h4>
       </div>
    </div>
  );
}

function PredictionBadge({ label, type }: { label: string, type: 'alert' | 'normal' }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest flex items-center gap-2",
      type === 'alert' ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" : "bg-white/5 text-white/40 border border-white/5"
    )}>
       <TrendingUp className="w-3 h-3" />
       {label}
    </div>
  );
}
