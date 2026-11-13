import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { adminService } from '../../services/adminService';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  ShoppingBag, 
  Receipt, 
  Calendar, 
  CheckCircle, 
  FileText 
} from 'lucide-react';

export const MyPurchasesPage = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allSales = await adminService.getSales();
        // Match sales for current user
        const userSales = allSales.filter((s) => s.customerId === currentUser?.id || s.customerPhone === currentUser?.phone);
        setPurchases(userSales);
      } catch (err) {
        console.error('Failed to load purchases', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          {t('nav.myPurchases', 'My Purchase History')}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          {language === 'gu'
            ? 'અમારી દુકાન પરથી ખરીદેલ સાઇકલના ઇન-પર્સન સેલ્સ બિલ અને રસીદ'
            : 'Official in-person purchase receipts from SAFAR CYCLE'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((sale) => (
            <div
              key={sale.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span className="font-mono font-bold text-xs text-stone-800">
                    Receipt #{sale.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Paid Full
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-mono">
                  Date: {sale.saleDate}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {sale.cycleName}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Qty: {sale.quantity} • Payment Method: <b className="text-stone-800">{sale.paymentMethod}</b>
                  </p>
                  {sale.paymentReference && (
                    <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                      Ref: {sale.paymentReference}
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-400 block">Total Paid at Shop</span>
                  <span className="text-xl font-black text-emerald-900 font-sans">
                    ₹{sale.finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title={language === 'gu' ? 'કોઈ ખરીદી નોંધાયેલ નથી' : 'No Purchase History Yet'}
          description={
            language === 'gu'
              ? 'દુકાન પરથી સાઇકલ ખરીદી કર્યા પછી અહીં તમારી રસીદ જોઈ શકાશે.'
              : 'When you purchase a bicycle at our workshop, your official receipt will appear here.'
          }
        />
      )}
    </div>
  );
};
