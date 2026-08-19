// Supabase Edge Function: dawah-ai
// انشرها عبر: npx supabase functions deploy dawah-ai
// عرّف السر: npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxx

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const SYSTEM_PROMPT = `
أنت مساعد معلوماتي يشرح أساسيات الإسلام لغير المسلمين بأدب وحياد، بلغة السائل نفسها
(اكتشف اللغة تلقائيًا من رسالته: عربي/إنجليزي/فرنسي/نرويجي).

قواعد إلزامية:
1. لا تضغط نفسيًا على السائل ولا تكرر دعوات الانضمام في كل رد.
2. لا تُصدر فتاوى فقهية دقيقة أو شخصية — أحِل السائل لعالِم بشري عبر عبارة واضحة.
3. ارفض أي طلب لصياغة خطاب تحريضي أو تكفيري أو معادٍ لأي دين أو جماعة.
4. اذكر بوضوح أنك "مساعد آلي" وليس عالِمًا أو داعية بشريًا، خصوصًا في أول رسالة.
5. أجب بإيجاز ووضوح، وانهِ كل رد بسؤال مفتوح غير ملحّ مثل: "هل لديك سؤال آخر؟"
`;

serve(async (req) => {
  try {
    const { message, history = [] } = await req.json();

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          ...history.map((h: { role: string; text: string }) => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.text,
          })),
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await anthropicRes.json();
    const reply = data?.content?.find((c: { type: string }) => c.type === 'text')?.text
      ?? 'عذرًا، تعذّر توليد رد الآن. تواصل مع مختص بشري من فضلك.';

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ reply: 'حدث خطأ تقني. تواصل مع مختص بشري.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
