/**
 * SAFAR CYCLE - Centralized Business Information Configuration
 * 
 * All public contact details, address, opening hours, and links are managed here.
 * As per specification, replaceable placeholder values are used for details that
 * will be provided by the business owner.
 */

export const BUSINESS_CONFIG = {
  BUSINESS_NAME: "SAFAR CYCLE",
  BUSINESS_NAME_GUJARATI: "સફર સાઇકલ",
  BUSINESS_TAGLINE: "Your Cycle, Our Care",
  BUSINESS_TAGLINE_GUJARATI: "તમારી સાઇકલ, અમારી સંભાળ",
  BUSINESS_DESCRIPTION: "Local cycle shop and expert workshop in Gujarat. Quality new bicycles, genuine spare parts, and trusted repair and maintenance services.",
  BUSINESS_DESCRIPTION_GUJARATI: "ગુજરાતમાં તમારી પોતાની સ્થાનિક સાઇકલ શોપ અને વર્કશોપ. નવી સાઇકલોનું વેચાણ, અસલી સ્પેરપાર્ટ્સ અને વિશ્વાસપાત્ર સર્વિસિંગ.",
  
  // Replaceable contact details (clean placeholders)
  SHOP_ADDRESS: "Opp. City Bus Station, Station Road",
  CITY: "Ahmedabad",
  DISTRICT: "Ahmedabad",
  STATE: "Gujarat",
  PINCODE: "380001",
  
  CONTACT_NUMBER: "+91 98765 43210",
  WHATSAPP_NUMBER: "+919876543210",
  BUSINESS_EMAIL: "contact@safarcycle.in",
  
  OPENING_TIME: "09:00 AM",
  CLOSING_TIME: "08:30 PM",
  OPENING_DAYS: "Monday - Saturday (Sunday 10:00 AM - 02:00 PM)",
  OPENING_DAYS_GUJARATI: "સોમવાર - શનિવાર (રવિવારે સવારે ૧૦ થી બપોરે ૨)",
  
  GOOGLE_MAPS_URL: "https://maps.google.com/?q=Station+Road+Ahmedabad+Gujarat",
  INSTAGRAM_URL: "https://instagram.com/safarcycle",
  FACEBOOK_URL: "https://facebook.com/safarcycle",
  YOUTUBE_URL: "",
  
  PRIVACY_POLICY_URL: "/privacy-policy",
  TERMS_URL: "/terms",
  
  // Workshop specific parameters
  APPOINTMENT_SLOT_DURATION_MINUTES: 45,
  MAX_DAILY_BOOKINGS: 15,
  ALLOW_AUTO_CONFIRM: false,
  NO_SHOW_GRACE_PERIOD_HOURS: 2,
  
  // Payment policy
  PAYMENT_POLICY_NOTICE: "Payment is strictly handled in-person at the workshop (Cash or Shop UPI). No online payment is collected through this app.",
  PAYMENT_POLICY_NOTICE_GUJARATI: "પેમેન્ટ ફક્ત શોપ પર રૂબરૂમાં સ્વીકારવામાં આવે છે (કેશ અથવા યુપીઆઈ). આ એપ દ્વારા કોઈ ઓનલાઈન પેમેન્ટ લેવામાં આવતું નથી."
};

export const getFullAddress = () => {
  return `${BUSINESS_CONFIG.SHOP_ADDRESS}, ${BUSINESS_CONFIG.CITY}, ${BUSINESS_CONFIG.DISTRICT}, ${BUSINESS_CONFIG.STATE} - ${BUSINESS_CONFIG.PINCODE}`;
};

export const getWhatsAppLink = (message = "Hello SAFAR CYCLE, I have an enquiry.") => {
  const cleanPhone = BUSINESS_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const getPhoneCallLink = () => {
  const cleanPhone = BUSINESS_CONFIG.CONTACT_NUMBER.replace(/[^0-9+]/g, "");
  return `tel:${cleanPhone}`;
};
