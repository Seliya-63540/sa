import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  PackageCheck, 
  Wrench, 
  CheckCheck, 
  Eye, 
  List, 
  CalendarDays, 
  UserX 
} from 'lucide-react';

export const AdminBookingsPage = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'ALL';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [viewMode, setViewMode] = useState('list'); // list or calendar
  const [search, setSearch] = useState('');

  // Confirmation modal state
  const [pendingAction, setPendingAction] = useState(null); // { id, newStatus, title, message, variant }
  const [actionLoading, setActionLoading] = useState(false);

  const loadBookings = async () => {
    try {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleExecuteAction = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      await adminService.updateBookingStatus(
        pendingAction.id,
        pendingAction.newStatus,
        pendingAction.note || ''
      );
      setPendingAction(null);
      await loadBookings();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const mName = b.customerName?.toLowerCase().includes(q);
        const mPhone = b.customerPhone?.includes(q);
        const mId = b.id?.toLowerCase().includes(q);
        const mCycle = b.cycleName?.toLowerCase().includes(q);
        if (!mName && !mPhone && !mId && !mCycle) return false;
      }

      if (activeFilter === 'TODAY') return b.appointmentDate === todayStr;
      if (activeFilter === 'UPCOMING') return ['REQUESTED', 'CONFIRMED'].includes(b.status);
      if (activeFilter === 'ALL') return true;
      return b.status === activeFilter;
    });
  }, [bookings, search, activeFilter, todayStr]);

  const filterTabs = [
    { key: 'ALL', label: 'All Bookings' },
    { key: 'TODAY', label: "Today's Schedule" },
    { key: 'REQUESTED', label: 'Requested (New)' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'CHECKED_IN', label: 'Cycle Received' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
    { key: 'NO_SHOW', label: 'No Show' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Service Bookings & Appointments
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage customer workshop reservations, cycle intake, repair workflow, and completion
          </p>
        </div>

        {/* View toggle (List vs Calendar/Day schedule) */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === 'calendar' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar Slots</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, customer name, phone, or cycle..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.key
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: List or Calendar View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Booking ID & Date</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Bicycle</th>
                  <th className="px-4 py-3.5">Service Requested</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Bill / Est</th>
                  <th className="px-5 py-3.5 text-right">Quick Transition Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-stone-900 block">{b.id}</span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{b.appointmentDate} at {b.appointmentTime}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-stone-900">{b.customerName}</p>
                      <a href={`tel:${b.customerPhone}`} className="text-[11px] font-mono text-emerald-800 hover:underline">
                        {b.customerPhone}
                      </a>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-stone-800">
                      {b.cycleName}
                    </td>

                    <td className="px-4 py-3.5 text-stone-600">
                      {b.serviceName}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={b.status} size="sm" />
                    </td>

                    <td className="px-4 py-3.5 font-sans font-bold text-stone-900">
                      ₹{b.finalCost || b.estimatedCost}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Section 28 Quick Actions */}
                        {b.status === 'REQUESTED' && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  id: b.id,
                                  newStatus: 'CONFIRMED',
                                  title: `Confirm Appointment ${b.id}?`,
                                  message: `Confirm appointment for ${b.customerName} on ${b.appointmentDate} at ${b.appointmentTime}. Customer will receive an in-app confirmation alert.`,
                                  variant: 'primary'
                                })
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px]"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  id: b.id,
                                  newStatus: 'REJECTED',
                                  title: `Reject Request ${b.id}?`,
                                  message: 'Reject this booking due to capacity limitation or slot unavailability.',
                                  variant: 'danger'
                                })
                              }
                              className="px-2 py-1 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.status === 'CONFIRMED' && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  id: b.id,
                                  newStatus: 'CHECKED_IN',
                                  title: `Cycle Received at Workshop?`,
                                  message: `Mark that ${b.customerName} has arrived and handed over the bicycle at the workshop.`,
                                  variant: 'primary'
                                })
                              }
                              className="px-2.5 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[11px] flex items-center gap-1"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>Cycle Received</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  id: b.id,
                                  newStatus: 'NO_SHOW',
                                  title: `Mark as No Show?`,
                                  message: `Customer did not arrive within the appointment grace window.`,
                                  variant: 'danger'
                                })
                              }
                              className="px-2 py-1 rounded-lg border border-stone-300 text-stone-600 text-[11px]"
                            >
                              No Show
                            </button>
                          </>
                        )}

                        {b.status === 'CHECKED_IN' && (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({
                                id: b.id,
                                newStatus: 'IN_PROGRESS',
                                title: `Start Workshop Repair?`,
                                message: `Move bicycle to mechanic workbench and begin active repair.`,
                                variant: 'primary'
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-[11px] flex items-center gap-1"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Start Work</span>
                          </button>
                        )}

                        {b.status === 'IN_PROGRESS' && (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({
                                id: b.id,
                                newStatus: 'COMPLETED',
                                title: `Complete & Notify Customer?`,
                                message: `Mark repair as completed and notify ${b.customerName} that their cycle is ready for collection at the shop.`,
                                variant: 'success'
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Complete & Notify</span>
                          </button>
                        )}

                        <Link
                          to={`/admin/bookings/${b.id}`}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Rows */}
          <div className="lg:hidden divide-y divide-stone-100">
            {filteredBookings.map((b) => (
              <div key={b.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                      {b.id}
                    </span>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <span className="font-sans font-black text-sm text-stone-900">
                    ₹{b.finalCost || b.estimatedCost}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-stone-900 text-sm">{b.customerName} ({b.customerPhone})</p>
                  <p className="text-xs text-stone-600 font-medium">{b.cycleName} • {b.serviceName}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5 font-mono">
                    {b.appointmentDate} at {b.appointmentTime}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                  <Link
                    to={`/admin/bookings/${b.id}`}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    View Details →
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {b.status === 'REQUESTED' && (
                      <button
                        onClick={() =>
                          setPendingAction({
                            id: b.id,
                            newStatus: 'CONFIRMED',
                            title: `Confirm Appointment ${b.id}?`,
                            message: `Confirm slot for ${b.customerName}.`,
                            variant: 'primary'
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() =>
                          setPendingAction({
                            id: b.id,
                            newStatus: 'CHECKED_IN',
                            title: `Receive Cycle?`,
                            message: `Customer handed in cycle.`,
                            variant: 'primary'
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-indigo-700 text-white font-bold text-xs"
                      >
                        Receive Cycle
                      </button>
                    )}
                    {b.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() =>
                          setPendingAction({
                            id: b.id,
                            newStatus: 'COMPLETED',
                            title: `Complete & Notify Customer?`,
                            message: `Mark job done and send collection notification.`,
                            variant: 'success'
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                      >
                        Complete & Notify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Calendar / Daily Schedule View */
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900">
              Workshop Schedule by Time Slot ({todayStr})
            </h2>
            <span className="text-xs text-stone-500 font-mono">Date: {todayStr}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'].map((slot) => {
              const slotBookings = bookings.filter((b) => b.appointmentTime === slot);
              return (
                <div key={slot} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{slot}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold">
                      {slotBookings.length} jobs
                    </span>
                  </div>

                  {slotBookings.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {slotBookings.map((sb) => (
                        <Link
                          key={sb.id}
                          to={`/admin/bookings/${sb.id}`}
                          className="block p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-600 transition-colors shadow-2xs text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-[10px] text-stone-700">{sb.id}</span>
                            <StatusBadge status={sb.status} size="sm" />
                          </div>
                          <p className="font-bold text-stone-900 truncate">{sb.customerName}</p>
                          <p className="text-[11px] text-stone-500 truncate">{sb.cycleName}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400 italic py-2">Slot Available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {pendingAction && (
        <ConfirmDialog
          isOpen={true}
          title={pendingAction.title}
          message={pendingAction.message}
          confirmText="Confirm Action"
          variant={pendingAction.variant || 'primary'}
          isLoading={actionLoading}
          onConfirm={handleExecuteAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};
