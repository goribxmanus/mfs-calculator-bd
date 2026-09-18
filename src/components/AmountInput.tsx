import React from 'react';
import { X } from 'lucide-react';
import { AppLanguage } from '../types';
import { t } from '../translations';

interface AmountInputProps {
  rawAmount: string;
  language: AppLanguage;
  onClear: () => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  rawAmount,
  language,
  onClear,
}) => {
  return (
    <div className="w-full">
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 pl-1">
        {t(language, 'yourAmount')}
      </div>
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2 pl-2">
          <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">৳</span>
          <span
            className={`text-2xl font-bold tracking-tight ${
              rawAmount ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {rawAmount || '0'}
          </span>
        </div>

        {rawAmount && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
