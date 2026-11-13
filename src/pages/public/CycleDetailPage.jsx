import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { cycleService } from '../../services/cycleService';
import { enquiryService } from '../../services/enquiryService';
import { CycleCard } from '../../components/cards/CycleCard';
import { 
  BUSINESS_CONFIG, 
  getWhatsAppLink, 
  getPhoneCallLink 
} from '../../config/business';
import { 
  Bike, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  PhoneCall, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Disc, 
  Cog, 
  Sparkles, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2 
} from 'lucide-react';

export const CycleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  const [cycle, setCycle] = useState(null);
  const [relatedCycles, setRelatedCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Enquiry Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const found = await cycleService.getCycleById(id);
        setCycle(found);
        setActiveImageIndex(0);

        // Fetch related cycles
        const all = await cycleService.getAllCycles();
        const related = all.filter((c) => c.id !== id && (c.category === found.category || c.brand === found.brand)).slice(0, 3);
        setRelatedCycles(related);
      } catch (err) {
        console.error('Failed to load cycle', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name || '');
      if (!customerPhone) setCustomerPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-stone-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Cycle Not Found</h2>
        <p className="text-sm text-stone-600 mb-6">The requested cycle could not be located in our inventory.</p>
        <Link
          to="/cycles"
          className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-sm"
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const displayName = language === 'gu' && cycle.name_gu ? cycle.name_gu : cycle.name;
  const displayDesc = language === 'gu' && cycle.description_gu ? cycle.description_gu : cycle.description;
  const isAvailable = cycle.stock > 0;
  const defaultFallback = '/images/cycles/cycle_safari_mtb.jpg';
  const images = cycle.images && cycle.images.length > 0 ? cycle.images : [defaultFallback];

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryError('');

    if (!customerName.trim()) {
      setEnquiryError('Please enter your full name');
      return;
    }
    if (!customerPhone || customerPhone.length < 10) {
      setEnquiryError('Please enter a valid 10-digit mobile number');
      return;
    }

    setEnquirySubmitting(true);
    try {
      await enquiryService.createEnquiry({
        customerName,
        customerPhone,
        cycleId: cycle.id,
        cycleName: cycle.name,
        cyclePrice: cycle.price,
        message: enquiryMessage || `Interested in ${cycle.name}. Please contact me regarding availability.`
      });
      setEnquirySuccess(true);
    } catch (err) {
      setEnquiryError(err.message || 'Failed to submit enquiry');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const whatsappMessage = `Hello SAFAR CYCLE, I am interested in: ${cycle.name} (SKU: ${cycle.sku || cycle.id}) priced at ₹${cycle.price.toLocaleString('en-IN')}. Is this in stock for a test ride?`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb & Back action */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/cycles" className="inline-flex items-center gap-1 hover:text-emerald-800 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('cycles.title', 'Back to Cycles')}</span>
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-bold truncate max-w-xs">{displayName}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* 11.1 PRODUCT GALLERY (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-16/11 bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={images[activeImageIndex]}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultFallback;
              }}
              className="w-full h-full object-cover object-center"
            />

            {/* Condition badge */}
            <div className="absolute top-4 left-4">
              {cycle.condition === 'used' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-900 shadow-sm">
                  {language === 'gu' ? 'ચકાસાયેલી સેકન્ડ હેન્ડ' : 'Certified Used'}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-sm">
                  {language === 'gu' ? 'તદ્દન નવી સાઇકલ' : 'Brand New'}
                </span>
              )}
            </div>

            {/* Gallery Next / Prev controls if multiple images */}
            {images.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 text-stone-800 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 text-stone-800 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-emerald-700 ring-2 ring-emerald-100' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 11.2 PRODUCT INFORMATION & ACTIONS (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-stone-200 pb-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {cycle.brand} • {cycle.category}
              </span>
              {isAvailable ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'gu' ? 'હાજરમાં ઉપલબ્ધ' : 'In Stock'} ({cycle.stock})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{language === 'gu' ? 'સ્ટોક ખલાસ' : 'Out of Stock'}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
              {displayName}
            </h1>

            {cycle.model && (
              <p className="text-xs text-stone-500 font-mono">
                Model: {cycle.model} {cycle.sku && `• SKU: ${cycle.sku}`}
              </p>
            )}

            {/* Price Box */}
            <div className="pt-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-800 tracking-tight font-sans">
                  ₹{cycle.price.toLocaleString('en-IN')}
                </span>
                {cycle.originalPrice && cycle.originalPrice > cycle.price && (
                  <span className="text-base text-stone-400 line-through font-mono">
                    ₹{cycle.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'gu'
                  ? 'દુકાન પર રૂબરૂ મુલાકાત માટેની કિંમત (કોઈ ઓનલાઇન ચાર્જ નથી)'
                  : 'In-person shop price with complete assembly & inspection.'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {language === 'gu' ? 'સાઇકલ વિશે માહિતી' : 'About this cycle'}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {displayDesc}
            </p>
          </div>

          {/* 11.2 Specifications List */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              {t('cycles.specifications', 'Specifications')}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {cycle.wheelSize && (
                <div>
                  <span className="text-stone-400 block">{t('cycles.wheelSize', 'Wheel Size')}</span>
                  <span className="font-bold text-stone-800">{cycle.wheelSize}</span>
                </div>
              )}
              {cycle.frameSize && (
                <div>
                  <span className="text-stone-400 block">{t('cycles.frameSize', 'Frame Size')}</span>
                  <span className="font-bold text-stone-800">{cycle.frameSize}</span>
                </div>
              )}
              {cycle.gears && (
                <div>
                  <span className="text-stone-400 block">{t('cycles.gears', 'Gears')}</span>
                  <span className="font-bold text-stone-800">{cycle.gears}</span>
                </div>
              )}
              {cycle.brakes && (
                <div>
                  <span className="text-stone-400 block">{t('cycles.brakes', 'Brakes')}</span>
                  <span className="font-bold text-stone-800">{cycle.brakes}</span>
                </div>
              )}
              {cycle.colors && cycle.colors.length > 0 && (
                <div className="col-span-2">
                  <span className="text-stone-400 block">{t('cycles.color', 'Available Colors')}</span>
                  <span className="font-bold text-stone-800">{cycle.colors.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* 11.3 CUSTOMER ACTIONS: Enquiry & WhatsApp (Strictly no online payment) */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setEnquirySuccess(false);
                setEnquiryModalOpen(true);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t('cycles.askAboutCycle', 'Ask About This Cycle')}</span>
            </button>

            <a
              href={getWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-6 rounded-2xl border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>{language === 'gu' ? 'વોટ્સએપ પર પૂછપરછ કરો' : 'Inquire on WhatsApp'}</span>
            </a>

            {/* In-person purchasing note */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              <span className="font-bold">
                {language === 'gu' ? 'રૂબરૂ ખરીદી નોંધ:' : 'In-Person Purchase Policy:'}
              </span>{' '}
              {language === 'gu'
                ? 'સાઇકલ ખરીદવા માટે શોપ પર રૂબરૂ આવીને ટેસ્ટ રાઇડ લઇ શકો છો. પેમેન્ટ શોપ પર રોકડ અથવા UPI દ્વારા થશે.'
                : 'No online payment required. Visit our shop to inspect, test-ride, and finalize your purchase directly at the counter.'}
            </div>
          </div>
        </div>
      </div>

      {/* 11.4 RELATED PRODUCTS */}
      {relatedCycles.length > 0 && (
        <div className="pt-10 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {language === 'gu' ? 'આના જેવી અન્ય સાઇકલો' : 'Related Bicycles'}
            </h2>
            <Link to="/cycles" className="text-xs font-bold text-emerald-800 hover:underline">
              {t('home.viewAllCycles', 'View All')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCycles.map((rel) => (
              <CycleCard key={rel.id} cycle={rel} />
            ))}
          </div>
        </div>
      )}

      {/* ENQUIRY MODAL (11.3) */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
            {enquirySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">
                  {t('cycles.enquirySuccess')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  {t('cycles.enquiryNote')}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-sm shadow-xs"
                  >
                    {t('common.close', 'Done')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-stone-900">
                      {t('cycles.askEnquiryTitle')}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {displayName} • ₹{cycle.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                {enquiryError && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
                    {enquiryError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {t('booking.name', 'Your Full Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {t('booking.phone', 'Mobile Number')} *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {language === 'gu' ? 'તમારો પ્રશ્ન અથવા મેસેજ' : 'Your Message / Inquiry'}
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder={
                      language === 'gu'
                        ? 'જેમ કે: કલર ઓપ્શન, ટેસ્ટ રાઇડ માટે ક્યારે આવી શકાય...'
                        : 'E.g., available colors, can I visit on Saturday for a test ride...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>

                <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-500">
                  {t('cycles.enquiryNote')}
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    {enquirySubmitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    <span>{t('common.submit', 'Submit Enquiry')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
