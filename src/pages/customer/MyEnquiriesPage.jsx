import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { enquiryService } from '../../services/enquiryService';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  BUSINESS_CONFIG, 
  getWhatsAppLink 
} from '../../config/business';
import { 
  MessageSquare, 
  Calendar, 
  Bike, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';

export const MyEnquiriesPage = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await enquiryService.getMyEnquiries(currentUser?.id || 'cust-current');
        setEnquiries(data);
      } catch (err) {
        console.error('Failed to load enquiries', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const statusBadges = {
    NEW: { label: 'New / Received', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    CONTACTED: { label: 'Shop Contacted', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    CONVERTED: { label: 'Purchased in Shop', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    CLOSED: { label: 'Closed', color: 'bg-stone-100 text-stone-600 border-stone-200' },
    CANCELLED: { label: 'Cancelled', color: 'bg-stone-100 text-stone-600 border-stone-200' }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {t('nav.myEnquiries', 'My Cycle Purchase Enquiries')}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'gu'
              ? 'નવી સાઇકલ ખરીદવા અંગે તમે મોકલેલી પૂછપરછની સ્થિતિ'
              : 'Track responses to your inquiries for in-stock bicycles'}
          </p>
        </div>

        <Link
          to="/cycles"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-emerald-900 transition-colors self-start sm:self-auto"
        >
          <Bike className="w-4 h-4" />
          <span>{t('common.exploreCycles', 'Explore More Cycles')}</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />
        </div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const badge = statusBadges[enq.status] || statusBadges.NEW;
            return (
              <div
                key={enq.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                      {enq.id}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-400 font-mono">
                    {enq.date}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {enq.cycleName}
                  </h3>
                  {enq.cyclePrice && (
                    <p className="text-xs font-bold text-emerald-800 font-sans mt-0.5">
                      ₹{enq.cyclePrice.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-700">
                  <p className="font-semibold text-stone-500 text-[10px] uppercase mb-0.5">Your Inquiry Message:</p>
                  <p className="italic">"{enq.message}"</p>
                </div>

                {enq.adminNotes && (
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 text-xs text-emerald-950">
                    <p className="font-bold text-emerald-800 text-[10px] uppercase mb-0.5">Shop Response / Status Note:</p>
                    <p>{enq.adminNotes}</p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    * Inquiries are finalized in-person at the workshop
                  </span>
                  <a
                    href={getWhatsAppLink(`Hello SAFAR CYCLE, inquiring about ${enq.cycleName} (Enquiry ID: ${enq.id})`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    <span>Contact Shop</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No Purchase Enquiries Yet"
          description="Interested in a bicycle? Explore our showroom and send an inquiry for test-rides or stock queries."
          actionText={t('common.exploreCycles', 'Explore Cycles')}
          onAction={() => window.location.assign('/cycles')}
        />
      )}
    </div>
  );
};
