import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Clock, X } from 'lucide-react';

export const BookingTimeline = ({ status, timeline = [] }) => {
  const { language } = useLanguage();

  const standardSteps = [
    { key: 'REQUESTED', label_en: 'Requested', label_gu: 'વિનંતી મોકલેલ' },
    { key: 'CONFIRMED', label_en: 'Confirmed', label_gu: 'કન્ફર્મ થયેલ' },
    { key: 'CHECKED_IN', label_en: 'Cycle Received', label_gu: 'સાઇકલ જમા' },
    { key: 'IN_PROGRESS', label_en: 'In Progress', label_gu: 'કામ ચાલુ' },
    { key: 'COMPLETED', label_en: 'Completed', label_gu: 'સર્વિસ પૂર્ણ' }
  ];

  const isTerminalNegative = ['CANCELLED', 'REJECTED', 'NO_SHOW'].includes(status);

  // Find index in standard flow
  const currentStepIndex = standardSteps.findIndex((s) => s.key === status);

  const getTimelineDate = (stepKey) => {
    const entry = timeline.find((t) => t.status === stepKey);
    return entry ? entry.date : null;
  };

  return (
    <div className="py-2">
      {/* Mobile-friendly horizontal progress for normal statuses */}
      {!isTerminalNegative ? (
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0 hidden sm:block" />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2">
            {standardSteps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;
              const dateStr = getTimelineDate(step.key);

              return (
                <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-2xs ${
                      isCurrent
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isPassed
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-100 text-stone-400 border border-stone-300'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>

                  <span
                    className={`text-xs mt-2 font-medium leading-tight ${
                      isCurrent
                        ? 'text-emerald-800 font-bold'
                        : isPassed
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {language === 'gu' ? step.label_gu : step.label_en}
                  </span>

                  {dateStr && (
                    <span className="text-[10px] text-stone-500 mt-0.5 font-mono">
                      {dateStr}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Alternative branch presentation for CANCELLED, REJECTED, NO_SHOW */
        <div className="rounded-xl bg-stone-100 p-4 border border-stone-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <X className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              {status === 'CANCELLED'
                ? language === 'gu' ? 'બુકિંગ રદ કરવામાં આવી છે' : 'Booking Cancelled'
                : status === 'REJECTED'
                ? language === 'gu' ? 'બુકિંગ વિનંતી નામંજૂર કરવામાં આવી છે' : 'Booking Rejected'
                : language === 'gu' ? 'ગ્રાહક આવ્યા નથી (No Show)' : 'Marked as No Show'}
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              {status === 'CANCELLED'
                ? language === 'gu' ? 'આ બુકિંગ રદ થયેલ છે. આપ નવેસરથી નવી બુકિંગ કરાવી શકો છો.' : 'This booking was cancelled. You may book a fresh appointment anytime.'
                : status === 'REJECTED'
                ? language === 'gu' ? 'પસંદ કરેલા સમય સ્લોટમાં જગ્યા ન હોવાથી નામંજૂર થયેલ છે.' : 'We could not accommodate this booking due to slot capacity.'
                : language === 'gu' ? 'નિયત સમયે ગ્રાહક વર્કશોપ પર ઉપસ્થિત રહ્યા નથી.' : 'Customer did not arrive during the scheduled appointment window.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
