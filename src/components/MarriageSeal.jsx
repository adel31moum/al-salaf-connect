// ختم زخرفي هندسي بحت يرمز لـ"الميثاق الشرعي" — بلا أي تصوير آدمي إطلاقًا،
// مستوحى من الأختام الرسمية والزخرفة الهندسية الإسلامية (نجمة ثمانية داخل حلقتين متداخلتين).
export default function MarriageSeal({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="none" stroke="#C69A45" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="47" fill="none" stroke="#C69A45" strokeWidth="0.8" opacity="0.6" />
      {/* حلقتان متداخلتان هندسيًا — ترمز لاتحاد أسرتين عبر الميثاق، بلا أي تصوير آدمي */}
      <circle cx="46" cy="60" r="22" fill="none" stroke="#6B1F2A" strokeWidth="1.4" opacity="0.85" />
      <circle cx="74" cy="60" r="22" fill="none" stroke="#0E3B2E" strokeWidth="1.4" opacity="0.85" />
      {/* نجمة ثمانية في المركز */}
      <g transform="translate(60,60)">
        {Array.from({ length: 8 }).map((_, i) => {
          const a1 = (i * Math.PI) / 4;
          const a2 = ((i + 1) * Math.PI) / 4;
          return (
            <polygon
              key={i}
              points={`0,0 ${14 * Math.cos(a1)},${14 * Math.sin(a1)} ${9 * Math.cos((a1 + a2) / 2)},${9 * Math.sin((a1 + a2) / 2)}`}
              fill="#C69A45"
              opacity="0.9"
            />
          );
        })}
      </g>
    </svg>
  );
}
