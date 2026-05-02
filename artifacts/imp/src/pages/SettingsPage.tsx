import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Settings, Database, Shield, Bell, Globe, Zap, Save, RefreshCw, CheckCircle, AlertCircle, Toggle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const configCategories = [
  { id: 'global', name: 'الإعدادات العامة', icon: Globe, desc: 'اسم المنشأة، اللغة، التوقيت، العملة' },
  { id: 'database', name: 'قاعدة البيانات', icon: Database, desc: 'إعدادات الاتصال والنسخ الاحتياطي' },
  { id: 'security', name: 'الأمان والصلاحيات', icon: Shield, desc: 'كلمات المرور، 2FA، سياسة الجلسات' },
  { id: 'notifications', name: 'الإشعارات والتنبيهات', icon: Bell, desc: 'إعدادات SMS وإشعارات المواعيد' },
  { id: 'automation', name: 'الأتمتة والتكامل', icon: Zap, desc: 'WebSocket، الأتمتة، API المشفرة' },
];

interface ToggleSettingProps { label: string; desc: string; value: boolean; onChange: (v: boolean) => void; }
function ToggleSetting({ label, desc, value, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
      <div>
        <p className="font-black text-gray-900 text-sm tracking-tight">{label}</p>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5 max-w-xs">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className={cn("relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner focus:outline-none",
          value ? "bg-primary shadow-md shadow-primary/25" : "bg-gray-200"
        )}
      >
        <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300",
          value ? "translate-x-6" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}

interface FormCardProps { title: string; children: React.ReactNode; }
function FormCard({ title, children }: FormCardProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic px-1">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface TextFieldProps { label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string; }
function TextField({ label, value, onChange, type = 'text', hint }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all" />
      {hint && <p className="text-[10px] text-gray-400 font-medium italic px-1">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('global');
  const [saved, setSaved] = useState(false);

  const [globalSettings, setGlobalSettings] = useState({
    hospitalName: 'مركز الرشيد الطبي', hospitalNameEn: 'Al-Rashid Medical Center',
    city: 'صنعاء', country: 'اليمن', currency: 'YER', timezone: 'Asia/Aden',
    language: 'ar', allowMultipleLanguages: true,
  });

  const [dbSettings, setDbSettings] = useState({
    firestoreDb: 'ai-studio-e84e21e0-4c5c-4c04-a418-f27c5532af28',
    backupEnabled: true, backupInterval: '24h', backupRetentionDays: '30',
    cacheEnabled: true, cacheExpiry: '60',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false, sessionTimeout: '60', minPasswordLength: '8',
    forcePasswordChange: true, loginAttempts: '5', ipWhitelist: '',
  });

  const [notifSettings, setNotifSettings] = useState({
    smsEnabled: true, emailNotif: true, appointmentReminder: true,
    reminderHours: '24', lowStockAlert: true, dailyReportEmail: false,
  });

  const [autoSettings, setAutoSettings] = useState({
    wsEnabled: true, dynamicConfig: true, autoQueueUpdate: true,
    apiRateLimit: '100', webhookUrl: '', maintenanceMode: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderContent = () => {
    switch (activeCategory) {
      case 'global':
        return (
          <div className="space-y-8">
            <FormCard title="معلومات المنشأة">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="اسم المنشأة (عربي)" value={globalSettings.hospitalName} onChange={v => setGlobalSettings(p => ({ ...p, hospitalName: v }))} />
                <TextField label="اسم المنشأة (إنجليزي)" value={globalSettings.hospitalNameEn} onChange={v => setGlobalSettings(p => ({ ...p, hospitalNameEn: v }))} />
                <TextField label="المدينة" value={globalSettings.city} onChange={v => setGlobalSettings(p => ({ ...p, city: v }))} />
                <TextField label="الدولة" value={globalSettings.country} onChange={v => setGlobalSettings(p => ({ ...p, country: v }))} />
              </div>
            </FormCard>
            <FormCard title="الإقليمية والتوطين">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700">العملة</label>
                  <select value={globalSettings.currency} onChange={e => setGlobalSettings(p => ({ ...p, currency: e.target.value }))} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                    <option value="YER">YER - ريال يمني</option><option value="USD">USD - دولار</option><option value="SAR">SAR - ريال سعودي</option>
                  </select>
                </div>
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700">المنطقة الزمنية</label>
                  <select value={globalSettings.timezone} onChange={e => setGlobalSettings(p => ({ ...p, timezone: e.target.value }))} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                    <option value="Asia/Aden">Asia/Aden (GMT+3)</option><option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700">اللغة الافتراضية</label>
                  <select value={globalSettings.language} onChange={e => setGlobalSettings(p => ({ ...p, language: e.target.value }))} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                    <option value="ar">العربية</option><option value="en">English</option>
                  </select>
                </div>
              </div>
              <ToggleSetting label="دعم تعدد اللغات" desc="السماح بتغيير لغة الواجهة من قبل المستخدمين" value={globalSettings.allowMultipleLanguages} onChange={v => setGlobalSettings(p => ({ ...p, allowMultipleLanguages: v }))} />
            </FormCard>
          </div>
        );
      case 'database':
        return (
          <div className="space-y-8">
            <FormCard title="Firebase Firestore">
              <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div><p className="font-black text-blue-900 text-sm">متصل بـ Firebase</p><p className="text-[10px] text-blue-400 font-bold italic">gen-lang-client-0734811332</p></div>
              </div>
              <TextField label="معرف قاعدة Firestore" value={dbSettings.firestoreDb} onChange={v => setDbSettings(p => ({ ...p, firestoreDb: v }))} hint="يُضبط في ملف الإعدادات الأساسي" />
            </FormCard>
            <FormCard title="النسخ الاحتياطي">
              <ToggleSetting label="تفعيل النسخ الاحتياطي التلقائي" desc="نسخ احتياطي دوري لقاعدة البيانات" value={dbSettings.backupEnabled} onChange={v => setDbSettings(p => ({ ...p, backupEnabled: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="فترة النسخ الاحتياطي" value={dbSettings.backupInterval} onChange={v => setDbSettings(p => ({ ...p, backupInterval: v }))} hint="مثال: 24h, 12h, 48h" />
                <TextField label="فترة الاحتفاظ (أيام)" value={dbSettings.backupRetentionDays} onChange={v => setDbSettings(p => ({ ...p, backupRetentionDays: v }))} type="number" />
              </div>
            </FormCard>
            <FormCard title="التخزين المؤقت (Cache)">
              <ToggleSetting label="تفعيل التخزين المؤقت" desc="تحسين أداء الاستعلامات" value={dbSettings.cacheEnabled} onChange={v => setDbSettings(p => ({ ...p, cacheEnabled: v }))} />
              <TextField label="مدة الصلاحية (ثانية)" value={dbSettings.cacheExpiry} onChange={v => setDbSettings(p => ({ ...p, cacheExpiry: v }))} type="number" />
            </FormCard>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8">
            <FormCard title="المصادقة الثنائية">
              <ToggleSetting label="تفعيل 2FA لجميع المستخدمين" desc="مصادقة ثنائية لكل تسجيل دخول" value={securitySettings.twoFactorEnabled} onChange={v => setSecuritySettings(p => ({ ...p, twoFactorEnabled: v }))} />
            </FormCard>
            <FormCard title="سياسة كلمة المرور">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="الحد الأدنى لطول كلمة المرور" value={securitySettings.minPasswordLength} onChange={v => setSecuritySettings(p => ({ ...p, minPasswordLength: v }))} type="number" />
                <TextField label="أقصى محاولات دخول فاشلة" value={securitySettings.loginAttempts} onChange={v => setSecuritySettings(p => ({ ...p, loginAttempts: v }))} type="number" />
                <TextField label="مهلة انتهاء الجلسة (دقيقة)" value={securitySettings.sessionTimeout} onChange={v => setSecuritySettings(p => ({ ...p, sessionTimeout: v }))} type="number" />
              </div>
              <ToggleSetting label="إلزام تغيير كلمة المرور الأولى" desc="يُطلب من المستخدمين الجدد تغيير كلمة المرور" value={securitySettings.forcePasswordChange} onChange={v => setSecuritySettings(p => ({ ...p, forcePasswordChange: v }))} />
            </FormCard>
            <FormCard title="قيود الوصول">
              <TextField label="قائمة IP المسموح بها (اختياري)" value={securitySettings.ipWhitelist} onChange={v => setSecuritySettings(p => ({ ...p, ipWhitelist: v }))} hint="أدخل عناوين IP مفصولة بفاصلة" />
            </FormCard>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8">
            <FormCard title="قنوات الإشعار">
              <ToggleSetting label="تفعيل إشعارات SMS" desc="إرسال تذكيرات عبر الرسائل النصية" value={notifSettings.smsEnabled} onChange={v => setNotifSettings(p => ({ ...p, smsEnabled: v }))} />
              <ToggleSetting label="إشعارات البريد الإلكتروني" desc="إرسال إشعارات عبر الإيميل" value={notifSettings.emailNotif} onChange={v => setNotifSettings(p => ({ ...p, emailNotif: v }))} />
            </FormCard>
            <FormCard title="تذكيرات المواعيد">
              <ToggleSetting label="تفعيل تذكير المواعيد" desc="إرسال تذكير للمرضى قبل موعدهم" value={notifSettings.appointmentReminder} onChange={v => setNotifSettings(p => ({ ...p, appointmentReminder: v }))} />
              <TextField label="مدة التذكير المسبق (ساعة)" value={notifSettings.reminderHours} onChange={v => setNotifSettings(p => ({ ...p, reminderHours: v }))} type="number" />
            </FormCard>
            <FormCard title="تنبيهات المخزون والتقارير">
              <ToggleSetting label="تنبيه المخزون المنخفض" desc="إشعار عند وصول الصنف للحد الأدنى" value={notifSettings.lowStockAlert} onChange={v => setNotifSettings(p => ({ ...p, lowStockAlert: v }))} />
              <ToggleSetting label="إرسال التقرير اليومي بالإيميل" desc="ملخص يومي يُرسل للإدارة صباحاً" value={notifSettings.dailyReportEmail} onChange={v => setNotifSettings(p => ({ ...p, dailyReportEmail: v }))} />
            </FormCard>
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-8">
            <FormCard title="الاتصال الفوري">
              <ToggleSetting label="تفعيل WebSocket للتحديثات الفورية" desc="تحديث قوائم الانتظار والبيانات بدون إعادة تحميل" value={autoSettings.wsEnabled} onChange={v => setAutoSettings(p => ({ ...p, wsEnabled: v }))} />
              <ToggleSetting label="التهيئة الديناميكية" desc="تطبيق تغييرات الإعدادات فوراً بدون إعادة تشغيل" value={autoSettings.dynamicConfig} onChange={v => setAutoSettings(p => ({ ...p, dynamicConfig: v }))} />
              <ToggleSetting label="تحديث قائمة الانتظار تلقائياً" desc="تحديث آلي كل 30 ثانية" value={autoSettings.autoQueueUpdate} onChange={v => setAutoSettings(p => ({ ...p, autoQueueUpdate: v }))} />
            </FormCard>
            <FormCard title="حدود API والتكامل">
              <TextField label="معدل طلبات API (per minute)" value={autoSettings.apiRateLimit} onChange={v => setAutoSettings(p => ({ ...p, apiRateLimit: v }))} type="number" />
              <TextField label="Webhook URL (اختياري)" value={autoSettings.webhookUrl} onChange={v => setAutoSettings(p => ({ ...p, webhookUrl: v }))} hint="للتكامل مع أنظمة خارجية" />
            </FormCard>
            <FormCard title="وضع الصيانة">
              <ToggleSetting label="تفعيل وضع الصيانة" desc="تعطيل وصول المستخدمين مؤقتاً ماعدا المسؤول" value={autoSettings.maintenanceMode} onChange={v => setAutoSettings(p => ({ ...p, maintenanceMode: v }))} />
              {autoSettings.maintenanceMode && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <p className="text-amber-800 font-bold text-sm">النظام في وضع الصيانة. لن يتمكن المستخدمون العاديون من الدخول.</p>
                </div>
              )}
            </FormCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sidebar>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Settings className="w-8 h-8 text-primary" />إعدادات النظام</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] text-primary/40">System Configuration Manager</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 text-sm hover:bg-gray-50 shadow-sm"><RefreshCw className="w-4 h-4" />إعادة تعيين</button>
            <button onClick={handleSave} className={cn("flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all",
              saved ? "bg-emerald-500 text-white shadow-emerald-500/25" : "bg-primary text-white shadow-primary/25 hover:scale-105"
            )}>
              {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? 'تم الحفظ!' : 'حفظ الإعدادات'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div className="bg-white rounded-3xl border shadow-sm p-4 space-y-2 sticky top-28">
            {configCategories.map((cat, i) => (
              <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={cn("w-full flex items-center gap-4 p-4 rounded-2xl text-right transition-all",
                  activeCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/25" : "hover:bg-gray-50 text-gray-600"
                )}
              >
                <div className={cn("p-2.5 rounded-xl transition-all", activeCategory === cat.id ? "bg-white/20" : "bg-gray-100 group-hover:bg-primary/10")}>
                  <cat.icon className={cn("w-5 h-5", activeCategory === cat.id ? "text-white" : "text-primary")} />
                </div>
                <div className="text-right">
                  <p className="font-black text-sm tracking-tight leading-none">{cat.name}</p>
                  <p className={cn("text-[10px] mt-1 font-medium italic truncate max-w-[160px]", activeCategory === cat.id ? "text-white/70" : "text-gray-400")}>{cat.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border shadow-sm p-8 min-h-[500px]"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </Sidebar>
  );
}
