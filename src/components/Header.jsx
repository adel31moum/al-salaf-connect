import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-[6vw] py-4 bg-emeraldDeep border-b border-gold/30">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-9 h-9 border border-gold rotate-45 flex items-center justify-center">
          <span className="-rotate-45 text-gold font-display font-bold">س</span>
        </div>
        <div>
          <div className="font-display text-goldSoft text-xl leading-none">ملتقى السلف</div>
          <div className="font-mono text-[0.6rem] tracking-[2px] text-parchment/60">AL-SALAF CONNECT</div>
        </div>
      </Link>
      <nav className="hidden md:flex gap-7 text-sm text-parchment/85">
        <Link to="/aqeedah" className="hover:text-goldSoft">العقيدة</Link>
        <Link to="/majalis" className="hover:text-goldSoft">المجالس</Link>
        <Link to="/zawaj" className="hover:text-goldSoft">الزواج الشرعي</Link>
        <Link to="/dawah" className="hover:text-goldSoft">الدعوة</Link>
        <Link to="/join" className="hover:text-goldSoft">انضم إلينا</Link>
      </nav>
    </header>
  );
}
