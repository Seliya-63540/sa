import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { 
  BUSINESS_CONFIG, 
  getFullAddress, 
  getPhoneCallLink, 
  getWhatsAppLink 
} from '../../config/business';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  ShieldCheck 
} from 'lucide-react';

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <Logo size="lg" invert={true} />
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              {language === 'gu'
                ? BUSINESS_CONFIG.BUSINESS_DESCRIPTION_GUJARATI
                : BUSINESS_CONFIG.BUSINESS_DESCRIPTION}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {language === 'gu' ? 'ગુજરાત સ્થાનિક વેપાર ગેરંટી' : 'Local Workshop Guarantee'}
              </span>
            </div>
          </div>

          {/* Column 2: Explore Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'gu' ? 'વેબસાઇટ પેજ' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  {t('common.home', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/cycles" className="hover:text-emerald-400 transition-colors">
                  {t('common.cycles', 'Buy Cycles')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  {t('common.services', 'Services & Repairs')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  {t('common.about', 'About SAFAR CYCLE')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  {t('common.contact', 'Contact & Location')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'gu' ? 'ગ્રાહક સુવિધા' : 'Customer Portal'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/book-service" className="hover:text-emerald-400 transition-colors">
                  {t('common.bookService', 'Book Cycle Service')}
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-emerald-400 transition-colors">
                  {t('common.myBookings', 'My Bookings & History')}
                </Link>
              </li>
              <li>
                <Link to="/my-account" className="hover:text-emerald-400 transition-colors">
                  {t('common.myAccount', 'Customer Dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  {t('common.login', 'Customer Login')}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition-colors text-stone-400">
                  {t('auth.adminLogin', 'Admin Portal Login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Workshop Timings */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'gu' ? 'દુકાન સરનામું અને સમય' : 'Shop Address & Hours'}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{getFullAddress()}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={getPhoneCallLink()} className="hover:text-emerald-400 font-mono">
                  {BUSINESS_CONFIG.CONTACT_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 font-medium"
                >
                  WhatsApp: {BUSINESS_CONFIG.WHATSAPP_NUMBER}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {BUSINESS_CONFIG.OPENING_TIME} - {BUSINESS_CONFIG.CLOSING_TIME}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {language === 'gu'
                      ? BUSINESS_CONFIG.OPENING_DAYS_GUJARATI
                      : BUSINESS_CONFIG.OPENING_DAYS}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {BUSINESS_CONFIG.BUSINESS_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">
              Terms & Conditions
            </Link>
            {BUSINESS_CONFIG.INSTAGRAM_URL && (
              <a
                href={BUSINESS_CONFIG.INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {BUSINESS_CONFIG.FACEBOOK_URL && (
              <a
                href={BUSINESS_CONFIG.FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
