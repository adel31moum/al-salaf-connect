import { useState } from 'react';
import VerseBanner from '../components/VerseBanner';
import MarriageSeal from '../components/MarriageSeal';
import MarriageProfileCard from '../components/MarriageProfileCard';
import MarriageRegisterForm from '../components/MarriageRegisterForm';
import { DEMO_MARRIAGE_PROFILES } from '../data/demoMarriageProfiles';
import { listVerifiedMarriageProfiles, listUserMarriageProfiles } from '../lib/localBackend';

const STEPS = [
  { title: 'تسجيل الولي أولًا', body: 'لا يُفعَّل ملف أي أخت إلا بعد تسجيل وليها الشرعي والتحقق من صلة القرابة.' },
  { title: 'ملف بيانات نصي فقط', body: 'الاستمارة نصية بالكامل — بدون أي صور شخصية منشورة.' },
  { title: 'مراجعة الهيئة الشرعية', body: 'لا يظهر أي ملف للآخرين إلا بعد موافقة صريحة من الهيئة — وليس فورًا عند التسجيل.' },
  { title: 'طلب تواصل عبر الولي', body: 'أي رغبة بالتقدّم تُرسَل تلقائيًا إلى ولي الطرفين.' },
  { title: 'محادثة مراقبة بثلاثة أطراف', body: 'لا توجد رسائل ثنائية مباشرة بين الجنسين على الإطلاق.' },
];

export default function Zawaj() {
  const [myProfiles, setMyProfiles] = useState(listUserMarriageProfiles());
  const verifiedProfiles = listVerifiedMarriageProfiles();
  const visibleProfiles = [...verifiedProfiles, ...DEMO_MARRIAGE_PROFILES];
  const myPending = myProfiles.filter((p) => p.guardian_verification_status === 'pending');
  const myRejected = myProfiles.filter((p) => p.guardian_verification_status === 'rejected');

  return (
    <div>
      <div className="dark-entry-band px-[6vw] py-20 text-center">
        <div className="flex justify-center mb-4">
          <MarriageSeal size={96} />
        </div>
        <span className="font-mono text-xs tracking-[3px] text-goldSoft uppercase">Sharia Marriage Covenant</span>
        <h2 className="font-display text-3xl md:text-5xl text-parchment mt-3 mb-2">ميثاق الزواج الشرعي</h2>
        <p className="text-sm text-parchment/70 max-w-md mx-auto leading-relaxed">
          ليست منصة "مواعدة" — بل إجراء رسمي منضبط، يبدأ وينتهي بإشراف الأولياء ومراجعة الهيئة الشرعية.
        </p>
      </div>

      <div className="px-[6vw] py-16 oil-bg oil-zawaj">
        <div className="max-w-3xl mx-auto covenant-frame bg-parchment/70 p-10 md:p-12">
          <VerseBanner contextKey="zawaj" />
          <div className="mt-10">
            {STEPS.map((s, idx) => (
              <div key={s.title} className="flex gap-4 py-5 border-b border-gold/20 last:border-b-0">
                <div className="font-mono text-maroon text-sm min-w-[28px]">{String(idx + 1).padStart(2, '0')}</div>
                <div>
                  <h4 className="font-medium text-emeraldDeep">{s.title}</h4>
                  <p className="text-sm text-ink/60 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-gold/30 text-center">
            <p className="font-mono text-[0.65rem] tracking-widest text-maroon uppercase mb-4">الأساس الشرعي</p>
            <VerseBanner contextKey="zawaj_guardian" />
          </div>
        </div>

        <div className="mt-20">
          <MarriageRegisterForm onCreated={() => setMyProfiles(listUserMarriageProfiles())} />
        </div>

        {myPending.length > 0 && (
          <div className="max-w-2xl mx-auto mt-8 bg-maroon/10 border border-maroon/30 rounded p-5 text-sm text-maroon">
            ملفك ({myPending.map((p) => p.kunya).join('، ')}) بانتظار مراجعة الهيئة الشرعية — لن يظهر للآخرين حتى تتم الموافقة.
          </div>
        )}
        {myRejected.length > 0 && (
          <div className="max-w-2xl mx-auto mt-4 bg-ink/5 border border-ink/20 rounded p-6 text-sm text-ink/70 space-y-3">
            <p>للأسف، لم تتم الموافقة على أحد ملفاتك. راجع ملاحظة الهيئة إن وُجدت، ويمكنك التسجيل مجددًا ببيانات أدق.</p>
            <p className="text-xs text-ink/50 leading-relaxed border-t border-ink/10 pt-3">
              هذا لا يعني انتهاء الطريق — التعارف الشرعي المباشر عبر مسجدك المحلي يبقى دومًا الخيار
              الأوسع والأكثر مرونة، ولا يعتمد على أي منصة إلكترونية. تواصل مع إمام أو مركز إسلامي
              قريب منك لعرض حالتك عليه مباشرة.
            </p>
          </div>
        )}

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-mono text-xs tracking-[3px] text-maroon uppercase">Verified Profiles</span>
            <h3 className="font-display text-2xl text-emeraldDeep mt-2">الملفات المتاحة (بعد المراجعة)</h3>
            <p className="text-xs text-ink/50 mt-1">
              لا يظهر هنا إلا ما وافقت عليه الهيئة الشرعية فعليًا، بجانب نماذج تجريبية خيالية لتوضيح شكل التجربة.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProfiles.map((p) => (
              <MarriageProfileCard key={p.id} profile={p} />
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-ink/40 font-mono mt-14 max-w-xl mx-auto">
          هذه الضوابط مُطبَّقة على مستوى قاعدة البيانات نفسها عند الترقية لخادم حقيقي (RLS) — لا يمكن تجاوزها من الواجهة تحت أي ظرف.
        </p>
      </div>
    </div>
  );
}
