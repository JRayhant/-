import React, { useState } from 'react';
import {
  Delete,
  CornerDownLeft,
  X,
  Sparkles,
  Divide,
  Percent,
  Plus,
  Minus,
  Equal,
  ChevronRight,
  MoveLeft,
  MoveRight,
} from 'lucide-react';

export interface MathKeyboardProps {
  onInsert: (value: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onEnter?: () => void;
  onClose?: () => void;
  onMoveCursor?: (direction: 'left' | 'right') => void;
}

type TabType = 'quick' | 'fractions_powers' | 'algebra_numbers' | 'symbols_calculus' | 'bangla';

export const MathKeyboard: React.FC<MathKeyboardProps> = ({
  onInsert,
  onBackspace,
  onClear,
  onEnter,
  onClose,
  onMoveCursor,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('quick');

  return (
    <div className="bg-slate-900 border-t border-slate-800 text-white p-2.5 select-none shadow-2xl safe-area-bottom w-full rounded-t-2xl">
      {/* Top Header Bar & Category Tabs */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 px-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] flex items-center gap-1 ${
              activeTab === 'quick'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            দ্রুত প্রতীক (x², √x, a/b)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fractions_powers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] flex items-center ${
              activeTab === 'fractions_powers'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            ভগ্নাংশ ও ঘাত
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('algebra_numbers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] flex items-center ${
              activeTab === 'algebra_numbers'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            সংখ্যা ও বীজগণিত
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('symbols_calculus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] flex items-center ${
              activeTab === 'symbols_calculus'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            প্রতীক ও ক্যালকুলাস
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bangla')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] flex items-center ${
              activeTab === 'bangla'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            বাংলা সংখ্যা (০-৯)
          </button>
        </div>

        {/* Keyboard Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2 min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
            title="কিবোর্ড লুকান"
            aria-label="কিবোর্ড লুকান"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* TAB 1: QUICK ACCESS (x², xⁿ, √x, a/b, π, θ, ± and high-frequency math symbols) */}
      {activeTab === 'quick' && (
        <div className="space-y-1.5">
          {/* Row 1: Core Requested Symbols (x², xⁿ, √x, a/b, etc.) */}
          <div className="grid grid-cols-6 gap-1.5">
            <button
              type="button"
              onClick={() => onInsert('²')}
              className="math-key-highlight"
              title="বর্গ (Square): x²"
            >
              x²
            </button>
            <button
              type="button"
              onClick={() => onInsert('³')}
              className="math-key-highlight"
              title="ঘন (Cube): x³"
            >
              x³
            </button>
            <button
              type="button"
              onClick={() => onInsert('ⁿ')}
              className="math-key-highlight"
              title="ঘাত (Power of n): xⁿ"
            >
              xⁿ
            </button>
            <button
              type="button"
              onClick={() => onInsert('√')}
              className="math-key-highlight"
              title="বর্গমূল (Square root): √x"
            >
              √x
            </button>
            <button
              type="button"
              onClick={() => onInsert(' (a)/(b) ')}
              className="math-key-highlight text-xs"
              title="ভগ্নাংশ: a/b"
            >
              a/b
            </button>
            <button
              type="button"
              onClick={onBackspace}
              className="math-key-action bg-rose-950/70 text-rose-300 border-rose-900/60"
              title="মুছুন"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {/* Row 2: Secondary Requested & Algebraic variables */}
          <div className="grid grid-cols-6 gap-1.5">
            <button type="button" onClick={() => onInsert('x')} className="math-key font-bold text-emerald-300">x</button>
            <button type="button" onClick={() => onInsert('y')} className="math-key font-bold text-emerald-300">y</button>
            <button type="button" onClick={() => onInsert('π')} className="math-key font-bold text-amber-300">π</button>
            <button type="button" onClick={() => onInsert('θ')} className="math-key font-bold text-amber-300">θ</button>
            <button type="button" onClick={() => onInsert('±')} className="math-key text-blue-300">±</button>
            <button type="button" onClick={() => onInsert('=')} className="math-key-op font-bold text-emerald-400">=</button>
          </div>

          {/* Row 3: Inequalities & Essential Math Operations */}
          <div className="grid grid-cols-6 gap-1.5">
            <button type="button" onClick={() => onInsert('+')} className="math-key-op">+</button>
            <button type="button" onClick={() => onInsert('−')} className="math-key-op">−</button>
            <button type="button" onClick={() => onInsert('×')} className="math-key-op">×</button>
            <button type="button" onClick={() => onInsert('÷')} className="math-key-op">÷</button>
            <button type="button" onClick={() => onInsert('≤')} className="math-key">≤</button>
            <button type="button" onClick={() => onInsert('≥')} className="math-key">≥</button>
          </div>

          {/* Row 4: Brackets, symbols, and navigation */}
          <div className="grid grid-cols-6 gap-1.5">
            <button type="button" onClick={() => onInsert('(')} className="math-key-bracket">(</button>
            <button type="button" onClick={() => onInsert(')')} className="math-key-bracket">)</button>
            <button type="button" onClick={() => onInsert('≠')} className="math-key">≠</button>
            <button type="button" onClick={() => onInsert('Δ')} className="math-key">Δ</button>
            <button type="button" onClick={() => onInsert('∑')} className="math-key font-serif">∑</button>
            <button type="button" onClick={() => onInsert('∫')} className="math-key font-serif">∫</button>
          </div>

          {/* Row 5: Cursor Navigation, Space & Enter */}
          <div className="grid grid-cols-6 gap-1.5">
            {onMoveCursor ? (
              <>
                <button
                  type="button"
                  onClick={() => onMoveCursor('left')}
                  className="math-key text-slate-300 hover:text-white"
                  title="কার্সার বামে নিন"
                >
                  <MoveLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveCursor('right')}
                  className="math-key text-slate-300 hover:text-white"
                  title="কার্সার ডানে নিন"
                >
                  <MoveRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => onInsert('.')} className="math-key-num">.</button>
                <button type="button" onClick={() => onInsert('%')} className="math-key">%</button>
              </>
            )}
            <button type="button" onClick={() => onInsert(' ')} className="math-key col-span-2 text-xs">
              space
            </button>
            <button type="button" onClick={onClear} className="math-key-action text-xs text-amber-300">
              C
            </button>
            {onEnter && (
              <button
                type="button"
                onClick={onEnter}
                className="math-key-action bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                title="সমাধান করুন"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FRACTIONS, POWERS & ROOTS (Comprehensive Fraction & Root studio) */}
      {activeTab === 'fractions_powers' && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => onInsert(' (a)/(b) ')}
              className="math-key-highlight font-mono text-xs"
              title="সাধারণ ভগ্নাংশ a/b"
            >
              a/b
            </button>
            <button
              type="button"
              onClick={() => onInsert(' (□)/(□) ')}
              className="math-key-highlight font-mono text-xs"
              title="খালি ভগ্নাংশ কাঠামো"
            >
              □ / □
            </button>
            <button
              type="button"
              onClick={() => onInsert(' ((a)/(b))/((c)/(d)) ')}
              className="math-key-highlight font-mono text-[10px]"
              title="নেস্টেড ভগ্নাংশ (Nested Fraction)"
            >
              (a/b)/(c/d)
            </button>
            <button
              type="button"
              onClick={() => onInsert(' (1)/(2) ')}
              className="math-key font-mono text-xs"
            >
              ½
            </button>
            <button
              type="button"
              onClick={onBackspace}
              className="math-key-action bg-rose-950/70 text-rose-300"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <button type="button" onClick={() => onInsert('²')} className="math-key-highlight">x²</button>
            <button type="button" onClick={() => onInsert('³')} className="math-key-highlight">x³</button>
            <button type="button" onClick={() => onInsert('⁴')} className="math-key">x⁴</button>
            <button type="button" onClick={() => onInsert('ⁿ')} className="math-key-highlight">xⁿ</button>
            <button type="button" onClick={() => onInsert('^')} className="math-key">xʸ (^)</button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <button type="button" onClick={() => onInsert('√')} className="math-key-highlight">√x</button>
            <button type="button" onClick={() => onInsert('∛')} className="math-key">∛x</button>
            <button type="button" onClick={() => onInsert('∜')} className="math-key">∜x</button>
            <button type="button" onClick={() => onInsert(' ⁿ√x ')} className="math-key">ⁿ√x</button>
            <button type="button" onClick={() => onInsert('√(')} className="math-key">√( ... )</button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <button type="button" onClick={() => onInsert('a')} className="math-key">a</button>
            <button type="button" onClick={() => onInsert('b')} className="math-key">b</button>
            <button type="button" onClick={() => onInsert('c')} className="math-key">c</button>
            <button type="button" onClick={() => onInsert('m')} className="math-key">m</button>
            <button type="button" onClick={() => onInsert('n')} className="math-key">n</button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <button type="button" onClick={() => onInsert('(')} className="math-key-bracket">(</button>
            <button type="button" onClick={() => onInsert(')')} className="math-key-bracket">)</button>
            <button type="button" onClick={() => onInsert('[')} className="math-key-bracket">[</button>
            <button type="button" onClick={() => onInsert(']')} className="math-key-bracket">]</button>
            <button type="button" onClick={onClear} className="math-key-action text-amber-300">C</button>
          </div>
        </div>
      )}

      {/* TAB 3: BASIC & ALGEBRA NUMBERS */}
      {activeTab === 'algebra_numbers' && (
        <div className="grid grid-cols-6 gap-1.5">
          <button type="button" onClick={() => onInsert('x')} className="math-key font-bold text-emerald-300">x</button>
          <button type="button" onClick={() => onInsert('y')} className="math-key font-bold text-emerald-300">y</button>
          <button type="button" onClick={() => onInsert('z')} className="math-key font-bold text-emerald-300">z</button>
          <button type="button" onClick={() => onInsert('+')} className="math-key-op">+</button>
          <button type="button" onClick={() => onInsert('−')} className="math-key-op">−</button>
          <button type="button" onClick={onBackspace} className="math-key-action bg-rose-950/70 text-rose-300">
            <Delete className="w-4 h-4" />
          </button>

          <button type="button" onClick={() => onInsert('7')} className="math-key-num">7</button>
          <button type="button" onClick={() => onInsert('8')} className="math-key-num">8</button>
          <button type="button" onClick={() => onInsert('9')} className="math-key-num">9</button>
          <button type="button" onClick={() => onInsert('²')} className="math-key-highlight">x²</button>
          <button type="button" onClick={() => onInsert('×')} className="math-key-op">×</button>
          <button type="button" onClick={() => onInsert('÷')} className="math-key-op">÷</button>

          <button type="button" onClick={() => onInsert('4')} className="math-key-num">4</button>
          <button type="button" onClick={() => onInsert('5')} className="math-key-num">5</button>
          <button type="button" onClick={() => onInsert('6')} className="math-key-num">6</button>
          <button type="button" onClick={() => onInsert('³')} className="math-key-highlight">x³</button>
          <button type="button" onClick={() => onInsert('(')} className="math-key-bracket">(</button>
          <button type="button" onClick={() => onInsert(')')} className="math-key-bracket">)</button>

          <button type="button" onClick={() => onInsert('1')} className="math-key-num">1</button>
          <button type="button" onClick={() => onInsert('2')} className="math-key-num">2</button>
          <button type="button" onClick={() => onInsert('3')} className="math-key-num">3</button>
          <button type="button" onClick={() => onInsert('√')} className="math-key-highlight">√</button>
          <button type="button" onClick={() => onInsert('=')} className="math-key-op font-bold text-emerald-400">=</button>
          <button type="button" onClick={onClear} className="math-key-action text-xs text-amber-300">C</button>

          <button type="button" onClick={() => onInsert('0')} className="math-key-num">0</button>
          <button type="button" onClick={() => onInsert('.')} className="math-key-num">.</button>
          <button type="button" onClick={() => onInsert(' (a)/(b) ')} className="math-key-highlight font-mono text-xs">a/b</button>
          <button type="button" onClick={() => onInsert(' ')} className="math-key col-span-2 text-xs">space</button>
          {onEnter && (
            <button
              type="button"
              onClick={onEnter}
              className="math-key-action bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              title="সমাধান করুন"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* TAB 4: ADVANCED SYMBOLS & CALCULUS */}
      {activeTab === 'symbols_calculus' && (
        <div className="grid grid-cols-6 gap-1.5">
          <button type="button" onClick={() => onInsert('π')} className="math-key font-bold text-amber-300">π</button>
          <button type="button" onClick={() => onInsert('θ')} className="math-key font-bold text-amber-300">θ</button>
          <button type="button" onClick={() => onInsert('Δ')} className="math-key">Δ</button>
          <button type="button" onClick={() => onInsert('∑')} className="math-key font-serif">∑</button>
          <button type="button" onClick={() => onInsert('∫')} className="math-key font-serif">∫</button>
          <button type="button" onClick={onBackspace} className="math-key-action bg-rose-950/70 text-rose-300">
            <Delete className="w-4 h-4" />
          </button>

          <button type="button" onClick={() => onInsert('≤')} className="math-key">≤</button>
          <button type="button" onClick={() => onInsert('≥')} className="math-key">≥</button>
          <button type="button" onClick={() => onInsert('≠')} className="math-key">≠</button>
          <button type="button" onClick={() => onInsert('≈')} className="math-key">≈</button>
          <button type="button" onClick={() => onInsert('∞')} className="math-key">∞</button>
          <button type="button" onClick={() => onInsert('%')} className="math-key">%</button>

          <button type="button" onClick={() => onInsert('sin(')} className="math-key text-xs font-mono">sin</button>
          <button type="button" onClick={() => onInsert('cos(')} className="math-key text-xs font-mono">cos</button>
          <button type="button" onClick={() => onInsert('tan(')} className="math-key text-xs font-mono">tan</button>
          <button type="button" onClick={() => onInsert('log(')} className="math-key text-xs font-mono">log</button>
          <button type="button" onClick={() => onInsert('ln(')} className="math-key text-xs font-mono">ln</button>
          <button type="button" onClick={() => onInsert('°')} className="math-key">°</button>

          <button type="button" onClick={() => onInsert('d/dx ')} className="math-key text-xs font-mono">d/dx</button>
          <button type="button" onClick={() => onInsert('lim ')} className="math-key text-xs font-mono">lim</button>
          <button type="button" onClick={() => onInsert('α')} className="math-key">α</button>
          <button type="button" onClick={() => onInsert('β')} className="math-key">β</button>
          <button type="button" onClick={() => onInsert('λ')} className="math-key">λ</button>
          <button type="button" onClick={onClear} className="math-key-action text-amber-300">C</button>
        </div>
      )}

      {/* TAB 5: BANGLA DIGITS (০-৯) */}
      {activeTab === 'bangla' && (
        <div className="grid grid-cols-5 gap-1.5">
          <button type="button" onClick={() => onInsert('০')} className="math-key-num text-lg">০</button>
          <button type="button" onClick={() => onInsert('১')} className="math-key-num text-lg">১</button>
          <button type="button" onClick={() => onInsert('২')} className="math-key-num text-lg">২</button>
          <button type="button" onClick={() => onInsert('৩')} className="math-key-num text-lg">৩</button>
          <button type="button" onClick={onBackspace} className="math-key-action bg-rose-950/70 text-rose-300">
            <Delete className="w-4 h-4" />
          </button>

          <button type="button" onClick={() => onInsert('৪')} className="math-key-num text-lg">৪</button>
          <button type="button" onClick={() => onInsert('৫')} className="math-key-num text-lg">৫</button>
          <button type="button" onClick={() => onInsert('৬')} className="math-key-num text-lg">৬</button>
          <button type="button" onClick={() => onInsert('৭')} className="math-key-num text-lg">৭</button>
          <button type="button" onClick={onClear} className="math-key-action text-amber-300">C</button>

          <button type="button" onClick={() => onInsert('৮')} className="math-key-num text-lg">৮</button>
          <button type="button" onClick={() => onInsert('৯')} className="math-key-num text-lg">৯</button>
          <button type="button" onClick={() => onInsert('+')} className="math-key-op">+</button>
          <button type="button" onClick={() => onInsert('−')} className="math-key-op">−</button>
          <button type="button" onClick={() => onInsert('=')} className="math-key-op text-emerald-400">=</button>
        </div>
      )}

      <style>{`
        .math-key {
          min-height: 44px;
          background-color: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(71, 85, 105, 0.6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 500;
          color: #f1f5f9;
          transition: all 0.1s ease;
          touch-action: manipulation;
        }
        .math-key:active {
          transform: scale(0.94);
          background-color: rgba(51, 65, 85, 1);
        }
        .math-key-highlight {
          min-height: 44px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(30, 58, 138, 0.35));
          border: 1px solid rgba(16, 185, 129, 0.5);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          color: #6ee7b7;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: all 0.1s ease;
          touch-action: manipulation;
        }
        .math-key-highlight:active {
          transform: scale(0.94);
          background-color: rgba(16, 185, 129, 0.4);
        }
        .math-key-num {
          min-height: 44px;
          background-color: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(51, 65, 85, 0.8);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          transition: all 0.1s ease;
          touch-action: manipulation;
        }
        .math-key-num:active {
          transform: scale(0.94);
          background-color: rgba(30, 41, 59, 1);
        }
        .math-key-op {
          min-height: 44px;
          background-color: rgba(30, 58, 138, 0.45);
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 17px;
          font-weight: 700;
          color: #93c5fd;
          transition: all 0.1s ease;
          touch-action: manipulation;
        }
        .math-key-op:active {
          transform: scale(0.94);
          background-color: rgba(30, 58, 138, 0.85);
        }
        .math-key-bracket {
          min-height: 44px;
          background-color: rgba(51, 65, 85, 0.7);
          border: 1px solid rgba(71, 85, 105, 0.6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          color: #cbd5e1;
          touch-action: manipulation;
        }
        .math-key-bracket:active {
          transform: scale(0.94);
        }
        .math-key-action {
          min-height: 44px;
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.1s ease;
          touch-action: manipulation;
        }
        .math-key-action:active {
          transform: scale(0.94);
        }
      `}</style>
    </div>
  );
};
