# دليل إعداد Supabase

## الخطوات الأساسية

### 1. إنشاء مشروع Supabase
1. اذهب إلى https://supabase.com
2. سجّل الدخول أو أنشئ حساب جديد
3. اضغط على "New Project"
4. اختر المنطقة الجغرافية
5. انتظر إنشاء المشروع

### 2. الحصول على المفاتيح
في لوحة تحكم Supabase:
1. اذهب إلى "Settings" > "API"
2. انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. إعداد قاعدة البيانات

#### الطريقة الأولى: عبر SQL Editor
1. اذهب إلى "SQL Editor"
2. اضغط على "New Query"
3. انسخ محتوى `supabase/migrations/V1__initial_schema.sql`
4. اضغط "Run"
5. ثم انسخ محتوى `supabase/supabase-setup.sql`
6. اضغط "Run"

#### الطريقة الثانية: عبر Supabase CLI
```bash
# تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref <your-project-ref>

# تطبيق الترحيلات
supabase migration up
```

### 4. إعداد المصادقة

#### تفعيل Google OAuth
1. اذهب إلى "Authentication" > "Providers"
2. اختر "Google"
3. أضف Google OAuth Credentials:
   - Client ID
   - Client Secret
4. اضغط "Save"

#### تفعيل البريد الإلكتروني
1. اذهب إلى "Authentication" > "Email"
2. فعّل "Email/Password"
3. اختر "Confirm email"

### 5. إعداد Row Level Security (RLS)

تم تفعيل RLS تلقائياً في ملف الترحيل. تأكد من:
1. اذهب إلى "Authentication" > "Policies"
2. تحقق من وجود السياسات المطلوبة
3. عدّل السياسات حسب احتياجاتك

## الجداول الرئيسية

### profiles
```sql
- id: UUID (Primary Key)
- full_name: TEXT
- avatar_url: TEXT
- role: TEXT (admin, doctor, nurse, staff)
- updated_at: TIMESTAMP
```

### patients
```sql
- id: UUID (Primary Key)
- first_name: TEXT
- last_name: TEXT
- date_of_birth: DATE
- gender: TEXT
- blood_group: TEXT
- phone: TEXT
- email: TEXT
- address: TEXT
- created_at: TIMESTAMP
- created_by: UUID (Foreign Key)
```

### appointments
```sql
- id: UUID (Primary Key)
- patient_id: UUID (Foreign Key)
- doctor_id: UUID (Foreign Key)
- appointment_date: TIMESTAMP
- status: TEXT
- reason_for_visit: TEXT
- notes: TEXT
- created_at: TIMESTAMP
```

### medical_records
```sql
- id: UUID (Primary Key)
- patient_id: UUID (Foreign Key)
- doctor_id: UUID (Foreign Key)
- visit_date: TIMESTAMP
- diagnosis: TEXT
- prescription: TEXT
- treatment_plan: TEXT
- attachments: JSONB
- created_at: TIMESTAMP
```

## الدوال والـ Triggers

### handle_updated_at()
تحديث `updated_at` تلقائياً عند تعديل السجل

### handle_new_user()
إنشاء ملف شخصي تلقائياً عند تسجيل مستخدم جديد

## استكشاف الأخطاء

### خطأ: "Connection refused"
- تأكد من أن `NEXT_PUBLIC_SUPABASE_URL` صحيح
- تحقق من اتصالك بالإنترنت

### خطأ: "Invalid API key"
- تأكد من أن `NEXT_PUBLIC_SUPABASE_ANON_KEY` صحيح
- تحقق من أنك تستخدم المفتاح الصحيح (anon, ليس service_role)

### خطأ: "Permission denied"
- تحقق من سياسات RLS
- تأكد من أن المستخدم مصرح له بالوصول

### خطأ: "Table does not exist"
- تأكد من تشغيل الترحيلات
- تحقق من أن الجداول تم إنشاؤها بنجاح

## النسخ الاحتياطية

### إنشاء نسخة احتياطية يدوية
1. اذهب إلى "Database" > "Backups"
2. اضغط "Create backup now"

### استعادة من نسخة احتياطية
1. اذهب إلى "Database" > "Backups"
2. اختر النسخة المطلوبة
3. اضغط "Restore"

## المراقبة والأداء

### عرض الاستخدام
1. اذهب إلى "Usage" في لوحة التحكم
2. راقب:
   - Database Size
   - Auth Users
   - API Requests
   - Storage Usage

### تحسين الأداء
- أضف Indexes للأعمدة المستخدمة كثيراً
- استخدم Materialized Views للاستعلامات المعقدة
- فعّل Connection Pooling

## الموارد الإضافية
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
