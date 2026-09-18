import React from 'react';
import { MfsId, AppLanguage } from '../types';
import { MFS_LIST } from '../calculationEngine';
import { t } from '../translations';

interface MfsSelectorProps {
  selectedMfsId: MfsId;
  language: AppLanguage;
  onSelectMfs: (id: MfsId) => void;
}

export const MfsSelector: React.FC<MfsSelectorProps> = ({
  selectedMfsId,
  language,
  onSelectMfs,
}) => {
  return (
    <div className="w-full">
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 pl-1">
        {t(language, 'selectMfs')}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {MFS_LIST.map((provider) => {
          const isSelected = provider.id === selectedMfsId;
          return (
            <button
              key={provider.id}
              onClick={() => onSelectMfs(provider.id)}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
