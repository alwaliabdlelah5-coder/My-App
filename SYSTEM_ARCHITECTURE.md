# النظام الطبي المتكامل (IMP) - وثائق العمارة

## نظرة عامة

النظام الطبي المتكامل (Integrated Medical Platform - IMP) هو حل متكامل مبني على Next.js لإدارة العيادات والمستشفيات بكفاءة عالية.

## الميزات الرئيسية

### 1. طبقة التهيئة المركزية
- **ملف تكوين JSON موحد** (`system-config.json`) يتحكم في كل شيء
- **إدارة ديناميكية للإعدادات** دون الحاجة لتعديل الكود
- **دعم ملفات تعريفية متعددة** (محلية، سحابية، هجينة)

### 2. قاعدة البيانات المرنة
- **PostgreSQL للبيانات الرئيسية**
- **Supabase للسحابة**
- **دعم الأنماط الهجينة** (محلي + سحابي)
- **مزامنة تلقائية** عند الحاجة

### 3. نظام المصادقة والصلاحيات
- **JWT للمصادقة**
- **RBAC (Role-Based Access Control)**
- **دعم MFA (Multi-Factor Authentication)**
- **سجل تدقيق شامل** لكل التغييرات

### 4. الوحدات الوظيفية الكاملة
- **إدارة المواعيد** (يومي/أسبوعي/شهري)
- **قائمة الانتظار الذكية** مع أولويات
- **السجل الطبي الإلكتروني**
- **المختبر والأشعة**
- **الصيدلية** (خاص باليمن)
- **شؤون الموظفين**
- **الحسابات والمالية**
- **التقارير والتحليلات**

---

## هيكل المشروع

```
lib/
├── config/
│   └── system-config.json          # ملف التكوين الرئيسي
├── services/
│   ├── index.ts                    # تصدير الخدمات
│   ├── configuration.service.ts    # إدارة الإعدادات
│   ├── database.manager.ts         # إدارة قاعدة البيانات
│   ├── auth.service.ts             # المصادقة والصلاحيات
│   ├── appointments.service.ts     # إدارة المواعيد
│   ├── patients.service.ts         # إدارة المرضى
│   └── ...                         # خدمات أخرى
├── supabase-client.ts              # عميل Supabase
└── ...

app/
├── page.tsx                        # الصفحة الرئيسية
├── dashboard/                      # لوحة التحكم
├── appointments/                   # إدارة المواعيد
├── patients/                       # إدارة المرضى
├── clinic/                         # العيادات
├── lab/                            # المختبر
├── pharmacy/                       # الصيدلية
├── queue/                          # قائمة الانتظار
└── ...

database/
└── schema.sql                      # نصوص إنشاء قاعدة البيانات
```

---

## الخدمات الأساسية

### 1. ConfigurationService
إدارة مركزية لجميع إعدادات النظام.

```typescript
import { configService } from '@/lib/services';

// قراءة إعداد
const taxPercent = configService.getValue('appointments.cost_calculation.tax_percent', 15);

// كتابة إعداد
await configService.setValue('appointments.cost_calculation.tax_percent', 20, 'appointments');

// الاستماع للتغييرات
configService.subscribe('appointments.cost_calculation', (value) => {
  console.log('تغير الإعداد:', value);
});
```

### 2. DatabaseManager
إدارة مرنة لقاعدة البيانات تدعم أنماطاً متعددة.

```typescript
import { databaseManager } from '@/lib/services';

// جلب بيانات
const result = await databaseManager.query({
  table: 'patients',
  operation: 'select',
  filters: { is_active: true },
  limit: 10
});

// إدراج
await databaseManager.query({
  table: 'patients',
  operation: 'insert',
  data: { full_name: 'أحمد', phone: '770123456' }
});

// تحديث
await databaseManager.query({
  table: 'patients',
  operation: 'update',
  data: { full_name: 'أحمد محمد' },
  filters: { id: 1 }
});
```

### 3. AuthenticationService
إدارة المستخدمين والصلاحيات.

```typescript
import { authService } from '@/lib/services';

// تسجيل الدخول
const tokens = await authService.login({
  username: 'doctor1',
  password: 'password123'
});

// التحقق من الصلاحيات
if (authService.hasPermission('medical_records.write')) {
  // تنفيذ العملية
}

// التحقق من الدور
if (authService.hasRole('Doctor')) {
  // تنفيذ العملية
}
```

### 4. AppointmentsService
إدارة المواعيد والقائمة الذكية.

```typescript
import { appointmentsService } from '@/lib/services';

// إنشاء موعد
const appointment = await appointmentsService.createAppointment({
  patient_id: 1,
  doctor_id: 2,
  service_id: 1,
  appointment_date: '2026-05-10T10:00:00'
});

// الحصول على مواعيد اليوم
const todayAppointments = await appointmentsService.getTodayAppointments();

// المواعيد القادمة
const upcomingAppointments = await appointmentsService.getUpcomingAppointments(60);
```

### 5. PatientsService
إدارة بيانات المرضى والبحث السريع.

```typescript
import { patientsService } from '@/lib/services';

// البحث السريع
const results = await patientsService.quickSearch('أحمد');

// إنشاء مريض
const patient = await patientsService.createPatient({
  full_name: 'أحمد محمد',
  phone: '770123456',
  email: 'ahmad@email.com'
});

// جلب إحصائيات المريض
const stats = await patientsService.getPatientStats(1);
```

---

## ملف التكوين (system-config.json)

يحتوي على جميع الإعدادات المتعلقة بـ:

### 1. قاعدة البيانات
```json
{
  "database_config_filter": {
    "active_profile": "hybrid_local_primary",
    "profiles": [...]
  }
}
```

### 2. المواعيد
```json
{
  "appointments": {
    "view_modes": ["day", "week", "month"],
    "time_slot_duration_minutes": 15,
    "cost_calculation": {
      "tax_percent": 15
    }
  }
}
```

### 3. الصلاحيات
```json
{
  "permissions": {
    "rbac_enabled": true,
    "jwt_config": {
      "expiration_hours": 1
    }
  }
}
```

---

## قاعدة البيانات

### الجداول الرئيسية

#### المستخدمون والصلاحيات
- `users` - بيانات المستخدمين
- `roles` - الأدوار المختلفة
- `permissions` - الصلاحيات
- `user_roles` - ربط المستخدمين بالأدوار
- `role_permissions` - ربط الأدوار بالصلاحيات

#### المرضى والمواعيد
- `patients` - بيانات المرضى
- `appointments` - المواعيد
- `queue_entries` - قائمة الانتظار

#### الأطباء والخدمات
- `doctors` - بيانات الأطباء
- `services` - الخدمات الطبية
- `doctor_services` - ربط الأطباء بالخدمات

#### السجل الطبي
- `medical_records` - السجلات الطبية
- `prescriptions` - الوصفات الطبية

#### المختبر
- `lab_tests` - الفحوصات المتوفرة
- `lab_test_parameters` - بارامترات الفحوصات
- `lab_orders` - طلبات الفحوصات
- `lab_results` - نتائج الفحوصات

#### الصيدلية
- `drugs` - الأدوية
- `drug_prices` - أسعار الأدوية
- `drug_inventory` - مخزون الأدوية

#### المالية
- `invoices` - الفواتير
- `payments` - المدفوعات

---

## سير العمل

### 1. إنشاء موعد جديد

```
1. البحث عن المريض (quickSearch)
   ↓
2. اختيار الطبيب والخدمة
   ↓
3. اختيار التاريخ والوقت
   ↓
4. حساب التكلفة (من configService)
   ↓
5. إنشاء الموعد (appointmentsService.createAppointment)
   ↓
6. إضافة إلى قائمة الانتظار
   ↓
7. إرسال تنبيهات (SMS/WhatsApp)
```

### 2. تسجيل دخول المستخدم

```
1. إدخال اسم المستخدم وكلمة المرور
   ↓
2. التحقق من بيانات المستخدم (authService.login)
   ↓
3. جلب الأدوار والصلاحيات
   ↓
4. توليد JWT tokens
   ↓
5. حفظ المستخدم الحالي
```

---

## المتطلبات الدنيا

- Node.js 18+
- Next.js 15+
- Supabase (اختياري)
- PostgreSQL 12+ أو SQLite 3+

---

## خطوات الإعداد

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إنشاء قاعدة البيانات
```bash
# للسحابة (Supabase)
psql -h YOUR_SUPABASE_HOST -U postgres -d postgres < database/schema.sql

# للمحلي
sqlite3 medical.db < database/schema.sql
```

### 3. تعيين متغيرات البيئة
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
```

### 4. تشغيل التطبيق
```bash
npm run dev
```

---

## الإحصائيات والأداء

- **استعلامات سريعة**: استخدام الفهارس على المفاتيح الأساسية
- **تخزين مؤقت**: LocalCache في DatabaseManager
- **مزامنة**: WebSocket للتحديثات الفورية
- **قابلية التوسع**: دعم الملايين من السجلات

---

## الأمان

- **JWT Tokens**: انتهاء الصلاحية التلقائي
- **RBAC**: التحكم الدقيق في الصلاحيات
- **تشفير**: تشفير كلمات المرور بـ bcrypt
- **سجل التدقيق**: تتبع جميع التغييرات

---

## الدعم والتطوير

للإبلاغ عن مشاكل أو اقتراح ميزات جديدة، يرجى فتح issue في المستودع.

---

**آخر تحديث**: مايو 2026
**الإصدار**: 1.0.0
