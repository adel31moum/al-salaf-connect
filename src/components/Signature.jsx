import { useState } from 'react';

// شعار "توقيع" غير فوتوغرافي: شارة رمزية (بوصلة بحّار + هلال) بدل صورة شخصية حقيقية.
//
// اللمسة الذكية هنا: اسم "الغريب" لم يكن اختيارًا تجميليًا عشوائيًا — بل إحالة مقصودة لحديث
// نبوي مشهور تمامًا بهذا اللفظ (رواه مسلم). النقر على التوقيع يكشف هذا المعنى بدل أن يبقى
// زخرفة صامتة، فيتحوّل التوقيع من "شعار" إلى رسالة صغيرة مقصودة.
const HADITH_AL_GHURABA = {
  arabic: 'بَدَأَ الْإِسْلَامُ غَرِيبًا وَسَيَعُودُ غَرِيبًا كَمَا بَدَأَ، فَطُوبَى لِلْغُرَبَاءِ',
  ref: 'رواه مسلم',
};

export default function Signature() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col items-center py-6">
      <button
        onClick={() => setRevealed((r) => !r)}
        className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity"
        aria-expanded={revealed}
        aria-label="لماذا الغريب؟"
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={revealed ? 'animate-[spin_18s_linear_infinite]' : ''}
        >
          <circle cx="50" cy="50" r="47" fill="none" stroke="#C69A45" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#C69A45" strokeWidth="0.8" opacity="0.5" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((i * Math.PI) / 4)}
              y2={50 + 40 * Math.sin((i * Math.PI) / 4)}
              stroke="#C69A45"
              strokeWidth="1.2"
            />
          ))}
          <circle cx="50" cy="50" r="10" fill="#0E3B2E" stroke="#C69A45" strokeWidth="1.5" />
          <path d="M 62 30 A 10 10 0 1 0 62 46 A 8 8 0 1 1 62 30 Z" fill="#E4C688" />
        </svg>
        <div className="text-right leading-tight">
          <div className="font-display text-goldSoft text-sm">البحّار السلفي الغريب</div>
          <div className="font-mono text-[0.62rem] text-parchment/50 tracking-wide">
            {revealed ? 'إخفاء المعنى' : 'لماذا "الغريب"؟ انقر لتعرف'}
          </div>
        </div>
      </button>

      {revealed && (
        <div className="mt-4 max-w-sm text-center border-t border-gold/20 pt-4 px-6">
          <p className="font-display text-goldSoft text-base leading-loose mb-2">
            {HADITH_AL_GHURABA.arabic}
          </p>
          <p className="font-mono text-[0.6rem] text-parchment/40">{HADITH_AL_GHURABA.ref}</p>
          <p className="text-xs text-parchment/50 mt-3 leading-relaxed">
            الكنية ليست زخرفة — هي تذكير متجدد لكل من يبني هذه المنصة أو يتصفحها: التمسّك بالمنهج
            في زمن الغربة أجرٌ وبشرى، لا عبء.
          </p>
        </div>
      )}
    </div>
  );
}
