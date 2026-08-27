import { useState, useEffect } from 'react';
import {
  listPendingMarriageProfiles,
  reviewMarriageProfile,
  listGuardianEscalations,
  resolveGuardianEscalation,
} from '../lib/localBackend';

// ⚠️ حماية مؤقتة على مستوى الواجهة فقط — تمنع الزائر العادي من الوصول العرضي،
// لكنها ليست حماية حقيقية (أي شخص يقرأ كود JS المبني يمكنه رؤية هذه القيمة).
// الحماية الحقيقية الوحيدة هي RLS على Supabase بدور shariah_board (موجود جاهزًا
// في supabase/schema.sql) — فعّلها فور ربط قاعدة بيانات حقيقية.
// غيّر هذه العبارة السرية الآن قبل مشاركة رابط الموقع مع أي أحد:
const BOARD_PASSPHRASE = 'salaf-board-review-92x7';
const SESSION_KEY = 'asc_board_unlocked';

function BoardGate({ onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const tryUnlock = () => {
    if (input === BOARD_PASSPHRASE) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch (_e) {
        /* تجاهل بصمت إن تعذّر — الجلسة ستُطلب مجددًا، وهذا مقبول */
      }
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-sm w-full covenant-frame bg-parchment/80 p-8 text-center">
        <h2 className="font-display text-xl text-emeraldDeep mb-2">لوحة الهيئة الشرعية</h2>
        <p className="text-xs text-ink/50 mb-6">هذه اللوحة مقيَّدة — أدخل العبارة السرية للمتابعة.</p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
          className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent text-center mb-3"
          placeholder="العبارة السرية"
        />
        {error && <p className="text-maroon text-xs mb-3">عبارة غير صحيحة.</p>}
        <button onClick={tryUnlock} className="bg-gold text-emeraldDeep px-6 py-2 rounded font-medium w-full">
          دخول
        </button>
      </div>
    </div>
  );
}

export default function BoardReview() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true);
    } catch (_e) {
      /* لا شيء — تبقى مقفلة، وهذا آمن افتراضيًا */
    }
  }, []);

  if (!unlocked) {
    return <BoardGate onUnlock={() => setUnlocked(true)} />;
  }

  return <BoardReviewPanel />;
}

function BoardReviewPanel() {
  const [pending, setPending] = useState(listPendingMarriageProfiles());
  const [escalations, setEscalations] = useState(listGuardianEscalations());
  const [note, setNote] = useState({});

  const decide = (id, decision) => {
    reviewMarriageProfile(id, decision, note[id] || '');
    setPending(listPendingMarriageProfiles());
  };

  const resolveEscalation = (id) => {
    resolveGuardianEscalation(id, note[id] || '');
    setEscalations(listGuardianEscalations());
  };

  return (
    <div className="px-[6vw] py-16 max-w-3xl mx-auto">
      <span className="font-mono text-xs tracking-[3px] text-maroon uppercase">Sharia Board Review</span>
      <h2 className="font-display text-3xl text-emeraldDeep mt-3 mb-2">لوحة مراجعة الهيئة الشرعية</h2>
      <p className="text-sm text-ink/60 mb-10 leading-relaxed">
        هذه هي البوابة الفعلية التي تمنع أي ملف زواج من الظهور للآخرين قبل موافقة إنسانية صريحة —
        وليست مجرد نص في السياسة. في نسخة محلية تجريبية كهذه، أي زائر يمكنه الوصول لهذه الصفحة لغرض
        العرض؛ في النسخة المتصلة بخادم حقيقي، تُقيَّد هذه اللوحة بدور <code>shariah_board</code> فقط
        عبر RLS (موجود بالفعل في <code>supabase/schema.sql</code>). <b>مقصود:</b> هذه لوحة جماعية للهيئة،
        وليست لوحة تحكم شخصية لأي فرد إداري — التزامًا بمنع أي تضارب مصالح.
      </p>

      {/* طلبات "لا يوجد ولي" — تُعرض هنا فقط، أمام الهيئة الجماعية، لا أمام أي فرد */}
      <div className="mb-14">
        <h3 className="font-display text-xl text-emeraldDeep mb-4">طلبات الولاية المعلَّقة</h3>
        {escalations.filter((e) => e.status === 'open').length === 0 && (
          <p className="text-sm text-ink/50 bg-gold/10 border border-gold/30 rounded p-5 text-center">
            لا توجد طلبات معلَّقة حاليًا.
          </p>
        )}
        <div className="space-y-4">
          {escalations
            .filter((e) => e.status === 'open')
            .map((e) => (
              <div key={e.id} className="border border-maroon/30 rounded p-5 bg-maroon/5">
                <p className="font-medium text-emeraldDeep">{e.kunya} · {e.country}</p>
                <p className="text-sm text-ink/70 mt-1">{e.religious_commitment}</p>
                <p className="text-xs text-ink/50 mt-2">{e.note}</p>
                <textarea
                  placeholder="قرار الهيئة (مثال: تعيين وليّ مؤقت، الإحالة لمركز إسلامي محلي)"
                  className="w-full border border-gold/30 rounded px-3 py-2 text-sm bg-transparent mt-3 mb-2"
                  rows={2}
                  onChange={(ev) => setNote((n) => ({ ...n, [e.id]: ev.target.value }))}
                />
                <button
                  onClick={() => resolveEscalation(e.id)}
                  className="bg-emeraldDeep text-parchment px-4 py-2 rounded text-sm"
                >
                  تسجيل القرار وإغلاق الطلب
                </button>
              </div>
            ))}
        </div>
      </div>

      <h3 className="font-display text-xl text-emeraldDeep mb-4">ملفات الزواج بانتظار المراجعة</h3>
      {pending.length === 0 && (
        <p className="text-sm text-ink/50 bg-gold/10 border border-gold/30 rounded p-6 text-center">
          لا توجد ملفات بانتظار المراجعة حاليًا.
        </p>
      )}

      <div className="space-y-6">
        {pending.map((p) => (
          <div key={p.id} className="border border-gold/30 rounded p-6 bg-parchment/70">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-display text-lg text-emeraldDeep">{p.kunya}</h4>
                <p className="text-xs text-ink/50 font-mono">{p.country} · {p.ageRange}</p>
              </div>
              <span className="text-[0.6rem] font-mono text-maroon border border-maroon/30 rounded px-2 py-0.5">
                قيد المراجعة
              </span>
            </div>
            <p className="text-sm text-ink/70 mb-2">{p.religious_commitment}</p>
            <p className="text-sm text-ink/70 mb-4">{p.seeking_description}</p>
            <div className="text-xs text-ink/50 bg-emeraldDeep/5 rounded p-3 mb-4">
              الولي: <b>{p.guardian_name || '—'}</b> ({p.guardian_relation || 'غير محدد'})
            </div>
            <textarea
              placeholder="ملاحظة المراجعة (اختياري)"
              className="w-full border border-gold/30 rounded px-3 py-2 text-sm bg-transparent mb-3"
              rows={2}
              onChange={(e) => setNote((n) => ({ ...n, [p.id]: e.target.value }))}
            />
            <div className="flex gap-3">
              <button
                onClick={() => decide(p.id, 'verified')}
                className="bg-emeraldDeep text-parchment px-4 py-2 rounded text-sm"
              >
                ✅ موافقة وتفعيل
              </button>
              <button
                onClick={() => decide(p.id, 'rejected')}
                className="border border-maroon text-maroon px-4 py-2 rounded text-sm"
              >
                ✕ رفض
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
