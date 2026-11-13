import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-stone-200 bg-white/50 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-500 mb-4 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-stone-900">{title}</h3>
      {description && <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1.5 leading-relaxed">{description}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
