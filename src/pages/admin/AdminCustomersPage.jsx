import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  Users, 
  Search, 
  Phone, 
  Bike, 
  Calendar, 
  ChevronRight, 
  ShoppingBag 
} from 'lucide-react';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([
    {
      id: 'cust-current',
      name: 'Arbaz Seliya',
      phone: '9876543210',
      registeredAt: '2026-10-10',
      totalBookings: 2,
      completedServices: 1,
      purchasesCount: 1,
      recentActivity: 'Booking BK-2602 Confirmed'
    },
    {
      id: 'cust-001',
      name: 'Jayesh Patel',
      phone: '9825012345',
      registeredAt: '2026-10-14',
      totalBookings: 3,
      completedServices: 2,
      purchasesCount: 0,
      recentActivity: 'Repair IN_PROGRESS bay 1'
    },
    {
      id: 'cust-003',
      name: 'Ramesh Bhai Shah',
      phone: '9898112233',
      registeredAt: '2026-10-25',
      totalBookings: 1,
      completedServices: 0,
      purchasesCount: 0,
      recentActivity: 'Requested wheel truing'
    },
    {
      id: 'cust-004',
      name: 'Ketan Trivedi',
      phone: '9724155667',
      registeredAt: '2026-10-01',
      totalBookings: 2,
      completedServices: 2,
      purchasesCount: 1,
      recentActivity: 'Purchased Junior Champ 20T'
    }
  ]);
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Registered customer profiles, service records, and purchase history
          </p>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Customer Name</th>
                <th className="px-4 py-3.5">Mobile Phone</th>
                <th className="px-4 py-3.5">Member Since</th>
                <th className="px-4 py-3.5">Total Bookings</th>
                <th className="px-4 py-3.5">Completed Repairs</th>
                <th className="px-4 py-3.5">Recent Activity</th>
                <th className="px-5 py-3.5 text-right">View History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-stone-900">
                    {c.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-emerald-800 font-bold">
                    <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 font-mono">
                    {c.registeredAt}
                  </td>
                  <td className="px-4 py-3.5 font-bold">
                    {c.totalBookings}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-emerald-800">
                    {c.completedServices}
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 text-[11px]">
                    {c.recentActivity}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/admin/customers/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminCustomerDetailPage = () => {
  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="text-xs font-bold text-stone-500 hover:text-emerald-800">
        ← Back to Customers
      </Link>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Customer Profile</span>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-1">Arbaz Seliya</h2>
          <p className="text-xs font-mono text-stone-500">+91 98765 43210 • Registered Gujarat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-xs text-stone-400 block">Registered Cycles</span>
            <span className="text-lg font-bold text-stone-800 mt-1 block">Hero Sprint 26T, Safari TR-275</span>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-xs text-stone-400 block">Active Bookings</span>
            <span className="text-lg font-bold text-blue-700 mt-1 block">BK-2602 (Confirmed)</span>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-xs text-stone-400 block">Shop Purchase History</span>
            <span className="text-lg font-bold text-emerald-800 mt-1 block">1 Verified Shop Sale</span>
          </div>
        </div>
      </div>
    </div>
  );
};
