'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Patient {
  id: string;
  fileNumber: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  age: number;
  lastVisit: string;
  status: 'active' | 'inactive';
}

const initialPatients: Patient[] = [
  { id: '1', fileNumber: 'P-1001', name: 'سناء علي عبد الله', phone: '777123456', email: 'sana@example.com', gender: 'أنثى', age: 28, lastVisit: '2024-05-01', status: 'active' },
  { id: '2', fileNumber: 'P-1002', name: 'محمد حسن صالح', phone: '770987654', email: 'mohammed@example.com', gender: 'ذكر', age: 45, lastVisit: '2024-04-28', status: 'active' },
  { id: '3', fileNumber: 'P-1003', name: 'ليلى مرشد السعدي', phone: '711223344', email: 'layla@example.com', gender: 'أنثى', age: 34, lastVisit: '2024-04-15', status: 'inactive' },
  { id: '4', fileNumber: 'P-1004', name: 'جابر يحيى حسين', phone: '733445566', email: 'jaber@example.com', gender: 'ذكر', age: 52, lastVisit: '2024-05-02', status: 'active' },
  { id: '5', fileNumber: 'P-1005', name: 'هند علي محمد', phone: '776655443', email: 'hind@example.com', gender: 'أنثى', age: 22, lastVisit: '2024-03-20', status: 'active' },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingPatient, setIsAddingPatient] = useState(false);

  const filteredPatients = patients.filter(p => 
    p.name.includes(searchQuery) || 
    p.phone.includes(searchQuery) || 
    p.fileNumber.includes(searchQuery)
  );

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              إدارة المرضى
            </h1>
            <p className="text-gray-500 mt-1">عرض وتعديل بيانات المرضى والسجلات الطبية.</p>
          </div>
          <button 
            onClick={() => setIsAddingPatient(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/25"
          >
            <UserPlus className="w-5 h-5" />
            إضافة مريض جديد
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="البحث بالاسم، الهاتف، أو رقم الملف..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              تصفية النتائج
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />
            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              عرض {filteredPatients.length} من {patients.length} مريض
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-5">رقم الملف</th>
                  <th className="px-6 py-5">المريض</th>
                  <th className="px-6 py-5">معلومات التواصل</th>
                  <th className="px-6 py-5">الجنس / العمر</th>
                  <th className="px-6 py-5">آخر زيارة</th>
                  <th className="px-6 py-5 text-center">الحالة</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredPatients.map((patient, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={patient.id} 
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-primary font-bold">{patient.fileNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {patient.name[0]}
                        </div>
                        <span className="font-bold text-gray-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{patient.gender}</span>
                      <span className="text-gray-400 mx-2">/</span>
                      <span className="text-gray-500">{patient.age} سنة</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="w-3 h-3 text-gray-400" />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "mx-auto w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                        patient.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                      )}>
                        {patient.status === 'active' ? 'نشط' : 'غير نشط'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-6 border-t flex items-center justify-between bg-gray-50/30">
            <span className="text-xs text-gray-500 font-medium tracking-tight">الصفحة 1 من 1</span>
            <div className="flex items-center gap-2">
              <button disabled className="p-2 rounded-xl border bg-white disabled:opacity-50 text-gray-400 cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button disabled className="p-2 rounded-xl border bg-white disabled:opacity-50 text-gray-400 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {isAddingPatient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingPatient(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b">
                <h2 className="text-2xl font-bold text-gray-900">إضافة مريض جديد</h2>
                <p className="text-gray-500 mt-1 uppercase text-xs font-bold tracking-widest text-primary">New Patient Registration</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">الاسم واللقب</label>
                    <input type="text" placeholder="مثال: يحيى صالح" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
                    <input type="tel" placeholder="777XXXXXX" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-left" dir="ltr" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">الجنس</label>
                    <select className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none">
                      <option>ذكر</option>
                      <option>أنثى</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">تاريخ الميلاد</label>
                    <input type="date" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">البريد الإلكتروني (اختياري)</label>
                  <input type="email" placeholder="example@gmail.com" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                </div>
              </div>
              <div className="p-8 bg-gray-50 flex items-center justify-end gap-4">
                <button 
                  onClick={() => setIsAddingPatient(false)}
                  className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  إلغاء
                </button>
                <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/25">
                  حفظ البيانات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
