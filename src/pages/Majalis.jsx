import VerseBanner from '../components/VerseBanner';

const SESSIONS = [
  { title: 'شرح كتاب التوحيد', level: 'مبتدئ', day: 'كل سبت' },
  { title: 'فقه المعاملات المعاصرة', level: 'متوسط', day: 'كل ثلاثاء' },
  { title: 'السيرة النبوية تدبرًا', level: 'عام', day: 'كل خميس' },
];

export default function Majalis() {
  return (
    <div className="px-[6vw] py-16">
      <VerseBanner contextKey="majalis" />
      <h2 className="font-display text-3xl text-emeraldDeep mt-10 mb-8">المجالس العلمية المباشرة</h2>
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
