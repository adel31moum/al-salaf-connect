import VerseBanner from '../components/VerseBanner';

const STEPS = [
  { title: 'تسجيل الولي أولًا', body: 'لا يُفعَّل ملف أي أخت إلا بعد تسجيل وليها الشرعي والتحقق من صلة القرابة.' },
  { title: 'ملف بيانات نصي فقط', body: 'الاستمارة نصية بالكامل — بدون أي صور شخصية منشورة.' },
  { title: 'طلب تواصل عبر الولي', body: 'أي رغبة بالتقدّم تُرسَل تلقائيًا إلى ولي الطرفين.' },
  { title: 'محادثة مراقبة بثلاثة أطراف', body: 'لا توجد رسائل ثنائية مباشرة بين الجنسين على الإطلاق.' },
  { title: 'الإحالة للمسجد المحلي', body: 'إتمام باقي الإجراءات الشرعية والعرفية مع إمام محلي.' },
];

export default function Zawaj() {
  return (
    <div className="px-[6vw] py-16">
      <VerseBanner contextKey="zawaj" />
      <h2 className="font-display text-3xl text-emeraldDeep mt-10 mb-2">الزواج الشرعي</h2>
      <p className="text-sm text-maroon font-mono mb-8">مبني بإشراف الولي على مستوى قاعدة البيانات — لا يمكن تجاوزه من الواجهة.</p>
      <div className="max-w-2xl">
        {STEPS.map((s, idx) => (
          <div key={s.title} className="flex gap-4 py-5 border-b border-gold/20">
            <div className="font-mono text-maroon text-sm min-w-[28px]">{String(idx + 1).padStart(2, '0')}</div>
            <div>
              <h4 className="font-medium text-emeraldDeep">{s.title}</h4>
              <p className="text-sm text-ink/60 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <VerseBanner contextKey="zawaj_guardian" />
      </div>
    </div>
  );
}
