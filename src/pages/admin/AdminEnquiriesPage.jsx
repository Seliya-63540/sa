import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { getWhatsAppLink } from '../../config/business';
import { 
  MessageSquare, 
  CheckCircle, 
  X, 
  ExternalLink, 
  PhoneCall, 
  Clock, 
  Check 
} from 'lucide-react';

export const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const loadData = async () => {
    try {
      const data = await adminService.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateEnquiryStatus(id, newStatus, adminNoteInput);
      setSelectedEnquiry(null);
      setAdminNoteInput('');
      await loadData();
    } catch (err) {
      alert('Failed to update enquiry status');
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (activeFilter === 'ALL') return true;
    return e.status === activeFilter;
  });

  const statusColors = {
    NEW: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    CONTACTED: 'bg-blue-100 text-blue-900 border-blue-300',
    CONVERTED: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    CLOSED: 'bg-stone-100 text-stone-600 border-stone-200'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Customer Cycle Purchase Enquiries
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage inquiries submitted by customers interested in purchasing bicycles
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['ALL', 'NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === tab
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Enquiries Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEnquiries.map((enq) => (
          <div
            key={enq.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                  {enq.id}
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${statusColors[enq.status] || ''}`}>
                  {enq.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {enq.customerName}
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Phone: <a href={`tel:${enq.customerPhone}`} className="text-emerald-800 font-bold hover:underline">{enq.customerPhone}</a>
                </p>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs">
                <p className="text-[10px] uppercase font-bold text-stone-400">Target Bicycle:</p>
                <p className="font-bold text-stone-800">{enq.cycleName}</p>
                {enq.cyclePrice && (
                  <p className="font-black text-emerald-800 font-sans mt-0.5">₹{enq.cyclePrice.toLocaleString('en-IN')}</p>
                )}
              </div>

              <p className="text-xs text-stone-600 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                "{enq.message}"
              </p>

              {enq.adminNotes && (
                <div className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg">
                  <span className="font-bold text-stone-700 block">Owner Note:</span>
                  <span>{enq.adminNotes}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <a
                href={`https://wa.me/91${enq.customerPhone}?text=${encodeURIComponent(`Hello ${enq.customerName}, regarding your inquiry for ${enq.cycleName} at SAFAR CYCLE.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSelectedEnquiry(enq);
                  setAdminNoteInput(enq.adminNotes || '');
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Status & Notes Update */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Update Enquiry: {selectedEnquiry.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p><b>Customer:</b> {selectedEnquiry.customerName} ({selectedEnquiry.customerPhone})</p>
              <p><b>Interested in:</b> {selectedEnquiry.cycleName}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Internal Note / Response</label>
              <textarea
                rows={3}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="e.g. Spoke on phone, invited for test ride Saturday..."
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Change Status:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedEnquiry.id, 'CONTACTED')}
                  className="py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs"
                >
                  Contacted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedEnquiry.id, 'CONVERTED')}
                  className="py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Converted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedEnquiry.id, 'CLOSED')}
                  className="py-2 rounded-xl bg-stone-700 hover:bg-stone-800 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
