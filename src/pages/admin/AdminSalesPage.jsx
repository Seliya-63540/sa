import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  ShoppingBag, 
  PlusCircle, 
  Receipt, 
  CreditCard, 
  Search, 
  Calendar 
} from 'lucide-react';

export const AdminSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadSales = async () => {
    try {
      const data = await adminService.getSales();
      setSales(data);
    } catch (err) {
      console.error('Failed to load sales', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const filteredSales = sales.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.id?.toLowerCase().includes(q) ||
      s.customerName?.toLowerCase().includes(q) ||
      s.cycleName?.toLowerCase().includes(q)
    );
  });

  const totalCollected = sales.reduce((sum, s) => sum + s.amountReceived, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            In-Person Cycle Sales Ledger
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Record physical shop sales, counter cash receipts, and shop UPI transactions
          </p>
        </div>

        <Link
          to="/admin/sales/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Sale</span>
        </Link>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-stone-400 text-xs block mb-1">Total Sales Recorded</span>
          <span className="text-2xl font-black text-stone-900 font-sans">{sales.length} units</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-emerald-700 text-xs font-bold block mb-1">Total Counter Collections</span>
          <span className="text-2xl font-black text-emerald-900 font-sans">₹{totalCollected.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-stone-400 text-xs block mb-1">Payment Modes Supported</span>
          <span className="text-sm font-bold text-stone-800 mt-1 block">Cash & Shop QR (UPI)</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sale number, customer, or cycle..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Sale Reference</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Cycle Purchased</th>
                <th className="px-4 py-3.5">Final Amount</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-5 py-3.5 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                    {sale.id}
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 font-mono">
                    {sale.saleDate}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-stone-900">{sale.customerName}</p>
                    <p className="text-[11px] text-stone-500 font-mono">{sale.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-stone-900">
                    {sale.cycleName} (Qty: {sale.quantity})
                  </td>
                  <td className="px-4 py-3.5 font-black text-stone-900 font-sans text-sm">
                    ₹{sale.finalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                      {sale.paymentMethod}
                    </span>
                    {sale.paymentReference && (
                      <span className="block text-[10px] text-stone-400 font-mono mt-0.5">{sale.paymentReference}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold">
                    {sale.remainingBalance === 0 ? (
                      <span className="text-emerald-700 font-semibold">PAID</span>
                    ) : (
                      <span className="text-rose-600">₹{sale.remainingBalance}</span>
                    )}
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
