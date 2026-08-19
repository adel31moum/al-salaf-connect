# ملتقى السلف — Al-Salaf Connect

تطبيق React + Vite + Tailwind متصل بـ Supabase، مع توجيه تسجيل ذكي، ومحرك سياسات شرعية،
ومساعد دعوة آلي متعدد اللغات.

## ⚠️ نقطة مهمة وصريحة
لا أستطيع أنا (Claude) رفع هذا الكود إلى حساب GitHub خاص بك تلقائيًا — لا أملك بيانات اعتماد حسابك،
ولن أطلبها منك في المحادثة لأسباب أمنية. لكن كل شيء أدناه **جاهز للتنفيذ خلال 10 دقائق فعليًا**
بنسخ ولصق الأوامر، دون أي تعديل إضافي مطلوب منك على الكود.

## 1) التشغيل محليًا
```bash
npm install
cp .env.example .env
# افتح .env وضع فيه مفاتيح مشروع Supabase الخاص بك
npm run dev
```

## 2) إعداد قاعدة البيانات
1. أنشئ مشروعًا مجانيًا على https://supabase.com
2. من لوحة SQL Editor، الصق محتوى الملف `supabase/schema.sql` ونفّذه.
3. انسخ `Project URL` و `anon public key` إلى ملف `.env`.

## 3) نشر مساعد الدعوة الذكي (Edge Function)
```bash
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
npx supabase functions deploy dawah-ai
```

## 4) رفع المشروع إلى GitHub (نفّذها أنت من جهازك)
```bash
git init
git add .
git commit -m "Al-Salaf Connect v1"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/al-salaf-connect.git
git push -u origin main
```

## 5) تفعيل النشر التلقائي (GitHub Pages)
1. في مستودعك على GitHub: Settings → Pages → Source = "GitHub Actions".
2. في Settings → Secrets and variables → Actions، أضف:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. أي `git push` جديد إلى `main` سيُبني وينشر الموقع تلقائيًا عبر
   `.github/workflows/deploy.yml` المرفق — هذا هو "الربط بجيتهاب" الذي طلبته:
   بعد الإعداد الأولي هذا، لن تحتاج للعودة لأي أحد؛ كل تحديث كود يُنشر نفسه تلقائيًا.

## بنية المشروع
```
src/
  policies/shariaPolicyEngine.js   ← "المدير الآلي": ينفّذ قواعد صريحة أقرّتها الهيئة الشرعية
  data/versesHadith.js             ← آيات/أحاديث سياقية لكل صفحة
  components/OnboardingWizard.jsx  ← التسجيل التوجيهي الذكي
  components/VerseBanner.jsx       ← عرض الآية/الحديث في كل نافذة
  pages/                           ← الصفحات الرئيسية
supabase/
  schema.sql                       ← قاعدة البيانات + RLS
  functions/dawah-ai/index.ts      ← مساعد الدعوة (Edge Function)
```
