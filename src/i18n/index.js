import en from './locales/en.json';
import gu from './locales/gu.json';

export const translations = {
  en,
  gu,
};

export const getTranslation = (lang, key, fallback = '') => {
  const currentLang = translations[lang] || translations.gu;
  const parts = key.split('.');
  let current = currentLang;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English if missing in current language
      let enFallback = translations.en;
      for (const enPart of parts) {
        if (enFallback && typeof enFallback === 'object' && enPart in enFallback) {
          enFallback = enFallback[enPart];
        } else {
          return fallback || key;
        }
      }
      return enFallback || fallback || key;
    }
  }

  return current || fallback || key;
};
