import VerseBanner from '../components/VerseBanner';
import { getAdaptiveResult } from '../lib/localBackend';

const SESSIONS = [
  { title: 'شرح كتاب التوحيد', level: 'مبتدئ', day: 'كل سبت' },
  { title: 'فقه المعاملات المعاصرة', level: 'متوسط', day: 'كل ثلاثاء' },
  { title: 'السيرة النبوية تدبرًا', level: 'عام', day: 'كل خميس' },
];

const LEVEL_LABELS = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' };

export default function Majalis() {
  const adaptive = getAdaptiveResult();

  return (
    <div className="px-[6vw] py-16 oil-bg oil-majalis">
      <VerseBanner contextKey="majalis" />
      <h2 className="font-display text-3xl text-emeraldDeep mt-10 mb-4">المجالس العلمية المباشرة</h2>

      {adaptive && (
        <div className="mb-8 bg-emeraldDeep text-parchment rounded p-6 max-w-xl">
          <p className="font-mono text-xs text-goldSoft mb-2">مسارك العلمي التكيفي</p>
          <p className="text-sm leading-relaxed">
            بحسب تشخيصك ({adaptive.correctCount}/{adaptive.total} — مستوى{' '}
            <b>{LEVEL_LABELS[adaptive.level] || adaptive.level}</b>)، ننصحك بالبدء بـ:{' '}
            <b>{adaptive.recommendedTracks.join('، ')}</b>
            {adaptive.gapLabels.length > 0 && (
              <> — مع تركيز إضافي على: {adaptive.gapLabels.join('، ')}</>
            )}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {SESSIONS.map((s) => (
          <div key={s.title} className="border border-gold/30 rounded p-6 bg-white/40">
            <h3 className="font-display text-lg text-emeraldDeep mb-2">{s.title}</h3>
            <p className="text-sm text-ink/60">المستوى: {s.level}</p>
            <p className="text-sm text-ink/60">الموعد: {s.day}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
