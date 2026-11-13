import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  Bike, 
  Wrench, 
  Phone, 
  Info, 
  LogOut, 
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  ShoppingBag,
  Bell,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Navbar = () => {
  const { t, language } = useLanguage();
  const { currentUser, isCustomer, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: t('nav.home', 'Home'), icon: Bike },
    { to: '/cycles', label: t('nav.buyCycles', 'Buy Cycles'), icon: ShoppingBag },
    { to: '/services', label: t('nav.services', 'Services'), icon: Wrench },
    { to: '/about', label: t('nav.about', 'About Us'), icon: Info },
    { to: '/contact', label: t('nav.contact', 'Contact'), icon: Phone }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo */}
            <div className="shrink-0 flex items-center">
              <Logo size="md" />
            </div>

            {/* Center: Desktop Navigation (Hidden on Mobile & Tablet) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-emerald-800 bg-emerald-50/90 font-bold shadow-2xs'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/70'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Language Switcher (Compact on small phones, normal on tablets/desktops) */}
              <LanguageSwitcher compact={true} className="sm:hidden" />
              <LanguageSwitcher compact={false} className="hidden sm:inline-flex" />

              {/* Account / Login button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors text-stone-800 text-xs sm:text-sm font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <span className="hidden md:inline-block max-w-[90px] truncate font-semibold">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {/* Dropdown Menu (Desktop) */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 text-stone-800 text-sm animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-bold text-stone-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-stone-500 font-mono truncate">{currentUser.phone}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          {currentUser.role}
                        </span>
                      </div>

                      {isCustomer && (
                        <>
                          <Link
                            to="/my-account"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 text-stone-700"
                          >
                            <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                            <span>{t('common.myAccount', 'My Account')}</span>
                          </Link>
                          <Link
                            to="/my-bookings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 text-stone-700"
                          >
                            <Calendar className="w-4 h-4 text-emerald-700" />
                            <span>{t('common.myBookings', 'My Bookings')}</span>
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-amber-900 font-bold"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-700" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left border-t border-stone-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('common.logout', 'Logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    to="/login"
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
                  >
                    {t('common.login', 'Login')}
                  </Link>
                  <Link
                    to="/book-service"
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{t('common.bookService', 'Book')}</span>
                  </Link>
                </div>
              )}

              {/* Mobile & Tablet Hamburger Button ("Three lines" Menu) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-stone-800 bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700"
                aria-label="Open Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Full-Screen Sliding Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop Overlay with Click-Outside to Dismiss */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Slide-Over Panel */}
          <div className="relative w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Top Header with Logo and Close 'X' Button */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
              <Logo size="sm" showTagline={false} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5 overscroll-contain">
              {/* Language Selection Bar inside Drawer */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  {language === 'gu' ? 'ભાષા પસંદ કરો (Language)' : 'Select Language (ભાષા)'}
                </span>
                <LanguageSwitcher className="w-full justify-center" />
              </div>

              {/* Main Navigation Links */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block px-2 mb-1.5">
                  {language === 'gu' ? 'મેનુ' : 'Navigation'}
                </span>
                <nav className="space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                            isActive
                              ? 'text-emerald-900 bg-emerald-50 font-bold border border-emerald-200/60'
                              : 'text-stone-700 hover:bg-stone-100'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Book Service CTA */}
              <Link
                to="/book-service"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all active:scale-98"
              >
                <Wrench className="w-4 h-4 stroke-[2.2]" />
                <span>{t('common.bookService', 'Book a Service')}</span>
              </Link>

              {/* Customer Account Area Links (When Logged in as Customer) */}
              {isCustomer && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block px-2 mb-1.5">
                    {t('common.myAccount', 'Customer Dashboard')}
                  </span>
                  <div className="space-y-1">
                    <Link
                      to="/my-account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                      <span>{t('common.dashboard', 'Account Overview')}</span>
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      <span>{t('common.myBookings', 'My Service Bookings')}</span>
                    </Link>
                    <Link
                      to="/my-cycles"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                      <Bike className="w-4 h-4 text-emerald-700" />
                      <span>{t('nav.myCycles', 'My Cycles')}</span>
                    </Link>
                    <Link
                      to="/my-enquiries"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                      <span>{t('nav.myEnquiries', 'Cycle Enquiries')}</span>
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <span>{t('nav.notifications', 'Notifications')}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Admin Portal Shortcut */}
              <div className="pt-2 border-t border-stone-200">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold">{t('auth.adminPortal', 'Admin Workshop Portal')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </Link>
              </div>

            </div>

            {/* Sticky Drawer Footer with User Info / Login / Logout */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 shrink-0">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-stone-500 font-mono truncate">{currentUser.phone}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {currentUser.role}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('common.logout', 'Logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-900 transition-colors text-center"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{t('common.login', 'Customer Login')}</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-100 transition-colors text-center"
                  >
                    <span>{t('auth.register', 'Register')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
