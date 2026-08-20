// شارة هندسية بديلة عن الصورة الشخصية — بلا أي تصوير آدمي إطلاقًا، بمربّع/معين زخرفي ملوّن فقط.
export default function GenderGlyph({ gender = 'male', size = 48 }) {
  const color = gender === 'female' ? '#6B1F2A' : '#0E3B2E';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="40" rx="4" fill="none" stroke="#C69A45" strokeWidth="1.2" transform="rotate(45 24 24)" />
      <rect x="12" y="12" width="24" height="24" rx="2" fill={color} opacity="0.85" transform="rotate(45 24 24)" />
      <circle cx="24" cy="24" r="4" fill="#C69A45" />
    </svg>
  );
}
