import { useState } from 'react';
import { saveMarriageProfile } from '../lib/backend';
import { saveGuardianEscalation } from '../lib/localBackend';
import { canActivateMarriageProfile } from '../policies/shariaPolicyEngine';

export default function MarriageRegisterForm({ onCreated }) {
  const [form, setForm] = useState({
    kunya: '',
    gender: 'male',
    country: '',
    ageRange: '',
    religious_commitment: '',
    seeking_description: '',
    guardian_name: '',
    guardian_relation: '',
    noGuardian: false,
    pledgeAccepted: false,
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setBool = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.checked }));

  const submit = async () => {
    const localErrors = [];
    if (!form.pledgeAccepted) {
      localErrors.push('يجب الموافقة على تعهد الجدية والمصداقية قبل المتابعة.');
    }

    // حالة "لا يوجد ولي": لا تفعيل تلقائي بديل، ولا توجيه لأي فرد — تصعيد لقائمة مراجعة
    // الهيئة الشرعية الجماعية فقط، ليقرروا آلية دعم مناسبة (وليّ مؤقت من الهيئة، إحالة لمركز إسلامي محلي...).
    if (form.gender === 'female' && form.noGuardian) {
      if (localErrors.length > 0) {
        setErrors(localErrors);
        return;
      }
      saveGuardianEscalation({
        kunya: form.kunya || 'أخت مسجّلة',
        country: form.country,
        religious_commitment: form.religious_commitment,
        note: 'طلب "لا يوجد ولي" — بانتظار قرار الهيئة الشرعية الجماعية بشأن آلية الدعم المناسبة.',
      });
      setErrors([]);
      setEscalated(true);
      return;
    }

    const check = canActivateMarriageProfile({
      guardian_id: form.guardian_name && form.guardian_relation ? 'local-guardian' : null,
      bio_text: form.religious_commitment,
    });
    if (!check.allowed) localErrors.push(...check.errors);

    if (localErrors.length > 0) {
      setErrors(localErrors);
      setSuccess(false);
      return;
    }

    setSaving(true);
    const saved = await saveMarriageProfile({
      kunya: form.kunya || 'عضو جديد',
      gender: form.gender,
      country: form.country,
      ageRange: form.ageRange,
      religious_commitment: form.religious_commitment,
      seeking_description: form.seeking_description,
      guardian_name: form.guardian_name,
      guardian_relation: form.guardian_relation,
      isDemo: false,
    });
    setSaving(false);
    setErrors([]);
    setSuccess(true);
    onCreated?.(saved);
  };

  if (escalated) {
    return (
      <div className="covenant-frame bg-parchment/70 p-8 md:p-10 max-w-2xl mx-auto text-center">
        <h3 className="font-display text-xl text-emeraldDeep mb-3">تم استلام طلبك</h3>
        <p className="text-sm text-ink/70 leading-relaxed">
          حالتك الآن أمام الهيئة الشرعية الجماعية للمنصة (وليست موجَّهة لأي فرد بعينه)، لتقرر آلية الدعم
          المناسبة لك — وليًا مؤقتًا من الهيئة، أو إحالة لمركز إسلامي محلي موثوق. سيتم التواصل معك قريبًا.
        </p>
      </div>
    );
  }

  return (
    <div className="covenant-frame bg-parchment/70 p-8 md:p-10 max-w-2xl mx-auto">
      <h3 className="font-display text-2xl text-emeraldDeep mb-1">استمارة التسجيل في وحدة الزواج</h3>
      <p className="text-xs text-ink/50 mb-6">نصية بالكامل — لا يوجد ولن يوجد حقل صورة في هذه الاستمارة إطلاقًا.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="border border-gold/40 rounded px-4 py-3 bg-transparent"
          placeholder="الكنية أو الاسم الظاهر (مثال: أبو عبد الله)"
          value={form.kunya}
          onChange={set('kunya')}
        />
        <select
          className="border border-gold/40 rounded px-4 py-3 bg-transparent"
          value={form.gender}
          onChange={set('gender')}
        >
          <option value="male">أخ</option>
          <option value="female">أخت</option>
        </select>
        <input
          className="border border-gold/40 rounded px-4 py-3 bg-transparent"
          placeholder="البلد"
          value={form.country}
          onChange={set('country')}
        />
        <input
          className="border border-gold/40 rounded px-4 py-3 bg-transparent"
          placeholder="الفئة العمرية (مثال: 25-30)"
          value={form.ageRange}
          onChange={set('ageRange')}
        />
      </div>

      <textarea
        className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent mt-4"
        placeholder="وصف الالتزام الديني (20 حرفًا على الأقل)"
        rows={3}
        value={form.religious_commitment}
        onChange={set('religious_commitment')}
      />
      <textarea
        className="w-full border border-gold/40 rounded px-4 py-3 bg-transparent mt-4"
        placeholder="ماذا تبحث/تبحثين عنه في شريك الحياة؟"
        rows={3}
        value={form.seeking_description}
        onChange={set('seeking_description')}
      />

      <div className="mt-6 pt-6 border-t border-gold/30">
        <p className="text-sm font-medium text-emeraldDeep mb-3">بيانات الولي</p>

        {form.gender === 'female' && (
          <label className="flex items-center gap-2 text-sm text-ink/70 mb-3">
            <input type="checkbox" checked={form.noGuardian} onChange={setBool('noGuardian')} />
            ليس لدي ولي شرعي متاح حاليًا
          </label>
        )}

        {!(form.gender === 'female' && form.noGuardian) && (
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border border-gold/40 rounded px-4 py-3 bg-transparent"
              placeholder="اسم الولي"
              value={form.guardian_name}
              onChange={set('guardian_name')}
            />
            <input
              className="border border-gold/40 rounded px-4 py-3 bg-transparent"
              placeholder="صلة القرابة (أب / أخ / عم...)"
              value={form.guardian_relation}
              onChange={set('guardian_relation')}
            />
          </div>
        )}
      </div>

      <label className="flex items-start gap-2 text-xs text-ink/70 mt-6 pt-6 border-t border-gold/30 leading-relaxed">
        <input
          type="checkbox"
          checked={form.pledgeAccepted}
          onChange={setBool('pledgeAccepted')}
          className="mt-0.5"
        />
        <span>
          أتعهد بالجدية والصدق في جميع البيانات المُدخلة، وأعلم أن ثبوت خلاف ذلك (بيانات وهمية، انتحال
          صفة، إساءة استخدام) يعرّض حسابي للشطب النهائي دون إشعار مسبق.
        </span>
      </label>

      {errors.length > 0 && (
        <div className="mt-4 text-sm text-maroon bg-maroon/10 border border-maroon/30 rounded p-3">
          {errors.map((e, i) => (
            <p key={i}>• {e}</p>
          ))}
        </div>
      )}

      {success && (
        <div className="mt-4 text-sm text-emeraldDeep bg-gold/10 border border-gold/30 rounded p-3">
          ✅ تم حفظ ملفك وإرساله لمراجعة الهيئة الشرعية. لن يظهر لبقية الزوار إلا بعد الموافقة —
          راقب الحالة أسفل هذا القسم.
        </div>
      )}

      <button
        onClick={submit}
        disabled={saving}
        className="mt-6 bg-gold text-emeraldDeep px-8 py-3 rounded font-medium disabled:opacity-60"
      >
        {saving ? 'جارٍ الحفظ...' : 'حفظ الملف'}
      </button>
    </div>
  );
}
