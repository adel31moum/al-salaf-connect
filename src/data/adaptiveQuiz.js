/**
 * المسار العلمي التكيفي (Adaptive Ilm Path)
 * -------------------------------------------
 * 5 أسئلة تشخيصية قصيرة (وليست استبيان تقييم ذاتي) تحدد المستوى الفعلي والثغرات المحددة،
 * ثم تُبنى توصية مسار شخصي بناءً على النتيجة — لا تخمينًا عامًا.
 */

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1',
    topic: 'aqeedah',
    prompt: 'كم عدد أركان الإسلام؟',
    options: [
      { id: 'a', text: '٣', correct: false },
      { id: 'b', text: '٤', correct: false },
      { id: 'c', text: '٥', correct: true },
      { id: 'd', text: '٦', correct: false },
    ],
  },
  {
    id: 'q2',
    topic: 'aqeedah',
    prompt: 'ما المقصود بـ"التوحيد" في العقيدة الإسلامية؟',
    options: [
      { id: 'a', text: 'إفراد الله تعالى بالعبادة وحده لا شريك له', correct: true },
      { id: 'b', text: 'الإيمان بوجود إله واحد فقط دون تفصيل', correct: false },
      { id: 'c', text: 'اتباع مذهب فقهي واحد', correct: false },
      { id: 'd', text: 'الانتماء لجماعة دينية معينة', correct: false },
    ],
  },
  {
    id: 'q3',
    topic: 'manhaj',
    prompt: 'من هم "السلف الصالح" المقصودون في منهج المنصة؟',
    options: [
      { id: 'a', text: 'كل عالم مسلم عبر التاريخ', correct: false },
      { id: 'b', text: 'الصحابة والتابعون وتابعوهم بإحسان', correct: true },
      { id: 'c', text: 'علماء القرن الماضي فقط', correct: false },
      { id: 'd', text: 'مؤسسو المذاهب الفقهية الأربعة حصرًا', correct: false },
    ],
  },
  {
    id: 'q4',
    topic: 'fiqh',
    prompt: 'ما حكم الصلوات الخمس المفروضة على كل مسلم بالغ عاقل؟',
    options: [
      { id: 'a', text: 'مستحبة وليست واجبة', correct: false },
      { id: 'b', text: 'فرض عين', correct: true },
      { id: 'c', text: 'فرض كفاية', correct: false },
      { id: 'd', text: 'تختلف حسب البلد', correct: false },
    ],
  },
  {
    id: 'q5',
    topic: 'usul',
    prompt: 'ما المصدر الأول للتشريع الإسلامي؟',
    options: [
      { id: 'a', text: 'إجماع العلماء المعاصرين', correct: false },
      { id: 'b', text: 'القرآن الكريم', correct: true },
      { id: 'c', text: 'العرف المحلي', correct: false },
      { id: 'd', text: 'أقوال المشايخ المعاصرين', correct: false },
    ],
  },
];

const TOPIC_LABELS = {
  aqeedah: 'أساسيات العقيدة',
  manhaj: 'منهج التلقي (فهم السلف)',
  fiqh: 'الفقه العملي',
  usul: 'أصول التشريع',
};

/**
 * يحسب النتيجة والثغرات المحددة ويبني توصية مسار شخصي.
 * answers: { q1: 'c', q2: 'a', ... }
 */
export function scoreDiagnostic(answers) {
  let correctCount = 0;
  const gaps = [];

  DIAGNOSTIC_QUESTIONS.forEach((q) => {
    const chosen = answers[q.id];
    const correctOption = q.options.find((o) => o.correct);
    const isCorrect = chosen === correctOption?.id;
    if (isCorrect) {
      correctCount += 1;
    } else if (chosen) {
      gaps.push(q.topic);
    }
  });

  let level;
  let recommendedTracks;
  if (correctCount <= 2) {
    level = 'beginner';
    recommendedTracks = ['aqeedah_basics_intensive', 'manhaj_intro'];
  } else if (correctCount <= 4) {
    level = 'intermediate';
    recommendedTracks = ['majalis_advanced', 'fiqh_seminars'];
  } else {
    level = 'advanced';
    recommendedTracks = ['scholar_verification_form', 'advanced_seminars'];
  }

  const uniqueGaps = [...new Set(gaps)];
  const gapLabels = uniqueGaps.map((g) => TOPIC_LABELS[g] || g);

  return {
    correctCount,
    total: DIAGNOSTIC_QUESTIONS.length,
    level,
    recommendedTracks,
    gaps: uniqueGaps,
    gapLabels,
  };
}
