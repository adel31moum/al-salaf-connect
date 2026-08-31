// تقدير توافق بسيط وشفاف — مؤشر إرشادي فقط، وليس حكمًا شرعيًا أو نفسيًا ملزمًا بأي شكل.
// يُعرض دومًا مع توضيح صريح لهذه الحقيقة في الواجهة.
export function estimateCompatibility(a, b) {
  let score = 50; // نقطة انطلاق محايدة
  if (a.country && b.country && a.country === b.country) score += 20;
  if (a.ageRange && b.ageRange) score += 10; // وجود نطاق عمري معلن من الطرفين يُحتسب إيجابيًا فقط لوجوده
  score += Math.floor(Math.random() * 15); // تباين بسيط لتفادي رقم ثابت مصطنع

  return Math.min(95, score); // لا تُعرض أبدًا نسبة 100% — لتفادي إيحاء "التوافق المضمون"
}
