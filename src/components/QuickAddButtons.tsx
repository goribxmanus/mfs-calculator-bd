import React from 'react';
import { AppLanguage } from '../types';
import { t } from '../translations';

interface QuickAddButtonsProps {
  language: AppLanguage;
  onQuickAdd: (amount: number) => void;
  onClear: () => void;
}

export const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({
  language,
  onQuickAdd,
  onClear,
}) => {
  const options = [500, 1000, 1500, 2000];

  return (
    <div className="w-full grid grid-cols-5 gap-1.5 select-none">
      {options.map((val) => (
        <button
          key={val}
          onClick={() => onQuickAdd(val)}
          className="py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
        >
          +{val.toLocaleString()}
        </button>
      ))}

      {/* Clear Pill */}
      <button
        onClick={onClear}
        className="py-2 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all"
      >
        {t(language, 'clear')}
      </button>
    </div>
  );
};
