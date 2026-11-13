import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomerBottomNav } from '../components/layout/CustomerBottomNav';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Bike, 
  MessageSquare, 
  ShoppingBag, 
  Bell, 
  User, 
  PlusCircle 
} from 'lucide-react';

export const CustomerLayout = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();

  const customerNavLinks = [
    { to: '/my-account', label: t('common.dashboard', 'Dashboard'), icon: LayoutDashboard },
    { to: '/my-bookings', label: t('common.myBookings', 'My Bookings'), icon: Calendar },
    { to: '/my-cycles', label: t('nav.myCycles', 'My Cycles'), icon: Bike },
    { to: '/my-enquiries', label: t('nav.myEnquiries', 'My Enquiries'), icon: MessageSquare },
    { to: '/my-purchases', label: t('nav.myPurchases', 'My Purchases'), icon: ShoppingBag },
    { to: '/notifications', label: t('nav.notifications', 'Notifications'), icon: Bell },
    { to: '/profile', label: t('nav.profile', 'Profile'), icon: User }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      {/* Customer Header Sub-bar */}
      <section className="bg-emerald-800 text-white py-6 border-b border-emerald-900/60 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200">
                Customer Account
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {currentUser?.name || 'Customer'}
              </h1>
              <p className="text-xs text-emerald-100 font-mono mt-0.5">
                {currentUser?.phone}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/book-service"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>{t('common.bookService', 'Book New Service')}</span>
              </Link>
            </div>
          </div>

          {/* Desktop Sub Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 mt-6 pt-2 border-t border-emerald-700/60 overflow-x-auto no-scrollbar">
            {customerNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/my-account'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white/20 text-white font-bold backdrop-blur-xs'
                        : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-12">
        <Outlet />
      </main>

      <Footer />
      <CustomerBottomNav />
    </div>
  );
};
