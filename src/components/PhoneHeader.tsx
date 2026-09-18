import React, { useState } from 'react';
import { Settings, MoreVertical, Check, Globe, History, Calculator, User } from 'lucide-react';
import { AppLanguage } from '../types';
import { t } from '../translations';

interface PhoneHeaderProps {
  language: AppLanguage;
  onNavigateToCalculator: () => void;
  onNavigateToHistory: () => void;
  onNavigateToAboutDeveloper: () => void;
  onNavigateToSettings: () => void;
  onSetLanguage: (lang: AppLanguage) => void;
}

export const PhoneHeader: React.FC<PhoneHeaderProps> = ({
  language,
  onNavigateToCalculator,
  onNavigateToHistory,
  onNavigateToAboutDeveloper,
  onNavigateToSettings,
  onSetLanguage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDialogOpen, setLangDialogOpen] = useState(false);

  return (
    <div className="w-full relative select-none">
      {/* Android Top App Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
            {t(language, 'appName')}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[210px]">
            {t(language, 'appSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-1">
          {/* Small unobtrusive Settings (gear icon) */}
          <button
            onClick={onNavigateToSettings}
            title={t(language, 'settings')}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Corner Menu Button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              title="Menu"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-11 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* Item 1: Cashout Charge */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigateToCalculator();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2.5 font-medium"
                  >
                    <Calculator className="w-4 h-4 text-slate-500" />
                    <span>{t(language, 'menuCashoutCharge')}</span>
                  </button>

                  {/* Item 2: Calculation History */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigateToHistory();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2.5 font-medium"
                  >
                    <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{t(language, 'calculationHistory')}</span>
                  </button>

                  {/* Item 3: About Developer */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigateToAboutDeveloper();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2.5 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>{t(language, 'menuAboutDeveloper')}</span>
                  </button>

                  {/* Item 4: Language / ভাষা */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setLangDialogOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2.5 font-medium"
                  >
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>{t(language, 'menuLanguage')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Language Modal */}
      {langDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xs p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {t(language, 'language')}
              </h3>
            </div>

            <div className="space-y-2">
              <label
                onClick={() => {
                  onSetLanguage('en');
                  setLangDialogOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  language === 'en'
                    ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              </label>

              <label
                onClick={() => {
                  onSetLanguage('bn');
                  setLangDialogOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  language === 'bn'
                    ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>বাংলা (Bengali)</span>
                {language === 'bn' && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              </label>
            </div>

            <button
              onClick={() => setLangDialogOpen(false)}
              className="mt-5 w-full py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {t(language, 'cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
