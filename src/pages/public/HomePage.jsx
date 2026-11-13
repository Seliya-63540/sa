import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { cycleService } from '../../services/cycleService';
import { CycleCard } from '../../components/cards/CycleCard';
import { ServiceCard } from '../../components/cards/ServiceCard';
import { CycleCardSkeleton } from '../../components/common/SkeletonLoader';
import { 
  BUSINESS_CONFIG, 
  getWhatsAppLink, 
  getPhoneCallLink, 
  getFullAddress 
} from '../../config/business';
import { 
  Bike, 
  Wrench, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  CheckCircle, 
  Sparkles, 
  Compass, 
  Clock 
} from 'lucide-react';

export const HomePage = () => {
  const { language, t } = useLanguage();
  const [featuredCycles, setFeaturedCycles] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cycles, services] = await Promise.all([
          cycleService.getAllCycles(),
          cycleService.getServices()
        ]);
        setFeaturedCycles(cycles.filter((c) => c.isFeatured || c.isPublished).slice(0, 4));
        setPopularServices(services.filter((s) => s.isPopular).slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 9.1 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-8 pb-16 sm:py-20 lg:py-24">
        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
                {language === 'gu' ? (
                  <span>
                    તમારી સાઇકલ, <br className="hidden sm:inline" />
                    <span className="text-emerald-300">અમારી સંભાળ.</span>
                  </span>
                ) : (
                  <span>
                    Your Cycle, <br className="hidden sm:inline" />
                    <span className="text-emerald-300">Our Care.</span>
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/cycles"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-sm sm:text-base shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-98 transition-all"
                >
                  <Bike className="w-5 h-5 text-emerald-700" />
                  <span>{t('hero.exploreCycles', 'Explore Cycles')}</span>
                </Link>

                <Link
                  to="/book-service"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600/60 hover:bg-emerald-600 border border-emerald-400/50 text-white font-extrabold text-sm sm:text-base backdrop-blur-xs hover:scale-[1.02] active:scale-98 transition-all"
                >
                  <Wrench className="w-5 h-5 text-emerald-200" />
                  <span>{t('hero.bookService', 'Book a Service')}</span>
                </Link>
              </div>

              {/* Trust bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-700/50 text-xs text-emerald-100 font-medium">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('hero.trust1')}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('hero.trust2')}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('hero.trust3')}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-700/40 bg-emerald-950">
                <img
                  src="/images/cycles/cycle_safari_mtb.jpg"
                  alt="SAFAR CYCLE Workshop and Display"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-96 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                  <div className="bg-white/95 text-stone-900 rounded-2xl p-4 shadow-xl backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          {language === 'gu' ? 'દુકાનનો સમય' : 'Workshop Hours'}
                        </span>
                        <p className="text-xs sm:text-sm font-bold mt-0.5">
                          {BUSINESS_CONFIG.OPENING_TIME} - {BUSINESS_CONFIG.CLOSING_TIME}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {language === 'gu' ? 'દુકાન ખુલ્લી છે' : 'Shop Open'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9.2 MAIN BUSINESS SERVICES (3 Equal Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {t('home.servicesHeading')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {t('home.servicesSubheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Buy a Cycle */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Bike className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                {t('home.buyCardTitle')}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.buyCardDesc')}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-stone-100">
              <Link
                to="/cycles"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 group-hover:text-emerald-900"
              >
                <span>{t('hero.exploreCycles', 'Explore Cycles')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Cycle Repair */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Wrench className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                {t('home.repairCardTitle')}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.repairCardDesc')}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-stone-100">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 group-hover:text-emerald-900"
              >
                <span>{language === 'gu' ? 'રિપેરિંગ માહિતી જુઓ' : 'Explore Repair Services'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Cycle Service */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Calendar className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                {t('home.serviceCardTitle')}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.serviceCardDesc')}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-stone-100">
              <Link
                to="/book-service"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 group-hover:text-emerald-900"
              >
                <span>{t('hero.bookService', 'Book Service Appointment')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9.3 FEATURED CYCLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t('home.featuredCycles')}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              {t('home.featuredCyclesDesc')}
            </p>
          </div>
          <Link
            to="/cycles"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-900 self-start sm:self-auto"
          >
            <span>{t('home.viewAllCycles', 'View All Cycles')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CycleCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCycles.map((cycle) => (
              <CycleCard key={cycle.id} cycle={cycle} />
            ))}
          </div>
        )}
      </section>

      {/* 9.4 HOW IT WORKS (4 simple visual steps) */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t('home.howItWorks')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2">
              {t('home.howItWorksSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">
                {t('home.step1')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('home.step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">
                {t('home.step2')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('home.step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">
                {t('home.step3')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('home.step3Desc')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">
                {t('home.step4')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('home.step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9.5 WHY CHOOSE SAFAR CYCLE? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {t('home.whyChooseUs')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {t('home.why1Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('home.why1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {t('home.why2Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('home.why2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {t('home.why3Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('home.why3Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {t('home.why4Title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('home.why4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 9.6 POPULAR SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === 'gu' ? 'લોકપ્રિય સર્વિસિસ' : 'Popular Workshop Services'}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              {language === 'gu'
                ? 'અમારા વર્કશોપમાં સૌથી વધુ પસંદ કરાતી સર્વિસિસ'
                : 'Most frequently booked repairs and maintenance'}
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-900"
          >
            <span>{language === 'gu' ? 'બધી સર્વિસિસ જુઓ' : 'View All Services'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* 9.7 NEUTRAL COMMUNITY INVITATION (Strictly respecting Section 9.7: no fake reviews) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {language === 'gu' ? 'સ્થાનિક સાઇકલિસ્ટ સમુદાય' : 'Local Cycling Community'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900">
              {language === 'gu'
                ? 'શોપ પર મુલાકાત લો અને તમારો સાઇકલ અનુભવ જણાવો'
                : 'Visit Our Shop & Experience Honest Local Service'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              {language === 'gu'
                ? 'અમારી પ્રાથમિકતા દરેક ગ્રાહકને સંતોષકારક અને યોગ્ય સલાહ આપવાની છે. ટેસ્ટ રાઇડ અને સાઇકલ તપાસ માટે હંમેશા આવકાર્ય છે.'
                : 'We focus on genuine craftsmanship and honest guidance. Come over for a free bike inspection or test-ride anytime.'}
            </p>
          </div>
          <a
            href={BUSINESS_CONFIG.GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors shrink-0"
          >
            {t('home.getDirections', 'Get Directions on Map')}
          </a>
        </div>
      </section>

      {/* 9.8 CONTACT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-emerald-800 rounded-3xl text-white p-6 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('home.contactBannerTitle')}
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 max-w-xl">
                {t('home.contactBannerSub')}
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-200 font-mono pt-1">
                <MapPin className="w-4 h-4 shrink-0 text-emerald-300" />
                <span>{getFullAddress()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={getPhoneCallLink()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-950 font-extrabold text-sm shadow-md hover:bg-emerald-50 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>{BUSINESS_CONFIG.CONTACT_NUMBER}</span>
              </a>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm border border-emerald-400/40 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'gu' ? 'વોટ્સએપ પર પૂછો' : 'Chat on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
