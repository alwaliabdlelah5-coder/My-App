'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Stethoscope, 
  Search, 
  User, 
  Heart, 
  Thermometer, 
  Activity, 
  Pill, 
  FlaskConical, 
  Save,
  Clock,
  ChevronLeft,
  Calendar,
  ArrowUpRight,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { usePatients } from '@/hooks/use-patients';
import { useQueue } from '@/hooks/use-queue';

interface Section {
  id: string;
  name: string;
  icon: React.ElementType;
}

const sections: Section[] = [
  { id: 'vitals', name: 'العلامات الحيوية', icon: Activity },
  { id: 'complaint', name: 'الشكوى الرئيسية', icon: Heart },
  { id: 'diagnosis', name: 'التشخيص', icon: Stethoscope },
  { id: 'prescription', name: 'الوصفة الطبية', icon: Pill },
  { id: 'labs', name: 'الفحوصات والأشعة', icon: FlaskConical },
];

export default function ClinicPage() {
  const [activeSection, setActiveSection] = useState('vitals');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [vitals, setVitals] = useState<Record<string, string>>({});
  const [medicalHistory, setMedicalHistory] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const { patients: livePatients, loading: patientsLoading } = usePatients();
  const { queue, loading: queueLoading } = useQueue();

  const displayPatients = patientsLoading ? [] : livePatients;
  const patientsInQueue = queue.filter(q => q.status === 'waiting' || q.status === 'in_consultation');

  const handleSave = () => {
    if (!selectedPatient) return;
    alert(`تم حفظ السجل الطبي للمريض ${selectedPatient.name} بنجاح.`);
  };

  return (
    <Sidebar>
      <div className="space-y-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-primary" />
              العيادة الذكية
            </h1>
            <p className="text-gray-500 mt-1 uppercase text-xs font-black tracking-widest text-primary/60">Electronic Health Records</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25"
            >
              <Save className="w-5 h-5" />
              حفظ السجل
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 flex-1 items-start">
          {/* Patient Selection & History */}
          <div className="space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6 space-y-6">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ابحث عن مريض..." 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-11 pl-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {!selectedPatient ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wider">مرضى اليوم المجدولون</p>
                  {displayPatients.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all text-right border border-transparent",
                        selectedPatient?.id === p.id && "bg-primary/5 border-primary/20 shadow-sm"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 border-b border-transparent group-hover:border-primary/20">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.fileNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
                      {selectedPatient.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{selectedPatient.name}</h3>
                      <p className="text-xs text-primary font-bold">{selectedPatient.fileNumber}</p>
                      <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                        <span>{new Date().getFullYear() - new Date(selectedPatient.birthDate).getFullYear()} سنة</span>
                        <span>•</span>
                        <span>{selectedPatient.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 px-2 uppercase tracking-widest text-primary/40">تاريخ الزيارات الأخيرة</p>
                    {[1, 2].map(v => (
                      <div key={v} className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-600">فحص دوري</span>
                          <span className="text-[10px] text-gray-400">12/04/2024</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">صداع نصفي مع شعور بالغثيان منذ 3 أيام...</p>
                      </div>
                    ))}
                    <button className="w-full py-2 text-xs font-bold text-primary hover:underline">عرض كل السجل</button>
                    <button 
                      onClick={() => setSelectedPatient(null)}
                      className="w-full py-2 text-xs font-bold text-rose-500 hover:underline border-t"
                    >
                      تغيير المريض
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Record Entry Area */}
          <div className="bg-white rounded-3xl border shadow-sm min-h-[600px] flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b bg-gray-50/30 overflow-x-auto no-scrollbar">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative border-l last:border-l-0 whitespace-nowrap",
                    activeSection === s.id 
                      ? "text-primary bg-white shadow-[inset_0_-2px_0_0_#2563eb]" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <s.icon className="w-4 h-4" />
                  {s.name}
                </button>
              ))}
            </div>

            {/* Section Content */}
            <div className="p-8 flex-1">
              {activeSection === 'vitals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <VitalsInput 
                    label="ضغط الدم (انقباضي)" icon={Activity} unit="mmHg" placeholder="120" 
                    value={vitals.systolic || ''} onChange={(v) => setVitals(prev => ({ ...prev, systolic: v }))} 
                  />
                  <VitalsInput 
                    label="ضغط الدم (انبساطي)" icon={Activity} unit="mmHg" placeholder="80" 
                    value={vitals.diastolic || ''} onChange={(v) => setVitals(prev => ({ ...prev, diastolic: v }))}
                  />
                  <VitalsInput 
                    label="النبض" icon={Heart} unit="bpm" placeholder="72" 
                    value={vitals.pulse || ''} onChange={(v) => setVitals(prev => ({ ...prev, pulse: v }))}
                  />
                  <VitalsInput 
                    label="درجة الحرارة" icon={Thermometer} unit="°C" placeholder="37.0" 
                    value={vitals.temp || ''} onChange={(v) => setVitals(prev => ({ ...prev, temp: v }))}
                  />
                </div>
              )}

              {activeSection === 'complaint' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">وصف الشكوى الرئيسية والتاريخ المرضي</label>
                    <textarea 
                      rows={10} 
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium leading-relaxed"
                      placeholder="صف حالة المريض كما ذكرها..."
                    />
                  </div>
                  <div className="flex gap-4">
                    {['صداع', 'حمى', 'ألم مفاصل', 'غثيان', 'تعب عام'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setMedicalHistory(prev => prev + ' ' + tag)}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'diagnosis' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">التشخيص الطبي (بصيغة ICD-10)</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20" placeholder="ابحث عن كود التشخيص..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">ملاحظات التشخيص والخطة العلاجية</label>
                    <textarea 
                      rows={10} 
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="نص حر للتشخيص والخطة..."
                    />
                  </div>
                </div>
              )}
              
              {activeSection === 'prescription' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-xl text-gray-900 italic tracking-tighter">Drug Prescription</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">مرتبط بقاعدة بيانات الصيدلية</p>
                    </div>
                    <button 
                      onClick={() => alert('تحويل المريض للصيدلية لصرف الدواء')}
                      className="flex items-center gap-2 text-primary text-sm font-black hover:scale-105 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة دواء للوصفة
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-primary/20 transition-all flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-md border border-gray-100">
                          <Pill className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-xl text-gray-900 tracking-tighter leading-none">Augmentin 625mg</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 italic uppercase">Amoxicillin/Clavulanic • 2 Times/Day • 7 Days</p>
                        </div>
                      </div>
                      <button className="p-3 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'labs' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-xl text-gray-900 italic tracking-tighter">Lab & Radiology Orders</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">إرسال طلبات التحاليل والأشعة</p>
                      </div>
                      <button 
                        onClick={() => alert('إرسال طلب التحليل للمختبر بنجاح')}
                        className="bg-gray-900 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-gray-900/10"
                      >
                         طلب فحص جديد
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LabOrderCard title="CBC (صورة دم)" status="pending" type="lab" date="اليوم" />
                      <LabOrderCard title="Chest X-Ray" status="completed" type="radiology" date="منذ يومين" />
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-8 border-t bg-gray-50/50 flex justify-between items-center px-12">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Autosaved at 10:42 PM</span>
              </div>
              <div className="flex items-center gap-4">
                 <button className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900">حفظ كمسودة</button>
                 <button 
                  onClick={handleSave}
                  className="bg-primary text-white px-12 py-4 rounded-2xl font-black italic tracking-tighter text-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                 >
                    إصدار السجل الطبي
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function LabOrderCard({ title, status, type, date }: { title: string, status: 'pending' | 'completed', type: 'lab' | 'radiology', date: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-primary/20 transition-all flex items-center justify-between group shadow-sm">
       <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm",
            type === 'lab' ? "bg-indigo-50 text-indigo-500 border-indigo-100" : "bg-purple-50 text-purple-500 border-purple-100"
          )}>
             {type === 'lab' ? <FlaskConical className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
          </div>
          <div>
             <h4 className="font-black text-gray-900 leading-none">{title}</h4>
             <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase italic">{date} • {type.toUpperCase()}</p>
          </div>
       </div>
       <div className={cn(
         "px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest",
         status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
       )}>
          {status === 'pending' ? 'جاري الفحص' : 'جاهز'}
       </div>
    </div>
  );
}

function VitalsInput({ label, icon: Icon, unit, placeholder, value, onChange }: { label: string, icon: any, unit: string, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary/40" />
        {label}
      </label>
      <div className="relative">
        <input 
          type="text" 
          placeholder={placeholder} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all font-mono"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 italic">
          {unit}
        </span>
      </div>
    </div>
  );
}
