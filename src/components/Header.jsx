import { Link } from 'react-router-dom';
import { getCurrentProfile, logoutLocal } from '../lib/localBackend';

export default function Header() {
  const profile = getCurrentProfile();

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
      <nav className="hidden md:flex gap-7 text-sm text-parchment/85 items-center">
        <Link to="/aqeedah" className="hover:text-goldSoft">العقيدة</Link>
        <Link to="/majalis" className="hover:text-goldSoft">المجالس</Link>
        <Link to="/zawaj" className="hover:text-goldSoft">الزواج الشرعي</Link>
        <Link to="/dawah" className="hover:text-goldSoft">الدعوة</Link>
        {profile ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-goldSoft">مرحبًا، {profile.full_name || 'عضو'}</span>
            <button
              onClick={() => { logoutLocal(); window.location.href = '/'; }}
              className="text-xs text-parchment/50 hover:text-parchment underline"
            >
              خروج
            </button>
          </div>
        ) : (
          <Link to="/join" className="hover:text-goldSoft">انضم إلينا</Link>
        )}
      </nav>
    </header>
  );
}

