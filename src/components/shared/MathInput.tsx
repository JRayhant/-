import React, { useRef, useState, useEffect } from 'react';
import {
  Keyboard,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MoveLeft,
  MoveRight,
  Code2,
  Eye,
  EyeOff,
  Send,
  Mic,
  MicOff,
} from 'lucide-react';
import { MathKeyboard } from '../MathKeyboard';
import { startSpeechRecognition } from '../../utils/speech';

export type MathFormatMode = 'standard' | 'latex';

export interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  formatMode?: MathFormatMode;
  onFormatModeChange?: (mode: MathFormatMode) => void;
  showQuickRibbon?: boolean;
  showPreview?: boolean;
  submitButtonText?: string;
  isSubmitting?: boolean;
  id?: string;
}

export const MathInput: React.FC<MathInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'এখানে গাণিতিক প্রশ্ন বা সমীকরণ লিখুন (যেমন: x² - 5x + 6 = 0 বা \\frac{a}{b})...',
  label = 'গাণিতিক সমস্যা বা সমীকরণ ইনপুট:',
  rows = 3,
  disabled = false,
  autoFocus = false,
  className = '',
  formatMode: controlledFormatMode,
  onFormatModeChange,
  showQuickRibbon = true,
  showPreview = true,
  submitButtonText = 'সমাধান করুন',
  isSubmitting = false,
  id = 'math-input-field',
}) => {
  const [internalFormatMode, setInternalFormatMode] = useState<MathFormatMode>('standard');
  const activeFormatMode = controlledFormatMode || internalFormatMode;

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechInstance, setSpeechInstance] = useState<{ stop: () => void } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const toggleMic = () => {
    if (isListening && speechInstance) {
      speechInstance.stop();
      setIsListening(false);
      setSpeechInstance(null);
      return;
    }

    setIsListening(true);
    const recognition = startSpeechRecognition(
      (transcript) => {
        handleInsert(transcript);
        setIsListening(false);
        setSpeechInstance(null);
      },
      () => {
        setIsListening(false);
        setSpeechInstance(null);
      },
      () => {
        setIsListening(false);
        setSpeechInstance(null);
      }
    );
    if (recognition) {
      setSpeechInstance(recognition);
    } else {
      setIsListening(false);
    }
  };

  const toggleFormatMode = (mode: MathFormatMode) => {
    if (onFormatModeChange) {
      onFormatModeChange(mode);
    } else {
      setInternalFormatMode(mode);
    }
  };

  // Quick Action Tokens for 1-Tap Math Ribbon
  const standardQuickTokens = [
    { label: 'x²', insert: '²', latex: '^{2}', title: 'বর্গ (Square)' },
    { label: 'xⁿ', insert: 'ⁿ', latex: '^{n}', title: 'ঘাত (Power of n)' },
    { label: '√x', insert: '√', latex: '\\sqrt{x}', title: 'বর্গমূল (Square Root)' },
    { label: 'a/b', insert: ' (a)/(b) ', latex: '\\frac{a}{b}', title: 'ভগ্নাংশ (Fraction)' },
    { label: 'π', insert: 'π', latex: '\\pi', title: 'পাই (Pi)' },
    { label: 'θ', insert: 'θ', latex: '\\theta', title: 'থিটা (Theta)' },
    { label: '±', insert: '±', latex: '\\pm', title: 'প্লাস-মাইনাস (Plus-Minus)' },
    { label: '≤', insert: '≤', latex: '\\le', title: 'কম বা সমান' },
    { label: '≥', insert: '≥', latex: '\\ge', title: 'বেশি বা সমান' },
    { label: '≠', insert: '≠', latex: '\\neq', title: 'অসমান' },
    { label: 'x³', insert: '³', latex: '^{3}', title: 'ঘন (Cube)' },
    { label: '( )', insert: '()', latex: '\\left( \\right)', title: 'বন্ধনী' },
    { label: '∫', insert: '∫', latex: '\\int', title: 'ইন্টিগ্রাল' },
    { label: '∑', insert: '∑', latex: '\\sum', title: 'সামেশন' },
    { label: 'd/dx', insert: 'd/dx ', latex: '\\frac{d}{dx}', title: 'অন্তরক' },
  ];

  // Core Cursor-Based Insertion Engine
  const handleInsert = (token: string, latexToken?: string, cursorInsideOffset?: number) => {
    const el = textareaRef.current;
    const isLatex = activeFormatMode === 'latex';
    const chosenToken = isLatex && latexToken ? latexToken : token;

    if (!el) {
      onChange(value + chosenToken);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentText = el.value;

    let textToInsert = chosenToken;
    let newCursorPos = start + textToInsert.length;

    // Smart contextual selection handling
    if (start !== end) {
      const selected = currentText.substring(start, end);
      if (token === '²' || token === '³' || token === 'ⁿ') {
        textToInsert = isLatex ? `(${selected})^{${token === '²' ? '2' : token === '³' ? '3' : 'n'}}` : `(${selected})${token}`;
      } else if (token === '√' || token === '\\sqrt{x}') {
        textToInsert = isLatex ? `\\sqrt{${selected}}` : `√(${selected})`;
      } else if (token === ' (a)/(b) ' || token === '\\frac{a}{b}') {
        textToInsert = isLatex ? `\\frac{${selected}}{b}` : `(${selected})/(□)`;
      } else if (token === '()') {
        textToInsert = isLatex ? `\\left(${selected}\\right)` : `(${selected})`;
      }
      newCursorPos = start + textToInsert.length;
    } else {
      // Special cursor placement inside brackets/fractions when no selection
      if (isLatex) {
        if (textToInsert.includes('\\frac{a}{b}')) {
          textToInsert = '\\frac{a}{b}';
          // Place cursor on 'a'
          newCursorPos = start + 6;
        } else if (textToInsert.includes('\\sqrt{x}')) {
          newCursorPos = start + 6;
        } else if (textToInsert.includes('^{}')) {
          newCursorPos = start + 2;
        }
      } else {
        if (textToInsert === '()') {
          newCursorPos = start + 1;
        } else if (textToInsert === ' (□)/(□) ') {
          newCursorPos = start + 3;
        }
      }
    }

    if (cursorInsideOffset !== undefined) {
      newCursorPos = start + cursorInsideOffset;
    }

    const updated = currentText.substring(0, start) + textToInsert + currentText.substring(end);
    onChange(updated);

    // Keep textarea focused and place cursor reliably
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 15);
  };

  // Cursor-based backspace
  const handleBackspace = () => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value.slice(0, -1));
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentText = el.value;

    if (start === end && start > 0) {
      // Check if deleting a LaTeX command like \frac, \sqrt, \pi
      let deleteCount = 1;
      const textBefore = currentText.substring(0, start);
      const latexMatch = textBefore.match(/\\[a-zA-Z]+$/);
      if (latexMatch) {
        deleteCount = latexMatch[0].length;
      }

      const updated = currentText.substring(0, start - deleteCount) + currentText.substring(end);
      onChange(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start - deleteCount, start - deleteCount);
      }, 15);
    } else if (start !== end) {
      const updated = currentText.substring(0, start) + currentText.substring(end);
      onChange(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start);
      }, 15);
    }
  };

  const handleClear = () => {
    onChange('');
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleMoveCursor = (direction: 'left' | 'right') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const newPos = direction === 'left' ? Math.max(0, start - 1) : Math.min(el.value.length, start + 1);
    el.focus();
    el.setSelectionRange(newPos, newPos);
  };

  const copyToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render LaTeX & Math Formatting for Preview
  const renderFormattedMath = (str: string) => {
    if (!str.trim()) return null;

    // Convert common LaTeX and Unicode patterns into clean HTML math layout
    // 1. Fractions: \frac{num}{den} or (a)/(b)
    let formatted = str
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="inline-flex flex-col items-center align-middle mx-1 text-center leading-none"><span class="border-b border-slate-600 px-1 text-xs pb-0.5">$1</span><span class="px-1 text-xs pt-0.5">$2</span></span>')
      .replace(/\(([a-zA-Z0-9+\-*^]+)\)\/\(([a-zA-Z0-9+\-*^]+)\)/g, '<span class="inline-flex flex-col items-center align-middle mx-1 text-center leading-none"><span class="border-b border-slate-600 px-1 text-xs pb-0.5">$1</span><span class="px-1 text-xs pt-0.5">$2</span></span>')
      // 2. Square roots: \sqrt{x} or √x or √(expr)
      .replace(/\\sqrt\{([^}]+)\}/g, '<span class="inline-flex items-center"><span class="font-math text-sm">√</span><span class="border-t border-slate-700 px-1 text-xs">$1</span></span>')
      .replace(/√\(([^)]+)\)/g, '<span class="inline-flex items-center"><span class="font-math text-sm">√</span><span class="border-t border-slate-700 px-1 text-xs">$1</span></span>')
      // 3. Superscripts / powers: ^{2}, ^2, ², ³, ⁿ
      .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
      .replace(/\^([0-9a-zA-Z]+)/g, '<sup>$1</sup>')
      .replace(/²/g, '<sup>2</sup>')
      .replace(/³/g, '<sup>3</sup>')
      .replace(/ⁿ/g, '<sup>n</sup>')
      // 4. Subscripts: _{i}, _i
      .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
      .replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>')
      // 5. Greek symbols & operators
      .replace(/\\pi/g, 'π')
      .replace(/\\theta/g, 'θ')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\sum/g, '∑')
      .replace(/\\int/g, '∫')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\pm/g, '±')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷');

    return formatted;
  };

  return (
    <div className={`space-y-2 text-slate-900 ${className}`}>
      {/* Header Bar: Label, Mode Switcher & Keyboard Trigger */}
      <div className="flex items-center justify-between flex-wrap gap-1.5">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
        </label>

        <div className="flex items-center gap-1.5">
          {/* Format Mode Toggle (Standard vs LaTeX) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => toggleFormatMode('standard')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-colors ${
                activeFormatMode === 'standard'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ইউনিকোড ও সাধারণ গাণিতিক প্রতীক"
            >
              স্ট্যান্ডার্ড (x², √x)
            </button>
            <button
              type="button"
              onClick={() => toggleFormatMode('latex')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1 ${
                activeFormatMode === 'latex'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="LaTeX ফরম্যাটিং (\frac, \sqrt, ^{2})"
            >
              <Code2 className="w-3 h-3 text-emerald-600" />
              LaTeX
            </button>
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleMic}
            className={`px-2.5 py-1 text-xs rounded-lg border font-semibold flex items-center gap-1 transition-all shadow-2xs ${
              isListening
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="মুখে বলুন (Microphone Voice Dictation)"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5 text-rose-600" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{isListening ? 'শুনছি...' : 'ভয়েস'}</span>
          </button>

          {/* Full Keyboard Toggle Button */}
          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-semibold flex items-center gap-1 transition-all shadow-2xs ${
              showKeyboard
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/20'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="সম্পূর্ণ ম্যাথ কিবোর্ড খুলুন বা লুকান"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>কিবোর্ড</span>
            {showKeyboard ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 1-Tap Quick Action Math Ribbon (Adapts dynamically to Standard / LaTeX mode) */}
      {showQuickRibbon && (
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 bg-slate-100/90 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 pl-1 pr-1 shrink-0">
            {activeFormatMode === 'latex' ? 'LaTeX প্রতীক:' : 'দ্রুত যোগ:'}
          </span>
          {standardQuickTokens.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleInsert(item.insert, item.latex)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 active:scale-95 border border-slate-200 hover:border-emerald-400 rounded-lg text-xs font-math font-semibold text-slate-800 hover:text-emerald-700 shadow-2xs shrink-0 transition-all"
              title={activeFormatMode === 'latex' ? `${item.title}: ${item.latex}` : `${item.title}: ${item.insert}`}
            >
              {activeFormatMode === 'latex' ? item.label : item.label}
            </button>
          ))}
        </div>
      )}

      {/* Standard Textarea with Cursor Integration */}
      <div className="relative">
        <textarea
          id={id}
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400 font-sans shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
        />

        {/* Floating Utilities (Clear, Copy, Move Cursor) */}
        {value && (
          <div className="absolute right-2.5 bottom-3 flex items-center gap-1 text-[11px] text-slate-400 bg-white/90 backdrop-blur-xs p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => handleMoveCursor('left')}
              className="p-1 hover:text-slate-800 rounded hover:bg-slate-100"
              title="কার্সার এক অক্ষর বামে নিন"
            >
              <MoveLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleMoveCursor('right')}
              className="p-1 hover:text-slate-800 rounded hover:bg-slate-100"
              title="কার্সার এক অক্ষর ডানে নিন"
            >
              <MoveRight className="w-3 h-3" />
            </button>
            <div className="w-[1px] h-3 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-1 hover:text-slate-800 rounded hover:bg-slate-100"
              title="কপি করুন"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-rose-600 rounded hover:bg-rose-50"
              title="সব মুছে ফেলুন"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Live Formatted Mathematical Preview */}
      {showPreview && value.trim() && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-2.5 space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200/60">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-slate-600">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              গাণিতিক প্রদর্শন (Live Math Preview):
            </span>
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5 font-medium"
            >
              {isPreviewExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {isPreviewExpanded ? 'লুকান' : 'প্রদর্শন'}
            </button>
          </div>

          {isPreviewExpanded && (
            <div
              className="font-math text-sm text-slate-900 font-medium py-1 px-1 overflow-x-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderFormattedMath(value) || '' }}
            />
          )}
        </div>
      )}

      {/* Integrated Full Math Keyboard Component */}
      {showKeyboard && (
        <div className="pt-1 animate-in fade-in slide-in-from-top-2 duration-150 shadow-md rounded-2xl overflow-hidden">
          <MathKeyboard
            onInsert={(token) => {
              // If LaTeX mode is active, map token where appropriate
              if (activeFormatMode === 'latex') {
                const latexMap: Record<string, string> = {
                  '²': '^{2}',
                  '³': '^{3}',
                  'ⁿ': '^{n}',
                  '√': '\\sqrt{x}',
                  '∛': '\\sqrt[3]{x}',
                  ' (a)/(b) ': '\\frac{a}{b}',
                  ' (□)/(□) ': '\\frac{a}{b}',
                  ' ((a)/(b))/((c)/(d)) ': '\\frac{\\frac{a}{b}}{\\frac{c}{d}}',
                  'π': '\\pi',
                  'θ': '\\theta',
                  'Δ': '\\Delta',
                  '∑': '\\sum',
                  '∫': '\\int',
                  '≤': '\\le',
                  '≥': '\\ge',
                  '≠': '\\neq',
                  '±': '\\pm',
                  '×': '\\times',
                  '÷': '\\div',
                  'sin(': '\\sin(',
                  'cos(': '\\cos(',
                  'tan(': '\\tan(',
                  'log(': '\\log(',
                  'ln(': '\\ln(',
                  'd/dx ': '\\frac{d}{dx}',
                  'lim ': '\\lim',
                  'α': '\\alpha',
                  'β': '\\beta',
                  'λ': '\\lambda',
                };
                const mapped = latexMap[token] || token;
                handleInsert(mapped);
              } else {
                handleInsert(token);
              }
            }}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onEnter={onSubmit}
            onClose={() => setShowKeyboard(false)}
            onMoveCursor={handleMoveCursor}
          />
        </div>
      )}

      {/* Optional In-Field Submit Button */}
      {onSubmit && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            Ctrl+Enter চেপে দ্রুত জমা দিন
          </span>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !value.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                প্রক্রিয়াধীন...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {submitButtonText}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
