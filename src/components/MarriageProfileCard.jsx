import { useEffect, useState } from 'react';
import GenderGlyph from './GenderGlyph';
import { saveCompatibilityRequest, getCurrentProfile } from '../lib/localBackend';
import { estimateCompatibility } from '../lib/compatibility';

const REVEAL_SECONDS = 5;

export default function MarriageProfileCard({ profile }) {
  const [revealState, setRevealState] = useState('closed'); // closed | counting | open
  const [countdown, setCountdown] = useState(REVEAL_SECONDS);
  const [requestSent, setRequestSent] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (revealState !== 'counting') return undefined;
    if (countdown <= 0) {
      setRevealState('open');
      return undefined;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [revealState, countdown]);

  const startReveal = () => {
    setCountdown(REVEAL_SECONDS);
    setRevealState('counting');
  };

  const skipReveal = () => setRevealState('open');

  const requestCompatibility = () => {
    const me = getCurrentProfile() || {};
    const s = estimateCompatibility(me, profile);
    setScore(s);
    saveCompatibilityRequest({
      requesterId: me.id || 'زائر',
      targetProfileId: profile.id,
      targetKunya: profile.kunya,
      estimatedScore: s,
    });
    setRequestSent(true);
  };

  return (
    <div className="border border-gold/30 rounded p-6 bg-parchment/80">
      <div className="flex items-center gap-3 mb-3">
        <GenderGlyph gender={profile.gender} size={40} />
        <div>
          <h4 className="font-display text-emeraldDeep text-lg leading-tight">{profile.kunya}</h4>
          <p className="text-xs text-ink/50 font-mono">{profile.country} · {profile.ageRange}</p>
        </div>
        {profile.isDemo && (
          <span className="ms-auto text-[0.6rem] font-mono text-maroon/70 border border-maroon/30 rounded px-2 py-0.5">
            نموذج تجريبي
          </span>
        )}
      </div>

      {revealState === 'closed' && (
        <button onClick={startReveal} className="text-sm text-emeraldDeep underline">
          عرض التفاصيل
        </button>
      )}

      {revealState === 'counting' && (
        <div className="text-sm text-ink/60">
          <p>لحظة تأمل قبل عرض التفاصيل… {countdown} ثانية</p>
          <button onClick={skipReveal} className="text-xs text-maroon underline mt-2">
            تخطّي الانتظار
          </button>
        </div>
      )}

      {revealState === 'open' && (
        <div className="space-y-3">
          <p className="text-sm text-ink/70 leading-relaxed">{profile.religious_commitment}</p>
          <p className="text-sm text-ink/70 leading-relaxed">{profile.seeking_description}</p>

          {!requestSent ? (
            <button
              onClick={requestCompatibility}
              className="mt-2 bg-gold text-emeraldDeep text-sm px-4 py-2 rounded"
            >
              طلب توافق عبر الولي
            </button>
          ) : (
            <div className="mt-2 text-sm bg-emeraldDeep/5 border border-gold/30 rounded p-3">
              <p>✅ أُرسل طلبك تجريبيًا. سيصل الإشعار الفعلي لولي الطرفين في النسخة الكاملة.</p>
              <p className="text-xs text-ink/50 mt-1">
                نسبة توافق تقديرية: <b>{score}%</b> — مؤشر إرشادي عام فقط، وليس حكمًا شرعيًا أو نفسيًا ملزمًا.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
