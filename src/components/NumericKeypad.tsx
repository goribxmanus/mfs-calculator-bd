import React, { useEffect } from 'react';
import { Delete } from 'lucide-react';

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onBackspace: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigit,
  onDecimal,
  onBackspace,
}) => {
  // Support physical keyboard input as well
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        onDigit(e.key);
      } else if (e.key === '.') {
        onDecimal();
      } else if (e.key === 'Backspace') {
        onBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDigit, onDecimal, onBackspace]);

  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  return (
    <div className="w-full space-y-2 select-none">
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="grid grid-cols-3 gap-2">
          {row.map((digit) => (
            <button
              key={digit}
              onClick={() => onDigit(digit)}
              className="h-13 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xl font-bold text-slate-800 dark:text-slate-100 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.97] transition-all flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}
        </div>
      ))}

      {/* Row 4: 00, 0, ⌫ (with decimal point supported) */}
      <div className="grid grid-cols-3 gap-2">
        {/* 00 */}
        <button
          onClick={() => onDigit('00')}
          className="h-13 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xl font-bold text-slate-800 dark:text-slate-100 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.97] transition-all flex items-center justify-center cursor-pointer"
        >
          00
        </button>

        {/* 0 with quick decimal tap/indicator */}
        <div className="h-13 relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs flex items-center justify-center overflow-hidden">
          <button
            onClick={() => onDigit('0')}
            className="w-full h-full text-xl font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.97] transition-all flex items-center justify-center cursor-pointer"
          >
            0
          </button>
          {/* Dedicated dot button on the 0 key corner for effortless decimal input */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDecimal();
            }}
            title="Decimal dot"
            className="absolute right-1 bottom-1 px-2 py-0.5 text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/60"
          >
            •
          </button>
        </div>

        {/* Backspace ⌫ */}
        <button
          onClick={onBackspace}
          className="h-13 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-[0.97] transition-all flex items-center justify-center cursor-pointer"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
