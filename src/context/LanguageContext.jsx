import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../i18n';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  // Default to Gujarati as specified in the business requirements
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('safar_lang') || 'gu';
  });

  useEffect(() => {
    localStorage.setItem('safar_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'gu' ? 'en' : 'gu'));
  };

  const t = (key, fallback) => {
    return getTranslation(language, key, fallback);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
