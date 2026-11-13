import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Home, Bike, Wrench, Calendar, User } from 'lucide-react';

export const CustomerBottomNav = () => {
  const { t } = useLanguage();
  const { currentUser, isCustomer } = useAuth();

  const accountLink = currentUser ? (isCustomer ? '/my-account' : '/admin') : '/login';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* 1. Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 h-full py-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>{t('common.home', 'Home')}</span>
        </NavLink>

        {/* 2. Cycles */}
        <NavLink
          to="/cycles"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 h-full py-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <Bike className="w-5 h-5" />
          <span>{t('common.cycles', 'Cycles')}</span>
        </NavLink>

        {/* 3. Book Service (Center Action) */}
        <NavLink
          to="/book-service"
          className="flex flex-col items-center justify-center relative -top-3"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-transform border-2 border-white">
            <Wrench className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 mt-0.5">
            {t('common.bookService', 'Book')}
          </span>
        </NavLink>

        {/* 4. My Bookings */}
        <NavLink
          to="/my-bookings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 h-full py-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <Calendar className="w-5 h-5" />
          <span>{t('common.myBookings', 'Bookings')}</span>
        </NavLink>

        {/* 5. Account */}
        <NavLink
          to={accountLink}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 h-full py-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>{currentUser ? t('common.myAccount', 'Account') : t('common.login', 'Login')}</span>
        </NavLink>
      </div>
    </div>
  );
};
