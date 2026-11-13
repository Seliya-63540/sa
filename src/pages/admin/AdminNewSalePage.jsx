import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { cycleService } from '../../services/cycleService';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  User, 
  CreditCard, 
  AlertCircle 
} from 'lucide-react';

export const AdminNewSalePage = () => {
  const navigate = useNavigate();

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [customerType, setCustomerType] = useState('Walk-in'); // 'Walk-in' or 'Registered'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // CASH, UPI, OTHER
  const [amountReceived, setAmountReceived] = useState(0);
  const [paymentReference, setPaymentReference] = useState('Cash counter receipt');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await cycleService.getAllCycles();
        setCycles(data.filter((c) => c.stock > 0));
        if (data.length > 0) {
          const first = data[0];
          setSelectedCycleId(first.id);
          setSellingPrice(first.price);
          setAmountReceived(first.price);
        }
      } catch (err) {
        console.error('Failed to load cycles for sale', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCycleChange = (cycleId) => {
    setSelectedCycleId(cycleId);
    const chosen = cycles.find((c) => c.id === cycleId);
    if (chosen) {
      setSellingPrice(chosen.price);
      const sub = chosen.price * quantity;
      const finalAmt = Math.max(0, sub - Number(discount));
      setAmountReceived(finalAmt);
    }
  };

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);
  const subtotal = (Number(sellingPrice) || 0) * (Number(quantity) || 1);
  const finalAmount = Math.max(0, subtotal - (Number(discount) || 0));
  const remainingBalance = Math.max(0, finalAmount - (Number(amountReceived) || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please provide customer name');
      return;
    }
    if (!customerPhone || customerPhone.length < 10) {
      setError('Please provide valid 10-digit customer phone number');
      return;
    }
    if (!selectedCycle) {
      setError('Please choose an in-stock cycle');
      return;
    }
    if (quantity > selectedCycle.stock) {
      setError(`Cannot sell ${quantity} units. Only ${selectedCycle.stock} currently in stock.`);
      return;
    }

    setSubmitting(true);
    try {
      await adminService.recordSale({
        customerType,
        customerName,
        customerPhone,
        cycleId: selectedCycle.id,
        cycleName: selectedCycle.name,
        quantity: Number(quantity),
        subtotal,
        discount: Number(discount) || 0,
        finalAmount,
        amountReceived: Number(amountReceived) || 0,
        paymentMethod,
        paymentReference
      });
      navigate('/admin/sales');
    } catch (err) {
      setError(err.message || 'Failed to record sale');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2">
        <Link
          to="/admin/sales"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sales</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Physical Counter Transaction
          </span>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
            Record New Cycle Sale
          </h1>
          <p className="text-xs text-stone-500">
            Record in-person bicycle sales made at SAFAR CYCLE physical workshop
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Customer Type & Info */}
          <div className="space-y-3 pb-4 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              1. Customer Information
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCustomerType('Walk-in')}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                  customerType === 'Walk-in'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                Walk-in Counter Customer
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('Registered')}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                  customerType === 'Registered'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                Registered Customer
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Nilesh Patel"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Product & Quantity */}
          <div className="space-y-3 pb-4 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              2. Selected Bicycle & Stock
            </h2>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Select Cycle for Sale *</label>
              <select
                value={selectedCycleId}
                onChange={(e) => handleCycleChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 font-medium"
              >
                {cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — ₹{c.price.toLocaleString('en-IN')} (Stock: {c.stock} in shop)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={selectedCycle?.stock || 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Discount (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 pb-4 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              3. Payment Collected at Counter
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold"
                >
                  <option value="CASH">Cash at Counter</option>
                  <option value="UPI">Shop QR (UPI)</option>
                  <option value="OTHER">Other Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Amount Collected (₹) *</label>
                <input
                  type="number"
                  min={0}
                  max={finalAmount}
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-bold text-emerald-800 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Reference / Note</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. UPI Ref / Cash drawer"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50 font-mono text-xs"
                />
              </div>
            </div>

            {/* Calculations breakdown */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({quantity} x ₹{sellingPrice}):</span>
                <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Discount applied:</span>
                <span className="font-mono">- ₹{Number(discount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                <span>Final Payable:</span>
                <span className="font-mono">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold pt-1">
                <span>Remaining Due:</span>
                <span className={`font-mono ${remainingBalance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  ₹{remainingBalance.toLocaleString('en-IN')} {remainingBalance === 0 && '(Fully Paid)'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              to="/admin/sales"
              className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              {submitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              <Check className="w-4 h-4" />
              <span>Record & Save Sale</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
