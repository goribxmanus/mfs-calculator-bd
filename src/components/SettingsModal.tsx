import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Moon, Sun, Monitor } from 'lucide-react';
import { AppLanguage, MfsId, ThemeMode } from '../types';
import { MFS_LIST } from '../calculationEngine';
import { t } from '../translations';

interface SettingsModalProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  rates: Record<MfsId, number>;
  sendFees: Record<MfsId, number>;
  onClose: () => void;
  onSetThemeMode: (mode: ThemeMode) => void;
  onUpdateRate: (id: MfsId, rate: number, fee: number) => void;
  onRestoreDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  language,
  themeMode,
  rates,
  sendFees,
  onClose,
  onSetThemeMode,
  onUpdateRate,
  onRestoreDefaults,
}) => {
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

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
          {t(language, 'settings')}
        </h2>
      </div>

      <div className="p-4 space-y-5">
        {/* Section 1: Theme Mode */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            {t(language, 'themeTitle')}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: t(language, 'themeLight'), icon: Sun },
              { id: 'dark', label: t(language, 'themeDark'), icon: Moon },
              { id: 'system', label: t(language, 'themeSystem'), icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSetThemeMode(id as ThemeMode)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center space-y-1 border transition-all ${
                  themeMode === id
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: MFS Rates & Fees */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            {t(language, 'ratePer1000')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Customise the cashout percentage charge and send money fee for each MFS provider.
          </p>

          <div className="space-y-4">
            {MFS_LIST.map((provider) => (
              <div
                key={provider.id}
                className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800"
              >
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  {provider.name}
                </span>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {t(language, 'rate')} (৳/1000)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={rates[provider.id] ?? provider.defaultRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0) {
                          onUpdateRate(provider.id, val, sendFees[provider.id] ?? provider.defaultSendFee);
                        }
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {t(language, 'sendMoneyFee')} (৳)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={sendFees[provider.id] ?? provider.defaultSendFee}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0) {
                          onUpdateRate(provider.id, rates[provider.id] ?? provider.defaultRate, val);
                        }
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-teal-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowRestoreConfirm(true)}
            className="w-full mt-4 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{t(language, 'restoreDefaults')}</span>
          </button>
        </div>
      </div>

      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xs p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
              {t(language, 'restoreDefaults')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {t(language, 'restoreDefaultsConfirm')}
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200"
              >
                {t(language, 'cancel')}
              </button>
              <button
                onClick={() => {
                  onRestoreDefaults();
                  setShowRestoreConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
              >
                {t(language, 'confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
