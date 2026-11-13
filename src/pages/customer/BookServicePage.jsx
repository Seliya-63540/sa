import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingService } from '../../services/bookingService';
import { cycleService } from '../../services/cycleService';
import { BUSINESS_CONFIG } from '../../config/business';
import { 
  Calendar, 
  Wrench, 
  Bike, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';

export const BookServicePage = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId');

  const [services, setServices] = useState([]);
  const [customerCycles, setCustomerCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [selectedCycleId, setSelectedCycleId] = useState('custom');
  const [customCycleName, setCustomCycleName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || 'srv-001');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // Tomorrow as sensible default date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [problemDescription, setProblemDescription] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = [
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '12:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM',
    '07:30 PM'
  ];

  useEffect(() => {
    async function loadInitial() {
      try {
        const [servs, cycles] = await Promise.all([
          cycleService.getServices(),
          bookingService.getCustomerCycles(currentUser?.id || 'cust-current')
        ]);
        setServices(servs);
        setCustomerCycles(cycles);

        if (cycles.length > 0) {
          setSelectedCycleId(cycles[0].id);
        }
        if (preselectedServiceId) {
          setSelectedServiceId(preselectedServiceId);
        }
      } catch (err) {
        console.error('Error loading booking data', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, [currentUser, preselectedServiceId]);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name || '');
      if (!customerPhone) setCustomerPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter customer full name');
      return;
    }
    if (!customerPhone || customerPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    let cycleName = customCycleName;
    let cycleBrand = 'Custom';
    if (selectedCycleId !== 'custom') {
      const matched = customerCycles.find((c) => c.id === selectedCycleId);
      if (matched) {
        cycleName = `${matched.brand} ${matched.model || matched.nickname}`;
        cycleBrand = matched.brand;
      }
    }

    if (!cycleName.trim()) {
      setErrorMsg('Please enter or select a bicycle');
      return;
    }

    const selectedService = services.find((s) => s.id === selectedServiceId);

    setSubmitting(true);
    try {
      const newBooking = await bookingService.createBooking({
        customerId: currentUser?.id || 'cust-current',
        customerName,
        customerPhone,
        cycleName,
        cycleBrand,
        serviceId: selectedServiceId,
        serviceName: selectedService?.title || 'Cycle Service',
        serviceName_gu: selectedService?.title_gu || 'સાઇકલ સર્વિસ',
        appointmentDate,
        appointmentTime,
        problemDescription,
        estimatedCost: selectedService?.startingPrice || 150
      });

      // Navigate to booking detail page
      navigate(`/my-bookings/${newBooking.id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {language === 'gu' ? 'ઓનલાઇન સમય સ્લોટ બુકિંગ' : 'Easy Workshop Appointment'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            {t('booking.title', 'Book Cycle Servicing')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t('booking.subtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Cycle Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 block">
              1. {t('booking.selectCycle', 'Select Your Bicycle')} *
            </label>

            {customerCycles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                {customerCycles.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCycleId(c.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      selectedCycleId === c.id
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-600 font-bold ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{c.nickname}</p>
                      <p className="text-[11px] text-stone-500">{c.brand} {c.model} • {c.wheelSize}</p>
                    </div>
                    {selectedCycleId === c.id && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedCycleId('custom')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    selectedCycleId === 'custom'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-600 font-bold ring-1 ring-emerald-600'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{language === 'gu' ? '+ અન્ય સાઇકલ લખો' : '+ Enter Other Cycle'}</span>
                  {selectedCycleId === 'custom' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                </button>
              </div>
            )}

            {(selectedCycleId === 'custom' || customerCycles.length === 0) && (
              <div>
                <input
                  type="text"
                  required
                  value={customCycleName}
                  onChange={(e) => setCustomCycleName(e.target.value)}
                  placeholder={
                    language === 'gu'
                      ? 'જેમ કે: હીરો સ્પ્રિન્ટ ૨૬T અથવા સાદી એટલાસ સાઇકલ...'
                      : 'E.g., Hero Sprint 26T Red MTB...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>
            )}
          </div>

          {/* 2. Service Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 block">
              2. {t('booking.selectService', 'Select Required Service')} *
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-medium"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'gu' && s.title_gu ? s.title_gu : s.title} {s.startingPrice ? `(Starts ₹${s.startingPrice})` : '(Price after inspection)'}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Date & Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                3. {t('booking.selectDate', 'Preferred Date')} *
              </label>
              <input
                type="date"
                required
                value={appointmentDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t('booking.selectTime', 'Preferred Time Slot')} *
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Problem Description */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              4. {t('booking.problemDescription', 'Describe Problem or Symptoms')}
            </label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={t('booking.problemPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
            />
          </div>

          {/* 5. Contact Details */}
          <div className="pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
              5. {t('booking.customerDetails', 'Customer Contact Details')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('booking.name', 'Your Name')} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Arbaz Seliya"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('booking.phone', 'Mobile Number')} *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit phone"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Transparent Payment Notice (Section 46) */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === 'gu'
                ? BUSINESS_CONFIG.PAYMENT_POLICY_NOTICE_GUJARATI
                : BUSINESS_CONFIG.PAYMENT_POLICY_NOTICE}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            <Calendar className="w-5 h-5" />
            <span>{t('booking.submitBooking', 'Confirm & Book Service Appointment')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
