import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  Wrench, 
  CreditCard, 
  FileSpreadsheet 
} from 'lucide-react';

export const AdminReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    async function load() {
      const [st, sl, bk] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSales(),
        adminService.getAllBookings()
      ]);
      setStats(st);
      setSales(sl);
      setBookings(bk);
    }
    load();
  }, []);

  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.amountReceived, 0);
  const completedRepairs = bookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Business & Financial Reports
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified financial summaries, workshop service performance, and sales collection
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-200/80 p-1 rounded-xl text-xs font-bold">
          {['today', '7d', '30d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg uppercase ${
                timeRange === range ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Total Recorded Sales</span>
          <span className="text-2xl font-black text-stone-900 font-sans">₹{totalSalesRevenue.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">From in-person purchases</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Completed Services</span>
          <span className="text-2xl font-black text-stone-900 font-sans">{completedRepairs} jobs</span>
          <span className="text-[11px] text-blue-700 font-bold block mt-1">Workshop turnaround</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Total Appointments</span>
          <span className="text-2xl font-black text-stone-900 font-sans">{bookings.length}</span>
          <span className="text-[11px] text-stone-500 font-medium block mt-1">Online & direct bookings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Outstanding Receivables</span>
          <span className="text-2xl font-black text-rose-700 font-sans">₹{(stats?.outstandingPayments || 0).toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-rose-600 font-medium block mt-1">Unsettled customer balances</span>
        </div>
      </div>

      {/* Visual Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">
            Recorded Sales Breakdown
          </h2>
          <div className="space-y-3 text-xs">
            {sales.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div>
                  <p className="font-bold text-stone-900">{s.cycleName}</p>
                  <p className="text-[11px] text-stone-500">{s.customerName} • {s.paymentMethod}</p>
                </div>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  ₹{s.finalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Workshop Booking Status Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">
            Booking & Workshop Efficiency
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Total Bookings Received:</span>
              <span className="font-bold font-mono text-stone-900">{bookings.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Completed & Handed Over:</span>
              <span className="font-bold font-mono text-emerald-700">{completedRepairs}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Currently in Workshop (Bay):</span>
              <span className="font-bold font-mono text-cyan-700">
                {bookings.filter((b) => ['CHECKED_IN', 'IN_PROGRESS'].includes(b.status)).length}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-600">No-Show / Cancelled:</span>
              <span className="font-bold font-mono text-stone-500">
                {bookings.filter((b) => ['CANCELLED', 'NO_SHOW'].includes(b.status)).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
