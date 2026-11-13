import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'primary', // primary, danger, success
  isLoading = false
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const btnStyles = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    success: 'bg-teal-700 hover:bg-teal-800 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 leading-snug">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-sm text-stone-600 leading-relaxed">{message}</p>

          <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-100 border border-stone-300 transition-colors"
            >
              {cancelText || t('common.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 ${btnStyles[variant] || btnStyles.primary}`}
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              <span>{confirmText || t('common.confirm', 'Confirm')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
