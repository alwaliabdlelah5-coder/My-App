import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Stethoscope, Search, Heart, Thermometer, Activity, Pill, FlaskConical, Save, Plus, Trash2, X, CheckCircle, ListOrdered, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { useQueue } from '@/hooks/use-queue';

const sections = [
  { id: 'vitals', name: 'العلامات الحيوية', icon: Activity },
  { id: 'complaint', name: 'الشكوى الرئيسية', icon: Heart },
  { id: 'diagnosis', name: 'التشخيص', icon: Stethoscope },
  { id: 'prescription', name: 'الوصفة الطبية', icon: Pill },
  { id: 'labs', name: 'الفحوصات', icon: FlaskConical },
];

const PATIENTS = [
  { id: 1, name: 'سناء علي عبد الله', fileNumber: 'P-1001', age: 28, gender: 'أنثى' },
  { id: 2, name: 'محمد حسن صالح', fileNumber: 'P-1002', age: 45, gender: 'ذكر' },
  { id: 3, name: 'ليلى مرشد السعدي', fileNumber: 'P-1003', age: 34, gender: 'أنثى' },
  { id: 4, name: 'جابر يحيى حسين', fileNumber: 'P-1004', age: 52, gender: 'ذكر' },
  { id: 5, name: 'هند علي محمد', fileNumber: 'P-1005', age: 22, gender: 'أنثى' },
];

const DRUGS_DB = [
  { id: '1', name: 'أوجمنتين (Augmentin)', scientificName: 'Amoxicillin/Clavulanic acid', stock: 45 },
  { id: '2', name: 'بنادول (Panadol)', scientificName: 'Paracetamol', stock: 120 },
  { id: '3', name: 'جلوكوفاج (Glucophage)', scientificName: 'Metformin', stock: 30 },
  { id: '4', name: 'فولتارين (Voltaren)', scientificName: 'Diclofenac', stock: 12 },
  { id: '5', name: 'أموكسيل (Amoxil)', scientificName: 'Amoxicillin', stock: 80 },
  { id: '6', name: 'زيثرومكس (Zithromax)', scientificName: 'Azithromycin', stock: 55 },
];

const TESTS_DB = ['CBC (صورة دم كاملة)', 'وظائف كبد', 'وظائف كلى', 'هرمونات الغدة', 'سكر صيام', 'تحليل بول', 'صدر X-Ray', 'أشعة مقطعية'];
const COMPLAINT_TAGS = ['صداع', 'حمى', 'ألم مفاصل', 'غثيان', 'تعب عام', 'ضيق تنفس', 'ألم بطن', 'دوخة', 'سعال'];
const doctors = ['د. سارة خالد', 'د. علي يحيى', 'د. أحمد المحمدي'];

interface PrescribedDrug { id: string; name: string; dose: string; duration: string; frequency: string; }
interface LabOrder { id: string; title: string; type: 'lab' | 'radiology'; status: 'pending' | 'completed'; date: string; }

function VitalsInput({ label, icon: Icon, unit, placeholder, value, onChange }: { label: string; icon: any; unit: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Icon className="w-4 h-4 text-primary/40" />{label}</label>
      <div className="relative">
        <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-4 pl-14 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all font-mono outline-none" />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 italic">{unit}</span>
      </div>
    </div>
  );
}

function LabOrderCard({ title, status, type, date }: { title: string; status: 'pending' | 'completed'; type: 'lab' | 'radiology'; date: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-primary/20 transition-all flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm",
          type === 'lab' ? "bg-indigo-50 text-indigo-500 border-indigo-100" : "bg-purple-50 text-purple-500 border-purple-100"
        )}>{type === 'lab' ? <FlaskConical className="w-6 h-6" /> : <Activity className="w-6 h-6" />}</div>
        <div>
          <h4 className="font-black text-gray-900 leading-none">{title}</h4>
          <p className="text-[10px] font-bold text-gray-400 mt-1 italic uppercase">{date} • {type.toUpperCase()}</p>
        </div>
      </div>
      <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest",
        status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
      )}>{status === 'pending' ? 'جاري الفحص' : 'جاهز'}</div>
    </div>
  );
}

export default function ClinicPage() {
  const { toast } = useToast();
  const { addToQueue } = useQueue();
  const [activeSection, setActiveSection] = useState('vitals');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [vitals, setVitals] = useState<Record<string, string>>({});
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [prescription, setPrescription] = useState<PrescribedDrug[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([
    { id: '1', title: 'CBC (صورة دم)', status: 'pending', type: 'lab', date: 'اليوم' },
    { id: '2', title: 'Chest X-Ray', status: 'completed', type: 'radiology', date: 'منذ يومين' },
  ]);
  const [showDrugPicker, setShowDrugPicker] = useState(false);
  const [showTestPicker, setShowTestPicker] = useState(false);
  const [drugSearch, setDrugSearch] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [drugDose, setDrugDose] = useState('');
  const [drugFreq, setDrugFreq] = useState('مرتان يومياً');
  const [drugDuration, setDrugDuration] = useState('7 أيام');
  const [selectedTest, setSelectedTest] = useState('');
  const [savedFlag, setSavedFlag] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [addedToQueue, setAddedToQueue] = useState(false);
  const [addingToQueue, setAddingToQueue] = useState(false);

  const filteredPatients = PATIENTS.filter(p => !searchPatient || p.name.includes(searchPatient) || p.fileNumber.includes(searchPatient));
  const filteredDrugs = DRUGS_DB.filter(d => !drugSearch || d.name.toLowerCase().includes(drugSearch.toLowerCase()) || d.scientificName.toLowerCase().includes(drugSearch.toLowerCase()));

  const addDrug = () => {
    const drug = DRUGS_DB.find(d => d.id === selectedDrugId);
    if (!drug) { toast('الرجاء اختيار دواء', 'error'); return; }
    if (!drugDose) { toast('الرجاء إدخال الجرعة', 'error'); return; }
    setPrescription(prev => [...prev, { id: String(Date.now()), name: drug.name, dose: drugDose, frequency: drugFreq, duration: drugDuration }]);
    toast(`تمت إضافة ${drug.name.split(' ')[0]} للوصفة ✓`);
    setShowDrugPicker(false);
    setSelectedDrugId(''); setDrugDose(''); setDrugSearch('');
  };

  const removeDrug = (id: string) => {
    setPrescription(prev => prev.filter(d => d.id !== id));
    toast('تم حذف الدواء من الوصفة', 'info');
  };

  const addLabOrder = () => {
    if (!selectedTest) { toast('الرجاء اختيار التحليل', 'error'); return; }
    const isRadio = selectedTest.includes('X-Ray') || selectedTest.includes('أشعة');
    setLabOrders(prev => [...prev, { id: String(Date.now()), title: selectedTest, type: isRadio ? 'radiology' : 'lab', status: 'pending', date: 'اليوم' }]);
    toast(`تم إرسال طلب: ${selectedTest} للمختبر ✓`);
    setShowTestPicker(false);
    setSelectedTest('');
  };

  const saveRecord = () => {
    if (!selectedPatient) { toast('الرجاء اختيار مريض أولاً', 'error'); return; }
    const record = { patient: selectedPatient, vitals, complaint, diagnosis, icdCode, prescription, labOrders, savedAt: new Date().toISOString() };
    const key = `clinic_record_${selectedPatient.id}`;
    localStorage.setItem(key, JSON.stringify(record));
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 3000);
    toast(`تم حفظ السجل الطبي للمريض ${selectedPatient.name} ✓`);
  };

  const issueRecord = () => {
    if (!selectedPatient) { toast('الرجاء اختيار مريض أولاً', 'error'); return; }
    if (!diagnosis) { toast('الرجاء إدخال التشخيص قبل الإصدار', 'error'); return; }
    saveRecord();
    toast(`تم إصدار السجل الطبي وإرساله للأرشفة ✓`);
  };

  const handleAddToQueue = async () => {
    if (!selectedPatient) { toast('الرجاء اختيار مريض أولاً', 'error'); return; }
    setAddingToQueue(true);
    try {
      await addToQueue({
        patientId: String(selectedPatient.id),
        patientName: selectedPatient.name,
        doctorName: selectedDoctor,
        type: 'كشف',
        priority: 1,
      });
      setAddedToQueue(true);
      setTimeout(() => setAddedToQueue(false), 3000);
      toast(`تمت إضافة ${selectedPatient.name} إلى الطابور ✓`);
    } catch {
      toast('حدث خطأ أثناء إضافة المريض إلى الطابور', 'error');
    } finally {
      setAddingToQueue(false);
    }
  };

  return (
    <Sidebar>
      <div className="space-y-8 h-full flex flex-col">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Stethoscope className="w-8 h-8 text-primary" />العيادة الذكية</h1>
            <p className="text-gray-500 mt-1 uppercase text-xs font-black tracking-widest text-primary/60">Electronic Health Records</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <AnimatePresence>
              {addedToQueue && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-black"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  تمت الإضافة إلى الطابور
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleAddToQueue}
              disabled={addingToQueue || !selectedPatient}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg",
                selectedPatient
                  ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              )}
            >
              <ListOrdered className="w-5 h-5" />
              {addingToQueue ? 'جاري الإضافة...' : 'إضافة للطابور'}
            </button>
            <button onClick={saveRecord}
              className={cn("text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg",
                savedFlag ? "bg-emerald-500 shadow-emerald-500/25" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
              )}>
              {savedFlag ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {savedFlag ? 'تم الحفظ!' : 'حفظ السجل'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 flex-1 items-start">
          <div className="space-y-4 sticky top-28">
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6 space-y-5">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="ابحث عن مريض..." value={searchPatient} onChange={e => setSearchPatient(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-11 pl-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              {!selectedPatient ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wider">مرضى اليوم المجدولون</p>
                  {filteredPatients.map(p => (
                    <button key={p.id} onClick={() => { setSelectedPatient(p); setAddedToQueue(false); }}
                      className={cn("w-full flex items-center gap-4 p-3.5 hover:bg-gray-50 rounded-2xl transition-all text-right border border-transparent hover:border-primary/10",
                        selectedPatient?.id === p.id && "bg-primary/5 border-primary/20 shadow-sm"
                      )}>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{p.name[0]}</div>
                      <div><p className="font-bold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-500">{p.fileNumber}</p></div>
                    </button>
                  ))}
                  {filteredPatients.length === 0 && <p className="text-center text-gray-400 text-sm py-4">لا توجد نتائج</p>}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">{selectedPatient.name[0]}</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{selectedPatient.name}</h3>
                      <p className="text-xs text-primary font-bold">{selectedPatient.fileNumber}</p>
                      <div className="flex gap-2 mt-1 text-[10px] text-gray-500"><span>{selectedPatient.age} سنة</span><span>•</span><span>{selectedPatient.gender}</span></div>
                    </div>
                  </div>
                  {(() => {
                    const saved = localStorage.getItem(`clinic_record_${selectedPatient.id}`);
                    if (!saved) return null;
                    const rec = JSON.parse(saved);
                    return (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />سجل محفوظ: {new Date(rec.savedAt).toLocaleDateString('ar')}
                      </div>
                    );
                  })()}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 px-1">الطبيب المسؤول</p>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <button onClick={() => { setSelectedPatient(null); setSearchPatient(''); setAddedToQueue(false); }} className="w-full py-2 text-xs font-bold text-rose-500 hover:underline border-t">تغيير المريض</button>
                </div>
              )}
            </div>

            {selectedPatient && (
              <div className="bg-white rounded-3xl border shadow-sm p-5">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">ملخص الزيارة</h4>
                <div className="space-y-2">
                  {vitals.systolic && <div className="flex justify-between text-sm"><span className="text-gray-500">الضغط</span><span className="font-bold">{vitals.systolic}/{vitals.diastolic} mmHg</span></div>}
                  {vitals.pulse && <div className="flex justify-between text-sm"><span className="text-gray-500">النبض</span><span className="font-bold">{vitals.pulse} bpm</span></div>}
                  {prescription.length > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">الأدوية</span><span className="font-bold text-primary">{prescription.length} دواء</span></div>}
                  {labOrders.length > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">الفحوصات</span><span className="font-bold text-primary">{labOrders.length} طلب</span></div>}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border shadow-sm min-h-[600px] flex flex-col overflow-hidden">
            <div className="flex border-b bg-gray-50/30 overflow-x-auto">
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn(
                  "flex items-center gap-2 px-6 py-5 text-sm font-bold transition-all relative border-l last:border-l-0 whitespace-nowrap",
                  activeSection === s.id ? "text-primary bg-white shadow-[inset_0_-2px_0_0_#2563eb]" : "text-gray-400 hover:text-gray-600"
                )}><s.icon className="w-4 h-4" />{s.name}</button>
              ))}
            </div>

            <div className="p-8 flex-1">
              {activeSection === 'vitals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <VitalsInput label="ضغط الدم (انقباضي)" icon={Activity} unit="mmHg" placeholder="120" value={vitals.systolic || ''} onChange={v => setVitals(p => ({ ...p, systolic: v }))} />
                  <VitalsInput label="ضغط الدم (انبساطي)" icon={Activity} unit="mmHg" placeholder="80" value={vitals.diastolic || ''} onChange={v => setVitals(p => ({ ...p, diastolic: v }))} />
                  <VitalsInput label="النبض" icon={Heart} unit="bpm" placeholder="72" value={vitals.pulse || ''} onChange={v => setVitals(p => ({ ...p, pulse: v }))} />
                  <VitalsInput label="درجة الحرارة" icon={Thermometer} unit="°C" placeholder="37.0" value={vitals.temp || ''} onChange={v => setVitals(p => ({ ...p, temp: v }))} />
                  <VitalsInput label="معدل التنفس" icon={Activity} unit="resp/min" placeholder="16" value={vitals.resp || ''} onChange={v => setVitals(p => ({ ...p, resp: v }))} />
                  <VitalsInput label="الوزن" icon={Activity} unit="kg" placeholder="70" value={vitals.weight || ''} onChange={v => setVitals(p => ({ ...p, weight: v }))} />
                </div>
              )}
              {activeSection === 'complaint' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">وصف الشكوى الرئيسية والتاريخ المرضي</label>
                    <textarea rows={8} value={complaint} onChange={e => setComplaint(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium leading-relaxed"
                      placeholder="صف حالة المريض كما ذكرها..." />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {COMPLAINT_TAGS.map(tag => (
                      <button key={tag} onClick={() => setComplaint(prev => prev ? `${prev}، ${tag}` : tag)}
                        className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all",
                          complaint.includes(tag) ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
                        )}>{tag}</button>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === 'diagnosis' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">كود ICD-10 (اختياري)</label>
                    <input type="text" value={icdCode} onChange={e => setIcdCode(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono" placeholder="مثال: J06.9" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">التشخيص الطبي والخطة العلاجية</label>
                    <textarea rows={10} value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="نص حر للتشخيص والخطة العلاجية..." />
                  </div>
                </div>
              )}
              {activeSection === 'prescription' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div><h3 className="font-black text-xl text-gray-900 italic tracking-tighter">Drug Prescription</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">الوصفة الطبية</p></div>
                    <button onClick={() => setShowDrugPicker(true)} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                      <Plus className="w-4 h-4" />إضافة دواء
                    </button>
                  </div>
                  {prescription.length === 0 && (
                    <div className="p-12 text-center text-gray-300 border-2 border-dashed border-gray-200 rounded-3xl">
                      <Pill className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="font-bold">لا توجد أدوية في الوصفة</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {prescription.map(drug => (
                      <div key={drug.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div>
                          <p className="font-bold text-gray-900">{drug.name}</p>
                          <p className="text-xs text-gray-500">{drug.dose} • {drug.frequency} • {drug.duration}</p>
                        </div>
                        <button onClick={() => removeDrug(drug.id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === 'labs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div><h3 className="font-black text-xl text-gray-900 italic tracking-tighter">Lab Orders</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">طلبات الفحوصات</p></div>
                    <button onClick={() => setShowTestPicker(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all">
                      <Plus className="w-4 h-4" />طلب فحص
                    </button>
                  </div>
                  <div className="space-y-3">
                    {labOrders.map(order => <LabOrderCard key={order.id} {...order} />)}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-6 flex justify-end gap-4 bg-gray-50/30">
              <button onClick={issueRecord} className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                إصدار السجل الطبي
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDrugPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDrugPicker(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-lg">اختيار دواء</h3>
                <button onClick={() => setShowDrugPicker(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <input type="text" placeholder="بحث عن دواء..." value={drugSearch} onChange={e => setDrugSearch(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredDrugs.map(d => (
                    <button key={d.id} onClick={() => setSelectedDrugId(d.id)} className={cn("w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between",
                      selectedDrugId === d.id ? "bg-primary/10 border-2 border-primary/20" : "hover:bg-gray-50 border-2 border-transparent"
                    )}>
                      <div><p className="font-bold text-sm">{d.name}</p><p className="text-xs text-gray-400 italic">{d.scientificName}</p></div>
                      <span className="text-xs font-bold text-gray-400">{d.stock} وحدة</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-3">
                    <label className="text-xs font-bold text-gray-500">الجرعة</label>
                    <input value={drugDose} onChange={e => setDrugDose(e.target.value)} placeholder="مثال: 500mg" className="w-full bg-gray-50 rounded-xl p-2.5 text-sm outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">التكرار</label>
                    <select value={drugFreq} onChange={e => setDrugFreq(e.target.value)} className="w-full bg-gray-50 rounded-xl p-2.5 text-sm outline-none">
                      {['مرة يومياً', 'مرتان يومياً', '3 مرات يومياً', 'عند الحاجة'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold text-gray-500">المدة</label>
                    <select value={drugDuration} onChange={e => setDrugDuration(e.target.value)} className="w-full bg-gray-50 rounded-xl p-2.5 text-sm outline-none">
                      {['3 أيام', '5 أيام', '7 أيام', '10 أيام', '14 يوم', 'شهر'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowDrugPicker(false)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={addDrug} className="bg-primary text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/25">إضافة للوصفة</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTestPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTestPicker(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-lg">طلب فحص</h3>
                <button onClick={() => setShowTestPicker(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-3">
                {TESTS_DB.map(test => (
                  <button key={test} onClick={() => setSelectedTest(test)} className={cn("w-full text-right px-4 py-3 rounded-2xl font-bold text-sm transition-all border-2",
                    selectedTest === test ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-transparent hover:bg-gray-50"
                  )}>{test}</button>
                ))}
              </div>
              <div className="p-6 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowTestPicker(false)} className="px-5 py-2.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">إلغاء</button>
                <button onClick={addLabOrder} className="bg-indigo-600 text-white px-7 py-2.5 rounded-2xl font-bold shadow-lg">إرسال طلب</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
