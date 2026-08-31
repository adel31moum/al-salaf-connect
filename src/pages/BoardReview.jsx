import { useState, useEffect } from 'react';
import {
  listUserMarriageProfiles,
  reviewMarriageProfile,
  listGuardianEscalations,
  resolveGuardianEscalation,
} from '../lib/localBackend';

// ⚠️ حماية مؤقتة على مستوى الواجهة فقط — لا تمنع مهاجمًا مصمّمًا يقرأ كود JS المبني،
// لكن مقارنة التجزئة (hash) بدل النص الصريح تمنع الاكتشاف العرضي بالبحث عن "PASSPHRASE"
// في مصدر الصفحة، وهو أكثر تهديد واقعي متوقع حاليًا. الحماية الحقيقية الوحيدة هي RLS على
// Supabase بدور shariah_board (موجود جاهزًا في supabase/schema.sql) — فعّلها فور ربط قاعدة
// بيانات حقيقية، ولا تعتمد على هذه الصفحة لحماية بيانات حساسة فعلية.
const BOARD_PASSPHRASE_SHA256 = 'e4ce82c41112bb6ba35407ad1cc706a7ec441ecb19146be0d9a3d0c0d668e710';
const SESSION_KEY = 'asc_board_unlocked';

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function BoardGate({ onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const tryUnlock = async () => {
    setChecking(true);
    const hash = await sha256Hex(input);
    if (hash === BOARD_PASSPHRASE_SHA256) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch (_e) {
        /* تجاهل بصمت إن تعذّر — الجلسة ستُطلب مجددًا، وهذا مقبول */
      }
      onUnlock();
    } else {
      setError(true);
    }
    setChecking(false);
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
        <button onClick={tryUnlock} disabled={checking} className="bg-gold text-emeraldDeep px-6 py-2 rounded font-medium w-full disabled:opacity-60">
          {checking ? '...' : 'دخول'}
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

const TABS = [
  { key: 'pending', label: 'قيد المراجعة', filter: (p) => p.guardian_verification_status === 'pending' },
  { key: 'verified', label: 'موافَق عليها', filter: (p) => p.guardian_verification_status === 'verified' },
  { key: 'rejected', label: 'مرفوضة', filter: (p) => p.guardian_verification_status === 'rejected' },
  { key: 'all', label: 'الكل', filter: () => true },
];

const STATUS_BADGE = {
  pending: { label: 'قيد المراجعة', cls: 'text-maroon border-maroon/30' },
  verified: { label: 'مفعَّل', cls: 'text-emeraldDeep border-emeraldDeep/30' },
  rejected: { label: 'مرفوض', cls: 'text-ink/50 border-ink/20' },
};

function BoardReviewPanel() {
  const [allProfiles, setAllProfiles] = useState(listUserMarriageProfiles());
  const [escalations, setEscalations] = useState(listGuardianEscalations());
  const [note, setNote] = useState({});
  const [tab, setTab] = useState('pending');
  const [query, setQuery] = useState('');

  const refresh = () => setAllProfiles(listUserMarriageProfiles());

  const decide = (id, decision) => {
    reviewMarriageProfile(id, decision, note[id] || '');
    refresh();
  };

  const resolveEscalation = (id) => {
    resolveGuardianEscalation(id, note[id] || '');
    setEscalations(listGuardianEscalations());
  };

  const counts = TABS.reduce((acc, t) => ({ ...acc, [t.key]: allProfiles.filter(t.filter).length }), {});
  const openEscalations = escalations.filter((e) => e.status === 'open');

  const visible = allProfiles
    .filter(TABS.find((t) => t.key === tab).filter)
    .filter((p) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (p.kunya || '').toLowerCase().includes(q) || (p.country || '').toLowerCase().includes(q);
    });

  return (
    <div className="px-[6vw] py-16 max-w-4xl mx-auto">
      <span className="font-mono text-xs tracking-[3px] text-maroon uppercase">Sharia Board Review</span>
      <h2 className="font-display text-3xl text-emeraldDeep mt-3 mb-2">لوحة مراجعة الهيئة الشرعية</h2>
      <p className="text-sm text-ink/60 mb-8 leading-relaxed">
        بوابة جماعية تمنع أي ملف زواج من الظهور للآخرين قبل موافقة إنسانية صريحة. <b>مقصود:</b> ليست
        لوحة تحكم شخصية لأي فرد إداري — التزامًا بمنع أي تضارب مصالح.
      </p>

      {/* شريط إحصائي سريع */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {TABS.map((t) => (
          <div key={t.key} className="text-center border border-gold/20 rounded p-3 bg-parchment/50">
            <div className="font-display text-2xl text-emeraldDeep">{counts[t.key]}</div>
            <div className="text-[0.65rem] text-ink/50 font-mono">{t.label}</div>
          </div>
        ))}
      </div>

      {/* طلبات "لا يوجد ولي" */}
      {openEscalations.length > 0 && (
        <div className="mb-12">
          <h3 className="font-display text-xl text-emeraldDeep mb-4">
            طلبات الولاية المعلَّقة ({openEscalations.length})
          </h3>
          <div className="space-y-4">
            {openEscalations.map((e) => (
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
                <button onClick={() => resolveEscalation(e.id)} className="bg-emeraldDeep text-parchment px-4 py-2 rounded text-sm">
                  تسجيل القرار وإغلاق الطلب
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* تبويبات + بحث */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-gold/20 pb-4">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm px-4 py-2 rounded font-medium ${
                tab === t.key ? 'bg-gold text-emeraldDeep' : 'border border-gold/30 text-ink/60'
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث بالكنية أو البلد..."
          className="border border-gold/30 rounded px-3 py-2 text-sm bg-transparent w-full sm:w-56"
        />
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-ink/50 bg-gold/10 border border-gold/30 rounded p-6 text-center">
          لا توجد ملفات في هذا التصنيف.
        </p>
      )}

      <div className="space-y-6">
        {visible.map((p) => {
          const badge = STATUS_BADGE[p.guardian_verification_status] || STATUS_BADGE.pending;
          return (
            <div key={p.id} className="border border-gold/30 rounded p-6 bg-parchment/70">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-display text-lg text-emeraldDeep">{p.kunya}</h4>
                  <p className="text-xs text-ink/50 font-mono">{p.country} · {p.ageRange}</p>
                </div>
                <span className={`text-[0.6rem] font-mono border rounded px-2 py-0.5 ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-ink/70 mb-2">{p.religious_commitment}</p>
              <p className="text-sm text-ink/70 mb-4">{p.seeking_description}</p>
              <div className="text-xs text-ink/50 bg-emeraldDeep/5 rounded p-3 mb-4">
                الولي: <b>{p.guardian_name || '—'}</b> ({p.guardian_relation || 'غير محدد'})
                {p.review_note && (
                  <p className="mt-2 border-t border-ink/10 pt-2">ملاحظة سابقة: {p.review_note}</p>
                )}
              </div>

              {p.guardian_verification_status === 'pending' ? (
                <>
                  <textarea
                    placeholder="ملاحظة المراجعة (اختياري)"
                    className="w-full border border-gold/30 rounded px-3 py-2 text-sm bg-transparent mb-3"
                    rows={2}
                    onChange={(e) => setNote((n) => ({ ...n, [p.id]: e.target.value }))}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => decide(p.id, 'verified')} className="bg-emeraldDeep text-parchment px-4 py-2 rounded text-sm">
                      ✅ موافقة وتفعيل
                    </button>
                    <button onClick={() => decide(p.id, 'rejected')} className="border border-maroon text-maroon px-4 py-2 rounded text-sm">
                      ✕ رفض
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => decide(p.id, 'pending')}
                  className="text-xs text-ink/50 underline"
                >
                  إعادة الملف لقائمة المراجعة (تراجع عن القرار)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
