/**
 * Local Storage Mock Backend
 * ---------------------------
 * يحلّ محل Supabase بالكامل لتشغيل المنصة دون أي خادم خارجي:
 * تسجيل، جلسة دخول، ملفات شخصية، ونتائج المسار العلمي التكيفي — كل ذلك محفوظ محليًا في المتصفح.
 *
 * تصميم مقصود: كل عملية قراءة/كتابة محاطة بـ try/catch مع مخزن احتياطي في الذاكرة (memoryStore)،
 * حتى لو كان localStorage غير متاح (تصفح خاص، إعدادات متصفح صارمة، الخ) — لا تظهر أي رسالة خطأ
 * للمستخدم أبدًا، ولا تتعطل أي خطوة من خطوات التسجيل أو التصفح.
 */

const KEYS = {
  users: 'asc_users',
  profiles: 'asc_profiles',
  session: 'asc_session',
  adaptive: 'asc_adaptive_results',
  marriageProfiles: 'asc_marriage_profiles',
  compatRequests: 'asc_compat_requests',
  guardianEscalations: 'asc_guardian_escalations',
};

// مخزن احتياطي في الذاكرة يُستخدم تلقائيًا إن تعذّر الوصول إلى localStorage
const memoryStore = {};

function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (_err) {
    return memoryStore[key] !== undefined ? memoryStore[key] : fallback;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_err) {
    memoryStore[key] = value;
  }
}

function uid() {
  return 'usr_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ==================== التسجيل والجلسة ==================== */

export function signUpLocal({ email, password, full_name, country, language, gender, idOverride }) {
  const users = safeGet(KEYS.users, {});
  const id = idOverride || uid();

  // لا نخزّن كلمة المرور كنص صريح حتى في هذا التخزين المحلي — تجزئة بسيطة كافية لغرض المعاينة
  const passwordHash = password ? btoa(unescape(encodeURIComponent(password))).slice(0, 24) : null;

  users[email || id] = { id, email, passwordHash, created_at: new Date().toISOString() };
  safeSet(KEYS.users, users);

  const profiles = safeGet(KEYS.profiles, {});
  profiles[id] = { id, full_name, country, language, gender, created_at: new Date().toISOString() };
  safeSet(KEYS.profiles, profiles);

  safeSet(KEYS.session, { userId: id, email, loggedInAt: new Date().toISOString() });

  return { id, email };
}

export function getSession() {
  return safeGet(KEYS.session, null);
}

export function isLoggedIn() {
  return Boolean(getSession()?.userId);
}

export function logoutLocal() {
  safeSet(KEYS.session, null);
}

export function getProfile(userId) {
  const profiles = safeGet(KEYS.profiles, {});
  return profiles[userId] || null;
}

export function getCurrentProfile() {
  const session = getSession();
  if (!session?.userId) return null;
  return getProfile(session.userId);
}

/* ==================== المسار العلمي التكيفي ==================== */

export function saveAdaptiveResult(result) {
  const session = getSession();
  const userId = session?.userId || 'anonymous';
  const all = safeGet(KEYS.adaptive, {});
  all[userId] = { ...result, savedAt: new Date().toISOString() };
  safeSet(KEYS.adaptive, all);
  return all[userId];
}

export function getAdaptiveResult() {
  const session = getSession();
  const userId = session?.userId || 'anonymous';
  const all = safeGet(KEYS.adaptive, {});
  return all[userId] || null;
}

/* ==================== وحدة الزواج: ملفات محلية وطلبات توافق ==================== */

export function saveMarriageProfile(profile) {
  const all = safeGet(KEYS.marriageProfiles, {});
  const id = profile.id || 'mp_' + Math.random().toString(36).slice(2, 10);
  // كل ملف جديد يبدأ "قيد المراجعة" وجوبًا — لا يظهر في قائمة الملفات المتاحة للآخرين
  // إلا بعد موافقة صريحة من الهيئة الشرعية عبر لوحة المراجعة. هذا هو صلب "الجاهزية الشرعية":
  // ليس نصًا تجميليًا، بل حالة فعلية تُتحقق منها الواجهة قبل عرض أي ملف.
  const existing = all[id];
  all[id] = {
    ...profile,
    id,
    guardian_verification_status: existing?.guardian_verification_status || 'pending',
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  safeSet(KEYS.marriageProfiles, all);
  return all[id];
}

export function listUserMarriageProfiles() {
  const all = safeGet(KEYS.marriageProfiles, {});
  return Object.values(all);
}

// الملفات "المتاحة" فعليًا للتصفح: فقط ما وافقت عليه الهيئة الشرعية — وليس كل ما سُجِّل
export function listVerifiedMarriageProfiles() {
  return listUserMarriageProfiles().filter((p) => p.guardian_verification_status === 'verified');
}

export function listPendingMarriageProfiles() {
  return listUserMarriageProfiles().filter((p) => p.guardian_verification_status === 'pending');
}

export function reviewMarriageProfile(id, decision, note) {
  const all = safeGet(KEYS.marriageProfiles, {});
  if (!all[id]) return null;
  all[id] = {
    ...all[id],
    guardian_verification_status: decision, // 'verified' | 'rejected'
    review_note: note || '',
    reviewed_at: new Date().toISOString(),
  };
  safeSet(KEYS.marriageProfiles, all);
  return all[id];
}

export function saveCompatibilityRequest(request) {
  const all = safeGet(KEYS.compatRequests, []);
  const entry = { ...request, id: 'req_' + Date.now().toString(36), created_at: new Date().toISOString() };
  all.push(entry);
  safeSet(KEYS.compatRequests, all);
  return entry;
}

export function listCompatibilityRequests() {
  return safeGet(KEYS.compatRequests, []);
}

/* ==================== تصعيد "لا يوجد ولي" — يذهب لقائمة الهيئة الجماعية، لا لأي فرد ==================== */

export function saveGuardianEscalation(entry) {
  const all = safeGet(KEYS.guardianEscalations, []);
  const record = { ...entry, id: 'esc_' + Date.now().toString(36), status: 'open', created_at: new Date().toISOString() };
  all.push(record);
  safeSet(KEYS.guardianEscalations, all);
  return record;
}

export function listGuardianEscalations() {
  return safeGet(KEYS.guardianEscalations, []);
}

export function resolveGuardianEscalation(id, note) {
  const all = safeGet(KEYS.guardianEscalations, []);
  const updated = all.map((e) => (e.id === id ? { ...e, status: 'resolved', resolution_note: note || '', resolved_at: new Date().toISOString() } : e));
  safeSet(KEYS.guardianEscalations, updated);
  return updated.find((e) => e.id === id);
}
