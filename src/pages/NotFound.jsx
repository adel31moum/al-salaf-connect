import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-6">
      <div>
        <h2 className="font-display text-3xl text-emeraldDeep mb-3">الصفحة غير موجودة</h2>
        <p className="text-sm text-ink/60 mb-6">
          الرابط الذي فتحته غير صحيح أو لم يعد متاحًا.
        </p>
        <Link to="/" className="bg-gold text-emeraldDeep px-6 py-3 rounded font-medium inline-block">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
