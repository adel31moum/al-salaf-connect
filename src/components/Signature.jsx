// شعار "توقيع" غير فوتوغرافي: شارة رمزية (بوصلة بحّار + هلال) بدل صورة شخصية حقيقية —
// أنسب فنيًا وأصون لهوية رمزية/كنية وليست شخصًا حقيقيًا قابلًا للتصوير.
export default function Signature() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 opacity-90">
      <svg width="46" height="46" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="47" fill="none" stroke="#C69A45" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#C69A45" strokeWidth="0.8" opacity="0.5" />
        {/* ship-wheel spokes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="50" y1="50"
            x2={50 + 40 * Math.cos((i * Math.PI) / 4)}
            y2={50 + 40 * Math.sin((i * Math.PI) / 4)}
            stroke="#C69A45" strokeWidth="1.2"
          />
        ))}
        <circle cx="50" cy="50" r="10" fill="#0E3B2E" stroke="#C69A45" strokeWidth="1.5" />
        {/* crescent accent */}
        <path
          d="M 62 30 A 10 10 0 1 0 62 46 A 8 8 0 1 1 62 30 Z"
          fill="#E4C688"
        />
      </svg>
      <div className="text-right leading-tight">
        <div className="font-display text-goldSoft text-sm">البحّار السلفي الغريب</div>
        <div className="font-mono text-[0.62rem] text-parchment/50 tracking-wide">
          مصمَّم ومُدار برعاية هذه الهوية الرمزية
        </div>
      </div>
    </div>
  );
}
