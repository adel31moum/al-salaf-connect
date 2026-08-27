import { useState } from 'react';
import { Link } from 'react-router-dom';
import VerseBanner from '../components/VerseBanner';
import { askDawahAI, isSupabaseConfigured } from '../lib/backend';

const STARTER = {
  role: 'assistant',
  text:
    'السلام عليكم / Hello / Bonjour / Hei — أنا مساعد آلي (لست عالِمًا بشريًا)، اسألني أي سؤال عن الإسلام بلغتك. ' +
    'تنويه للشفافية: قد تُراجَع بعض المحادثات بشريًا بشكل عشوائي لضمان الجودة والالتزام بالضوابط.',
};

export default function Dawah() {
  const [messages, setMessages] = useState([STARTER]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setSending(true);

    // الطبقة الهجينة تتولى الأمر بالكامل: ذكاء اصطناعي حقيقي إن كان مفعَّلًا، وإلا رد محلي فوري —
    // لا حاجة لأي تعديل هنا لاحقًا عند تفعيل Supabase.
    const { reply } = await askDawahAI(userMsg.text, history);
    setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    setSending(false);
  };

  return (
    <div className="px-[6vw] py-16 bg-maroon text-parchment min-h-[70vh] oil-bg oil-dawah">
      <VerseBanner contextKey="dawah" />
      <div className="flex items-center gap-3 mt-10 mb-8">
        <h2 className="font-display text-3xl">مساعد الدعوة الذكي</h2>
        <span
          className={`text-[0.65rem] font-mono px-2 py-1 rounded border ${
            isSupabaseConfigured ? 'border-gold text-goldSoft' : 'border-parchment/30 text-parchment/50'
          }`}
        >
          {isSupabaseConfigured ? 'وضع مباشر (AI حقيقي)' : 'وضع محلي تجريبي'}
        </span>
      </div>
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

        {/* جسر لطيف وغير ملحّ — يظهر فقط بعد تبادل حقيقي، لا من أول رسالة */}
        {messages.length >= 4 && (
          <div className="pt-2 text-xs text-parchment/60 text-center">
            إن أردت القراءة أكثر بلا أي التزام أو تسجيل:{' '}
            <Link to="/new-muslims" className="text-goldSoft underline">
              صفحة مخصصة لمن هم في بداية الطريق
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
