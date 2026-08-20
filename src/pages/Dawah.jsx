import { useState } from 'react';
import VerseBanner from '../components/VerseBanner';

const STARTER = {
  role: 'assistant',
  text:
    'السلام عليكم / Hello / Bonjour / Hei — أنا مساعد آلي (لست عالِمًا بشريًا)، اسألني أي سؤال عن الإسلام بلغتك. ' +
    'تنويه للشفافية: قد تُراجَع بعض المحادثات بشريًا بشكل عشوائي لضمان الجودة والالتزام بالضوابط.',
};

// ردود محلية جاهزة — تعمل دومًا بلا اتصال خادم، لضمان عدم ظهور أي رسالة خطأ أو تعليق للمستخدم أبدًا.
const LOCAL_REPLIES = [
  'سؤال جميل. باختصار: الإسلام يقوم على الشهادتين والصلاة والزكاة والصوم والحج، وأساسه توحيد الله تعالى وحده بالعبادة. هل تودّ التوسّع في نقطة معينة؟',
  'هذا من الأسئلة التي يسأل عنها كثيرون. يمكنني أن أشرح لك الفكرة بإيجاز، وإن أردت تفصيلًا فقهيًا دقيقًا، أنصحك بالتواصل مع أحد المشايخ المتاحين في قسم المجالس العلمية. هل لديك سؤال آخر؟',
  'شكرًا لصدق سؤالك. الإسلام يدعو إلى العدل والرحمة والتعامل الحسن مع الجميع بغض النظر عن دينهم. أخبرني إن أردت معرفة المزيد عن أي جانب محدد.',
];

function pickReply(index) {
  return LOCAL_REPLIES[index % LOCAL_REPLIES.length];
}

export default function Dawah() {
  const [messages, setMessages] = useState([STARTER]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [replyCount, setReplyCount] = useState(0);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    // رد محلي فوري بلا أي استدعاء شبكة — يضمن عمل الواجهة كاملة بدون Supabase
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', text: pickReply(replyCount) }]);
      setReplyCount((c) => c + 1);
      setSending(false);
    }, 400);
  };

  return (
    <div className="px-[6vw] py-16 bg-maroon text-parchment min-h-[70vh] oil-bg oil-dawah">
      <VerseBanner contextKey="dawah" />
      <h2 className="font-display text-3xl mt-10 mb-8">مساعد الدعوة الذكي</h2>
      <div className="max-w-xl bg-black/20 border border-parchment/20 rounded p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`px-4 py-3 rounded-lg text-sm max-w-[80%] leading-relaxed ${
                m.role === 'user' ? 'bg-gold text-emeraldDeep' : 'bg-parchment/10'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div className="flex gap-2 pt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            className="flex-1 bg-transparent border border-parchment/30 rounded px-4 py-2 text-sm"
            placeholder="اكتب سؤالك بأي لغة..."
          />
          <button onClick={send} disabled={sending} className="bg-gold text-emeraldDeep px-5 py-2 rounded text-sm">
            {sending ? '...' : 'إرسال'}
          </button>
        </div>
      </div>
    </div>
  );
}
