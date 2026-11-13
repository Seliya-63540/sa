import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Wrench, 
  Disc, 
  Cog, 
  CircleDot, 
  Crosshair, 
  Link as LinkIcon, 
  Sparkles, 
  ClipboardList, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

export const ServiceCard = ({ service }) => {
  const { language, t } = useLanguage();

  const iconMap = {
    wrench: Wrench,
    disc: Disc,
    cog: Cog,
    'circle-dot': CircleDot,
    crosshair: Crosshair,
    link: LinkIcon,
    sparkles: Sparkles,
    'clipboard-list': ClipboardList
  };

  const Icon = iconMap[service.icon] || Wrench;
  const displayTitle = language === 'gu' && service.title_gu ? service.title_gu : service.title;
  const displayDesc = language === 'gu' && service.description_gu ? service.description_gu : service.description;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors shadow-2xs">
            <Icon className="w-6 h-6 stroke-[2]" />
          </div>

          {service.isPopular && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {t('services.popular', 'Popular')}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
          {displayTitle}
        </h3>

        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
          {displayDesc}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          {service.isInspectionBased ? (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              {t('services.priceAfterInspection', 'Price after inspection')}
            </span>
          ) : (
            <div>
              <span className="text-[10px] text-stone-500 block">
                {t('services.startsFrom', 'Starts from')}
              </span>
              <span className="text-base font-black text-stone-900 font-sans">
                ₹{service.startingPrice}
              </span>
            </div>
          )}

          {service.durationMinutes && (
            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>~{service.durationMinutes} {t('services.minutes', 'mins')}</span>
            </div>
          )}
        </div>

        <Link
          to={`/book-service?serviceId=${service.id}`}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs transition-colors shrink-0"
        >
          <span>{t('services.bookCta', 'Book')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
