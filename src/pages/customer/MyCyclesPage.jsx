import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { 
  Bike, 
  PlusCircle, 
  Trash2, 
  Wrench, 
  Check, 
  X 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyCyclesPage = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // New Cycle Form state
  const [formData, setFormData] = useState({
    nickname: '',
    brand: '',
    model: '',
    type: 'MTB',
    color: '',
    wheelSize: '26"',
    serialNumber: ''
  });

  const loadCycles = async () => {
    try {
      const data = await bookingService.getCustomerCycles(currentUser?.id || 'cust-current');
      setCycles(data);
    } catch (err) {
      console.error('Failed to load customer cycles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
  }, [currentUser]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nickname.trim() || !formData.brand.trim()) return;

    try {
      await bookingService.addCustomerCycle({
        ...formData,
        customerId: currentUser?.id || 'cust-current'
      });
      setModalOpen(false);
      setFormData({
        nickname: '',
        brand: '',
        model: '',
        type: 'MTB',
        color: '',
        wheelSize: '26"',
        serialNumber: ''
      });
      await loadCycles();
    } catch (err) {
      alert('Failed to register cycle');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await bookingService.deleteCustomerCycle(deleteTargetId);
      setDeleteTargetId(null);
      await loadCycles();
    } catch (err) {
      alert('Failed to remove cycle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {t('nav.myCycles', 'My Registered Bicycles')}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'gu'
              ? 'ઝડપી સર્વિસ બુકિંગ માટે તમારી સાઇકલોની માહિતી સાચવી રાખો'
              : 'Save your cycles for quick 1-click service appointments'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'gu' ? 'નવી સાઇકલ ઉમેરો' : 'Register New Cycle'}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-40 bg-stone-200 rounded-2xl animate-pulse" />
          <div className="h-40 bg-stone-200 rounded-2xl animate-pulse" />
        </div>
      ) : cycles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cycles.map((cycle) => (
            <div
              key={cycle.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Bike className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(cycle.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove cycle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {cycle.nickname}
                  </h3>
                  <p className="text-xs text-stone-600 font-semibold mt-0.5">
                    {cycle.brand} {cycle.model}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Type</span>
                    <span className="font-medium text-stone-700">{cycle.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Wheel Size</span>
                    <span className="font-medium text-stone-700">{cycle.wheelSize}</span>
                  </div>
                  {cycle.color && (
                    <div>
                      <span className="text-[10px] text-stone-400 block">Color</span>
                      <span className="font-medium text-stone-700">{cycle.color}</span>
                    </div>
                  )}
                  {cycle.serialNumber && (
                    <div>
                      <span className="text-[10px] text-stone-400 block">Serial / Frame</span>
                      <span className="font-mono text-[11px] text-stone-700">{cycle.serialNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100">
                <Link
                  to={`/book-service`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-800 font-bold text-xs transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'gu' ? 'આ સાઇકલ માટે સર્વિસ બુક કરો' : 'Book Service for this cycle'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bike}
          title={language === 'gu' ? 'કોઈ સાઇકલ રજીસ્ટર થયેલી નથી' : 'No Cycles Registered Yet'}
          description={
            language === 'gu'
              ? 'તમારી સાઇકલની વિગત ઉમેરો જેથી વારંવાર માહિતી ભર્યા વગર ઝડપથી બુકિંગ કરી શકાય.'
              : 'Add your cycle details here to streamline future repair and servicing requests.'
          }
          actionText={language === 'gu' ? 'સાઇકલ ઉમેરો' : 'Add First Cycle'}
          onAction={() => setModalOpen(true)}
        />
      )}

      {/* Add Cycle Modal (Section 19) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">
                {language === 'gu' ? 'નવી સાઇકલ રજીસ્ટ્રેશન' : 'Register a Bicycle'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {language === 'gu' ? 'સાઇકલનું ઉપનામ (Nickname)' : 'Cycle Nickname'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="e.g. My Red MTB"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {language === 'gu' ? 'બ્રાન્ડ' : 'Brand'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Hero, Firefox"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {language === 'gu' ? 'મોડેલ' : 'Model'}
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Sprint Pro"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {language === 'gu' ? 'સાઇકલ પ્રકાર' : 'Cycle Type'}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  >
                    <option value="Mountain">Mountain / MTB</option>
                    <option value="City">City / Regular</option>
                    <option value="Geared">Geared Hybrid</option>
                    <option value="Kids">Kids</option>
                    <option value="Road">Road</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {language === 'gu' ? 'વ્હીલ સાઇઝ' : 'Wheel Size'}
                  </label>
                  <input
                    type="text"
                    value={formData.wheelSize}
                    onChange={(e) => setFormData({ ...formData, wheelSize: e.target.value })}
                    placeholder='26", 27.5", 29"'
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {language === 'gu' ? 'રંગ' : 'Color'}
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g. Black / Green"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {language === 'gu' ? 'સીરીયલ નંબર (ઓપ્શનલ)' : 'Frame Serial # (opt)'}
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-700"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold shadow-xs hover:bg-emerald-900"
                >
                  {language === 'gu' ? 'સાચવો' : 'Save Cycle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title={language === 'gu' ? 'સાઇકલ કાઢી નાખવાની ખાતરી?' : 'Remove Registered Cycle?'}
        message="Are you sure you want to delete this bicycle from your profile? Past booking records will remain intact."
        confirmText={language === 'gu' ? 'કાઢી નાખો' : 'Remove'}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
