import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Logo = ({
  size = 'md', // sm, md, lg
  showTagline = true,
  to = '/',
  className = '',
  invert = false
}) => {
  const { language } = useLanguage();

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight'
  };

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Bicycle Icon */}
      <div
        className={`flex items-center justify-center rounded-xl transition-transform hover:scale-105 ${
          invert ? 'bg-white text-emerald-800' : 'bg-emerald-800 text-white shadow-sm'
        } ${size === 'lg' ? 'p-2.5' : size === 'sm' ? 'p-1.5' : 'p-2'}`}
      >
        <svg
          className={iconSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="5.5" cy="17.5" r="3.5" />
          <circle cx="18.5" cy="17.5" r="3.5" />
          <circle cx="15" cy="5" r="1" />
          <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className={`flex items-center gap-1.5 font-sans ${textSizes[size]} ${
            invert ? 'text-white' : 'text-stone-900'
          }`}
        >
          <span>SAFAR</span>
          <span className={invert ? 'text-emerald-300' : 'text-emerald-700'}>CYCLE</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-medium tracking-wide hidden sm:block ${
              invert ? 'text-emerald-200/80' : 'text-stone-500'
            }`}
          >
            {language === 'gu' ? 'સફર સાઇકલ • શોપ & વર્કશોપ' : 'Sales • Repair • Service'}
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
