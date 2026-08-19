import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { routeNewMember, canActivateMarriageProfile } from '../policies/shariaPolicyEngine';
import VerseBanner from './VerseBanner';

const STEPS = ['identity', 'origin', 'knowledge', 'interests', 'confirm'];

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'no', label: 'Norsk' },
];

const KNOWLEDGE_LEVELS = [
  { code: 'beginner', label: 'جديد على طلب العلم' },
  { code: 'student', label: 'طالب علم منتظم' },
  { code: 'scholar_track', label: 'داعية / معلّم' },
];

const INTERESTS = [
  { code: 'marriage', label: 'الزواج الشرعي' },
  { code: 'local_community', label: 'مجتمع محلي في بلدي' },
  { code: 'charity', label: 'صندوق التكافل' },
  { code: 'dawah', label: 'الدعوة لغير المسلمين' },
];

export default function OnboardingWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({
    full_name: '',
    gender: '',
    country: '',
    language: 'ar',
    knowledgeLevel: 'beginner',
    interests: [],
  });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const step = STEPS[stepIndex];

  const toggleInterest = (code) => {
    setData((d) => ({
      ...d,
      interests: d.interests.includes(code) ? d.interests.filter((i) => i !== code) : [...d.interests, code],
    }));
  };

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // 1) التوجيه الذكي وفق القواعد الصريحة (لا يوجد اجتهاد آلي في العقيدة) — يعمل دومًا حتى بلا خادم
      const route = routeNewMember(data);
      setResult(route);

      // 2) إن كان Supabase غير مُهيّأ بعد (لا مفاتيح بيئة)، لا نحاول الاتصال بالخادم إطلاقًا —
      // نكتفي بعرض نتيجة التوجيه فورًا حتى تبقى الواجهة كاملة وواضحة دون أي شاشة بيضاء أو تعليق.
      if (!isSupabaseConfigured) {
        route.marriageNotice = [
          'ملاحظة: التسجيل الفعلي غير مُفعَّل بعد على هذه النسخة (بانتظار ربط مفاتيح Supabase من المشرف).',
        ];
        setSubmitting(false);
        return;
      }

      // 3) إنشاء الحساب في Supabase (يعمل فقط بعد إضافة مفاتيح بيئة حقيقية)
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (authError) throw authError;

        const userId = authData?.user?.id;
        if (userId) {
          const { error: insertError } = await supabase.from('profiles').insert({
            id: userId,
            full_name: data.full_name,
            country: data.country,
            language: data.language,
            gender: data.gender,
          });
          if (insertError) console.error('[Al-Salaf Connect] تعذّر حفظ الملف الشخصي:', insertError);
        }
      } catch (dbErr) {
        // لا نُسقط تجربة المستخدم بسبب فشل اتصال بالخادم — نعرض تحذيرًا ونكمل عرض النتيجة محليًا.
        console.error('[Al-Salaf Connect] تعذّر إتمام التسجيل عبر Supabase:', dbErr);
        setError('تعذّر الاتصال بالخادم حاليًا. تم حفظ توجيهك محليًا، حاول التسجيل الفعلي لاحقًا.');
      }

      // 4) إن كان مهتمًا بالزواج، نتحقق فورًا من شرط الولي قبل عرض الوحدة
      if (data.interests.includes('marriage')) {
        const check = canActivateMarriageProfile({ guardian_id: null, bio_text: '' });
        if (!check.allowed) {
          route.marriageNotice = check.errors;
        }
      }

      navigate(`/${route.landingPage.replace(/_.*/, '')}`, { state: { route } });
    } catch (err) {
      // شبكة أمان أخيرة تضمن ظهور رسالة مفهومة دومًا بدل شاشة بيضاء أو تجمّد الواجهة.
      console.error('[Al-Salaf Connect] خطأ غير متوقع في التسجيل:', err);
      setError(err?.message || 'حدث خطأ غير متوقع. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <VerseBanner contextKey="onboarding_start" />

      {!isSupabaseConfigured && (
        <div className="mt-6 text-sm bg-maroon/10 border border-maroon/30 text-maroon rounded p-4 text-center">
          وضع المعاينة: التسجيل الفعلي غير مُفعَّل بعد على هذه النسخة (بانتظار ربط مفاتيح Supabase من المشرف). يمكنك تجربة خطوات التوجيه الذكي بأمان.
        </div>
      )}

      <div className="mt-10 bg-white/50 border border-gold/30 rounded p-8">
        <div className="font-mono text-xs text-maroon mb-6">
          خطوة {stepIndex + 1} من {STEPS.length}
        </div>

        {step === 'identity' && (
          <div className="space-y-4">
            <h3 className="font-display text-xl text-emeraldDeep">من أنت؟</h3>
            <input
              className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent"
              placeholder="الاسم الكامل"
              value={data.full_name}
              onChange={(e) => setData({ ...data, full_name: e.target.value })}
            />
            <div className="flex gap-3">
              {['male', 'female'].map((g) => (
                <button
                  key={g}
                  onClick={() => setData({ ...data, gender: g })}
                  className={`flex-1 py-3 rounded border ${
                    data.gender === g ? 'bg-gold border-gold text-emeraldDeep' : 'border-gold/40'
                  }`}
                >
                  {g === 'male' ? 'أخ' : 'أخت'}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'origin' && (
          <div className="space-y-4">
            <h3 className="font-display text-xl text-emeraldDeep">بلدك ولغتك</h3>
            <input
              className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent"
              placeholder="البلد / المدينة"
              value={data.country}
              onChange={(e) => setData({ ...data, country: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setData({ ...data, language: l.code })}
                  className={`py-3 rounded border ${
                    data.language === l.code ? 'bg-gold border-gold text-emeraldDeep' : 'border-gold/40'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'knowledge' && (
          <div className="space-y-4">
            <h3 className="font-display text-xl text-emeraldDeep">مستواك العلمي</h3>
            {KNOWLEDGE_LEVELS.map((k) => (
              <button
                key={k.code}
                onClick={() => setData({ ...data, knowledgeLevel: k.code })}
                className={`w-full text-right py-3 px-4 rounded border ${
                  data.knowledgeLevel === k.code ? 'bg-gold border-gold text-emeraldDeep' : 'border-gold/40'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        )}

        {step === 'interests' && (
          <div className="space-y-4">
            <h3 className="font-display text-xl text-emeraldDeep">ما الذي يهمك أكثر؟ (اختر ما شئت)</h3>
            {INTERESTS.map((i) => (
              <button
                key={i.code}
                onClick={() => toggleInterest(i.code)}
                className={`w-full text-right py-3 px-4 rounded border ${
                  data.interests.includes(i.code) ? 'bg-gold border-gold text-emeraldDeep' : 'border-gold/40'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <h3 className="font-display text-xl text-emeraldDeep">تأكيد التسجيل</h3>
            <p className="text-sm text-ink/70 leading-relaxed">
              سنوجّهك تلقائيًا إلى المسارات الأنسب بحسب بياناتك أعلاه. يمكنك تعديل اهتماماتك لاحقًا من إعدادات الحساب.
            </p>
            <input
              type="email"
              className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent"
              placeholder="البريد الإلكتروني"
              value={data.email || ''}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <input
              type="password"
              className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent"
              placeholder="كلمة المرور"
              value={data.password || ''}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            {error && <p className="text-maroon text-sm">{error}</p>}
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <button onClick={back} disabled={stepIndex === 0} className="text-sm text-ink/50 disabled:opacity-0">
            رجوع
          </button>
          {step !== 'confirm' && step !== 'identity' && (
            <button onClick={next} className="text-xs text-ink/40 underline">
              تخطّي هذه الخطوة
            </button>
          )}
          {step !== 'confirm' ? (
            <button onClick={next} className="bg-gold text-emeraldDeep px-6 py-2 rounded font-medium">
              التالي
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="bg-gold text-emeraldDeep px-6 py-2 rounded font-medium disabled:opacity-60"
            >
              {submitting ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-6 text-sm text-emeraldDeep bg-gold/10 border border-gold/30 rounded p-4">
          تم توجيهك بحسب بياناتك إلى: <b>{result.suggestedTracks.join('، ') || 'الصفحة الرئيسية'}</b>
          {result.marriageNotice && (
            <p className="text-maroon mt-2">{result.marriageNotice.join(' ')}</p>
          )}
        </div>
      )}
    </div>
  );
}
