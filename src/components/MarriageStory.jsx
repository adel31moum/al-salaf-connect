import { Link } from 'react-router-dom';

// قصة تعريفية متحركة في مقدمة المنصة — بالكامل ظلال هندسية (silhouettes) بلا أي وجوه أو عيون
// أو تفاصيل تشريحية، التزامًا صريحًا بما طُلب. الشخوص الثلاث رمزية بحتة: شيخ يقرأ، عريس بثوب
// شرعي، عروس بستر كامل — لا تصوير آدمي حقيقي بأي شكل، بل أقرب لفن "خيال الظل".
//
// قرار تحريري مهم: لا نعرض هذا كـ"شهادة عضو حقيقي" (ذلك ادعاء غير صادق لم يحدث فعليًا) —
// بل كـ"قصة ملهمة" رمزية معلنة بوضوح، تُختم بآية قرآنية صحيحة النسبة قطعًا (لا حديثًا قد
// يُختلف في تصحيحه)، فتُحقق الأثر العاطفي المطلوب دون أي مبالغة أو تضليل تسويقي.

export default function MarriageStory() {
  return (
    <section className="relative overflow-hidden bg-emeraldDeep py-16 px-[6vw]">
      <style>{`
        @keyframes riseIn { from { opacity:0; transform:translateY(18px);} to { opacity:1; transform:translateY(0);} }
        @keyframes duneShimmer { 0%,100% { opacity:.9; } 50% { opacity:1; } }
        @keyframes riverFlow { 0% { stroke-dashoffset: 40; } 100% { stroke-dashoffset: 0; } }
        .ms-figure { opacity:0; animation: riseIn 1.1s ease forwards; }
        .ms-sheikh { animation-delay: .3s; }
        .ms-groom { animation-delay: .9s; }
        .ms-bride { animation-delay: 1.5s; }
        .ms-dunes { animation: duneShimmer 6s ease-in-out infinite; }
        .ms-river { stroke-dasharray: 6 4; animation: riverFlow 3s linear infinite; }
        .ms-text { opacity:0; animation: riseIn 1s ease forwards; animation-delay: 2.3s; }
        .ms-cta { opacity:0; animation: riseIn 1s ease forwards; animation-delay: 3s; }
      `}</style>

      <div className="max-w-3xl mx-auto text-center">
        <span className="font-mono text-xs tracking-[3px] text-goldSoft uppercase">قصة ملهمة</span>

        <svg viewBox="0 0 800 340" className="w-full h-auto mt-6" xmlns="http://www.w3.org/2000/svg">
          {/* سماء الغروب */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B1F2A" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#082821" />
              <stop offset="100%" stopColor="#051813" />
            </linearGradient>
          </defs>
          <rect width="800" height="340" fill="url(#skyGrad)" />

          {/* كثبان رملية */}
          <g className="ms-dunes">
            <path d="M0,260 Q150,220 300,255 T800,240 V340 H0 Z" fill="#C69A45" opacity="0.12" />
            <path d="M0,290 Q200,255 400,285 T800,275 V340 H0 Z" fill="#C69A45" opacity="0.18" />
          </g>

          {/* نهر صغير */}
          <path
            d="M60,305 Q220,290 380,308 T740,300"
            fill="none"
            stroke="#7FB8B0"
            strokeWidth="3"
            opacity="0.5"
            className="ms-river"
          />

          {/* الخيمة */}
          <g opacity="0.9">
            <path d="M400,90 L300,240 L500,240 Z" fill="none" stroke="#E4C688" strokeWidth="2" />
            <path d="M400,90 L400,240" stroke="#E4C688" strokeWidth="1.2" opacity="0.6" />
            <path d="M355,240 L400,150 L445,240 Z" fill="#082821" stroke="#E4C688" strokeWidth="1.5" />
          </g>

          {/* الشيخ جالسًا في الوسط بين الطرفين، يقرأ من كتاب */}
          <g className="ms-figure ms-sheikh" transform="translate(400,205)">
            <path d="M-22,35 Q-22,0 0,-5 Q22,0 22,35 Z" fill="#171512" />
            <circle cx="0" cy="-18" r="14" fill="#171512" />
            <path d="M-10,-24 Q0,-34 10,-24 Q6,-16 0,-16 Q-6,-16 -10,-24 Z" fill="#171512" />
            <rect x="-14" y="10" width="28" height="16" rx="2" fill="#C69A45" opacity="0.9" />
          </g>

          {/* العريس: ثوب شرعي طويل، لحية كظل بسيط، بلا وجه */}
          <g className="ms-figure ms-groom" transform="translate(500,190)">
            <path d="M-20,60 Q-20,-10 0,-15 Q20,-10 20,60 Z" fill="#171512" />
            <circle cx="0" cy="-28" r="15" fill="#171512" />
            <path d="M-9,-20 Q0,-8 9,-20 Q5,-14 0,-13 Q-5,-14 -9,-20 Z" fill="#171512" opacity="0.9" />
            <rect x="-9" y="-42" width="18" height="8" rx="2" fill="#171512" />
          </g>

          {/* العروس: ستر كامل بلا أي ملامح، ظل هندسي بحت */}
          <g className="ms-figure ms-bride" transform="translate(300,190)">
            <path d="M-24,60 Q-24,-16 0,-20 Q24,-16 24,60 Z" fill="#171512" />
            <path d="M-17,-20 Q0,-34 17,-20 Q17,4 0,6 Q-17,4 -17,-20 Z" fill="#171512" />
          </g>
        </svg>

        <div className="ms-text mt-8">
          <p className="font-display text-goldSoft text-xl md:text-2xl leading-loose mb-3">
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
            وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
          </p>
          <p className="font-mono text-xs text-parchment/50 mb-4">سورة الروم — الآية 21</p>
          <p className="text-sm text-parchment/70 max-w-md mx-auto leading-relaxed">
            بإشراف وليّ، وبين يدي شيخ، وبضوابط لا تُتجاوَز — هكذا يبدأ سكنٌ جديد. قصة رمزية
            تختصر ما تقوم عليه هذه المنصة.
          </p>
        </div>

        <div className="ms-cta mt-8">
          <Link to="/join" className="bg-gold text-emeraldDeep px-8 py-3 rounded font-medium inline-block">
            ابدأ قصتك
          </Link>
        </div>
      </div>
    </section>
  );
}
