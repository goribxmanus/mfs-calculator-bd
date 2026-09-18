import React, { useState } from 'react';
import { History, Trash2 } from 'lucide-react';
import { HistoryItem, AppLanguage } from '../types';
import { formatTaka } from '../calculationEngine';
import { t } from '../translations';

interface HistorySectionProps {
  history: HistoryItem[];
  language: AppLanguage;
  onRestore: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  language,
  onRestore,
  onClearHistory,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200">
          <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-bold">{t(language, 'calculationHistory')}</span>
          <span className="text-xs text-slate-400 font-medium">({history.length}/100)</span>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t(language, 'clearHistory')}</span>
          </button>
        )}
      </div>

      {/* History Items or Empty state */}
      {history.length === 0 ? (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t(language, 'noHistory')}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {t(language, 'noHistorySub')}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onRestore(item)}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl hover:border-teal-500/50 cursor-pointer transition-all active:scale-[0.99] shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                    {item.mfsName}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {formatTaka(item.amount)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-teal-700 dark:text-teal-400">
                    {formatTaka(item.totalCustomerPays)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  Charge: {formatTaka(item.netCharge)} (Fee: {formatTaka(item.sendMoneyFee)})
                </span>
                <span>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xs p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
              {t(language, 'clearHistoryConfirmTitle')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {t(language, 'clearHistoryConfirmMsg')}
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200"
              >
                {t(language, 'cancel')}
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                {t(language, 'delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
