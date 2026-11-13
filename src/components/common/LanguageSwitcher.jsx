import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = ({ variant = 'default', className = '', compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full border border-stone-300 bg-stone-100/90 text-xs font-semibold select-none shadow-2xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('gu')}
        className={`px-2 sm:px-2.5 py-1 rounded-full transition-all flex items-center justify-center gap-1 ${
          language === 'gu'
            ? 'bg-emerald-700 text-white shadow-xs font-bold'
            : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <span className="text-[11px] sm:text-xs">
          {compact ? 'ગુજ' : 'ગુજરાતી'}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 sm:px-2.5 py-1 rounded-full transition-all flex items-center justify-center gap-1 ${
          language === 'en'
            ? 'bg-emerald-700 text-white shadow-xs font-bold'
            : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <span className="text-[11px] sm:text-xs">
          {compact ? 'EN' : 'English'}
        </span>
      </button>
    </div>
  );
};
