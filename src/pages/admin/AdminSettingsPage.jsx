import React, { useState } from 'react';
import { BUSINESS_CONFIG, getFullAddress } from '../../config/business';
import { mockStore } from '../../services/mock/mockStore';
import { Settings, Save, RotateCcw, ShieldCheck, Check } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [savedNotice, setSavedNotice] = useState(false);

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo data (cycles, bookings, sales, inventory) back to initial factory state?')) {
      mockStore.resetToDefault();
      window.location.reload();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Business Settings & Workshop Parameters
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Centralized shop configuration, workshop capacity, hours, and demo storage controls
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDemoData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Store to Factory State</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully in runtime configuration!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Profile (From config/business.js) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              1. Centralized Business Information (src/config/business.js)
            </h2>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded-full">
              Central Config Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Business Name</label>
              <input
                type="text"
                disabled
                value={BUSINESS_CONFIG.BUSINESS_NAME}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 font-bold text-stone-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Brand Name (Gujarati)</label>
              <input
                type="text"
                disabled
                value={BUSINESS_CONFIG.BUSINESS_NAME_GUJARATI}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 font-bold text-stone-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Phone Number</label>
              <input
                type="text"
                disabled
                value={BUSINESS_CONFIG.CONTACT_NUMBER}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 font-mono text-stone-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">WhatsApp Number</label>
              <input
                type="text"
                disabled
                value={BUSINESS_CONFIG.WHATSAPP_NUMBER}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 font-mono text-stone-700 cursor-not-allowed"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">Shop Address</label>
              <input
                type="text"
                disabled
                value={getFullAddress()}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Workshop Operating Hours & Capacity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800 pb-3 border-b border-stone-100">
            2. Workshop Hours & Appointment Capacity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Daily Opening Time</label>
              <input
                type="text"
                defaultValue={BUSINESS_CONFIG.OPENING_TIME}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Daily Closing Time</label>
              <input
                type="text"
                defaultValue={BUSINESS_CONFIG.CLOSING_TIME}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Max Daily Bookings</label>
              <input
                type="number"
                defaultValue={BUSINESS_CONFIG.MAX_DAILY_BOOKINGS}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Slot Duration</label>
              <input
                type="text"
                defaultValue={`${BUSINESS_CONFIG.APPOINTMENT_SLOT_DURATION_MINUTES} minutes`}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">No-Show Grace Period</label>
              <input
                type="text"
                defaultValue={`${BUSINESS_CONFIG.NO_SHOW_GRACE_PERIOD_HOURS} hours`}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Confirmation Flow</label>
              <select className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 font-bold">
                <option value="MANUAL">Manual Owner Confirmation</option>
                <option value="AUTO">Automatic Slot Confirmation</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
            >
              Save Workshop Preferences
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
