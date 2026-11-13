import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BookingTimeline } from '../../components/common/BookingTimeline';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { 
  BUSINESS_CONFIG, 
  getWhatsAppLink, 
  getPhoneCallLink 
} from '../../config/business';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Bike, 
  Wrench, 
  MessageSquare, 
  PhoneCall, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadData = async () => {
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data);
    } catch (err) {
      console.error('Failed to load booking details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCancelConfirm = async () => {
    setCancelling(true);
    try {
      await bookingService.cancelBooking(id, 'Cancelled by customer online');
      setCancelModalOpen(false);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-stone-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-lg font-bold text-stone-900 mb-2">Booking Not Found</h2>
        <Link to="/my-bookings" className="text-xs font-bold text-emerald-800 underline">
          Back to Bookings
        </Link>
      </div>
    );
  }

  // Can cancel only if still REQUESTED or CONFIRMED (not yet checked in or completed)
  const canCancel = ['REQUESTED', 'CONFIRMED'].includes(booking.status);

  const whatsappMessage = `Hello SAFAR CYCLE, inquiring about my Booking ${booking.id} (${booking.cycleName} - ${booking.serviceName}).`;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'gu' ? 'બધી બુકિંગ્સ પર પાછા જાઓ' : 'Back to My Bookings'}</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-sm bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg">
                {booking.id}
              </span>
              <StatusBadge status={booking.status} size="md" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {language === 'gu' && booking.serviceName_gu ? booking.serviceName_gu : booking.serviceName}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Customer: <b className="text-stone-800">{booking.customerName}</b> ({booking.customerPhone})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'gu' ? 'દુકાન પર પૂછો' : 'WhatsApp Shop'}</span>
            </a>
          </div>
        </div>

        {/* 18.2 STATUS TIMELINE */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-4">
            {language === 'gu' ? 'રિપેરિંગ / સર્વિસ પ્રગતિ' : 'Status Timeline'}
          </h2>
          <BookingTimeline status={booking.status} timeline={booking.timeline} />
        </div>

        {/* 18.1 BOOKING INFORMATION GRID */}
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            {language === 'gu' ? 'એપોઇન્ટમેન્ટ વિગતો' : 'Appointment Details'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block">{language === 'gu' ? 'સાઇકલ' : 'Cycle'}</span>
              <span className="font-bold text-stone-800 text-sm">{booking.cycleName}</span>
              <span className="text-stone-500 block text-[11px]">{booking.cycleBrand}</span>
            </div>

            <div>
              <span className="text-stone-400 block">{language === 'gu' ? 'તારીખ અને સમય' : 'Date & Time Slot'}</span>
              <span className="font-bold text-stone-800 text-sm">
                {booking.appointmentDate} at {booking.appointmentTime}
              </span>
            </div>

            {booking.problemDescription && (
              <div className="sm:col-span-2 pt-2 border-t border-stone-200/60">
                <span className="text-stone-400 block mb-0.5">
                  {language === 'gu' ? 'ગ્રાહકની ફરિયાદ / સમસ્યા' : 'Reported Problem Description'}
                </span>
                <p className="font-medium text-stone-700 leading-relaxed">
                  "{booking.problemDescription}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 18.3 WORKSHOP UPDATES (Customer visible) */}
        {booking.customerNotes && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Workshop Note for Customer:</span>
            </span>
            <p className="leading-relaxed">{booking.customerNotes}</p>
          </div>
        )}

        {/* 18.4 PAYMENT SUMMARY */}
        <div className="border border-stone-200 rounded-2xl p-5 bg-white space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            {language === 'gu' ? 'ચુકવણી સારાંશ' : 'Payment Summary'}
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>{language === 'gu' ? 'અંદાજિત ખર્ચ' : 'Estimated Cost'}:</span>
              <span className="font-mono font-semibold">₹{booking.estimatedCost}</span>
            </div>

            {booking.finalCost > 0 && (
              <div className="flex justify-between text-stone-800 font-bold">
                <span>{language === 'gu' ? 'આખરી ખર્ચ (બિલ)' : 'Final Amount'}:</span>
                <span className="font-mono text-sm">₹{booking.finalCost}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>{language === 'gu' ? 'ચૂકવેલ રકમ' : 'Amount Paid'}:</span>
              <span className="font-mono font-semibold text-emerald-800">₹{booking.amountPaid}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-black text-stone-900">
              <span>{language === 'gu' ? 'બાકી રકમ' : 'Remaining Balance'}:</span>
              <span className="font-mono text-emerald-900">₹{booking.remainingAmount}</span>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="pt-2 text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
            <p className="font-semibold text-stone-800">
              {language === 'gu' ? 'દુકાન પર રૂબરૂ ચુકવણી:' : 'In-Person Payment Notice:'}
            </p>
            <p>
              {language === 'gu'
                ? 'સર્વિસિંગ પૂર્ણ થયા બાદ સાઇકલ લેતી વખતે શોપ કાઉન્ટર પર રોકડ અથવા શોપ UPI દ્વારા પેમેન્ટ સ્વીકારવામાં આવે છે.'
                : 'Payment is accepted directly at the shop counter in Cash or UPI when collecting your serviced cycle.'}
            </p>
          </div>
        </div>

        {/* 18.5 CUSTOMER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
          <div className="w-full sm:w-auto">
            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                {language === 'gu' ? 'બુકિંગ રદ કરો' : 'Cancel Booking'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/book-service"
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {language === 'gu' ? 'નવું બુકિંગ કરો' : 'Book Another Service'}
            </Link>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title={language === 'gu' ? 'બુકિંગ રદ કરવાની ખાતરી?' : 'Cancel Service Booking?'}
        message={
          language === 'gu'
            ? 'શું તમે ખરેખર આ બુકિંગ રદ કરવા માંગો છો? આ સમય સ્લોટ અન્ય ગ્રાહક માટે ખાલી થઈ જશે.'
            : 'Are you sure you want to cancel this appointment slot? You can re-book anytime.'
        }
        confirmText={language === 'gu' ? 'હા, રદ કરો' : 'Yes, Cancel Booking'}
        cancelText={t('common.back', 'Go Back')}
        variant="danger"
        isLoading={cancelling}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};
