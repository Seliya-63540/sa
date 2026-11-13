import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Lock, 
  LogOut, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export const CustomerProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone] = useState(currentUser?.phone || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          {t('nav.profile', 'Profile & Settings')}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          {language === 'gu'
            ? 'તમારી વ્યક્તિગત માહિતી અને ભાષા પસંદગી'
            : 'Manage your contact information and language preferences'}
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-100">
            Personal Information
          </h2>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {t('booking.name', 'Full Name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {t('booking.phone', 'Registered Mobile Number')}
            </label>
            <input
              type="text"
              disabled
              value={phone}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-100 text-stone-500 font-mono cursor-not-allowed"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Phone number cannot be changed directly as it acts as your account ID.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
            />
          </div>

          {/* Preferred Language */}
          <div className="pt-2">
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              {t('auth.preferredLanguage', 'Preferred App Language')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('gu')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                  language === 'gu'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-600 ring-1 ring-emerald-600'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                ગુજરાતી (Gujarati)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                  language === 'en'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-600 ring-1 ring-emerald-600'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        {/* Account Details & Logout */}
        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500">
            <span>Role: </span>
            <span className="font-bold text-emerald-800 uppercase">{currentUser?.role}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('common.logout', 'Log Out of Account')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
