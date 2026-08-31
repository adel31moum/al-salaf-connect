import { useState } from 'react';
import VerseBanner from '../components/VerseBanner';
import { saveGuardianEscalation } from '../lib/localBackend';

export default function NewMuslims() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const requestMentor = () => {
    // نعيد استخدام نفس قائمة المراجعة الجماعية (لا فرد بعينه) لطلبات التأهيل والتوجيه أيضًا
    saveGuardianEscalation({
      kunya: name || 'مسلم جديد',
      country: '',
      religious_commitment: message,
      note: 'طلب تأهيل ومرافقة لمسلم جديد — بانتظار تعيين مرافق مناسب من الهيئة.',
    });
    setSent(true);
  };

  return (
    <div className="px-[6vw] py-16 max-w-3xl mx-auto">
      <VerseBanner contextKey="dawah" />

      <h2 className="font-display text-3xl text-emeraldDeep mt-10 mb-2">ركن تلقين الشهادتين وتأهيل المسلمين الجدد</h2>
      <p className="text-sm text-ink/60 leading-relaxed mb-10">
        إن كنت تفكر في الدخول إلى الإسلام، أو دخلته حديثًا وتحتاج مرافقة، هذا الركن لك خصيصًا.
      </p>

      <div className="covenant-frame bg-parchment/70 p-8 mb-10">
        <h3 className="font-display text-xl text-emeraldDeep mb-3">الشهادتان</h3>
        <p className="text-sm text-ink/70 leading-relaxed mb-4">
          الدخول في الإسلام يكون بنطق الشهادتين بيقين القلب: أن تشهد ألّا إله إلا الله وحده لا شريك له،
          وأن محمدًا صلى الله عليه وسلم عبده ورسوله. لا يُشترط شاهد ولا مكان معيّن — لكن يُستحب أن يكون
          ذلك بحضور من يعينك على تعلّم أساسيات دينك بعدها.
        </p>
        <div className="bg-emeraldDeep text-parchment rounded p-5 text-center font-display text-lg leading-loose">
          أشهدُ أن لا إله إلا الله، وأشهدُ أنّ محمدًا رسول الله
        </div>
      </div>

      <div className="covenant-frame bg-parchment/70 p-8">
        <h3 className="font-display text-xl text-emeraldDeep mb-3">اطلب مرافقًا يساعدك في الخطوات الأولى</h3>
        <p className="text-xs text-ink/50 mb-4">
          يذهب طلبك لقائمة مراجعة جماعية تابعة للهيئة الشرعية، لتعيين المرافق الأنسب — وليس لأي فرد بعينه.
        </p>
        {sent ? (
          <p className="text-sm text-emeraldDeep bg-gold/10 border border-gold/30 rounded p-4">
            ✅ تم إرسال طلبك. سيتواصل معك أحد المرافقين المعتمدين قريبًا بإذن الله.
          </p>
        ) : (
          <>
            <input
              className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent mb-3"
              placeholder="اسمك (أو أي اسم تفضّل استخدامه الآن)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent mb-4"
              placeholder="أخبرنا قليلًا عن وضعك وما تحتاج مساعدة فيه"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={requestMentor} className="bg-gold text-emeraldDeep px-6 py-3 rounded font-medium">
              إرسال الطلب
            </button>
          </>
        )}
      </div>
    </div>
  );
}
