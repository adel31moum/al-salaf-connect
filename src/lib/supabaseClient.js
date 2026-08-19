import { createClient } from '@supabase/supabase-js';

// عرّف هذين المتغيرين في ملف .env المحلي، وفي إعدادات البيئة على Netlify:
// VITE_SUPABASE_URL=https://xxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
//
// ⚠️ سبب "الشاشة البيضاء" الذي تم إصلاحه هنا:
// createClient() من مكتبة Supabase يتحقق من صحة الرابط فورًا عبر new URL(...)
// وإن كان الرابط سلسلة فارغة (''), يرمي استثناءً يوقف تحميل كامل التطبيق
// قبل أن يصل React حتى إلى مرحلة الرسم — وهذا يُظهر شاشة بيضاء تمامًا بلا أي خطأ ظاهر للمستخدم.
// الحل: رابط ومفتاح placeholder صالحان شكليًا (URL حقيقي التركيب) حتى لا ينهار الاستدعاء،
// مع علم isSupabaseConfigured تستخدمه الواجهات لإظهار تنبيه واضح للمستخدم بدل الفشل الصامت.

const PLACEHOLDER_URL = 'https://placeholder-project.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key-not-a-real-secret';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(rawUrl && rawKey);

if (!isSupabaseConfigured) {
  // لا نرمي استثناء يوقف التطبيق؛ نطبع تحذيرًا واضحًا في الكونسول فقط.
  console.warn(
    '[Al-Salaf Connect] متغيرات Supabase غير معرّفة بعد. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY ' +
    'في إعدادات البيئة على Netlify (Site settings → Environment variables) ثم أعد النشر (Trigger deploy). ' +
    'التطبيق يعمل الآن بواجهات كاملة لكن بدون تسجيل أو مساعد دعوة فعليَّين حتى تُضاف المفاتيح.'
  );
}

let supabaseClient;
try {
  supabaseClient = createClient(rawUrl || PLACEHOLDER_URL, rawKey || PLACEHOLDER_KEY);
} catch (err) {
  // شبكة أمان أخيرة: حتى لو فشل إنشاء العميل لأي سبب غير متوقع، لا نُسقط التطبيق كله.
  console.error('[Al-Salaf Connect] فشل إنشاء عميل Supabase:', err);
  supabaseClient = createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
}

export const supabase = supabaseClient;

