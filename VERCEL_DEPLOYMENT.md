# دليل النشر على Vercel

## الخطوات السريعة

### 1. إعداد حساب Vercel
- اذهب إلى https://vercel.com
- سجّل الدخول أو أنشئ حساب جديد
- ربط حسابك بـ GitHub

### 2. استيراد المشروع
```bash
# الطريقة الأولى: عبر واجهة Vercel
# 1. اضغط على "New Project"
# 2. اختر "Import Git Repository"
# 3. اختر المستودع: alwaliabdlelah5-coder/My-App
# 4. اضغط "Import"

# الطريقة الثانية: عبر CLI
npm i -g vercel
vercel
```

### 3. إضافة متغيرات البيئة
في لوحة تحكم Vercel:
1. اذهب إلى "Settings" > "Environment Variables"
2. أضف المتغيرات التالية:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<your_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_key>
GEMINI_API_KEY=<your_gemini_key>
```

### 4. إعدادات البناء
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`

### 5. النشر التلقائي
بعد الإعداد، سيتم النشر تلقائياً عند:
- Push إلى الفرع الرئيسي (main)
- إنشاء Pull Request جديد

## المراقبة والإدارة

### عرض السجلات
```bash
vercel logs
```

### إعادة النشر
```bash
vercel --prod
```

### حذف النشر
```bash
vercel remove <project-name>
```

## النطاقات المخصصة

1. في لوحة تحكم Vercel، اذهب إلى "Domains"
2. أضف نطاقك المخصص
3. حدّث سجلات DNS لديك

## استكشاف الأخطاء

### خطأ: Build Failed
- تحقق من السجلات في Vercel Dashboard
- تأكد من أن جميع متغيرات البيئة موجودة
- جرّب إعادة النشر

### خطأ: Environment Variables Not Found
- تأكد من أن المتغيرات مضافة في "Settings" > "Environment Variables"
- تأكد من أسماء المتغيرات صحيحة (حساسة لحالة الأحرف)

### خطأ: Firebase Authentication Failed
- تحقق من Firebase API Keys
- تأكد من أن النطاق مصرح به في Firebase Console

## الأداء والتحسينات

### تحسين الأداء
- استخدم Image Optimization من Vercel
- فعّل Caching للـ Static Assets
- استخدم Edge Functions للـ API Routes

### المراقبة
- استخدم Vercel Analytics
- راقب Web Vitals
- تحقق من استهلاك الـ Bandwidth

## الموارد الإضافية
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
