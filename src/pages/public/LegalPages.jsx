import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../config/business';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="flex items-center gap-2 text-emerald-800">
        <ShieldCheck className="w-6 h-6" />
        <span className="text-xs font-bold uppercase tracking-wider">Legal & Transparency</span>
      </div>
      <h1 className="text-3xl font-black text-stone-900 tracking-tight">
        Privacy Policy — {BUSINESS_CONFIG.BUSINESS_NAME}
      </h1>
      <div className="prose prose-stone text-stone-700 text-sm leading-relaxed space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200">
        <p>
          At {BUSINESS_CONFIG.BUSINESS_NAME}, we value your trust and are committed to protecting your personal information. This Privacy Policy outlines how your data is collected and used.
        </p>
        <h3 className="text-base font-bold text-stone-900 mt-4">1. Information We Collect</h3>
        <p>
          We only collect information necessary to process your cycle purchase enquiries and service appointments: your full name, mobile phone number, cycle details, and problem descriptions.
        </p>
        <h3 className="text-base font-bold text-stone-900 mt-4">2. Payment Policy</h3>
        <p>
          {BUSINESS_CONFIG.PAYMENT_POLICY_NOTICE}
        </p>
        <h3 className="text-base font-bold text-stone-900 mt-4">3. Data Security</h3>
        <p>
          We do not sell, rent, or share customer contact details with third-party advertisers. Your contact information is solely used by workshop staff to communicate regarding your cycle service, booking confirmations, or purchase enquiries.
        </p>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="flex items-center gap-2 text-emerald-800">
        <ShieldCheck className="w-6 h-6" />
        <span className="text-xs font-bold uppercase tracking-wider">Shop Terms</span>
      </div>
      <h1 className="text-3xl font-black text-stone-900 tracking-tight">
        Terms & Conditions — {BUSINESS_CONFIG.BUSINESS_NAME}
      </h1>
      <div className="prose prose-stone text-stone-700 text-sm leading-relaxed space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200">
        <p>
          By booking a service appointment or submitting a cycle purchase enquiry with {BUSINESS_CONFIG.BUSINESS_NAME}, you agree to the following business terms:
        </p>
        <h3 className="text-base font-bold text-stone-900 mt-4">1. Service Appointments & Capacity</h3>
        <p>
          Bookings are subject to workshop capacity and mechanics availability. We request customers to arrive within the scheduled appointment window. A grace period of {BUSINESS_CONFIG.NO_SHOW_GRACE_PERIOD_HOURS} hours is maintained.
        </p>
        <h3 className="text-base font-bold text-stone-900 mt-4">2. Inspection & Parts Estimation</h3>
        <p>
          Initial prices shown on the website represent standard labor starting rates. If internal damage, broken spokes, or severely worn components are discovered upon disassembly, our mechanics will notify you before fitting replacement parts.
        </p>
        <h3 className="text-base font-bold text-stone-900 mt-4">3. In-Person Payment Only</h3>
        <p>
          All transactions are settled directly at the workshop counter via Cash or Shop UPI upon collection and inspection of your bicycle.
        </p>
      </div>
    </div>
  );
};
