import React from 'react';
import { ArrowLeft, Code2 } from 'lucide-react';
import { AppLanguage } from '../types';
import { t } from '../translations';

interface AboutDeveloperModalProps {
  language: AppLanguage;
  onClose: () => void;
}

export const AboutDeveloperModal: React.FC<AboutDeveloperModalProps> = ({
  language,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-white dark:bg-slate-900 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
        <button
          onClick={onClose}
          className="p-1.5 -ml-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
          {t(language, 'aboutDeveloper')}
        </h2>
      </div>

      {/* Body with generous whitespace */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center mb-6">
          <Code2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t(language, 'appName')}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-8">
          Version 1.0.0 • Offline Native Android
        </p>

        {/* Mandatory prominent developer label */}
        <div className="w-full max-w-xs p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl mb-6 shadow-2xs">
          <p className="text-base font-bold text-teal-700 dark:text-teal-400">
            {t(language, 'developedBy')}
          </p>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          {t(language, 'aboutDescription')}
        </p>

        <button
          onClick={onClose}
          className="mt-8 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-all shadow-xs"
        >
          {t(language, 'back')}
        </button>
      </div>
    </div>
  );
};
