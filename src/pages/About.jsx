import VerseBanner from '../components/VerseBanner';

const SOURCES = [
  'القرآن الكريم وتفسيره وفق أصول أهل السنة',
  'كتب الحديث الستة وشروحها المعتبرة',
  'مؤلفات أئمة الدعوة السلفية المعاصرة المعتمدة في أغلب المراكز الإسلامية',
  'فتاوى اللجان والهيئات العلمية الرسمية المعروفة',
];

const BOARD_PRINCIPLES = [
  { title: 'قرار جماعي لا فردي', body: 'لا يملك أي عضو منفرد صلاحية اعتماد أو رفض ملف — كل قرار حساس يمر عبر مراجعة جماعية، تفاديًا لتضارب المصالح أو الخطأ الفردي.' },
  { title: 'لا اجتهاد في العقيدة', body: 'الهيئة لا "تُفتي" باجتهاد شخصي في مسائل العقيدة أو الفقه الدقيق — دورها تطبيق ضوابط صريحة سبق إقرارها، وإحالة أي مسألة مستجدة لأهل العلم المختصين خارج المنصة.' },
  { title: 'الشفافية في حدود الخصوصية', body: 'لا نكشف هويات الأعضاء أو تفاصيل الملفات الشخصية، لكننا نلتزم بالإفصاح عن منهجية العمل وضوابط المراجعة لأي زائر يسأل.' },
];

export default function About() {
  return (
    <div className="px-[6vw] py-16 max-w-3xl mx-auto oil-bg oil-aqeedah">
      <div className="text-center mb-12">
        <span className="font-mono text-xs tracking-[3px] text-maroon uppercase">Scholarly Attribution</span>
        <h2 className="font-display text-3xl md:text-4xl text-emeraldDeep mt-3 mb-3">الإسناد العلمي والمنهجية</h2>
        <p className="text-sm text-ink/60 max-w-lg mx-auto leading-relaxed">
          سؤال مشروع يستحق إجابة واضحة: من يقف خلف هذه المنصة، وعلى أي أساس يُبنى محتواها وقراراتها؟
        </p>
      </div>

      <VerseBanner contextKey="aqeedah" />

      <div className="covenant-frame bg-parchment/70 p-8 md:p-10 mt-12">
        <h3 className="font-display text-xl text-emeraldDeep mb-4">من نحن</h3>
        <p className="text-sm text-ink/70 leading-relaxed mb-4">
          ملتقى السلف مبادرة مجتمعية مستقلة غير ربحية، لا تتبع لجهة سياسية أو حزبية. الهدف
          المعلن الوحيد: تسهيل التواصل العلمي والاجتماعي بين من يتبنّون منهج التلقي من الكتاب
          والسنة بفهم السلف الصالح، دون ادّعاء تمثيل جهة رسمية أو مؤسسة علمية قائمة.
        </p>
        <p className="text-sm text-ink/70 leading-relaxed">
          نحن أداة تقنية تخدم هذا المجتمع — لسنا مصدرًا للفتوى، ولا بديلاً عن أهل العلم
          المعتبرين. أي محتوى فقهي دقيق تجده هنا هو إحالة أو تجميع، لا اجتهادًا مستقلًا من فريق
          المنصة.
        </p>
      </div>

      <div className="covenant-frame bg-parchment/70 p-8 md:p-10 mt-8">
        <h3 className="font-display text-xl text-emeraldDeep mb-4">المصادر التي نعتمد عليها</h3>
        <ul className="space-y-2">
          {SOURCES.map((s) => (
            <li key={s} className="text-sm text-ink/70 flex gap-2">
              <span className="text-gold">•</span> {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-xl text-emeraldDeep mb-5 text-center">مبادئ عمل الهيئة الشرعية</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {BOARD_PRINCIPLES.map((p) => (
            <div key={p.title} className="border border-gold/30 rounded p-5 bg-parchment/60">
              <h4 className="font-medium text-emeraldDeep text-sm mb-2">{p.title}</h4>
              <p className="text-xs text-ink/60 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 bg-maroon/5 border border-maroon/20 rounded p-6 text-center">
        <p className="text-sm text-ink/70 leading-relaxed">
          لديك سؤال عن منهجية المنصة أو تحفظ على قرار مُتَّخذ؟ تواصل معنا — نرحّب بالمساءلة،
          فهي جزء من الأمانة التي نلتزم بها.
        </p>
      </div>
    </div>
  );
}
