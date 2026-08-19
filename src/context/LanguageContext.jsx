import { createContext, useContext, useState, useEffect } from 'react';

const DICT = {
  ar: {
    dir: 'rtl',
    next: 'التالي', back: 'رجوع', skip: 'تخطّي الآن', join: 'انضم الآن مجانًا',
    home: 'الرئيسية', aqeedah: 'العقيدة', majalis: 'المجالس', zawaj: 'الزواج الشرعي',
    dawah: 'الدعوة', joinNav: 'انضم إلينا', privacy: 'الخصوصية',
  },
  en: {
    dir: 'ltr',
    next: 'Next', back: 'Back', skip: 'Skip for now', join: 'Join Free Now',
    home: 'Home', aqeedah: 'Creed', majalis: 'Sessions', zawaj: 'Marriage',
    dawah: 'Outreach', joinNav: 'Join Us', privacy: 'Privacy',
  },
  fr: {
    dir: 'ltr',
    next: 'Suivant', back: 'Retour', skip: 'Passer pour l’instant', join: 'Rejoindre gratuitement',
    home: 'Accueil', aqeedah: 'Croyance', majalis: 'Sessions', zawaj: 'Mariage',
    dawah: 'Appel', joinNav: 'Nous rejoindre', privacy: 'Confidentialité',
  },
  no: {
    dir: 'ltr',
    next: 'Neste', back: 'Tilbake', skip: 'Hopp over nå', join: 'Bli med gratis',
    home: 'Hjem', aqeedah: 'Trosgrunnlag', majalis: 'Timer', zawaj: 'Ekteskap',
    dawah: 'Dawah', joinNav: 'Bli med', privacy: 'Personvern',
  },
};

const LanguageContext = createContext({ lang: 'ar', t: DICT.ar, setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('asc_lang') || 'ar');

  useEffect(() => {
    const dict = DICT[lang] || DICT.ar;
    document.documentElement.dir = dict.dir;
    document.documentElement.lang = lang;
    localStorage.setItem('asc_lang', lang);
  }, [lang]);

  const value = { lang, t: DICT[lang] || DICT.ar, setLang };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}
