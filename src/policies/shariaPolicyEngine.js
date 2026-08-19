/**
 * محرك السياسات الشرعية (Sharia Policy Engine)
 * ------------------------------------------------
 * تصميم مقصود ومهم: هذا الملف لا "يفتي" ولا يتخذ قرارات فقهية اجتهادية بنفسه.
 * هو فقط يُنفّذ قواعد صريحة سبق أن أقرّتها الهيئة الشرعية (راجع blueprint.md § 6)
 * كنصوص برمجية ثابتة. أي حالة غامضة أو جديدة تُحال تلقائيًا لمراجعة بشرية
 * (flagForHumanReview) بدل أن يقرر الكود نيابة عن العلماء.
 *
 * هذا الملف هو "المدير الآلي" الذي يمنع تفعيل أي ميزة تخالف القواعد،
 * لكنه ليس مصدر التشريع — العلماء هم المصدر، والكود هو التنفيذ فقط.
 */

// 1) هل يجوز تفعيل ملف تعارف زواج؟
export function canActivateMarriageProfile(profile) {
  const errors = [];
  if (!profile.guardian_id) errors.push('لا يمكن تفعيل الملف بدون تسجيل ولي شرعي معتمد.');
  if (profile.photo_url) errors.push('الحقل غير مسموح به شرعًا في هذه الوحدة — يجب حذف أي صورة.');
  if (!profile.bio_text || profile.bio_text.trim().length < 20)
    errors.push('يلزم وصف نصي كافٍ (20 حرفًا على الأقل) بدل الاعتماد على الصور.');
  return { allowed: errors.length === 0, errors };
}

// 2) هل يجوز إنشاء غرفة محادثة تخص وحدة الزواج؟
export function canCreateGuardianChatRoom(participantIds) {
  if (!Array.isArray(participantIds) || participantIds.length < 3) {
    return {
      allowed: false,
      reason: 'يُمنع إنشاء أي غرفة محادثة ثنائية بين الجنسين في وحدة الزواج — يلزم حضور وليّ واحد على الأقل.',
    };
  }
  return { allowed: true };
}

// 3) تصنيف محتوى منشور بالمنصة قبل نشره تلقائيًا (تصفية أولية فقط، وليست حكمًا نهائيًا)
const HARD_BLOCK_PATTERNS = [
  /تكفير/i,
  /دعوة\s*(إلى|الى)?\s*العنف/i,
  /تحريض/i,
  /incitement/i,
  /violence/i,
];

export function prescreenPost(text) {
  const flagged = HARD_BLOCK_PATTERNS.some((pattern) => pattern.test(text));
  if (flagged) {
    return flagForHumanReview(text, 'تطابق مع نمط محظور صراحةً (تحريض/تكفير) — يُحجب مؤقتًا حتى مراجعة المشرف.');
  }
  return { status: 'published' };
}

export function flagForHumanReview(content, reason) {
  return {
    status: 'pending_human_review',
    reason,
    note: 'لا يُتخذ قرار الحذف أو القبول النهائي إلا من قبل عضو في الهيئة الشرعية، لا من الكود وحده.',
  };
}

// 4) توجيه ذكي بحسب بيانات التسجيل — هذا هو "المدير الآلي" في التوجيه فقط، وليس في الفتوى
export function routeNewMember(registration) {
  const { country, language, knowledgeLevel, gender, interests = [] } = registration;

  const route = {
    locale: language || 'ar',
    landingPage: 'home',
    suggestedTracks: [],
  };

  // التوجيه اللغوي أولًا
  if (!['ar', 'en', 'fr', 'no'].includes(route.locale)) route.locale = 'en';

  // التوجيه حسب مستوى العلم
  if (knowledgeLevel === 'beginner') {
    route.suggestedTracks.push('aqeedah_basics', 'dawah_faq');
  } else if (knowledgeLevel === 'student') {
    route.suggestedTracks.push('majalis_advanced', 'fiqh_seminars');
  } else if (knowledgeLevel === 'scholar_track') {
    route.suggestedTracks.push('scholar_verification_form');
  }

  // التوجيه حسب الاهتمامات المصرَّح بها من المستخدم نفسه (لا افتراضات غير معلنة)
  if (interests.includes('marriage')) route.suggestedTracks.push('zawaj_intro');
  if (interests.includes('local_community') && country) route.suggestedTracks.push(`community_${country}`);
  if (interests.includes('charity')) route.suggestedTracks.push('takaful_fund');

  // بوابة الجنس: توجّه فقط لصفحات عامة، لا فرق في المحتوى العلمي المتاح
  route.landingPage = route.suggestedTracks[0] || 'home';

  return route;
}
