'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Layers, 
  Save, 
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Eye,
  Server,
  Cloud,
  Cpu,
  Rocket,
  History,
  Zap,
  Tablets
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const configCategories = [
  { id: 'db', name: 'إعدادات قاعدة البيانات', icon: Database, description: 'تحكم في فلتر الاتصال والشبكات الهجينة.' },
  { id: 'modules', name: 'وحدات النظام الطبية', icon: Layers, description: 'تفعيل وتخصيص وحدات العيادات، المختبر، والصيدلية.' },
  { id: 'security', name: 'الأمان والصلاحيات', icon: ShieldCheck, description: 'إدارة أدوار المستخدمين والمصادقة الثنائية.' },
  { id: 'notifications', name: 'التنبيهات', icon: Bell, description: 'قوالب SMS/WhatsApp وإشعارات النظام.' },
  { id: 'audit', name: 'سجل التدقيق', icon: ShieldCheck, description: 'تتبع كافة العمليات والتحركات في النظام.' },
  { id: 'global', name: 'إعدادات عامة', icon: Globe, description: 'اللغة، المظهر، وساعات العمل.' },
  { id: 'automation', name: 'الأتمتة والنشر (CI/CD)', icon: Rocket, description: 'إدارة الهجرات، فلاتر البيئة، وأتمتة النشر.' },
];

const featureFlags = [
  { id: 'ENABLE_DASHBOARD', name: 'لوحة التحكم الذكية', description: 'تفعيل رسوم بيانية متقدمة وإحصائيات حية.', active: true },
  { id: 'ENABLE_AI_ANALYSIS', name: 'التحليل التشخيصي الذكي', description: 'استخدام Gemini لتحليل التقارير الطبية.', active: true },
  { id: 'ENABLE_REALTIME_NOTIFICATIONS', name: 'التنبيهات اللحظية', description: 'دفع التحديثات للأطراف المعنية فوراً.', active: false },
  { id: 'MAINTENANCE_MODE', name: 'وضع الصيانة', description: 'إغلاق النظام مؤقتاً للتحديثات التقنية.', active: false },
];

const migrations = [
  { version: 'V1', name: 'Initial Schema Migration', date: '2026-05-01', status: 'success' },
  { version: 'V2', name: 'Add Patient Medical History Table', date: '2026-05-02', status: 'success' },
  { version: 'V3', name: 'Pharmacy Inventory Optimization', date: 'Pending', status: 'pending' },
];

const medicalModules = [
  { id: 'clinics', name: 'العيادات', keys: 'Specialties, Working Hours', icon: UserCircle },
  { id: 'labs', name: 'المختبر', keys: 'Test Categories, Sample Types', icon: FlaskConical },
  { id: 'pharmacy', name: 'الصيدلية', keys: 'Drug Categories, Pricing', icon: Tablets },
  { id: 'appointments', name: 'المواعيد', keys: 'Time Slots, Statuses', icon: Calendar },
  { id: 'queue', name: 'قائمة الانتظار', keys: 'Priorities, Auto Refresh', icon: Clock },
];

const auditLogs = [
  { id: 1, user: 'د. خالد محمد', action: 'تغيير نتيجة مختبر', target: 'L-501', time: 'منذ 10 دقائق', type: 'warning' },
  { id: 2, user: 'أحمد صالح', action: 'إضافة مريض جديد', target: 'P-1005', time: 'منذ 45 دقيقة', type: 'info' },
  { id: 3, user: 'سارة أحمد', action: 'صرف دواء', target: 'RX-99', time: 'منذ ساعة', type: 'success' },
];

const dbProfiles = [
  { id: 'local', name: 'الشبكة المحلية (PostgreSQL)', type: 'local', status: 'primary' },
  { id: 'cloud', name: 'السحابة (Azure SQL)', type: 'cloud', status: 'secondary' },
  { id: 'hybrid', name: 'هجين (Hybrid Sync)', type: 'hybrid', status: 'active' },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('db');

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter uppercase font-mono">
              System Configuration
            </h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
              Centralized Enterprise Resource Planning (ERP) Control
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all text-gray-500">
                <RefreshCw className="w-5 h-5" />
             </button>
             <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black italic tracking-tighter shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                حفظ الإعدادات
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Categories Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-28">
            {configCategories.map((cat, i) => (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'automation') {
                    window.location.href = '/settings/devops';
                  } else {
                    setActiveCategory(cat.id);
                  }
                }}
                className={cn(
                  "w-full text-right p-6 rounded-[2.5rem] border-2 transition-all flex items-center gap-5 group relative overflow-hidden",
                  activeCategory === cat.id 
                    ? "bg-white border-primary shadow-xl shadow-primary/5" 
                    : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100"
                )}
              >
                <div className={cn(
                  "p-4 rounded-2xl transition-all",
                  activeCategory === cat.id ? "bg-primary text-white" : "bg-white text-gray-400 group-hover:text-gray-600 shadow-sm"
                )}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                   <h3 className={cn("font-black text-lg italic tracking-tighter", activeCategory === cat.id ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700")}>{cat.name}</h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 line-clamp-1">{cat.description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Settings Canvas */}
          <div className="bg-white rounded-[3rem] border shadow-sm min-h-[750px] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {activeCategory === 'db' && (
                <motion.div
                  key="db"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-10 space-y-10"
                >
                  <div className="flex items-center justify-between border-b pb-8">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Database Connectivity Filter</h2>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">إدارة ملفات تعريف الاتصال الهجين والمزامنة السحابية.</p>
                     </div>
                     <button className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all shadow-lg shadow-gray-900/10">
                        <Plus className="w-6 h-6" />
                     </button>
                  </div>

                  <div className="space-y-6">
                    {dbProfiles.map((profile) => (
                      <div key={profile.id} className="p-8 bg-gray-50 rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className={cn(
                              "w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all group-hover:scale-110",
                              profile.type === 'local' ? "bg-blue-50 border-blue-100 text-blue-500" :
                              profile.type === 'cloud' ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                              "bg-indigo-50 border-indigo-100 text-indigo-500"
                            )}>
                               {profile.type === 'local' ? <Server className="w-8 h-8" /> : 
                                profile.type === 'cloud' ? <Cloud className="w-8 h-8" /> : 
                                <Cpu className="w-8 h-8" />}
                            </div>
                            <div>
                               <div className="flex items-center gap-3">
                                  <h3 className="font-black text-xl text-gray-900 italic tracking-tighter">{profile.name}</h3>
                                  <span className={cn(
                                    "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic",
                                    profile.status === 'active' || profile.status === 'primary' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-gray-200 text-gray-500"
                                  )}>
                                    {profile.status}
                                  </span>
                               </div>
                               <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest">Connection ID: {profile.id} • Latency: 45ms</p>
                            </div>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-4 bg-white text-gray-400 hover:text-primary rounded-2xl border border-gray-100 shadow-sm transition-all">
                               <RefreshCw className="w-5 h-5" />
                            </button>
                            <button className="p-4 bg-white text-gray-400 hover:text-gray-900 rounded-2xl border border-gray-100 shadow-sm transition-all">
                               <Edit2 className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeCategory === 'modules' && (
                <motion.div
                  key="modules"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-10 space-y-8"
                >
                  <div className="border-b pb-8">
                     <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Medical Modules Optimization</h2>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">تخصيص الحقول والوظائف لكل قسم طبي.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {medicalModules.map(module => (
                      <div key={module.id} className="p-8 bg-gray-50 rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 transition-all flex flex-col gap-6 group">
                         <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-md group-hover:scale-110 transition-all">
                               <module.icon className="w-7 h-7" />
                            </div>
                            <button className="p-2 text-[10px] font-black text-primary uppercase tracking-widest italic hover:underline">Configuration Screen</button>
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter leading-none mb-2">{module.name}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{module.keys}</p>
                         </div>
                         <button className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-xs italic text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all">
                            تعديل الوحدة
                         </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeCategory === 'audit' && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-10"
                >
                  <div className="border-b pb-8 mb-8">
                     <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">System Audit Ledger</h2>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">سجل غير قابل للتعديل لكافة نشاطات النظام.</p>
                  </div>

                  <div className="space-y-4">
                     {auditLogs.map(log => (
                       <div key={log.id} className="p-6 bg-gray-50 border rounded-[2rem] flex items-center justify-between group hover:border-gray-200 transition-all">
                          <div className="flex items-center gap-6">
                             <div className={cn(
                               "w-4 h-4 rounded-full",
                               log.type === 'warning' ? "bg-amber-500" : log.type === 'info' ? "bg-blue-500" : "bg-emerald-500"
                             )} />
                             <div>
                                <p className="font-black text-gray-900 italic tracking-tighter">{log.action}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                   By: <span className="text-gray-600">{log.user}</span> • Target: {log.target}
                                </p>
                             </div>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 italic">{log.time}</span>
                       </div>
                     ))}
                     <button className="w-full py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all">
                        Load Complete Audit History
                     </button>
                  </div>
                </motion.div>
              )}

              {activeCategory === 'global' && (
                <motion.div
                  key="global"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-10 space-y-12"
                >
                  <div className="border-b pb-8">
                     <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Global Identity & Region</h2>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">الإعدادات الأساسية للبيئة التشغيلية.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FormCard label="نظام اللغة" value="العربية (اليمن)" icon={Globe} />
                     <FormCard label="العملة الافتراضية" value="ريال يمني (YER)" icon={Database} />
                     <FormCard label="ساعات العمل" value="08:00 AM - 10:00 PM" icon={Clock} />
                     <FormCard label="السمة البصرية" value="وضع الإبداع (Vibrant)" icon={Layers} />
                  </div>
                  
                  <div className="pt-8 border-t">
                     <button className="flex items-center gap-3 text-rose-500 font-black text-sm italic tracking-tighter group">
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-all" />
                        مسح كافة الملفات المؤقتة وإعادة التشغيل
                     </button>
                  </div>
                </motion.div>
              )}

              {activeCategory === 'automation' && (
                <motion.div
                  key="automation"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-10 space-y-12"
                >
                  <div className="flex items-center justify-between border-b pb-8">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Release & Automation Hub</h2>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">One-Click Pipeline: Build, Deploy & Seed Data.</p>
                     </div>
                     <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black italic text-xs hover:bg-primary transition-all shadow-lg">
                           <History className="w-4 h-4" />
                           View Pipeline Logs
                        </button>
                     </div>
                  </div>

                  {/* Feature Flags */}
                  <div className="space-y-6">
                     <h4 className="font-black text-sm uppercase tracking-[0.2em] text-primary italic border-l-4 border-primary pl-4">Engine Feature Flags</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featureFlags.map(flag => (
                          <ToggleSetting key={flag.id} title={flag.name} description={flag.description} active={flag.active} />
                        ))}
                     </div>
                  </div>

                  {/* Migrations */}
                  <div className="space-y-6 pt-8 border-t">
                     <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase tracking-[0.2em] text-primary italic border-l-4 border-primary pl-4">Database Migration Ledger (Flyway)</h4>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Create New Migration</button>
                     </div>
                     <div className="bg-gray-50 rounded-[2rem] overflow-hidden border">
                        <table className="w-full text-right">
                           <thead>
                              <tr className="bg-gray-100/50 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                                 <th className="px-8 py-4">Version</th>
                                 <th className="px-8 py-4">Descriptor</th>
                                 <th className="px-8 py-4">Applied Date</th>
                                 <th className="px-8 py-4 text-left">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {migrations.map(m => (
                                <tr key={m.version} className="hover:bg-white transition-colors">
                                   <td className="px-8 py-4 font-black italic text-gray-900">{m.version}</td>
                                   <td className="px-8 py-4 text-xs font-bold text-gray-500">{m.name}</td>
                                   <td className="px-8 py-4 text-[10px] font-black text-gray-400">{m.date}</td>
                                   <td className="px-8 py-4">
                                      <span className={cn(
                                        "px-3 py-1 rounded-full text-[8px] font-black uppercase italic tracking-widest",
                                        m.status === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                      )}>
                                         {m.status}
                                      </span>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Seed Data */}
                  <div className="pt-8 border-t flex items-center justify-between p-8 bg-gray-900 rounded-[2.5rem] text-white">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                           <Zap className="w-8 h-8" />
                        </div>
                        <div>
                           <h4 className="text-xl font-black italic tracking-tighter">Initial Data Seeding</h4>
                           <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Populate system with baseline clinical identities.</p>
                        </div>
                     </div>
                     <button className="px-8 py-3 bg-primary text-white rounded-2xl font-black italic tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                        Execute Seed.sql
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function ToggleSetting({ title, description, active }: { title: string, description: string, active: boolean }) {
  const [isActive, setIsActive] = useState(active);
  return (
    <div className="flex items-center justify-between p-7 bg-white border-2 border-gray-50 rounded-[2rem] group hover:border-primary/10 transition-all">
      <div className="max-w-[200px]">
        <h5 className="font-black text-gray-900 text-sm italic tracking-tighter">{title}</h5>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 leading-tight">{description}</p>
      </div>
      <button 
        onClick={() => setIsActive(!isActive)}
        className={cn(
          "w-14 h-7 rounded-full relative transition-all duration-300",
          isActive ? "bg-primary shadow-lg shadow-primary/20" : "bg-gray-200"
        )}
      >
        <motion.div 
          animate={{ x: isActive ? 28 : 4 }}
          className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
}

function FormCard({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="p-8 bg-gray-50 rounded-[2.5rem] border-2 border-transparent hover:border-gray-200 transition-all group flex items-center justify-between">
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2">{label}</p>
          <p className="text-xl font-black text-gray-900 italic tracking-tighter">{value}</p>
       </div>
       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-primary transition-all shadow-sm">
          <Icon className="w-5 h-5" />
       </div>
    </div>
  );
}

import { 
  UserCircle, 
  FlaskConical, 
  Clock, 
  Calendar,
  Edit2
} from 'lucide-react';
