import React from 'react';
import { RotateCcw } from 'lucide-react';
import { AppLanguage } from '../types';
import { t } from '../translations';

interface ResetButtonProps {
  language: AppLanguage;
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ language, onReset }) => {
  return (
    <button
      onClick={onReset}
      className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
    >
      <RotateCcw className="w-4 h-4 text-slate-500" />
      <span>{t(language, 'reset')}</span>
    </button>
  );
};
