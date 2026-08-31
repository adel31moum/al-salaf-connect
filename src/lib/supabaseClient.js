import { createClient } from '@supabase/supabase-js';

// مفاتيح المشروع الحقيقي — anon/publishable key مصمَّم أصلًا ليكون علنيًا في كود الواجهة
// (الحماية الفعلية للبيانات تأتي من قواعد RLS في قاعدة البيانات، لا من إخفاء هذا المفتاح).
// يمكن تجاوزها عبر متغيرات بيئة VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY في Netlify عند الحاجة لمشروع مختلف.
const REAL_URL = 'https://ayzqnhalgmxqixdxbyej.supabase.co';
const REAL_ANON_KEY = 'Sb_publishable_4PPLZTv8mwgBrzZk8p05mw_cw9nIVEb';

const PLACEHOLDER_URL = 'https://placeholder-project.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key-not-a-real-secret';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || REAL_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || REAL_ANON_KEY;

export const isSupabaseConfigured = Boolean(rawUrl && rawKey && rawUrl !== PLACEHOLDER_URL);

if (!isSupabaseConfigured) {
  console.warn('[Al-Salaf Connect] Supabase غير مُهيّأ — التطبيق يعمل في الوضع المحلي فقط.');
}

let supabaseClient;
try {
  supabaseClient = createClient(rawUrl || PLACEHOLDER_URL, rawKey || PLACEHOLDER_KEY);
} catch (err) {
  // شبكة أمان أخيرة: حتى لو فشل إنشاء العميل لأي سبب غير متوقع (مثل رابط تالف)، لا نُسقط التطبيق كله.
  console.error('[Al-Salaf Connect] فشل إنشاء عميل Supabase، التراجع للوضع المحلي:', err);
  supabaseClient = createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
}

export const supabase = supabaseClient;

