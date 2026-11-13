import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BUSINESS_CONFIG, 
  getFullAddress, 
  getWhatsAppLink, 
  getPhoneCallLink 
} from '../../config/business';
import { 
  Bike, 
  Wrench, 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';

export const AboutPage = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 13.1 HERO INTRODUCTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200 shadow-2xs">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {language === 'gu' ? 'સ્થાનિક સાઇકલ વેપાર પરિચય' : 'Local Business Introduction'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            {language === 'gu' ? 'સફર સાઇકલ વિશે' : `About ${BUSINESS_CONFIG.BUSINESS_NAME}`}
          </h1>
          <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
            {language === 'gu'
              ? BUSINESS_CONFIG.BUSINESS_DESCRIPTION_GUJARATI
              : BUSINESS_CONFIG.BUSINESS_DESCRIPTION}
          </p>
          <div className="pt-2 text-xs sm:text-sm text-stone-500 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{getFullAddress()}</span>
          </div>
        </div>
      </div>

      {/* 13.2 & 13.3 WHAT WE OFFER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Bike className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {language === 'gu' ? 'ગુણવત્તાયુક્ત નવી સાઇકલો' : 'Curated Cycle Sales'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {language === 'gu'
              ? 'અમે દરેક ગ્રાહકની ઊંચાઈ, વજન અને ઉપયોગિતા સમજીને યોગ્ય સાઇકલની ભલામણ કરીએ છીએ. સાદી સિટી સાઇકલથી લઈને ૨૧-ગિયર વાળી MTB સુધી તમામ ઉપલબ્ધ છે.'
              : 'From everyday commute roadsters to advanced 21-speed mountain bikes, assembled with precision and pre-delivery inspection.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {language === 'gu' ? 'અસલી સ્પેરપાર્ટ્સ અને રિપેર' : 'Genuine Spares & Repair'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {language === 'gu'
              ? 'સાઇકલ રિપેરિંગમાં ફક્ત ભરોસાપાત્ર કંપનીઓના ઓરિજિનલ પાર્ટ્સનો જ ઉપયોગ થાય છે. જેથી સાઇકલનું આયુષ્ય લાંબું રહે અને ચલાવવામાં સરળતા રહે.'
              : 'Our mechanical workbench uses proper tools, quality lubricants, and authentic brand replacement parts for dependable performance.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {language === 'gu' ? 'પ્રામાણિક ગ્રાહક સંભાળ' : 'Honest Customer Relationship'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {language === 'gu'
              ? 'અમારો ઉદ્દેશ્ય ખોટા ખર્ચા કરાવ્યા વગર જે ખરેખર જરૂર હોય તેટલું જ કામ કરવાનો છે. બિલિંગ સ્પષ્ટ અને ચોખ્ખું રહે છે.'
              : 'We believe in community goodwill. Clear diagnosis before work, reasonable pricing, and friendly advice in simple language.'}
          </p>
        </div>
      </div>

      {/* 13.6 WHY CUSTOMERS CAN CONTACT US & CTA */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            {language === 'gu' ? 'સહાયતા માટે તૈયાર' : 'We Are Here To Help'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            {language === 'gu' ? 'કોઈપણ પ્રશ્ન હોય તો મુલાકાત લો' : 'Have Questions About Cycles or Repairs?'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            {language === 'gu'
              ? 'નવી સાઇકલની પૂછપરછ હોય કે સર્વિસનું બુકિંગ, અમારા સ્થાનિક સ્ટોર પર સીધો સંપર્ક કરી શકો છો.'
              : 'Reach out to us directly or visit our shop during operating hours. We look forward to serving your journey.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-xs hover:bg-emerald-50 transition-colors"
          >
            {t('common.contact', 'View Contact & Map')}
          </Link>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl border border-emerald-400/50 text-white font-bold text-sm hover:bg-emerald-800 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
