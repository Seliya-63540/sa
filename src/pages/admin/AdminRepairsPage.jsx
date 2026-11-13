import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { 
  Wrench, 
  CheckCheck, 
  Clock, 
  PackageCheck, 
  ArrowRight, 
  Eye, 
  Filter 
} from 'lucide-react';

export const AdminRepairsPage = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'ACTIVE';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialFilter); // ACTIVE, CHECKED_IN, IN_PROGRESS, COMPLETED, ALL

  const [confirmModal, setConfirmModal] = useState(null);

  const loadData = async () => {
    try {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load repairs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComplete = async (bookingId) => {
    try {
      await adminService.updateBookingStatus(bookingId, 'COMPLETED');
      setConfirmModal(null);
      await loadData();
    } catch (err) {
      alert('Failed to mark repair complete');
    }
  };

  const handleStartWork = async (bookingId) => {
    try {
      await adminService.updateBookingStatus(bookingId, 'IN_PROGRESS');
      await loadData();
    } catch (err) {
      alert('Failed to start work');
    }
  };

  const filteredRepairs = bookings.filter((b) => {
    if (activeTab === 'ACTIVE') return ['CHECKED_IN', 'IN_PROGRESS'].includes(b.status);
    if (activeTab === 'CHECKED_IN') return b.status === 'CHECKED_IN';
    if (activeTab === 'IN_PROGRESS') return b.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Workshop Repair Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Active workbench jobs, intake status, and single-click customer completion notification
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'ACTIVE', label: 'Active in Workshop' },
          { key: 'CHECKED_IN', label: 'Waiting on Bay (Received)' },
          { key: 'IN_PROGRESS', label: 'Under Repair' },
          { key: 'COMPLETED', label: 'Completed / Ready for Pickup' },
          { key: 'ALL', label: 'All Repairs' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Repair Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRepairs.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-2xl p-5 border shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4 ${
              r.status === 'IN_PROGRESS' ? 'border-cyan-400/80 ring-1 ring-cyan-100' : 'border-stone-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2.5 py-0.5 rounded">
                  {r.id}
                </span>
                <StatusBadge status={r.status} size="sm" />
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {r.cycleName}
                </h3>
                <p className="text-xs font-semibold text-emerald-800">
                  {r.serviceName}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Customer: <b>{r.customerName}</b> ({r.customerPhone})
                </p>
              </div>

              {r.problemDescription && (
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs text-stone-600 italic">
                  "{r.problemDescription}"
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>Appt Date: <b>{r.appointmentDate}</b></span>
                <span className="font-mono font-bold text-stone-900 font-sans">
                  ₹{r.finalCost || r.estimatedCost}
                </span>
              </div>
            </div>

            {/* Workbench Actions (Section 30) */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <Link
                to={`/admin/bookings/${r.id}`}
                className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl"
                title="Full Work Inspection"
              >
                <Eye className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-1.5">
                {r.status === 'CHECKED_IN' && (
                  <button
                    type="button"
                    onClick={() => handleStartWork(r.id)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Start Work</span>
                  </button>
                )}

                {r.status === 'IN_PROGRESS' && (
                  <button
                    type="button"
                    onClick={() => setConfirmModal(r)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Complete & Notify</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {confirmModal && (
        <ConfirmDialog
          isOpen={true}
          title={`Mark Repair ${confirmModal.id} Completed?`}
          message={`Cycle ${confirmModal.cycleName} will be marked ready for pickup. A completion notification will be issued to ${confirmModal.customerName}.`}
          confirmText="Complete & Notify Customer"
          variant="success"
          onConfirm={() => handleComplete(confirmModal.id)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};
