import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Settings, Database, Shield, Bell, Globe, Zap, Save, RefreshCw, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/Toast';

const LS_KEY = 'clinic_settings_v2';

const DEFAULTS = {
  clinicName: 'المنظومة الطبية المتكامل',
  clinicAddress: 'صنعاء - شارع الستين، مجمع الرفاع',
  clinicPhone: '+967 1 234567',
  clinicEmail: 'info@clinic-imp.com',
  timezone: 'Asia/Aden',
  language: 'ar',
  dateFormat: 'dd/mm/yyyy',
  currency: 'YER',
  theme: 'light',
  fontSize: 'medium',
  appointmentDuration: '30',
  workingHoursStart: '08:00',
  workingHoursEnd: '17:00',
  workingDays: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'] as string[],
  twoFactorAuth: false,
  sessionTimeout: '60',
  loginAttempts: '5',
  passwordMinLength: '8',
  emailNotifications: true,
  appointmentReminder: true,
  labResultsNotification: true,
  stockAlertNotification: true,
  reminderHoursBefore: '24',
  autoBackup: true,
  backupFrequency: 'daily',
  backupRetention: '30',
};

type SettingsState = typeof DEFAULTS;

const sections = [
  { id: 'clinic', icon: Settings, label: 'بيانات المنشأة', desc: 'المعلومات الأساسية للعيادة' },
  { id: 'system', icon: Globe, label: 'إعدادات النظام', desc: 'اللغة، التاريخ، العملة' },
  { id: 'appointments', icon: Zap, label: 'إعدادات المواعيد', desc: 'مدة الكشف وأوقات العمل' },
  { id: 'security', icon: Shield, label: 'الأمان والحماية', desc: 'المصادقة وسياسات الوصول' },
  { id: 'notifications', icon: Bell, label: 'الإشعارات', desc: 'التنبيهات والتذكيرات' },
  { id: 'backup', icon: Database, label: 'النسخ الاحتياطي', desc: 'إعدادات الحفظ والاسترداد' },
];

const DAYS_AR: Record<string, string> = {
  saturday: 'السبت', sunday: 'الأحد', monday: 'الاثنين',
  tuesday: 'الثلاثاء', wednesday: 'الأربعاء', thursday: 'الخميس', friday: 'الجمعة',
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={cn("w-12 h-6 rounded-full transition-all relative flex-shrink-0", checked ? "bg-primary" : "bg-gray-200")}>
      <div className={cn("w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-all", checked ? "left-6" : "left-0.5")} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-5 border-b last:border-0">
      <div className="flex-1 ml-6">
        <p className="font-bold text-gray-900 text-sm">{label}</p>
        {desc && <p className="text-xs text-gray-400 font-medium mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);
  const [activeSection, setActiveSection] = useState('clinic');
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) { setSettings({ ...DEFAULTS, ...JSON.parse(stored) }); }
    } catch {}
  }, []);

  const update = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const toggleDay = (day: string) => {
    const days = settings.workingDays.includes(day)
      ? settings.workingDays.filter(d => d !== day)
      : [...settings.workingDays, day];
    update('workingDays', days);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
      setSaved(true); setHasChanges(false);
      setTimeout(() => setSaved(false), 3000);
      toast('تم حفظ الإعدادات بنجاح ✓');
    } catch {
      toast('فشل حفظ الإعدادات', 'error');
    }
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    localStorage.removeItem(LS_KEY);
    setHasChanges(false);
    toast('تمت إعادة تعيين جميع الإعدادات للقيم الافتراضية', 'info');
  };

  const inp = "w-full bg-gray-50 rounded-xl p-3 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20";
  const sel = "w-full bg-gray-50 rounded-xl p-3 text-sm font-medium border-none outline-none";

  return (
    <Sidebar>
      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Settings className="w-8 h-8 text-primary" />الإعدادات</h1>
            <p className="text-gray-500 mt-1 text-xs font-bold uppercase tracking-widest">System Configuration & Preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                تعديلات غير محفوظة
              </motion.span>
            )}
            <button onClick={handleReset} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <RefreshCw className="w-4 h-4" />إعادة تعيين
            </button>
            <button onClick={handleSave} className={cn("px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg",
              saved ? "bg-emerald-500 text-white shadow-emerald-500/25" : "bg-primary text-white shadow-primary/25 hover:bg-primary/95"
            )}>
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'تم الحفظ!' : 'حفظ الإعدادات'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <div className="space-y-2">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={cn("w-full text-right flex items-center gap-4 px-5 py-4 rounded-2xl transition-all",
                  activeSection === s.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white border text-gray-600 hover:border-primary/20 hover:text-primary shadow-sm"
                )}>
                <s.icon className="w-5 h-5 shrink-0" />
                <div className="text-right">
                  <p className="font-black text-sm">{s.label}</p>
                  <p className={cn("text-[10px] font-medium mt-0.5 line-clamp-1", activeSection === s.id ? "text-white/60" : "text-gray-400")}>{s.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-8 space-y-0">
            <AnimatePresence mode="wait">
              {activeSection === 'clinic' && (
                <motion.div key="clinic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tighter">بيانات المنشأة</h2>
                  <SettingRow label="اسم العيادة / المركز الصحي">
                    <input value={settings.clinicName} onChange={e => update('clinicName', e.target.value)} className={cn(inp, "w-72")} />
                  </SettingRow>
                  <SettingRow label="عنوان العيادة">
                    <input value={settings.clinicAddress} onChange={e => update('clinicAddress', e.target.value)} className={cn(inp, "w-72")} />
                  </SettingRow>
                  <SettingRow label="رقم الهاتف">
                    <input value={settings.clinicPhone} onChange={e => update('clinicPhone', e.target.value)} dir="ltr" className={cn(inp, "w-56")} />
                  </SettingRow>
                  <SettingRow label="البريد الإلكتروني">
                    <input value={settings.clinicEmail} onChange={e => update('clinicEmail', e.target.value)} dir="ltr" className={cn(inp, "w-72")} />
                  </SettingRow>
                </motion.div>
              )}
              {activeSection === 'system' && (
                <motion.div key="system" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tighter">إعدادات النظام</h2>
                  <SettingRow label="المنطقة الزمنية">
                    <select value={settings.timezone} onChange={e => update('timezone', e.target.value)} className={cn(sel, "w-52")}>
                      <option value="Asia/Aden">Asia/Aden (Yemen)</option>
                      <option value="Asia/Riyadh">Asia/Riyadh (KSA)</option>
                      <option value="Asia/Dubai">Asia/Dubai (UAE)</option>
                      <option value="Africa/Cairo">Africa/Cairo (Egypt)</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="اللغة الافتراضية">
                    <select value={settings.language} onChange={e => update('language', e.target.value)} className={cn(sel, "w-48")}>
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="صيغة التاريخ">
                    <select value={settings.dateFormat} onChange={e => update('dateFormat', e.target.value)} className={cn(sel, "w-48")}>
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="العملة">
                    <select value={settings.currency} onChange={e => update('currency', e.target.value)} className={cn(sel, "w-36")}>
                      <option value="YER">YER - ريال يمني</option>
                      <option value="SAR">SAR - ريال سعودي</option>
                      <option value="USD">USD - دولار</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="حجم الخط">
                    <select value={settings.fontSize} onChange={e => update('fontSize', e.target.value)} className={cn(sel, "w-40")}>
                      <option value="small">صغير</option>
                      <option value="medium">متوسط</option>
                      <option value="large">كبير</option>
                    </select>
                  </SettingRow>
                </motion.div>
              )}
              {activeSection === 'appointments' && (
                <motion.div key="appointments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tighter">إعدادات المواعيد</h2>
                  <SettingRow label="مدة الكشف الافتراضية" desc="بالدقائق">
                    <select value={settings.appointmentDuration} onChange={e => update('appointmentDuration', e.target.value)} className={cn(sel, "w-36")}>
                      {['15','20','30','45','60'].map(v => <option key={v} value={v}>{v} دقيقة</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="وقت بداية الدوام">
                    <input type="time" value={settings.workingHoursStart} onChange={e => update('workingHoursStart', e.target.value)} className={cn(inp, "w-36")} />
                  </SettingRow>
                  <SettingRow label="وقت نهاية الدوام">
                    <input type="time" value={settings.workingHoursEnd} onChange={e => update('workingHoursEnd', e.target.value)} className={cn(inp, "w-36")} />
                  </SettingRow>
                  <SettingRow label="أيام العمل">
                    <div className="flex gap-1.5 flex-wrap justify-end max-w-sm">
                      {Object.entries(DAYS_AR).map(([key, label]) => (
                        <button key={key} onClick={() => toggleDay(key)}
                          className={cn("px-3 py-1.5 rounded-xl text-xs font-black transition-all",
                            settings.workingDays.includes(key) ? "bg-primary text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          )}>{label}</button>
                      ))}
                    </div>
                  </SettingRow>
                </motion.div>
              )}
              {activeSection === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tighter">الأمان والحماية</h2>
                  <SettingRow label="المصادقة الثنائية" desc="حماية إضافية عند تسجيل الدخول">
                    <Toggle checked={settings.twoFactorAuth} onChange={() => update('twoFactorAuth', !settings.twoFactorAuth)} />
                  </SettingRow>
                  <SettingRow label="مهلة انتهاء الجلسة" desc="بالدقائق">
                    <select value={settings.sessionTimeout} onChange={e => update('sessionTimeout', e.target.value)} className={cn(sel, "w-36")}>
                      {['15','30','60','120','240'].map(v => <option key={v} value={v}>{v} دقيقة</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="محاولات الدخول الفاشلة" desc="قبل القفل المؤقت">
                    <select value={settings.loginAttempts} onChange={e => update('loginAttempts', e.target.value)} className={cn(sel, "w-36")}>
                      {['3','5','10'].map(v => <option key={v} value={v}>{v} محاولات</option>)}
                    </select>
                  </SettingRow>
                  <SettingRow label="الحد الأدنى لكلمة المرور" desc="عدد الأحرف">
                    <select value={settings.passwordMinLength} onChange={e => update('passwordMinLength', e.target.value)} className={cn(sel, "w-36")}>
                      {['6','8','10','12'].map(v => <option key={v} value={v}>{v} أحرف</option>)}
                    </select>
                  </SettingRow>
                </motion.div>
              )}
              {activeSection === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tighter">الإشعارات</h2>
                  <SettingRow label="إشعارات البريد الإلكتروني">
                    <Toggle checked={settings.emailNotifications} onChange={() => update('emailNotifications', !settings.emailNotifications)} />
                  </SettingRow>
                  <SettingRow label="تذكير المواعيد" desc="تنبيه للمريض قبل موعده">
                    <Toggle checked={settings.appointmentReminder} onChange={() => update('appointmentReminder', !settings.appointmentReminder)} />
                  </SettingRow>
                  {settings.appointmentReminder && (
                    <SettingRow label="مدة التذكير المسبق">
                      <select value={settings.reminderHoursBefore} onChange={e => update('reminderHoursBefore', e.target.value)} className={cn(sel, "w-40")}>
                        {['1','2','6','12','24','48'].map(v => <option key={v} value={v}>{v} ساعة</option>)}
                      </select>
                    </SettingRow>
                  )}
                  <SettingRow label="إشعار نتائج المختبر">
                    <Toggle checked={settings.labResultsNotification} onChange={() => update('labResultsNotification', !settings.labResultsNotification)} />
                  </SettingRow>
                  <SettingRow label="تنبيه نفاد المخزون">
                    <Toggle checked={settings.stockAlertNotification} onChange={() => update('stockAlertNotification', !settings.stockAlertNotification)} />
                  </SettingRow>
                </motion.div>
              )}
              {activeSection === 'backup' && (
                <motion.div key="backup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tighter">النسخ الاحتياطي</h2>
                  <SettingRow label="النسخ الاحتياطي التلقائي">
                    <Toggle checked={settings.autoBackup} onChange={() => update('autoBackup', !settings.autoBackup)} />
                  </SettingRow>
                  {settings.autoBackup && (
                    <>
                      <SettingRow label="تكرار النسخ الاحتياطي">
                        <select value={settings.backupFrequency} onChange={e => update('backupFrequency', e.target.value)} className={cn(sel, "w-44")}>
                          <option value="hourly">كل ساعة</option>
                          <option value="daily">يومياً</option>
                          <option value="weekly">أسبوعياً</option>
                        </select>
                      </SettingRow>
                      <SettingRow label="مدة الاحتفاظ" desc="بالأيام">
                        <select value={settings.backupRetention} onChange={e => update('backupRetention', e.target.value)} className={cn(sel, "w-36")}>
                          {['7','14','30','90','365'].map(v => <option key={v} value={v}>{v} يوم</option>)}
                        </select>
                      </SettingRow>
                    </>
                  )}
                  <SettingRow label="نسخة احتياطية يدوية الآن">
                    <button onClick={() => toast('تم إنشاء نسخة احتياطية بنجاح ✓')} className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all flex items-center gap-2">
                      <Database className="w-4 h-4" />نسخ الآن
                    </button>
                  </SettingRow>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
