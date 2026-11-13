import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { enquiryService } from '../../services/enquiryService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Calendar, 
  Wrench, 
  Bike, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle, 
  Bell, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

export const CustomerDashboardPage = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const [userBookings, userEnquiries] = await Promise.all([
          bookingService.getMyBookings(currentUser?.id || 'cust-current'),
          enquiryService.getMyEnquiries(currentUser?.id || 'cust-current')
        ]);
        setBookings(userBookings);
        setEnquiries(userEnquiries);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomerData();
  }, [currentUser]);

  // Derived metrics (Section 16.2)
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter((b) => ['REQUESTED', 'CONFIRMED'].includes(b.status));
  const activeRepairs = bookings.filter((b) => ['CHECKED_IN', 'IN_PROGRESS'].includes(b.status));
  const completedServices = bookings.filter((b) => b.status === 'COMPLETED');
  const openEnquiries = enquiries.filter((e) => ['NEW', 'CONTACTED'].includes(e.status));

  // Primary upcoming booking
  const nextBooking = upcomingBookings[0] || activeRepairs[0] || null;

  return (
    <div className="space-y-8">
      {/* 16.1 WELCOME BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white font-black text-xl flex items-center justify-center shadow-md">
            {currentUser?.name ? currentUser.name.charAt(0) : 'C'}
          </div>
          <div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              {language === 'gu' ? 'આપનું સ્વાગત છે' : 'Welcome back'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {currentUser?.name || 'Customer'}
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              {currentUser?.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/notifications"
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-stone-600" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
          </Link>
          <Link
            to="/book-service"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('common.bookService', 'Book Service')}</span>
          </Link>
        </div>
      </div>

      {/* 16.2 SUMMARY METRIC CARDS (Android 2-cols / Desktop 5-cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Bookings */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-stone-400 text-xs block mb-1">
            {language === 'gu' ? 'કુલ બુકિંગ્સ' : 'Total Bookings'}
          </span>
          <span className="text-2xl font-black text-stone-900 font-sans">
            {totalBookings}
          </span>
        </div>

        {/* Upcoming */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-blue-600 text-xs font-bold block mb-1">
            {language === 'gu' ? 'આવનારી એપોઇન્ટમેન્ટ' : 'Upcoming Bookings'}
          </span>
          <span className="text-2xl font-black text-blue-700 font-sans">
            {upcomingBookings.length}
          </span>
        </div>

        {/* Active Repairs */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-cyan-700 text-xs font-bold block mb-1">
            {language === 'gu' ? 'ચાલુ રિપેરિંગ' : 'Active Repairs'}
          </span>
          <span className="text-2xl font-black text-cyan-800 font-sans">
            {activeRepairs.length}
          </span>
        </div>

        {/* Completed Services */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-emerald-700 text-xs font-bold block mb-1">
            {language === 'gu' ? 'પૂર્ણ થયેલ સર્વિસ' : 'Completed Services'}
          </span>
          <span className="text-2xl font-black text-emerald-800 font-sans">
            {completedServices.length}
          </span>
        </div>

        {/* Open Enquiries */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-amber-700 text-xs font-bold block mb-1">
            {language === 'gu' ? 'સાઇકલ પૂછપરછ' : 'Cycle Enquiries'}
          </span>
          <span className="text-2xl font-black text-amber-800 font-sans">
            {openEnquiries.length}
          </span>
        </div>
      </div>

      {/* 16.3 UPCOMING BOOKING HIGHLIGHT */}
      {nextBooking ? (
        <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {nextBooking.id}
                </span>
                <StatusBadge status={nextBooking.status} size="sm" />
              </div>
              <h3 className="text-lg font-black text-stone-900 mt-1">
                {language === 'gu' && nextBooking.serviceName_gu ? nextBooking.serviceName_gu : nextBooking.serviceName}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Cycle: <b className="text-stone-800">{nextBooking.cycleName}</b>
              </p>
            </div>

            <Link
              to={`/my-bookings/${nextBooking.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto shrink-0"
            >
              <span>{t('common.viewDetails', 'View Details')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div>
              <span className="text-stone-400 block">{t('common.date', 'Date')}</span>
              <span className="font-bold text-stone-800">{nextBooking.appointmentDate}</span>
            </div>
            <div>
              <span className="text-stone-400 block">{t('common.time', 'Time')}</span>
              <span className="font-bold text-stone-800">{nextBooking.appointmentTime}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Estimated Cost</span>
              <span className="font-bold text-stone-800 font-sans">
                ₹{nextBooking.estimatedCost || 'After inspection'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">
              {language === 'gu' ? 'કોઈ એપોઇન્ટમેન્ટ બાકી નથી' : 'No Active Appointment'}
            </h3>
            <p className="text-xs text-emerald-800/80 max-w-md">
              {language === 'gu'
                ? 'તમારી સાઇકલની આગામી સર્વિસિંગ માટે સમય સ્લોટ બુક કરો.'
                : 'Need a tune-up, brake fix, or puncture repair? Book your preferred slot.'}
            </p>
          </div>
          <Link
            to="/book-service"
            className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs shadow-xs hover:bg-emerald-900 transition-colors self-start sm:self-auto shrink-0"
          >
            {t('common.bookService', 'Book Service Now')}
          </Link>
        </div>
      )}

      {/* 16.5 QUICK ACTIONS */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-3">
          {language === 'gu' ? 'ઝડપી વિકલ્પો' : 'Quick Actions'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/book-service"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-900">{t('common.bookService', 'Book Service')}</p>
            <p className="text-[10px] text-stone-500 mt-0.5">Schedule tune-up</p>
          </Link>

          <Link
            to="/cycles"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Bike className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-900">{t('common.exploreCycles', 'Explore Cycles')}</p>
            <p className="text-[10px] text-stone-500 mt-0.5">View in-stock models</p>
          </Link>

          <Link
            to="/my-bookings"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-900">{t('common.myBookings', 'My Bookings')}</p>
            <p className="text-[10px] text-stone-500 mt-0.5">View all repair history</p>
          </Link>

          <Link
            to="/my-cycles"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <Bike className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-900">{t('nav.myCycles', 'My Cycles')}</p>
            <p className="text-[10px] text-stone-500 mt-0.5">Manage your bicycles</p>
          </Link>
        </div>
      </div>

      {/* 16.4 RECENT ACTIVITY LIST */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
            {language === 'gu' ? 'તાજેતરની ગતિવિધિ' : 'Recent Workshop Activity'}
          </h3>
          <Link to="/my-bookings" className="text-xs font-bold text-emerald-800 hover:underline">
            View All Bookings →
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="divide-y divide-stone-100 text-xs">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-700">{b.id}</span>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <p className="font-semibold text-stone-900">
                    {language === 'gu' && b.serviceName_gu ? b.serviceName_gu : b.serviceName}
                  </p>
                  <p className="text-stone-400 text-[11px]">
                    {b.cycleName} • {b.appointmentDate} at {b.appointmentTime}
                  </p>
                </div>

                <Link
                  to={`/my-bookings/${b.id}`}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 py-4 text-center">No recent activity found.</p>
        )}
      </div>
    </div>
  );
};
