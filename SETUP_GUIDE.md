# دليل الإعداد والنشر التلقائي

## المتطلبات

- Node.js 22 أو أحدث
- npm أو yarn
- حساب GitHub
- حساب Vercel
- حساب Firebase
- حساب Supabase

## خطوات الإعداد المحلية

### 1. استنساخ المستودع
```bash
git clone https://github.com/alwaliabdlelah5-coder/My-App.git
cd My-App
```

### 2. تثبيت التبعيات
```bash
npm install --legacy-peer-deps
```

### 3. إعداد متغيرات البيئة
انسخ ملف `.env.example` إلى `.env.local` وأضف قيمك الخاصة:
```bash
cp .env.example .env.local
```

ثم عدّل `.env.local` بإضافة:
- Firebase API Keys
- Supabase URL و Anon Key
- Gemini API Key

### 4. تشغيل المشروع محلياً
```bash
npm run dev
```

التطبيق سيكون متاحاً على `http://localhost:3000`

## إعداد النشر التلقائي

### إعداد Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. قم بتسجيل الدخول أو إنشاء حساب
3. اضغط على "New Project"
4. اختر مستودع GitHub الخاص بك
5. أضف متغيرات البيئة المطلوبة
6. اضغط "Deploy"

### إعداد GitHub Actions

1. اذهب إلى مستودعك على GitHub
2. اضغط على "Settings" > "Secrets and variables" > "Actions"
3. أضف الـ Secrets التالية:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `VERCEL_TOKEN` (من Vercel)
   - `VERCEL_ORG_ID` (من Vercel)
   - `VERCEL_PROJECT_ID` (من Vercel)
   - `FIREBASE_SERVICE_ACCOUNT_JSON` (JSON من Firebase)
   - `FIREBASE_PROJECT_ID`

### إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. اذهب إلى "SQL Editor" وشغّل الـ SQL من `supabase/migrations/V1__initial_schema.sql`
5. ثم شغّل `supabase/supabase-setup.sql`

## الأوامر المتاحة

```bash
# تطوير محلي
npm run dev

# البناء للإنتاج
npm run build

# تشغيل الإنتاج محلياً
npm start

# فحص الكود
npm run lint

# تنظيف الملفات المؤقتة
npm run clean

# بناء تطبيق Android
npm run build:android

# بناء تطبيق Windows
npm run build:windows

# نشر على Firebase
npm run deploy:web
```

## هيكل المشروع

```
My-App/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── appointments/      # صفحة المواعيد
│   ├── auth/             # صفحة المصادقة
│   ├── clinic/           # صفحة العيادة
│   ├── finance/          # صفحة المالية
│   ├── hr/               # صفحة الموارد البشرية
│   ├── inventory/        # صفحة المخزون
│   ├── lab/              # صفحة المختبر
│   ├── patients/         # صفحة المرضى
│   ├── pharmacy/         # صفحة الصيدلية
│   ├── queue/            # صفحة الطابور
│   ├── reports/          # صفحة التقارير
│   ├── settings/         # صفحة الإعدادات
│   ├── users/            # صفحة المستخدمين
│   └── layout.tsx        # التخطيط الرئيسي
├── components/            # مكونات React
├── hooks/                 # React Hooks المخصصة
├── lib/                   # دوال مساعدة
├── supabase/             # إعدادات Supabase
├── .github/workflows/    # GitHub Actions
├── .env.example          # مثال متغيرات البيئة
├── next.config.ts        # إعدادات Next.js
├── vercel.json          # إعدادات Vercel
└── package.json         # التبعيات

```

## استكشاف الأخطاء

### خطأ: "Firebase Auth not initialized"
تأكد من أن جميع متغيرات Firebase موجودة في `.env.local`

### خطأ: "Supabase connection failed"
تأكد من أن `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` صحيحة

### خطأ: "Build failed on Vercel"
تحقق من GitHub Actions logs للتفاصيل

## المزيد من المعلومات

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
