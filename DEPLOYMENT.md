# دليل النشر والبناء المتعدد المنصات

تم إعداد هذا المشروع ليدعم البناء التلقائي والنشر عبر عدة منصات باستخدام GitHub Actions و Firebase و Supabase.

## 1. إعدادات قاعدة البيانات

### Firebase
- يتم استخدام Firebase للمصادقة (Auth) وقاعدة البيانات الفورية (Firestore) والاستضافة (Hosting).
- الملفات المتعلقة: `firestore.rules`, `firebase-blueprint.json`.

### Supabase
- تم إضافة دعم Supabase للعمليات المعقدة أو كبديل لقاعدة البيانات.
- المفاتيح المطلوبة في `.env`: `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 2. أوامر البناء (Scripts)

يمكنك تشغيل الأوامر التالية من خلال التيرمينال:

- **لبناء تطبيق الويب ونشره**:
  ```bash
  npm run deploy:web
  ```

- **لبناء تطبيق أندرويد**:
  ```bash
  npm run build:android
  ```
  (يتطلب وجود Android Studio مثبت محلياً عند المزامنة النهائية)

- **لبناء تطبيق ويندوز**:
  ```bash
  npm run build:windows
  ```

## 3. الأتمتة عبر GitHub Actions

يوجد ملف في `.github/workflows/automated-deployment.yml` يقوم بالتالي عند كل عملية `push` للفرع `main`:
1. فحص الكود (Linting).
2. بناء تطبيق الويب.
3. النشر التلقائي إلى Firebase Hosting.
4. (اختياري) تشغيل هجرات قاعدة بيانات Supabase.

## 4. المتطلبات اليدوية في GitHub Secrets

لتعمل الأتمتة بشكل كامل، يجب إضافة الأسرار (Secrets) التالية في مستودع GitHub الخاص بك:
- `FIREBASE_SERVICE_ACCOUNT`: مفتاح الخدمة من Firebase.
- `SUPABASE_URL`: رابط مشروع Supabase.
- `SUPABASE_ANON_KEY`: مفتاح الـ API لـ Supabase.
- `GEMINI_API_KEY`: مفتاح Gemini للذكاء الاصطناعي.

---
تم إعداد هذا النظام ليوفر لك بيئة عمل متكاملة تبدأ من الكود وتنتهي بتطبيق حي على الويب وهواتف الأندرويد.
