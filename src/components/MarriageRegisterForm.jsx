import { useState } from 'react';
import { saveMarriageProfile } from '../lib/localBackend';
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
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = () => {
    // فحص السياسة الشرعية نفسها المطبَّقة في بقية المنصة — لا حقل صورة، ولا تفعيل بلا ولي
    const check = canActivateMarriageProfile({
      guardian_id: form.guardian_name && form.guardian_relation ? 'local-guardian' : null,
      bio_text: form.religious_commitment,
    });

    if (!check.allowed) {
      setErrors(check.errors);
      setSuccess(false);
      return;
    }

    const saved = saveMarriageProfile({
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

    setErrors([]);
    setSuccess(true);
    onCreated?.(saved);
  };

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
        <p className="text-sm font-medium text-emeraldDeep mb-3">بيانات الولي (إلزامية)</p>
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
      </div>

      {errors.length > 0 && (
        <div className="mt-4 text-sm text-maroon bg-maroon/10 border border-maroon/30 rounded p-3">
          {errors.map((e, i) => (
            <p key={i}>• {e}</p>
          ))}
        </div>
      )}

      {success && (
        <div className="mt-4 text-sm text-emeraldDeep bg-gold/10 border border-gold/30 rounded p-3">
          ✅ تم حفظ ملفك محليًا بنجاح، وأصبح ظاهرًا في قائمة الملفات أدناه.
        </div>
      )}

      <button onClick={submit} className="mt-6 bg-gold text-emeraldDeep px-8 py-3 rounded font-medium">
        حفظ الملف
      </button>
    </div>
  );
}
