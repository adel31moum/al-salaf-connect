import { Link } from 'react-router-dom';
import VerseBanner from '../components/VerseBanner';

export default function Home() {
  return (
    <div>
      <section className="relative min-h-[80vh] bg-emeraldDeep text-parchment px-[6vw] py-24 grid md:grid-cols-2 gap-10 items-center overflow-hidden oil-bg oil-home">
        <div className="star-field absolute inset-0 opacity-10 pointer-events-none" />
        <div>
          <span className="font-mono text-xs tracking-[3px] text-goldSoft uppercase">
            Global Salafi Gathering
          </span>
          <h1 className="font-display text-4xl md:text-5xl leading-relaxed mt-4 mb-6">
            ملتقى يجمع أهل <span className="text-gold">السنة والجماعة</span> على منهج السلف الصالح
          </h1>
          <p className="text-parchment/80 leading-loose max-w-md mb-8">
            فضاء رقمي آمن للتعارف العلمي، وطلب العلم الشرعي، والزواج المنضبط بالضوابط الشرعية.
          </p>
          <div className="flex gap-4">
            <Link to="/join" className="bg-gold text-emeraldDeep px-7 py-3 rounded font-medium">
              انضم الآن مجانًا
            </Link>
            <Link to="/aqeedah" className="border border-gold/40 px-7 py-3 rounded">
              تعرّف على المنهج
            </Link>
          </div>
        </div>
        <VerseBanner contextKey="home" />
      </section>
    </div>
  );
}
