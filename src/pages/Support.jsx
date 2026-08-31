import { SUPPORT_LINKS } from '../data/supportConfig';

export default function Support() {
  const hasAnyLink = SUPPORT_LINKS.paypal || SUPPORT_LINKS.buyMeACoffee || SUPPORT_LINKS.bankTransferNote;

  return (
    <div className="px-[6vw] py-16 max-w-2xl mx-auto text-center oil-bg oil-join">
      <span className="font-mono text-xs tracking-[3px] text-maroon uppercase">Support the Platform</span>
      <h2 className="font-display text-3xl text-emeraldDeep mt-3 mb-4">ادعم استمرار المنصة</h2>
      <p className="text-sm text-ink/70 leading-relaxed mb-8">
        هذه المنصة مجانية بالكامل للجميع، ولن نضع أي رسوم على التسجيل أو التعارف الشرعي — هذا خط أحمر
        لن نتجاوزه. لكن استمرارها (استضافة، تطوير، وقت) له تكلفة. إن أردت المساهمة، فهي صدقة جارية
        اختيارية بحتة، لا مقابلًا لأي خدمة.
      </p>

      {hasAnyLink ? (
        <div className="flex flex-col items-center gap-3">
          {SUPPORT_LINKS.paypal && (
            <a href={SUPPORT_LINKS.paypal} target="_blank" rel="noreferrer" className="bg-gold text-emeraldDeep px-8 py-3 rounded font-medium w-full max-w-xs">
              التبرع عبر PayPal
            </a>
          )}
          {SUPPORT_LINKS.buyMeACoffee && (
            <a href={SUPPORT_LINKS.buyMeACoffee} target="_blank" rel="noreferrer" className="border border-gold text-emeraldDeep px-8 py-3 rounded font-medium w-full max-w-xs">
              Buy Me a Coffee
            </a>
          )}
          {SUPPORT_LINKS.bankTransferNote && (
            <p className="text-xs text-ink/50 font-mono mt-2">{SUPPORT_LINKS.bankTransferNote}</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-ink/40 font-mono">
          روابط الدعم لم تُفعَّل بعد من قبل مدير المنصة.
        </p>
      )}

      <p className="text-xs text-ink/40 mt-10 leading-relaxed">
        "مَن سَنَّ فِي الْإِسْلَامِ سُنَّةً حَسَنَةً فَلَهُ أَجْرُهَا وَأَجْرُ مَنْ عَمِلَ بِهَا بَعْدَهُ" — رواه مسلم
      </p>
    </div>
  );
}
