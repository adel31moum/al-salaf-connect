import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-emeraldDeep text-parchment/60 px-[6vw] pt-12 pb-8 text-sm mt-20">
      <div className="text-center mb-5 flex justify-center gap-4 flex-wrap">
        <Link to="/support" className="font-mono text-xs text-goldSoft/70 hover:text-goldSoft underline">
          ادعم المنصة
        </Link>
        <Link to="/board" className="font-mono text-xs text-goldSoft/70 hover:text-goldSoft underline">
          لوحة مراجعة الهيئة الشرعية
        </Link>
        <Link to="/chastity-library" className="font-mono text-xs text-goldSoft/70 hover:text-goldSoft underline">
          مكتبة العفاف
        </Link>
      </div>
      <div className="border-t border-gold/30 pt-5 text-center font-mono text-xs">
        AL-SALAF CONNECT © 2026 — منصة مجتمعية مستقلة غير ربحية
      </div>
    </footer>
  );
}
