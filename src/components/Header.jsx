import { Link } from 'react-router-dom';
import { getCurrentProfile, logoutLocal } from '../lib/localBackend';
import { useLang } from '../context/LanguageContext';

const LANGS = [
  { code: 'ar', label: 'AR' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'no', label: 'NO' },
];

export default function Header() {
  const profile = getCurrentProfile();
  const { lang, t, setLang } = useLang();

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
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`font-mono text-[0.65rem] px-1.5 py-0.5 rounded ${
                lang === l.code ? 'bg-gold text-emeraldDeep' : 'text-parchment/50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-parchment/85 items-center">
          <Link to="/about" className="hover:text-goldSoft">{lang === 'ar' ? 'من نحن' : 'About'}</Link>
          <Link to="/aqeedah" className="hover:text-goldSoft">{t.aqeedah}</Link>
          <Link to="/majalis" className="hover:text-goldSoft">{t.majalis}</Link>
          <Link to="/zawaj" className="hover:text-goldSoft">{t.zawaj}</Link>
          <Link to="/new-muslims" className="hover:text-goldSoft">{lang === 'ar' ? 'مسلم جديد' : 'New Muslim'}</Link>
          <Link to="/dawah" className="hover:text-goldSoft">{t.dawah}</Link>
          {profile ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-goldSoft">
                {lang === 'ar' ? 'مرحبًا،' : 'Hi,'} {profile.full_name || (lang === 'ar' ? 'عضو' : 'Member')}
              </span>
              <button
                onClick={() => { logoutLocal(); window.location.href = '/'; }}
                className="text-xs text-parchment/50 hover:text-parchment underline"
              >
                {lang === 'ar' ? 'خروج' : 'Sign out'}
              </button>
            </div>
          ) : (
            <Link to="/join" className="hover:text-goldSoft">{t.joinNav}</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

