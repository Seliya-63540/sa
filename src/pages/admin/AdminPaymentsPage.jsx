import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  CreditCard, 
  PlusCircle, 
  Search, 
  Receipt, 
  Check, 
  X 
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New Payment Form
  const [formData, setFormData] = useState({
    referenceId: 'BK-2601',
    customerName: '',
    type: 'WORKSHOP_SERVICE',
    totalAmount: '',
    amountReceived: '',
    paymentMethod: 'CASH'
  });

  const loadPayments = async () => {
    try {
      const data = await adminService.getPayments();
      setPayments(data);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.amountReceived) return;

    try {
      await adminService.recordPayment({
        ...formData,
        totalAmount: Number(formData.totalAmount) || Number(formData.amountReceived),
        amountReceived: Number(formData.amountReceived)
      });
      setModalOpen(false);
      setFormData({
        referenceId: '',
        customerName: '',
        type: 'WORKSHOP_SERVICE',
        totalAmount: '',
        amountReceived: '',
        paymentMethod: 'CASH'
      });
      await loadPayments();
    } catch (err) {
      alert('Failed to record payment');
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + (p.amountReceived || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Payments Received Ledger
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Record physical payments collected in Cash or Shop UPI against sales and repairs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Total Payments Logged</span>
          <span className="text-2xl font-black text-stone-900 font-sans">{payments.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-emerald-700 font-bold block mb-1">Total Cash & UPI Collected</span>
          <span className="text-2xl font-black text-emerald-900 font-sans">₹{totalCollected.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 block mb-1">Verification Standard</span>
          <span className="text-xs font-bold text-stone-800 mt-1 block">In-person workshop register only</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Payment ID</th>
                <th className="px-4 py-3.5">Related Job / Sale Ref</th>
                <th className="px-4 py-3.5">Customer Name</th>
                <th className="px-4 py-3.5">Amount Collected</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Recorded At</th>
                <th className="px-5 py-3.5 text-right">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                    {p.id}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-emerald-800">
                    {p.referenceId}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-stone-900">
                    {p.customerName}
                  </td>
                  <td className="px-4 py-3.5 font-black text-stone-900 font-sans text-sm">
                    ₹{p.amountReceived.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 font-mono text-[11px]">
                    {p.paymentDate}
                  </td>
                  <td className="px-5 py-3.5 text-right text-stone-500 text-[11px]">
                    {p.recordedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">Record In-Person Payment</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Related Job / Booking Ref (e.g. BK-2601)</label>
                <input
                  type="text"
                  required
                  value={formData.referenceId}
                  onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                  placeholder="BK-XXXX or SALE-XXX"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Ketan Shah"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Amount Collected (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amountReceived}
                    onChange={(e) => setFormData({ ...formData, amountReceived: e.target.value })}
                    placeholder="e.g. 350"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
                  >
                    <option value="CASH">Cash at Counter</option>
                    <option value="UPI">Shop QR (UPI)</option>
                    <option value="OTHER">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold shadow-xs hover:bg-emerald-900"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
