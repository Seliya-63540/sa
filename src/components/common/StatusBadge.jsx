import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Clock, 
  CheckCircle2, 
  Wrench, 
  CheckCheck, 
  XCircle, 
  AlertTriangle,
  UserX,
  PackageCheck
} from 'lucide-react';

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const { language, t } = useLanguage();

  const config = {
    REQUESTED: {
      color: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: Clock,
      label_en: 'Requested',
      label_gu: 'વિનંતી મોકલેલ'
    },
    CONFIRMED: {
      color: 'bg-blue-50 text-blue-800 border-blue-200/80',
      icon: CheckCircle2,
      label_en: 'Confirmed',
      label_gu: 'કન્ફર્મ થયેલ'
    },
    CHECKED_IN: {
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      icon: PackageCheck,
      label_en: 'Cycle Received',
      label_gu: 'સાઇકલ જમા લીધી'
    },
    IN_PROGRESS: {
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
      icon: Wrench,
      label_en: 'Work in Progress',
      label_gu: 'કામ ચાલુ છે'
    },
    COMPLETED: {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      icon: CheckCheck,
      label_en: 'Ready / Done',
      label_gu: 'તૈયાર / પૂર્ણ'
    },
    REJECTED: {
      color: 'bg-rose-50 text-rose-800 border-rose-200/80',
      icon: XCircle,
      label_en: 'Rejected',
      label_gu: 'નામંજૂર'
    },
    CANCELLED: {
      color: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: XCircle,
      label_en: 'Cancelled',
      label_gu: 'રદ કરેલ'
    },
    NO_SHOW: {
      color: 'bg-purple-50 text-purple-800 border-purple-200/80',
      icon: UserX,
      label_en: 'No Show',
      label_gu: 'ગ્રાહક આવ્યા નથી'
    }
  };

  const current = config[status] || {
    color: 'bg-stone-100 text-stone-700 border-stone-200',
    icon: AlertTriangle,
    label_en: status,
    label_gu: status
  };

  const Icon = current.icon;
  const label = language === 'gu' ? current.label_gu : current.label_en;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs tracking-tight select-none ${current.color} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span>{label}</span>
    </span>
  );
};
