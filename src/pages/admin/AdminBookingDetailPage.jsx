import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BookingTimeline } from '../../components/common/BookingTimeline';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { 
  ArrowLeft, 
  PhoneCall, 
  MessageSquare, 
  Wrench, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCheck, 
  Save, 
  FileText 
} from 'lucide-react';

export const AdminBookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable work info
  const [internalNotes, setInternalNotes] = useState('');
  const [finalCost, setFinalCost] = useState('');
  const [savingWork, setSavingWork] = useState(false);
  const [statusActionOpen, setStatusActionOpen] = useState(null);

  const loadBooking = async () => {
    try {
      const all = await adminService.getAllBookings();
      const b = all.find((item) => item.id === id);
      if (b) {
        setBooking(b);
        setInternalNotes(b.internalNotes || '');
        setFinalCost(b.finalCost || b.estimatedCost || '');
      }
    } catch (err) {
      console.error('Failed to load booking detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const handleSaveWorkDetails = async (e) => {
    e.preventDefault();
    setSavingWork(true);
    try {
      await adminService.updateBookingStatus(
        id,
        booking.status,
        internalNotes,
        finalCost ? Number(finalCost) : null
      );
      await loadBooking();
      alert('Workshop repair notes and final cost saved!');
    } catch (err) {
      alert('Failed to save changes');
    } finally {
      setSavingWork(false);
    }
  };

  const handleTransition = async (newStatus) => {
    try {
      await adminService.updateBookingStatus(
        id,
        newStatus,
        internalNotes,
        finalCost ? Number(finalCost) : null
      );
      setStatusActionOpen(null);
      await loadBooking();
    } catch (err) {
      alert('Failed to transition status');
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-stone-500">Loading booking detail...</div>;
  }

  if (!booking) {
    return <div className="py-16 text-center text-xs text-stone-500">Booking not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Bookings</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-sm bg-stone-900 text-white px-2.5 py-1 rounded-lg">
                {booking.id}
              </span>
              <StatusBadge status={booking.status} size="md" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {booking.serviceName}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Cycle: <b className="text-stone-800">{booking.cycleName}</b> • Scheduled: <b>{booking.appointmentDate} at {booking.appointmentTime}</b>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${booking.customerPhone}`}
              className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700"
              title="Call customer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
            </a>
            <a
              href={`https://wa.me/91${booking.customerPhone}?text=${encodeURIComponent(`Hello ${booking.customerName}, regarding your booking ${booking.id} at SAFAR CYCLE.`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Customer</span>
            </a>
          </div>
        </div>

        {/* Status Transition Action Bar */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-stone-700">Workshop State Transition:</span>
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'REQUESTED' && (
              <>
                <button
                  type="button"
                  onClick={() => handleTransition('CONFIRMED')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Confirm Appointment
                </button>
                <button
                  type="button"
                  onClick={() => handleTransition('REJECTED')}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 text-xs font-bold"
                >
                  Reject
                </button>
              </>
            )}

            {booking.status === 'CONFIRMED' && (
              <>
                <button
                  type="button"
                  onClick={() => handleTransition('CHECKED_IN')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold"
                >
                  Mark Cycle Received
                </button>
                <button
                  type="button"
                  onClick={() => handleTransition('NO_SHOW')}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold"
                >
                  No Show
                </button>
              </>
            )}

            {booking.status === 'CHECKED_IN' && (
              <button
                type="button"
                onClick={() => handleTransition('IN_PROGRESS')}
                className="px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold flex items-center gap-1"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Start Work</span>
              </button>
            )}

            {booking.status === 'IN_PROGRESS' && (
              <button
                type="button"
                onClick={() => handleTransition('COMPLETED')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Complete & Notify Customer</span>
              </button>
            )}

            {['CANCELLED', 'REJECTED', 'NO_SHOW', 'COMPLETED'].includes(booking.status) && (
              <span className="text-xs text-stone-500 font-semibold italic">
                Terminal status reached ({booking.status})
              </span>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
            Workflow Progress
          </h2>
          <BookingTimeline status={booking.status} timeline={booking.timeline} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Cycle Info */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Customer & Bicycle Info
            </h3>
            <div>
              <span className="text-stone-400 block">Customer Name</span>
              <span className="font-bold text-stone-800 text-sm">{booking.customerName}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Mobile Phone</span>
              <span className="font-mono text-stone-800 font-bold">{booking.customerPhone}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Registered Cycle</span>
              <span className="font-bold text-stone-800">{booking.cycleName}</span>
              <span className="text-stone-500 block text-[11px]">{booking.cycleBrand}</span>
            </div>
            {booking.problemDescription && (
              <div>
                <span className="text-stone-400 block">Reported Problem</span>
                <span className="text-stone-700 italic font-medium">"{booking.problemDescription}"</span>
              </div>
            )}
          </div>

          {/* Payment & Financial Ledger */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Financial Summary (In-Person Shop)
            </h3>
            <div className="flex justify-between">
              <span className="text-stone-500">Initial Estimated Labor:</span>
              <span className="font-mono font-bold">₹{booking.estimatedCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Final Billed Amount:</span>
              <span className="font-mono font-bold text-sm text-stone-900">₹{booking.finalCost || booking.estimatedCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Amount Received at Counter:</span>
              <span className="font-mono font-bold text-emerald-800">₹{booking.amountPaid}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 font-black text-sm text-stone-900">
              <span>Outstanding Balance:</span>
              <span className="font-mono text-emerald-900">₹{booking.remainingAmount}</span>
            </div>

            <div className="pt-2">
              <Link
                to={`/admin/payments`}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment Received</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section 29 Work Information & Internal Notes Form */}
        <form onSubmit={handleSaveWorkDetails} className="space-y-4 pt-4 border-t border-stone-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Workshop Work Performed & Internal Notes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Final Bill Amount (₹)
              </label>
              <input
                type="number"
                min={0}
                value={finalCost}
                onChange={(e) => setFinalCost(e.target.value)}
                placeholder="Final amount"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">
                Internal Notes & Parts Replaced
              </label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="e.g. Fitted 26' tube, replaced rear brake shoe, oiled chain..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingWork}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Repair Notes & Final Cost</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
