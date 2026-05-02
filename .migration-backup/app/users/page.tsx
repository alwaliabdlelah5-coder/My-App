'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  MoreVertical, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  Lock,
  Eye,
  Trash2,
  Edit2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const users = [
  { id: 1, name: 'د. خالد محمد', role: 'مدير النظام', status: 'نشط', email: 'khaled@medical.ye', lastLogin: 'منذ 5 دقائق' },
  { id: 2, name: 'أحمد صالح', role: 'موظف استقبال', status: 'نشط', email: 'ahmed@medical.ye', lastLogin: 'منذ ساعتين' },
  { id: 3, name: 'سارة أحمد', role: 'فني مختبر', status: 'غير نشط', email: 'sara@medical.ye', lastLogin: 'أمس' },
];

const roles = [
  { id: 1, name: 'مدير النظام', usersCount: 1, permissions: ['جميع الصلاحيات'] },
  { id: 2, name: 'دكتور', usersCount: 12, permissions: ['العيادة', 'السجلات الطبية'] },
  { id: 3, name: 'موظف استقبال', usersCount: 5, permissions: ['المواعيد', 'المرضى'] },
  { id: 4, name: 'صيدلي', usersCount: 3, permissions: ['الصيدلية', 'المخزون'] },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showAddUser, setShowAddUser] = useState(false);

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter uppercase font-mono">
              Identity Management
            </h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
              User Access Control & Role Definition
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddUser(true)}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-black italic tracking-tighter shadow-lg shadow-primary/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              أضف مستخدم جديد
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 p-2 rounded-3xl w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-8 py-3 rounded-2xl font-black text-sm italic tracking-widest uppercase transition-all",
              activeTab === 'users' ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-900"
            )}
          >
            المستخدمين
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={cn(
              "px-8 py-3 rounded-2xl font-black text-sm italic tracking-widest uppercase transition-all",
              activeTab === 'roles' ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-900"
            )}
          >
            الأدوار والصلاحيات
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          <div className="p-8 border-b bg-gray-50/50 flex flex-col md:flex-row justify-between gap-6">
             <div className="relative flex-1 max-w-xl">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..." 
                  className="w-full pr-12 pl-4 py-4 bg-white border-2 border-gray-100 rounded-[1.5rem] focus:border-primary outline-none font-bold text-[16px] transition-all"
                />
             </div>
             <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-600 hover:border-primary transition-all">
                  <ShieldCheck className="w-5 h-5" />
                  فلترة الأدوار
                </button>
             </div>
          </div>

          <div className="flex-1">
             <AnimatePresence mode="wait">
                {activeTab === 'users' ? (
                  <motion.div
                    key="users"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full text-right">
                       <thead>
                          <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest italic border-b">
                             <th className="px-8 py-5">المستخدم</th>
                             <th className="px-8 py-5">الدور الوظيفي</th>
                             <th className="px-8 py-5">الحالة</th>
                             <th className="px-8 py-5">آخر دخول</th>
                             <th className="px-8 py-5">العمليات</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/80 transition-all group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black italic shadow-lg shadow-gray-900/10">
                                        {user.name[0]}
                                     </div>
                                     <div>
                                        <p className="font-black text-gray-900 text-lg tracking-tighter leading-none">{user.name}</p>
                                        <p className="text-[10px] font-black text-gray-400 italic uppercase tracking-widest mt-1">{user.email}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                     <ShieldCheck className="w-4 h-4 text-primary" />
                                     <span className="font-black text-sm italic tracking-tighter text-gray-600">{user.role}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className={cn(
                                    "px-4 py-1 rounded-full text-[10px] font-black italic tracking-widest uppercase inline-flex items-center gap-1.5",
                                    user.status === 'نشط' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                                  )}>
                                     <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'نشط' ? "bg-emerald-500" : "bg-rose-500")} />
                                     {user.status}
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <p className="font-bold text-gray-400 text-sm italic">{user.lastLogin}</p>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex gap-2">
                                     <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                                        <Edit2 className="w-4 h-4" />
                                     </button>
                                     <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm">
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                     <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                                        <MoreVertical className="w-4 h-4" />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </motion.div>
                ) : (
                  <motion.div
                    key="roles"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {roles.map(role => (
                      <div key={role.id} className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] flex flex-col gap-8 group hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-md">
                              <Lock className="w-7 h-7" />
                           </div>
                           <span className="text-[10px] font-black text-gray-400 italic">ID: 00{role.id}</span>
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none mb-2">{role.name}</h4>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{role.usersCount} Assigned Users</p>
                        </div>
                        <div className="space-y-3 flex-1">
                           <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Active Permissions</p>
                           <div className="flex flex-wrap gap-2">
                              {role.permissions.map(p => (
                                <span key={p} className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-600 italic">
                                   {p}
                                </span>
                              ))}
                              {role.name === 'مدير النظام' && (
                                <span className="px-3 py-1 bg-gray-900 text-white rounded-xl text-[10px] font-black italic">
                                   FULL ACCESS
                                </span>
                              )}
                           </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t">
                           <button className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl font-black text-xs italic tracking-tighter text-gray-900 hover:border-primary transition-all">تحرير الدور</button>
                           <button className="p-3 bg-white border border-gray-200 rounded-2xl hover:text-primary transition-all"><Eye className="w-5 h-5" /></button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="border-4 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-gray-300 hover:text-primary hover:border-primary/20 transition-all gap-4">
                       <Plus className="w-12 h-12" />
                       <span className="font-black italic uppercase tracking-widest text-sm">Create New Role</span>
                    </button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Add User Modal */}
      <AnimatePresence>
         {showAddUser && (
           <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
              >
                 <div className="p-10 border-b bg-gray-50 flex justify-between items-center">
                    <div>
                       <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Add Clinical Identity</h2>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Register new system operator</p>
                    </div>
                    <button onClick={() => setShowAddUser(false)} className="p-3 bg-white border rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                 </div>
                 
                 <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                       <FormInput label="Full Medical Name" icon={Users} placeholder="د. خالد محمد..." />
                       <FormInput label="Email Address" icon={Mail} placeholder="name@medical.ye" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <FormInput label="Assigned Role" icon={ShieldCheck} placeholder="Select Permission Level" />
                       <FormInput label="Security Level" icon={Lock} placeholder="Alpha / Beta / Gamma" />
                    </div>
                    <button 
                      onClick={() => { alert('تم إنشاء حساب المستخدم بنجاح'); setShowAddUser(false); }}
                      className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] italic hover:bg-primary transition-all shadow-xl shadow-gray-900/10"
                    >
                       Confirm Authorization
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </Sidebar>
  );
}

function FormInput({ label, icon: Icon, placeholder }: { label: string, icon: any, placeholder: string }) {
  return (
    <div className="space-y-3">
       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{label}</label>
       <div className="relative">
          <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input 
            type="text" 
            placeholder={placeholder}
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all"
          />
       </div>
    </div>
  );
}
