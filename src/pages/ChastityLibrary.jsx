import { useState } from 'react';
import VerseBanner from '../components/VerseBanner';

const CARDS = [
  {
    type: 'hadith',
    title: 'غضّ البصر',
    body: 'من الأحاديث الصحيحة المعروفة أن من السبعة الذين يظلّهم الله يوم لا ظل إلا ظله: شابٌّ دعته امرأة ذات منصب وجمال فقال إني أخاف الله. رواه البخاري ومسلم في الصحيحين.',
    note: 'راجع نص الحديث الكامل وسنده في صحيح البخاري (كتاب الأذان) وصحيح مسلم (كتاب الزكاة) للتوثيق الدقيق.',
  },
  {
    type: 'seerah',
    title: 'قصة جُليبيب رضي الله عنه',
    body: 'جُليبيب صحابي لم يكن معروفًا بجمال أو نسب، زوّجه النبي صلى الله عليه وسلم بعد أن رضيت أسرة الفتاة برأي النبي رغم تردّدها الأول، فكان زواجًا مباركًا. استُشهد جُليبيب في إحدى الغزوات، وأثنى عليه النبي صلى الله عليه وسلم ثناءً عظيمًا.',
    note: 'القصة مشهورة في كتب السيرة والسنن (رواها مسلم مختصرًا)، يُنصح بمراجعة المصدر الأصلي للتفاصيل الدقيقة.',
  },
  {
    type: 'quote',
    title: 'قول لأحد العلماء',
    body: 'العفة ليست حرمانًا، بل هي صيانة القلب والجوارح حتى يجد الإنسان طريقه المشروع للسكينة — والزواج المبكر المنضبط أحد أعظم أسباب هذه الصيانة.',
    note: 'معنى متداول بين أهل العلم في باب الترغيب بالزواج وتيسيره، وليس نصًا حرفيًا منسوبًا لعالم بعينه.',
  },
  {
    type: 'quran',
    title: 'الأمر بالعفاف',
    body: 'قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ۚ ذَٰلِكَ أَزْكَىٰ لَهُمْ',
    note: 'سورة النور — الآية 30.',
  },
];

export default function ChastityLibrary() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const share = async (card, idx) => {
    const text = `${card.title}\n\n${card.body}\n\n— ملتقى السلف`;
    try {
      if (navigator.share) {
        await navigator.share({ title: card.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (_err) {
      // المستخدم ألغى المشاركة — لا حاجة لأي رسالة خطأ
    }
  };

  return (
    <div className="px-[6vw] py-16 max-w-4xl mx-auto">
      <VerseBanner contextKey="zawaj" />
      <h2 className="font-display text-3xl text-emeraldDeep mt-10 mb-2">مكتبة العفاف</h2>
      <p className="text-sm text-ink/60 leading-relaxed mb-10">
        بطاقات قابلة للمشاركة السريعة — أحاديث، قصص صحابة، وأقوال أهل العلم في الترغيب بالعفاف والزواج المبكر المنضبط.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {CARDS.map((c, idx) => (
          <div key={idx} className="covenant-frame bg-parchment/70 p-6 flex flex-col">
            <span className="text-[0.6rem] font-mono text-maroon uppercase mb-2">{c.type}</span>
            <h3 className="font-display text-lg text-emeraldDeep mb-3">{c.title}</h3>
            <p className="text-sm text-ink/75 leading-relaxed flex-1">{c.body}</p>
            <p className="text-[0.65rem] text-ink/40 mt-3 italic">{c.note}</p>
            <button
              onClick={() => share(c, idx)}
              className="mt-4 self-start text-xs text-emeraldDeep underline"
            >
              {copiedIndex === idx ? '✅ نُسخ للحافظة' : 'مشاركة سريعة'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
