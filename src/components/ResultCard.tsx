import React from 'react';
import { Copy, Check } from 'lucide-react';
import { CalculationResult, AppLanguage } from '../types';
import { t } from '../translations';

interface ResultCardProps {
  result: CalculationResult;
  isCopied: boolean;
  language: AppLanguage;
  onCopy: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  isCopied,
  language,
  onCopy,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Top Emerald Hero Section with Grand Total */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-700 p-5 text-white">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold tracking-wider text-teal-200 uppercase">
            {t(language, 'totalCustomerPays')}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-950/60 text-teal-200 border border-teal-500/30">
            {result.mfsName}
          </span>
        </div>

        {/* Most prominent number */}
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white py-1">
          {result.formattedTotal}
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t(language, 'yourAmount')}
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {result.formattedAmount}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              MFS
            </div>
            <div className="text-base font-bold text-teal-600 dark:text-teal-400">
              {result.mfsName}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t(language, 'cashoutCharge')}
            </div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {result.formattedGrossCharge}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t(language, 'sendMoneyFee')}
            </div>
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {result.formattedSendMoneyFee}
            </div>
          </div>
        </div>

        {/* Copy Total Button */}
        <button
          onClick={onCopy}
          className={`w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-xs ${
            isCopied
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-teal-700 hover:bg-teal-800 text-white active:scale-[0.99]'
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t(language, 'copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{t(language, 'copyTotal')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
