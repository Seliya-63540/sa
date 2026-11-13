import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BUSINESS_CONFIG, 
  getFullAddress, 
  getPhoneCallLink, 
  getWhatsAppLink 
} from '../../config/business';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const ContactPage = () => {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your message');
      return;
    }

    setSubmitting(true);
    // Frontend-only submission simulation
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          {language === 'gu' ? 'સ્થાનિક દુકાન સરનામું અને વિગતો' : 'Shop Address & Direct Communication'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">
          {language === 'gu' ? 'અમારો સંપર્ક કરો' : `Contact ${BUSINESS_CONFIG.BUSINESS_NAME}`}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          {language === 'gu'
            ? 'નવી સાઇકલ જોવા આવો અથવા તમારા જૂના સાઇકલના રિપેરિંગ માટે સીધા વર્કશોપ પર પધારો.'
            : 'Feel free to visit our shop or contact us through phone and WhatsApp during business hours.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <h2 className="text-lg font-bold text-stone-900">
              {language === 'gu' ? 'શોપ સરનામું અને સંપર્ક' : 'Workshop Contact Details'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                    {language === 'gu' ? 'સરનામું' : 'Physical Address'}
                  </span>
                  <p className="font-semibold text-stone-900 leading-snug">
                    {getFullAddress()}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                    {t('common.phone', 'Phone Number')}
                  </span>
                  <a
                    href={getPhoneCallLink()}
                    className="font-bold text-emerald-800 hover:underline font-mono text-base block"
                  >
                    {BUSINESS_CONFIG.CONTACT_NUMBER}
                  </a>
                  <span className="text-[11px] text-stone-500">Calling hours: 9 AM - 8:30 PM</span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                    WhatsApp
                  </span>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-800 hover:underline font-mono text-base block"
                  >
                    {BUSINESS_CONFIG.WHATSAPP_NUMBER}
                  </a>
                  <span className="text-[11px] text-stone-500">Quick replies & photos</span>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                    {language === 'gu' ? 'સમય' : 'Hours'}
                  </span>
                  <p className="font-bold text-stone-900">
                    {BUSINESS_CONFIG.OPENING_TIME} - {BUSINESS_CONFIG.CLOSING_TIME}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {language === 'gu'
                      ? BUSINESS_CONFIG.OPENING_DAYS_GUJARATI
                      : BUSINESS_CONFIG.OPENING_DAYS}
                  </p>
                </div>
              </div>
            </div>

            {/* Email if available */}
            {BUSINESS_CONFIG.BUSINESS_EMAIL && (
              <div className="pt-4 border-t border-stone-100 flex items-center gap-3 text-xs sm:text-sm text-stone-600">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span>Email: <a href={`mailto:${BUSINESS_CONFIG.BUSINESS_EMAIL}`} className="font-mono text-emerald-800 hover:underline">{BUSINESS_CONFIG.BUSINESS_EMAIL}</a></span>
              </div>
            )}
          </div>

          {/* 14.2 MAP SECTION */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">
                {language === 'gu' ? 'નકશા પર દુકાનનું લોકેશન' : 'Location on Google Maps'}
              </h3>
              <a
                href={BUSINESS_CONFIG.GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
              >
                <span>{language === 'gu' ? 'મોટા મેપમાં ખોલો' : 'Open in Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="aspect-16/9 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 relative flex items-center justify-center">
              <div className="text-center p-6 space-y-2">
                <MapPin className="w-8 h-8 text-emerald-700 mx-auto" />
                <p className="text-sm font-bold text-stone-800">{BUSINESS_CONFIG.BUSINESS_NAME}</p>
                <p className="text-xs text-stone-500 max-w-sm">{getFullAddress()}</p>
                <a
                  href={BUSINESS_CONFIG.GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-900 transition-colors"
                >
                  {language === 'gu' ? 'દિશાનિર્દેશ મેળવો (Get Directions)' : 'Get Directions'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 14.3 CONTACT FORM (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
            <h2 className="text-lg font-bold text-stone-900 mb-1">
              {language === 'gu' ? 'સંદેશ મોકલો' : 'Send Direct Message'}
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              {language === 'gu'
                ? 'કોઈ પ્રશ્ન હોય તો નીચેની વિગતો ભરી સબમિટ કરો. અમે તમને કોલ કરીશું.'
                : 'Have a question or request? Drop a message and we will respond promptly.'}
            </p>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {language === 'gu' ? 'સંદેશ મળી ગયો છે!' : 'Message Received!'}
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  {language === 'gu'
                    ? 'તમારો સંપર્ક કરવા બદલ આભાર. અમે ટૂંક સમયમાં તમારા મોબાઇલ નંબર પર સંપર્ક કરીશું.'
                    : 'Thank you for reaching out. Our workshop manager will contact your phone number soon.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  {language === 'gu' ? 'બીજો સંદેશ મોકલો' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {t('booking.name', 'Your Full Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ketan Shah"
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {language === 'gu' ? 'વિષય (ઓપ્શનલ)' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Cycle Inquiry or Service"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {language === 'gu' ? 'તમારો સંદેશ' : 'Message'} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      language === 'gu'
                        ? 'તમારો પ્રશ્ન અથવા જરૂરિયાત અહીં લખો...'
                        : 'Write your question or request here...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{language === 'gu' ? 'સંદેશ મોકલો' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
