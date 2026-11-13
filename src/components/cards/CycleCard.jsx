import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const CycleCard = ({ cycle }) => {
  const { language, t } = useLanguage();

  const displayName = language === 'gu' && cycle.name_gu ? cycle.name_gu : cycle.name;
  const isAvailable = cycle.stock > 0;
  const defaultFallback = '/images/cycles/cycle_safari_mtb.jpg';
  const mainImage = cycle.images?.[0] || defaultFallback;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group">
      {/* Product Image */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
        <img
          src={mainImage}
          alt={displayName}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultFallback;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Condition & Category Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-stone-900/80 text-white backdrop-blur-xs">
            {cycle.brand}
          </span>
          {cycle.condition === 'used' ? (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-stone-900 shadow-xs">
              {language === 'gu' ? 'સેકન્ડ હેન્ડ' : 'Used'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-700 text-white shadow-xs">
              {language === 'gu' ? 'નવી સાઇકલ' : 'New'}
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-2.5 right-2.5">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{language === 'gu' ? 'હાજરમાં ઉપલબ્ધ' : 'In Stock'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
              <XCircle className="w-3 h-3" />
              <span>{language === 'gu' ? 'સ્ટોક ખલાસ' : 'Out of Stock'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
            {cycle.category} • {cycle.wheelSize}
          </span>
          <h3 className="text-base font-bold text-stone-900 mt-0.5 line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {displayName}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {language === 'gu' && cycle.description_gu ? cycle.description_gu : cycle.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-emerald-800 tracking-tight font-sans">
                ₹{cycle.price.toLocaleString('en-IN')}
              </span>
              {cycle.originalPrice && cycle.originalPrice > cycle.price && (
                <span className="text-xs text-stone-400 line-through font-mono">
                  ₹{cycle.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              {language === 'gu' ? 'શોપ પર કિંમત' : 'Shop In-Person Price'}
            </span>
          </div>

          <Link
            to={`/cycles/${cycle.id}`}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-emerald-800 text-white transition-colors shadow-2xs shrink-0"
          >
            <span>{t('common.viewDetails', 'Details')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
