import React from 'react';
import { CalculationResult, AppLanguage } from '../types';
import { t } from '../translations';

interface ResultCardProps {
  result: CalculationResult;
  language: AppLanguage;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  language,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Top Emerald Hero Section with Grand Total */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-700 px-4 py-2.5 text-white">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[11px] font-semibold tracking-wider text-teal-200 uppercase">
            {t(language, 'totalCustomerPays')}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-950/60 text-teal-200 border border-teal-500/30">
            {result.mfsName}
          </span>
        </div>

        {/* Most prominent number */}
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white py-0.5">
          {result.formattedTotal}
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="px-3.5 py-2 space-y-1.5">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {t(language, 'yourAmount')}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {result.formattedAmount}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              MFS
            </div>
            <div className="text-sm font-bold text-teal-600 dark:text-teal-400">
              {result.mfsName}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {t(language, 'cashoutCharge')}
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {result.formattedGrossCharge}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {t(language, 'sendMoneyFee')}
            </div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {result.formattedSendMoneyFee}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
