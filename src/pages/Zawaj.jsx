import VerseBanner from '../components/VerseBanner';
import MarriageSeal from '../components/MarriageSeal';

const STEPS = [
  { title: 'تسجيل الولي أولًا', body: 'لا يُفعَّل ملف أي أخت إلا بعد تسجيل وليها الشرعي والتحقق من صلة القرابة.' },
  { title: 'ملف بيانات نصي فقط', body: 'الاستمارة نصية بالكامل — بدون أي صور شخصية منشورة.' },
  { title: 'طلب تواصل عبر الولي', body: 'أي رغبة بالتقدّم تُرسَل تلقائيًا إلى ولي الطرفين.' },
  { title: 'محادثة مراقبة بثلاثة أطراف', body: 'لا توجد رسائل ثنائية مباشرة بين الجنسين على الإطلاق.' },
  { title: 'الإحالة للمسجد المحلي', body: 'إتمام باقي الإجراءات الشرعية والعرفية مع إمام محلي.' },
];

export default function Zawaj() {
  return (
    <div className="px-[6vw] py-16 oil-bg oil-zawaj">
      {/* رأس الصفحة: هوية "ميثاق شرعي رسمي" مميّزة عن بقية الأقسام عمدًا */}
      <div className="text-center mb-14">
        <div className="flex justify-center mb-4">
          <MarriageSeal size={88} />
        </div>
        <span className="font-mono text-xs tracking-[3px] text-maroon uppercase">Sharia Marriage Covenant</span>
        <h2 className="font-display text-3xl md:text-4xl text-emeraldDeep mt-3 mb-2">ميثاق الزواج الشرعي</h2>
        <p className="text-sm text-ink/60 max-w-md mx-auto leading-relaxed">
          ليست منصة "مواعدة" — بل إجراء رسمي منضبط، يبدأ وينتهي بإشراف الأولياء، ويُحال في نهايته إلى مسجدك المحلي لإتمام العقد الشرعي الفعلي.
        </p>
      </div>

      <div className="max-w-3xl mx-auto covenant-frame bg-parchment/70 p-10 md:p-12">
        <VerseBanner contextKey="zawaj" />

        <div className="mt-10">
          {STEPS.map((s, idx) => (
            <div key={s.title} className="flex gap-4 py-5 border-b border-gold/20 last:border-b-0">
              <div className="font-mono text-maroon text-sm min-w-[28px]">{String(idx + 1).padStart(2, '0')}</div>
              <div>
                <h4 className="font-medium text-emeraldDeep">{s.title}</h4>
                <p className="text-sm text-ink/60 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gold/30 text-center">
          <p className="font-mono text-[0.65rem] tracking-widest text-maroon uppercase mb-4">
            الأساس الشرعي
          </p>
          <VerseBanner contextKey="zawaj_guardian" />
        </div>
      </div>

      <p className="text-center text-xs text-ink/40 font-mono mt-8 max-w-xl mx-auto">
        هذه الضوابط مُطبَّقة على مستوى قاعدة البيانات نفسها (RLS) — لا يمكن تجاوزها من الواجهة تحت أي ظرف.
      </p>
    </div>
  );
}
