// فلتر SVG مخفي يولّد ملمس "الحبيبات الزيتية" لكل الخلفيات — بدون أي صورة خارجية محمية.
// يُركَّب مرة واحدة فقط في جذر التطبيق (App.jsx) ويُستخدَم عبر filter:url(#oilGrain) في index.css.
export default function OilGrainFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="oilGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
      </filter>
    </svg>
  );
}
