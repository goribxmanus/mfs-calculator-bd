import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MfsId, AppLanguage, ThemeMode, HistoryItem, ScreenRoute } from './types';
import { MFS_PROVIDERS, calculateMfsCharge, formatTaka } from './calculationEngine';
import { PhoneHeader } from './components/PhoneHeader';
import { ResultCard } from './components/ResultCard';
import { MfsSelector } from './components/MfsSelector';
import { AmountInput } from './components/AmountInput';
import { QuickAddButtons } from './components/QuickAddButtons';
import { NumericKeypad } from './components/NumericKeypad';
import { ResetButton } from './components/ResetButton';
import { HistorySection } from './components/HistorySection';
import { SettingsModal } from './components/SettingsModal';
import { AboutDeveloperModal } from './components/AboutDeveloperModal';
import { AndroidProjectHub } from './components/AndroidProjectHub';
import { Smartphone, Code, Wifi, Battery, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_HISTORY = 'mfs_calc_history_v1';
const STORAGE_KEY_LANG = 'mfs_calc_lang_v1';
const STORAGE_KEY_THEME = 'mfs_calc_theme_v1';
const STORAGE_KEY_MFS = 'mfs_calc_mfs_v1';
const STORAGE_KEY_RATES = 'mfs_calc_rates_v1';
const STORAGE_KEY_FEES = 'mfs_calc_fees_v1';

export default function App() {
  // 1. Language State
  const [language, setLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as AppLanguage) || 'en';
  });

  // 2. Theme State
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode) || 'system';
  });

  // 3. Selected MFS (Default: bKash)
  const [selectedMfsId, setSelectedMfsId] = useState<MfsId>(() => {
    return (localStorage.getItem(STORAGE_KEY_MFS) as MfsId) || 'BKASH';
  });

  // 4. Stored MFS Rates & Fees
  const [rates, setRates] = useState<Record<MfsId, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RATES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      BKASH: MFS_PROVIDERS.BKASH.defaultRate,
      NAGAD: MFS_PROVIDERS.NAGAD.defaultRate,
      ROCKET: MFS_PROVIDERS.ROCKET.defaultRate,
      UPAY: MFS_PROVIDERS.UPAY.defaultRate,
    };
  });

  const [sendFees, setSendFees] = useState<Record<MfsId, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FEES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      BKASH: MFS_PROVIDERS.BKASH.defaultSendFee,
      NAGAD: MFS_PROVIDERS.NAGAD.defaultSendFee,
      ROCKET: MFS_PROVIDERS.ROCKET.defaultSendFee,
      UPAY: MFS_PROVIDERS.UPAY.defaultSendFee,
    };
  });

  // 5. Input Amount State
  const [rawAmount, setRawAmount] = useState<string>('');

  // 6. Navigation Route
  const [currentScreen, setCurrentScreen] = useState<ScreenRoute>('calculator');

  // 7. Copy State
  const [isCopied, setIsCopied] = useState(false);

  // 8. Calculation History (Room DB simulation in LocalStorage, max 100 entries)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Tab View for Companion
  const [activeTab, setActiveTab] = useState<'emulator' | 'project'>('emulator');

  // Apply Theme to DOM
  useEffect(() => {
    const isDark =
      themeMode === 'dark' ||
      (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Persist Preferences safely
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MFS, selectedMfsId);
  }, [selectedMfsId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(rates));
  }, [rates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FEES, JSON.stringify(sendFees));
  }, [sendFees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  // Current Provider
  const provider = MFS_PROVIDERS[selectedMfsId] || MFS_PROVIDERS.BKASH;
  const currentRate = rates[selectedMfsId] ?? provider.defaultRate;
  const currentSendFee = sendFees[selectedMfsId] ?? provider.defaultSendFee;

  // Authoritative Instant Calculation Result
  const calculationResult = useMemo(() => {
    const numAmount = parseFloat(rawAmount) || 0;
    return calculateMfsCharge(numAmount, provider.name, currentRate, currentSendFee);
  }, [rawAmount, provider.name, currentRate, currentSendFee]);

  // History Auto-Commit Debouncer
  const commitToHistory = useCallback(
    (res: typeof calculationResult) => {
      if (res.amount <= 0) return;

      setHistory((prev) => {
        // Prevent immediate duplicates
        if (
          prev.length > 0 &&
          prev[0].mfsName === res.mfsName &&
          prev[0].amount === res.amount &&
          prev[0].totalCustomerPays === res.totalCustomerPays
        ) {
          return prev;
        }

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          mfsName: res.mfsName,
          amount: res.amount,
          grossPercentageCharge: res.grossPercentageCharge,
          sendMoneyFee: res.sendMoneyFee,
          netCharge: res.netCharge,
          totalCustomerPays: res.totalCustomerPays,
          timestamp: Date.now(),
        };

        // Section 26: Maximum 100 calculations, newest first
        return [newItem, ...prev.slice(0, 99)];
      });
    },
    []
  );

  useEffect(() => {
    if (calculationResult.amount > 0) {
      const timer = setTimeout(() => {
        commitToHistory(calculationResult);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [calculationResult, commitToHistory]);

  // Keypad Handlers
  const handleDigit = (digit: string) => {
    if (rawAmount.length >= 10) return;
    if (digit === '00') {
      if (!rawAmount || rawAmount === '0') {
        setRawAmount('0');
      } else {
        setRawAmount((prev) => prev + '00');
      }
      return;
    }

    if (rawAmount === '0') {
      setRawAmount(digit);
      return;
    }

    if (rawAmount.includes('.')) {
      const decimals = rawAmount.split('.')[1];
      if (decimals && decimals.length >= 2) return;
    }

    setRawAmount((prev) => prev + digit);
  };

  const handleDecimal = () => {
    if (rawAmount.includes('.')) return;
    setRawAmount((prev) => (prev ? prev + '.' : '0.'));
  };

  const handleBackspace = () => {
    setRawAmount((prev) => prev.slice(0, -1));
  };

  const handleQuickAdd = (amount: number) => {
    const current = parseFloat(rawAmount) || 0;
    const next = current + amount;
    setRawAmount(next % 1 === 0 ? next.toString() : next.toFixed(2));
  };

  const handleClearAmount = () => {
    setRawAmount('');
  };

  const handleReset = () => {
    setRawAmount('');
    setSelectedMfsId('BKASH');
  };

  const handleCopyTotal = async () => {
    try {
      await navigator.clipboard.writeText(calculationResult.formattedTotal);
      setIsCopied(true);
      commitToHistory(calculationResult);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00796B', '#26A69A', '#80CBC4'],
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    const matched = Object.values(MFS_PROVIDERS).find(
      (p) => p.name.toLowerCase() === item.mfsName.toLowerCase()
    );
    if (matched) {
      setSelectedMfsId(matched.id);
    }
    setRawAmount(item.amount % 1 === 0 ? item.amount.toString() : item.amount.toFixed(2));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleUpdateRate = (id: MfsId, rate: number, fee: number) => {
    setRates((prev) => ({ ...prev, [id]: rate }));
    setSendFees((prev) => ({ ...prev, [id]: fee }));
  };

  const handleRestoreDefaults = () => {
    setRates({
      BKASH: MFS_PROVIDERS.BKASH.defaultRate,
      NAGAD: MFS_PROVIDERS.NAGAD.defaultRate,
      ROCKET: MFS_PROVIDERS.ROCKET.defaultRate,
      UPAY: MFS_PROVIDERS.UPAY.defaultRate,
    });
    setSendFees({
      BKASH: MFS_PROVIDERS.BKASH.defaultSendFee,
      NAGAD: MFS_PROVIDERS.NAGAD.defaultSendFee,
      ROCKET: MFS_PROVIDERS.ROCKET.defaultSendFee,
      UPAY: MFS_PROVIDERS.UPAY.defaultSendFee,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 transition-colors duration-200">
      {/* Top Companion Mode Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            ৳
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
              MFS Charge Calculator
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
              Android Native Architecture • 100% Offline
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/60 dark:border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('emulator')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'emulator'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'project'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Android Project & APK</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl flex flex-col items-center justify-center">
        {activeTab === 'project' ? (
          <div className="w-full">
            <AndroidProjectHub />
          </div>
        ) : (
          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
            {/* Native Android Phone Frame */}
            <div className="w-full max-w-sm sm:w-[390px] h-[820px] bg-slate-900 rounded-[44px] p-3 shadow-2xl shadow-slate-900/30 border-4 border-slate-800 relative flex flex-col overflow-hidden shrink-0">
              {/* Phone Speaker & Dynamic Island / Camera Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-teal-900/40" />
              </div>

              {/* Internal Android Display Surface */}
              <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800/40">
                {/* Android Status Bar */}
                <div className="w-full px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 select-none z-30">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1.5">
                    <Wifi className="w-3 h-3" />
                    <span className="text-[10px]">5G</span>
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Android Screen Container */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  {/* Top App Bar with 3-Item Menu & Settings Gear */}
                  <PhoneHeader
                    language={language}
                    onNavigateToCalculator={() => setCurrentScreen('calculator')}
                    onNavigateToAboutDeveloper={() => setCurrentScreen('about_developer')}
                    onNavigateToSettings={() => setCurrentScreen('settings')}
                    onSetLanguage={setLanguage}
                  />

                  {/* Scrollable Calculator Body */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
                    {/* 1. RESULT CARD (MUST BE AT THE TOP ABOVE EVERYTHING!) */}
                    <ResultCard
                      result={calculationResult}
                      isCopied={isCopied}
                      language={language}
                      onCopy={handleCopyTotal}
                    />

                    {/* 2. MFS SELECTOR (Exactly 4: bKash, Nagad, Rocket, Upay) */}
                    <MfsSelector
                      selectedMfsId={selectedMfsId}
                      language={language}
                      onSelectMfs={setSelectedMfsId}
                    />

                    {/* 3. AMOUNT INPUT */}
                    <AmountInput
                      rawAmount={rawAmount}
                      language={language}
                      onClear={handleClearAmount}
                    />

                    {/* 4. QUICK-ADD BUTTONS (+500, +1,000, +1,500, +2,000, Clear) */}
                    <QuickAddButtons
                      language={language}
                      onQuickAdd={handleQuickAdd}
                      onClear={handleClearAmount}
                    />

                    {/* 5. CUSTOM NUMERIC KEYPAD (1-9, 00, 0, ⌫) */}
                    <NumericKeypad
                      onDigit={handleDigit}
                      onDecimal={handleDecimal}
                      onBackspace={handleBackspace}
                    />

                    {/* 6. RESET BUTTON (Clears without deleting history) */}
                    <ResetButton language={language} onReset={handleReset} />

                    {/* 7. CALCULATION HISTORY (Up to 100, newest first) */}
                    <div className="pt-1 pb-4">
                      <HistorySection
                        history={history}
                        language={language}
                        onRestore={handleRestoreHistory}
                        onClearHistory={handleClearHistory}
                      />
                    </div>
                  </div>

                  {/* Overlays: Settings Screen & About Developer Screen */}
                  {currentScreen === 'settings' && (
                    <SettingsModal
                      language={language}
                      themeMode={themeMode}
                      rates={rates}
                      sendFees={sendFees}
                      onClose={() => setCurrentScreen('calculator')}
                      onSetThemeMode={setThemeMode}
                      onUpdateRate={handleUpdateRate}
                      onRestoreDefaults={handleRestoreDefaults}
                    />
                  )}

                  {currentScreen === 'about_developer' && (
                    <AboutDeveloperModal
                      language={language}
                      onClose={() => setCurrentScreen('calculator')}
                    />
                  )}
                </div>

                {/* Android Bottom Navigation Home Pill */}
                <div className="w-full py-1.5 flex items-center justify-center bg-transparent select-none z-30">
                  <div className="w-28 h-1 bg-slate-400/50 dark:bg-slate-600 rounded-full" />
                </div>
              </div>
            </div>

            {/* Quick Feature Highlights & Specs sidebar on larger screens */}
            <div className="hidden lg:flex flex-col w-72 space-y-4 pt-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold text-xs">MFS Charging Formula</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 font-mono">
                  <div>1. charge = amount × rate / 1000</div>
                  <div>2. net = max(0, charge - sendFee)</div>
                  <div>3. total = amount + net</div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                  For bKash & Nagad, the ৳5 send fee is deducted from the percentage charge. Rocket & Upay have ৳0 fee.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block mb-2">
                  Android Native Checklist
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <li className="flex items-center space-x-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Kotlin + Jetpack Compose</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Room SQLite (max 100 history)</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>DataStore Preferences</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>English & বাংলা Localization</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Light, Dark & System Theme</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Custom 00 & Backspace Keypad</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveTab('project')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
              >
                <Code className="w-4 h-4 text-teal-400" />
                <span>Inspect Kotlin Code</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
