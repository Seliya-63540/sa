import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../../components/common/Logo';
import { 
  User, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ShieldCheck 
} from 'lucide-react';

export const RegisterPage = () => {
  const { registerCustomer } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState(language || 'gu');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(language === 'gu' ? 'કૃપા કરીને પૂરું નામ લખો' : 'Please enter your full name');
      return;
    }
    if (!phone || phone.length < 10) {
      setError(language === 'gu' ? '૧૦ અંકનો સાચો મોબાઇલ નંબર દાખલ કરો' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password || password.length < 4) {
      setError(language === 'gu' ? 'પાસવર્ડ ઓછામાં ઓછો ૪ અક્ષરનો હોવો જોઈએ' : 'Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError(language === 'gu' ? 'પાસવર્ડ મેચ થતો નથી' : 'Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      setError(language === 'gu' ? 'કૃપા કરીને નિયમો સ્વીકારો' : 'Please accept the shop terms');
      return;
    }

    setLoading(true);
    try {
      await registerCustomer({
        name,
        phone,
        password,
        preferredLanguage: preferredLang
      });
      setLanguage(preferredLang);
      navigate('/my-account');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-4">
            {language === 'gu' ? 'નવું ગ્રાહક રજીસ્ટ્રેશન' : 'Create Customer Account'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'gu'
              ? 'સર્વિસ બુકિંગ અને સાઇકલ ટ્રેકિંગ માટે એકાઉન્ટ બનાવો'
              : 'Register to book services and track repairs with ease'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t('auth.enterFullName', 'Full Name')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mukesh Patel"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t('auth.enterMobile', 'Mobile Number')} *
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

            {/* Preferred Language */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t('auth.preferredLanguage', 'Preferred Language')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredLang('gu')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    preferredLang === 'gu'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ગુજરાતી (Gujarati)
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredLang('en')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    preferredLang === 'en'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t('auth.enterPassword', 'Password')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t('auth.confirmPassword', 'Confirm Password')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700 accent-emerald-700"
                />
                <span>
                  {t('auth.termsAccept', 'I agree to the shop terms and privacy policy')}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              <UserPlus className="w-4 h-4" />
              <span>{t('auth.registerNow', 'Complete Registration')}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-600">
              {t('auth.alreadyHaveAccount', 'Already registered?')}{' '}
              <Link to="/login" className="font-bold text-emerald-800 hover:underline">
                {t('common.login', 'Log In')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
