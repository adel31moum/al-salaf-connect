import { createClient } from '@supabase/supabase-js';

// عرّف هذين المتغيرين في ملف .env المحلي، وفي إعدادات البيئة على Vercel:
// VITE_SUPABASE_URL=https://xxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // لا نرمي استثناء يوقف التطبيق أثناء التطوير المحلي بدون مفاتيح؛
  // بدلاً من ذلك نطبع تحذيرًا واضحًا في الكونسول.
  console.warn(
    '[Al-Salaf Connect] متغيرات Supabase غير معرّفة بعد. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
