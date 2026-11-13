import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  Filter 
} from 'lucide-react';

export const MyBookingsPage = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await bookingService.getMyBookings(currentUser?.id || 'cust-current');
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [currentUser]);

  const filterTabs = [
    { key: 'ALL', label_en: 'All', label_gu: 'બધા' },
    { key: 'UPCOMING', label_en: 'Upcoming', label_gu: 'આવનારા' },
    { key: 'IN_PROGRESS', label_en: 'In Workshop', label_gu: 'વર્કશોપમાં' },
    { key: 'COMPLETED', label_en: 'Completed', label_gu: 'સર્વિસ પૂર્ણ' },
    { key: 'CANCELLED', label_en: 'Cancelled', label_gu: 'રદ થયેલ' }
  ];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab === 'ALL') return true;
      if (activeTab === 'UPCOMING') return ['REQUESTED', 'CONFIRMED'].includes(b.status);
      if (activeTab === 'IN_PROGRESS') return ['CHECKED_IN', 'IN_PROGRESS'].includes(b.status);
      if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
      if (activeTab === 'CANCELLED') return ['CANCELLED', 'REJECTED', 'NO_SHOW'].includes(b.status);
      return true;
    });
  }, [bookings, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {t('common.myBookings', 'My Service Bookings')}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'gu'
              ? 'તમારી તમામ સાઇકલ સર્વિસિંગ અને રિપેરિંગની હિસ્ટ્રી'
              : 'Track status of your cycle maintenance and repair jobs'}
          </p>
        </div>

        <Link
          to="/book-service"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-emerald-900 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('common.bookService', 'Book New Service')}</span>
        </Link>
      </div>

      {/* Tabs / Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {language === 'gu' ? tab.label_gu : tab.label_en}
          </button>
        ))}
      </div>

      {/* Bookings List (Mobile Cards) */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                    {b.id}
                  </span>
                  <StatusBadge status={b.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {language === 'gu' && b.serviceName_gu ? b.serviceName_gu : b.serviceName}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium mt-0.5">
                    Cycle: <b className="text-stone-800">{b.cycleName}</b>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{b.appointmentDate}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{b.appointmentTime}</span>
                  </span>
                  {b.estimatedCost > 0 && (
                    <>
                      <span>•</span>
                      <span className="font-bold text-stone-700 font-sans">
                        Est: ₹{b.estimatedCost}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 flex items-center justify-between sm:justify-end gap-3">
                <Link
                  to={`/my-bookings/${b.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <span>{t('common.viewDetails', 'View Details & Status')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={language === 'gu' ? 'કોઈ બુકિંગ્સ મળ્યા નથી' : 'No Bookings Found'}
          description={
            language === 'gu'
              ? 'આ ફિલ્ટરમાં હાલ કોઈ બુકિંગ નોંધાયેલ નથી.'
              : 'There are no service appointments in this category.'
          }
          actionText={t('common.bookService', 'Book a Service')}
          onAction={() => window.location.assign('/book-service')}
        />
      )}
    </div>
  );
};
