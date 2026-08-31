import VerseBanner from '../components/VerseBanner';

const PILLARS = [
  { num: '01', title: 'مصدر التلقي', body: 'القرآن الكريم والسنة الصحيحة، مفهومَين وفق فهم السلف الصالح، دون غلوّ ولا تفريط.' },
  { num: '02', title: 'الاعتدال والرفق', body: 'الدعوة بالحكمة والموعظة الحسنة، ورفض كل خطاب يحرّض على العنف أو يكفّر الناس بغير حق.' },
  { num: '03', title: 'الانضباط الاجتماعي', body: 'مراعاة آداب التعامل بين الجنسين، وصون الأعراض، وسلامة الأسرة المسلمة.' },
];

export default function Aqeedah() {
  return (
    <div className="px-[6vw] py-16 oil-bg oil-aqeedah">
      <VerseBanner contextKey="aqeedah" />
      <h2 className="font-display text-3xl text-emeraldDeep mt-10 mb-8">ثلاثة أصول تُبنى عليها المنصة</h2>
      <div className="grid md:grid-cols-3 gap-px bg-gold/20 border border-gold/20">
        {PILLARS.map((p) => (
          <div key={p.num} className="bg-parchment p-8">
            <div className="font-mono text-gold text-sm">{p.num}</div>
            <h3 className="font-display text-lg text-emeraldDeep my-3">{p.title}</h3>
            <p className="text-sm text-ink/65 leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 max-w-md">
        <VerseBanner contextKey="ethics" />
      </div>
    </div>
  );
}
