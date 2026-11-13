import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../../components/common/Logo';
import { Phone, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-4">
            {t('auth.forgotPassword', 'Password Recovery')}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'gu'
              ? 'તમારો રજીસ્ટર્ડ મોબાઇલ નંબર દાખલ કરો'
              : 'Enter your registered mobile number to reset password'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {language === 'gu' ? 'વિનંતી નોંધાઈ છે' : 'Recovery Request Submitted'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'gu'
                  ? 'પાસવર્ડ રીસેટ કરવા માટે કૃપા કરીને શોપ પર રૂબરૂ મુલાકાત લો અથવા વોટ્સએપ પર સંપર્ક કરો.'
                  : 'For security reasons, password resets are verified directly by workshop staff at the counter or via verified WhatsApp.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs inline-block"
                >
                  {language === 'gu' ? 'લોગિન પેજ પર પાછા જાઓ' : 'Return to Login'}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {t('auth.enterMobile', 'Registered Mobile Number')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors"
              >
                {language === 'gu' ? 'રીસેટ વિનંતી મોકલો' : 'Request Password Reset'}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-stone-100">
            <Link to="/login" className="text-xs font-bold text-emerald-800 hover:underline">
              ← {language === 'gu' ? 'લોગિન પર પાછા જાઓ' : 'Back to Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
