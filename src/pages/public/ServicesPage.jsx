import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { cycleService } from '../../services/cycleService';
import { ServiceCard } from '../../components/cards/ServiceCard';
import { 
  BUSINESS_CONFIG, 
  getWhatsAppLink, 
  getPhoneCallLink 
} from '../../config/business';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  ClipboardCheck, 
  Truck 
} from 'lucide-react';

export const ServicesPage = () => {
  const { language, t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await cycleService.getServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* 12.1 HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-8 sm:p-14 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'gu' ? 'ઓરિજિનલ સ્પેરપાર્ટ્સ ગેરંટી' : 'Genuine Spares & Expert Mechanics'}</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t('services.title')}
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              {t('services.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/book-service"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-950 font-extrabold text-sm shadow-md hover:bg-emerald-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>{t('services.bookCta', 'Book a Service Slot')}</span>
              </Link>

              <a
                href={getWhatsAppLink('Hello SAFAR CYCLE, I want to ask about cycle repair.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700/60 hover:bg-emerald-700 border border-emerald-400/50 text-white font-bold text-sm backdrop-blur-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'gu' ? 'વોટ્સએપ પૂછપરછ' : 'WhatsApp Us'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 12.2 SERVICE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {language === 'gu' ? 'વર્કશોપ મેનૂ' : 'Workshop Menu'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-0.5">
            {language === 'gu' ? 'અમારી તમામ રિપેરિંગ અને સર્વિસ સેવાઓ' : 'All Workshop Services'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {language === 'gu'
              ? 'પારદર્શક ભાવ અને અસલી સ્પેરપાર્ટ્સ સાથેનું ગુણવત્તાસભર કામ'
              : 'Transparent labor costs, genuine parts, and quick turnaround times.'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-stone-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 12.3 BOOKING PROCESS */}
      <section className="bg-stone-100 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === 'gu' ? 'સર્વિસ બુક કરવાની પદ્ધતિ' : 'How Workshop Booking Works'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
              {language === 'gu'
                ? 'પાંચ સરળ સ્ટેપમાં તમારી સાઇકલ સર્વિસ કરાવો'
                : 'Simple step-by-step process with no waiting in line'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                1
              </span>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'gu' ? 'સાઇકલ પસંદ કરો' : '1. Select Cycle'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'gu' ? 'તમારી સાઇકલનું નામ અથવા બ્રાન્ડ જણાવો.' : 'Pick from registered cycles or enter manually.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                2
              </span>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'gu' ? 'સર્વિસ પસંદ કરો' : '2. Choose Service'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'gu' ? 'જનરલ સર્વિસ, બ્રેક કે ગિયર જે કામ કરાવવું હોય તે પસંદ કરો.' : 'Select general maintenance or specific repair.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                3
              </span>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'gu' ? 'તારીખ અને સમય' : '3. Pick Time Slot'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'gu' ? 'તમારી અનુકૂળ તારીખ અને ટાઈમ સ્લોટ નક્કી કરો.' : 'Choose convenient day and time for drop-off.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                4
              </span>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'gu' ? 'બુકિંગ વિનંતી મોકલો' : '4. Submit Request'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'gu' ? 'સબમિટ કરો. શોપ તરફથી ઝડપી કન્ફર્મેશન મળશે.' : 'We confirm appointment and prepare slot.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                5
              </span>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'gu' ? 'શોપ પર આવો' : '5. Visit & Pay'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'gu' ? 'સાઇકલ જમા કરાવો અને કામ પતે એટલે રોકડ કે UPI થી ચૂકવી લઇ જાઓ.' : 'Bring cycle, inspect work, pay cash/UPI on collection.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12.4 CONTACT AND BOOKING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'gu' ? 'કોઈ ખાસ ખામી છે જે લિસ્ટમાં નથી?' : 'Have a unique problem not listed above?'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-lg">
              {language === 'gu'
                ? 'અમારા વર્કશોપ પર આવીને ફ્રી ચેકઅપ કરાવો. અમે નિદાન કરી સાચો ખર્ચ જણાવીશું.'
                : 'Bring your cycle to our workshop for an inspection. We will diagnose and quote before starting work.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/book-service"
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              {t('services.bookCta', 'Book Inspection')}
            </Link>
            <a
              href={getPhoneCallLink()}
              className="px-5 py-3 rounded-xl border border-stone-700 text-white hover:bg-stone-800 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{BUSINESS_CONFIG.CONTACT_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
