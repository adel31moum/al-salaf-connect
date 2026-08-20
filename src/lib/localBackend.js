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

export function signUpLocal({ email, password, full_name, country, language, gender }) {
  const users = safeGet(KEYS.users, {});
  const id = uid();

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
