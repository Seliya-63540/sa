import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../../components/common/Logo';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const LoginPage = () => {
  const { loginCustomer } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/my-account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length < 10) {
      setError(language === 'gu' ? 'કૃપા કરીને ૧૦ અંકનો સાચો મોબાઇલ નંબર દાખલ કરો' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      setError(language === 'gu' ? 'કૃપા કરીને પાસવર્ડ દાખલ કરો' : 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await loginCustomer(phone, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-4">
            {t('auth.customerLogin', 'Customer Login')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {t('auth.welcomeBack')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t('auth.enterMobile', 'Mobile Number')}
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

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">
                  {t('auth.enterPassword', 'Password')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  {t('auth.forgotPassword', 'Forgot Password?')}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              <LogIn className="w-4 h-4" />
              <span>{t('common.login', 'Log In')}</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-stone-100 text-center">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
              <span className="font-bold">Pre-filled Demo Customer:</span> Phone <b>9876543210</b>, Pass <b>123456</b>. Just click Log In!
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-stone-600">
              {t('auth.dontHaveAccount', "Don't have an account?")}{' '}
              <Link to="/register" className="font-bold text-emerald-800 hover:underline">
                {t('auth.registerNow', 'Register Now')}
              </Link>
            </p>
          </div>
        </div>

        {/* Dedicated Admin Portal Link */}
        <div className="text-center pt-2">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900"
          >
            <span>Are you the shop owner?</span>
            <span className="text-amber-800 font-bold hover:underline">Admin Login →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
