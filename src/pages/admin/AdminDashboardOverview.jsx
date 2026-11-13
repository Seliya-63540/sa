import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Bike, 
  MessageSquare, 
  ShoppingBag, 
  CreditCard, 
  AlertTriangle, 
  ArrowRight, 
  PlusCircle, 
  Boxes, 
  CheckCheck, 
  UserX 
} from 'lucide-react';

export const AdminDashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-stone-500">Loading Workshop Dashboard...</p>
      </div>
    );
  }

  // 10 Statistics Cards (Section 25.2)
  const statCards = [
    { label: "Today's Bookings", val: stats?.todayBookingsCount || 0, icon: Calendar, color: 'text-stone-900', link: '/admin/bookings' },
    { label: 'Pending Requests', val: stats?.pendingRequestsCount || 0, icon: Clock, color: 'text-amber-700 font-bold', link: '/admin/bookings?filter=REQUESTED' },
    { label: 'Confirmed Appointments', val: stats?.confirmedAppointmentsCount || 0, icon: CheckCircle2, color: 'text-blue-700', link: '/admin/bookings?filter=CONFIRMED' },
    { label: 'Ongoing Repairs', val: stats?.ongoingRepairsCount || 0, icon: Wrench, color: 'text-cyan-700 font-bold', link: '/admin/repairs' },
    { label: 'Completed Repairs', val: stats?.completedRepairsCount || 0, icon: CheckCheck, color: 'text-emerald-700', link: '/admin/repairs?filter=COMPLETED' },
    { label: 'No-Show Bookings', val: stats?.noShowCount || 0, icon: UserX, color: 'text-purple-700', link: '/admin/bookings?filter=NO_SHOW' },
    { label: 'Available Cycles', val: stats?.availableCyclesCount || 0, icon: Bike, color: 'text-stone-800', link: '/admin/cycles' },
    { label: 'New Enquiries', val: stats?.newEnquiriesCount || 0, icon: MessageSquare, color: 'text-amber-800 font-bold', link: '/admin/enquiries' },
    { label: "Today's Sales", val: `₹${(stats?.todaySalesAmount || 0).toLocaleString('en-IN')}`, icon: ShoppingBag, color: 'text-emerald-900 font-black', link: '/admin/sales' },
    { label: 'Outstanding Payments', val: `₹${(stats?.outstandingPayments || 0).toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-rose-700 font-bold', link: '/admin/payments' }
  ];

  return (
    <div className="space-y-8">
      {/* 25.1 WELCOME & QUICK ACTIONS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Workshop Operations Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-0.5">
            SAFAR CYCLE Management
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Current Date: <b className="text-stone-700">{new Date().toDateString()}</b> • Physical Shop Gujarat
          </p>
        </div>

        {/* 25.5 QUICK ACTIONS BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/cycles/add"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Cycle</span>
          </Link>

          <Link
            to="/admin/sales/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Record Shop Sale</span>
          </Link>

          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Bookings</span>
          </Link>
        </div>
      </div>

      {/* 25.2 STATISTICS 10 CARDS GRID */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          Daily Business & Workshop Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-600 hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-[11px] font-semibold truncate pr-1">{card.label}</span>
                  <Icon className="w-4 h-4 shrink-0 group-hover:text-emerald-700 transition-colors" />
                </div>
                <div className={`text-xl sm:text-2xl font-black ${card.color} font-sans`}>
                  {card.val}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 25.3 & 25.4 ACTIVITY & PENDING ATTENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 25.3 Today's Workshop Activity (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Today's Workshop Schedule
              </h2>
              <p className="text-xs text-stone-500">
                Customer appointments scheduled for today
              </p>
            </div>
            <Link to="/admin/bookings" className="text-xs font-bold text-emerald-800 hover:underline">
              View Calendar →
            </Link>
          </div>

          {stats?.todayBookings && stats.todayBookings.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {stats.todayBookings.map((b) => (
                <div key={b.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        {b.id}
                      </span>
                      <StatusBadge status={b.status} size="sm" />
                      <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{b.appointmentTime}</span>
                      </span>
                    </div>

                    <p className="text-sm font-bold text-stone-900">
                      {b.customerName} • <span className="font-normal text-stone-600">{b.cycleName}</span>
                    </p>
                    <p className="text-xs text-stone-500">
                      Service: {b.serviceName}
                    </p>
                  </div>

                  <Link
                    to={`/admin/bookings/${b.id}`}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-800 text-xs font-bold transition-colors shrink-0"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">
              No appointments booked yet for today. Customers can book slots online or walk in.
            </p>
          )}
        </div>

        {/* 25.4 Pending Actions Requiring Owner Attention (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pending Approvals</span>
              </h2>
              <p className="text-xs text-stone-500">
                New service requests waiting for confirmation
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {stats?.pendingRequestsCount || 0}
            </span>
          </div>

          {stats?.pendingRequests && stats.pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {stats.pendingRequests.map((req) => (
                <div key={req.id} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-900">{req.id}</span>
                    <span className="text-[11px] text-amber-800 font-semibold">{req.appointmentDate} • {req.appointmentTime}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">{req.customerName} ({req.customerPhone})</p>
                    <p className="text-xs text-stone-600">{req.cycleName} — {req.serviceName}</p>
                  </div>
                  <div className="pt-1 flex justify-end">
                    <Link
                      to={`/admin/bookings/${req.id}`}
                      className="px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
                    >
                      Review & Confirm
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">
              All booking requests have been reviewed! Good job.
            </p>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
            <Link
              to="/admin/enquiries"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 font-medium"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Cycle Enquiries Waiting</span>
              </span>
              <span className="font-bold text-amber-800 font-mono">{stats?.newEnquiriesCount || 0}</span>
            </Link>

            <Link
              to="/admin/inventory"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 font-medium"
            >
              <span className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-700" />
                <span>Spare Parts Inventory</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
