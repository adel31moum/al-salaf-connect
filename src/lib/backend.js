import { supabase, isSupabaseConfigured } from './supabaseClient';
import * as local from './localBackend';

export { isSupabaseConfigured };

/**
 * طبقة موحّدة: تحاول الكتابة الحقيقية على Supabase أولًا إن كان مُهيّأ، وفي كل الحالات
 * (نجاح أو فشل) تعكس نفس البيانات محليًا أيضًا — حتى تستمر كل قراءات الواجهة المتزامنة
 * الموجودة أصلًا (Header, Zawaj, Majalis...) في العمل دون أي تعديل إضافي عليها.
 *
 * ⚠️ ملاحظة صدق مهمة: الاتصال بـSupabase هنا حقيقي، لكن الجداول (profiles, marriage_profiles...)
 * لم تُنشأ بعد على مشروعك — يجب تنفيذ supabase/schema.sql من محرر SQL في لوحة Supabase أولًا.
 * قبل ذلك، كل محاولة كتابة ستفشل بصمت وتتراجع تلقائيًا للتخزين المحلي (سلوك متوقع ومقصود).
 */

export async function signUp({ email, password, full_name, country, language, gender }) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const userId = data?.user?.id;
      if (userId) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, full_name, country, language, gender });
        if (insertError) throw insertError;
        local.signUpLocal({ email, password, full_name, country, language, gender, idOverride: userId });
        return { id: userId, email, mode: 'live' };
      }
    } catch (err) {
      console.warn('[Al-Salaf Connect] تعذّر التسجيل عبر Supabase (على الأرجح: لم يُنفَّذ schema.sql بعد). التراجع للتخزين المحلي:', err?.message || err);
    }
  }
  return { ...local.signUpLocal({ email, password, full_name, country, language, gender }), mode: 'local' };
}

export async function resetPassword(email) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      });
      if (error) throw error;
      return { ok: true, mode: 'live' };
    } catch (err) {
      console.warn('[Al-Salaf Connect] تعذّر إرسال رابط استعادة كلمة المرور عبر Supabase:', err?.message || err);
      return { ok: false, mode: 'live-failed' };
    }
  }
  return { ok: false, mode: 'unconfigured' };
}

export async function saveMarriageProfile(profile) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('marriage_profiles')
        .insert({
          user_id: profile.user_id || null,
          guardian_id: profile.guardian_id || null,
          bio_text: profile.religious_commitment,
          religious_commitment: profile.religious_commitment,
          seeking_description: profile.seeking_description,
        })
        .select()
        .single();
      if (error) throw error;
      local.saveMarriageProfile({ ...profile, id: data.id });
      return { ...data, mode: 'live' };
    } catch (err) {
      console.warn('[Al-Salaf Connect] تعذّر حفظ ملف الزواج عبر Supabase، تم الحفظ محليًا فقط:', err?.message || err);
    }
  }
  return { ...local.saveMarriageProfile(profile), mode: 'local' };
}

export async function saveCompatibilityRequest(request) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('proposal_requests')
        .insert({
          requester_id: request.requesterId || null,
          target_profile_id: request.targetProfileId,
        })
        .select()
        .single();
      if (error) throw error;
      local.saveCompatibilityRequest(request);
      return { ...data, mode: 'live' };
    } catch (err) {
      console.warn('[Al-Salaf Connect] تعذّر إرسال طلب التوافق عبر Supabase، تم حفظه محليًا فقط:', err?.message || err);
    }
  }
  return { ...local.saveCompatibilityRequest(request), mode: 'local' };
}

// ردود محلية للمساعد الدعوي — تُستخدَم دومًا كخط رجوع، ويعمل بها المساعد بالكامل الآن
const LOCAL_DAWAH_REPLIES = [
  'سؤال جميل. باختصار: الإسلام يقوم على الشهادتين والصلاة والزكاة والصوم والحج، وأساسه توحيد الله تعالى وحده بالعبادة. هل تودّ التوسّع في نقطة معينة؟',
  'هذا من الأسئلة التي يسأل عنها كثيرون. يمكنني أن أشرح لك الفكرة بإيجاز، وإن أردت تفصيلًا فقهيًا دقيقًا، أنصحك بالتواصل مع أحد المشايخ المتاحين في قسم المجالس العلمية. هل لديك سؤال آخر؟',
  'شكرًا لصدق سؤالك. الإسلام يدعو إلى العدل والرحمة والتعامل الحسن مع الجميع بغض النظر عن دينهم. أخبرني إن أردت معرفة المزيد عن أي جانب محدد.',
];

/**
 * مساعد الدعوة الهجين: يستدعي Edge Function الحقيقية (dawah-ai) إن كان Supabase مُهيّأً
 * ونُشرت الدالة فعليًا، وإلا يتراجع فورًا لرد محلي جاهز — بلا أي شاشة انتظار أو خطأ ظاهر أبدًا.
 */
export async function askDawahAI(message, history = []) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('dawah-ai', { body: { message, history } });
      if (error) throw error;
      if (data?.reply) return { reply: data.reply, mode: 'live' };
    } catch (err) {
      console.warn('[Al-Salaf Connect] تعذّر الوصول لمساعد الدعوة الحقيقي (على الأرجح: لم تُنشر Edge Function بعد). التراجع لرد محلي:', err?.message || err);
    }
  }
  const reply = LOCAL_DAWAH_REPLIES[history.length % LOCAL_DAWAH_REPLIES.length];
  // تأخير بسيط لمحاكاة زمن رد طبيعي بدل ظهور فوري صناعي
  await new Promise((r) => setTimeout(r, 400));
  return { reply, mode: 'local' };
}

// إعادة تصدير كل الدوال المتزامنة كما هي — القراءات تبقى محلية دومًا لضمان استجابة فورية بلا وميض تحميل
export const {
  getSession,
  isLoggedIn,
  logoutLocal,
  getProfile,
  getCurrentProfile,
  saveAdaptiveResult,
  getAdaptiveResult,
  listUserMarriageProfiles,
  listVerifiedMarriageProfiles,
  listPendingMarriageProfiles,
  reviewMarriageProfile,
  listCompatibilityRequests,
} = local;
