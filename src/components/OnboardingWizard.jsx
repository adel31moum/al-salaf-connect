import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, saveAdaptiveResult, resetPassword, isSupabaseConfigured } from '../lib/backend';
import { routeNewMember, canActivateMarriageProfile } from '../policies/shariaPolicyEngine';
import { DIAGNOSTIC_QUESTIONS, scoreDiagnostic } from '../data/adaptiveQuiz';
import VerseBanner from './VerseBanner';

const STEPS = ['identity', 'origin', 'diagnostic', 'interests', 'confirm'];

// قائمة بيضاء بكل المسارات الفعلية الموجودة في التطبيق — أي وجهة توجيه غير مدرجة هنا
// تُعاد تلقائيًا للصفحة الرئيسية بدل عرض شاشة بيضاء. هذا يمنع نهائيًا تكرار خلل "التوجيه
// إلى صفحة غير موجودة" بغضّ النظر عن أي تعديل مستقبلي في shariaPolicyEngine.js أو adaptiveQuiz.js.
const VALID_LANDING_ROUTES = new Set([
  '', 'about', 'aqeedah', 'board', 'chastity-library', 'dawah',
  'join', 'majalis', 'new-muslims', 'privacy', 'support', 'zawaj',
]);

// خريطة تحويل صريحة لأي مسار "مفاهيمي" لا يطابق اسم صفحة حرفيًا
const CONCEPTUAL_ROUTE_ALIASES = {
  scholar_verification_form: 'about', // المتقدّمون عِلميًا يُوجَّهون لصفحة الانضمام للهيئة الشرعية
  advanced_seminars: 'majalis',
  aqeedah_basics_intensive: 'aqeedah',
  manhaj_intro: 'aqeedah',
  fiqh_seminars: 'majalis',
  dawah_faq: 'dawah',
  zawaj_intro: 'zawaj',
  takaful_fund: 'support',
};

function resolveSafeLandingPath(landingPage) {
  if (CONCEPTUAL_ROUTE_ALIASES[landingPage]) return `/${CONCEPTUAL_ROUTE_ALIASES[landingPage]}`;
  const cleaned = (landingPage || '').replace(/_.*/, '');
  return VALID_LANDING_ROUTES.has(cleaned) ? `/${cleaned}` : '/';
}

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'no', label: 'Norsk' },
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
    interests: [],
  });
  const [quizAnswers, setQuizAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const step = STEPS[stepIndex];

  const toggleInterest = (code) => {
    setData((d) => ({
      ...d,
      interests: d.interests.includes(code) ? d.interests.filter((i) => i !== code) : [...d.interests, code],
    }));
  };

  const answerQuiz = (questionId, optionId) => {
    setQuizAnswers((a) => ({ ...a, [questionId]: optionId }));
  };

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const submit = async () => {
    setSubmitting(true);

    // 1) تشخيص المسار العلمي التكيفي — نتيجة فعلية من الإجابات، لا تخمين ذاتي
    const diagnostic = scoreDiagnostic(quizAnswers);
    saveAdaptiveResult(diagnostic);

    // 2) التوجيه الذكي وفق القواعد الصريحة (لا يوجد اجتهاد آلي في العقيدة)
    const route = routeNewMember({ ...data, knowledgeLevel: diagnostic.level });
    route.suggestedTracks = [...new Set([...diagnostic.recommendedTracks, ...route.suggestedTracks])];
    route.diagnostic = diagnostic;
    setResult(route);

    // 3) التسجيل: يحاول الاتصال الحقيقي بـSupabase أولًا، ويتراجع للتخزين المحلي تلقائيًا
    // عند أي عائق (مثل عدم تنفيذ schema.sql بعد) — بلا أي رسالة خطأ للمستخدم في الحالتين.
    await signUp({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      country: data.country,
      language: data.language,
      gender: data.gender,
    });

    // 4) إن كان مهتمًا بالزواج، نتحقق فورًا من شرط الولي قبل عرض الوحدة
    if (data.interests.includes('marriage')) {
      const check = canActivateMarriageProfile({ guardian_id: null, bio_text: '' });
      if (!check.allowed) {
        route.marriageNotice = check.errors;
      }
    }

    setSubmitting(false);
    navigate(resolveSafeLandingPath(route.landingPage), { state: { route } });
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <VerseBanner contextKey="onboarding_start" />

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

        {step === 'diagnostic' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-xl text-emeraldDeep mb-1">المسار العلمي التكيفي</h3>
              <p className="text-xs text-ink/50">
                5 أسئلة قصيرة تحدد مستواك الفعلي بدقة، ليوجّهك النظام لمسار مناسب — لا يوجد إجابات "خطأ" تُحرجك، فقط تشخيص لطيف.
              </p>
            </div>
            {DIAGNOSTIC_QUESTIONS.map((q, qi) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-emeraldDeep mb-2">
                  {qi + 1}. {q.prompt}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => answerQuiz(q.id, opt.id)}
                      className={`text-right text-sm py-2 px-3 rounded border ${
                        quizAnswers[q.id] === opt.id ? 'bg-gold border-gold text-emeraldDeep' : 'border-gold/30'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
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
              سنوجّهك تلقائيًا إلى المسارات الأنسب بحسب بياناتك ونتيجة التشخيص أعلاه. يمكنك تعديل اهتماماتك لاحقًا.
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
            <ForgotPasswordLink email={data.email} />
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
        <div className="mt-6 text-sm text-emeraldDeep bg-gold/10 border border-gold/30 rounded p-5 space-y-2">
          <p>
            نتيجة التشخيص: <b>{result.diagnostic.correctCount} / {result.diagnostic.total}</b> —
            المستوى المكتشَف: <b>
              {{ beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' }[result.diagnostic.level]}
            </b>
          </p>
          {result.diagnostic.gapLabels.length > 0 && (
            <p className="text-maroon">
              نقاط تحتاج تركيزًا: {result.diagnostic.gapLabels.join('، ')}
            </p>
          )}
          <p>
            مسارك الموصى به: <b>{result.suggestedTracks.join('، ') || 'الصفحة الرئيسية'}</b>
          </p>
          <p className="text-emeraldDeep/70">تم إنشاء حسابك وحفظ بياناتك بنجاح في هذا المتصفح.</p>
          {result.marriageNotice && <p className="text-maroon mt-2">{result.marriageNotice.join(' ')}</p>}
        </div>
      )}
    </div>
  );
}

function ForgotPasswordLink({ email }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  // في الوضع المحلي لا يوجد نظام "تسجيل دخول" يتحقق من كلمة المرور أصلًا —
  // الجلسة تُحفظ تلقائيًا على هذا الجهاز فور التسجيل. لذلك لا نعرض زرًا يقود لطريق مسدود؛
  // نشرح الواقع الفعلي بصدق بدل رسالة خطأ محبطة.
  if (!isSupabaseConfigured) {
    return (
      <p className="text-xs text-ink/40 leading-relaxed">
        ℹ️ جلستك تُحفظ تلقائيًا على هذا الجهاز — لا حاجة لتسجيل دخول منفصل أو كلمة مرور حاليًا.
      </p>
    );
  }

  const handleClick = async () => {
    if (!email) {
      setStatus('needs-email');
      return;
    }
    setStatus('sending');
    const result = await resetPassword(email);
    setStatus(result.ok ? 'sent' : 'failed');
  };

  return (
    <div className="text-xs">
      <button type="button" onClick={handleClick} className="text-maroon underline">
        نسيت كلمة المرور؟
      </button>
      {status === 'needs-email' && <p className="text-maroon mt-1">أدخل بريدك الإلكتروني أعلاه أولًا.</p>}
      {status === 'sending' && <p className="text-ink/50 mt-1">جارٍ الإرسال...</p>}
      {status === 'sent' && <p className="text-emeraldDeep mt-1">✅ أُرسل رابط استعادة كلمة المرور إلى بريدك.</p>}
      {status === 'failed' && <p className="text-ink/50 mt-1">تعذّر الإرسال حاليًا — حاول لاحقًا.</p>}
    </div>
  );
}

