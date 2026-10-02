import React, { useState } from 'react';
import {
  ArrowLeft,
  Atom,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { PHYSICS_TOPICS } from '../../data/curriculumData';
import { MathInput } from '../shared/MathInput';

interface PhysicsSolverScreenProps {
  onBack: () => void;
  onSolveQuestion: (q: string) => void;
}

export const PhysicsSolverScreen: React.FC<PhysicsSolverScreenProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState('গতি ও বেগ (Motion)');
  const [numericalInput, setNumericalInput] = useState(
    'একটি গাড়ি স্থির অবস্থান থেকে যাত্রা শুরু করে 2 m/s² সুষম ত্বরণে 10 সেকেন্ড চলল। গাড়িটির শেষ বেগ ও অতিক্রান্ত দূরত্ব কত?'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSolve = async () => {
    if (!numericalInput.trim()) return;
    setIsLoading(true);
    setSolution(null);

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: numericalInput.trim(),
          classLevel: 'পদার্থবিজ্ঞান (Physics)',
          subject: 'Physics Numerical',
        }),
      });

      const data = await res.json();
      setSolution(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    if (!solution) return;
    navigator.clipboard.writeText(
      `পদার্থবিজ্ঞান সমাধান:\nপ্রশ্ন: ${solution.question}\nদেওয়া আছে: ${solution.given}\nসূত্র: ${solution.formula}\nচূড়ান্ত উত্তর: ${solution.finalAnswer}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          পিছনে
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">পদার্থবিজ্ঞান নিউমেরিক্যাল সলভার</h2>
          <span className="text-[11px] text-slate-500">Given → Required → Formula → Unit</span>
        </div>

        <div className="w-16"></div>
      </div>

      {/* Input Stage */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            টপিক নির্বাচন করুন:
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-medium text-slate-900"
          >
            {PHYSICS_TOPICS.map((pt) => (
              <option key={pt.id} value={pt.name}>
                {pt.name} — ({pt.formula})
              </option>
            ))}
          </select>
        </div>

        <MathInput
          value={numericalInput}
          onChange={setNumericalInput}
          placeholder="যেমন: একটি 5 kg ভরের বস্তুর ওপর 20 N বল প্রয়োগ করা হলে ত্বরণ কত হবে? অথবা v² = u² + 2as"
          rows={3}
          label="পদার্থবিজ্ঞানের গাণিতিক সমস্যাটি লিখুন (দ্রুত x², √x, a/b চাপুন):"
          onSubmit={handleSolve}
          submitButtonText="পদার্থবিজ্ঞান সমাধান দেখুন"
          isSubmitting={isLoading}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">একক (Unit) ও মানসহ নির্ভুল সমাধান</span>
          <button
            type="button"
            onClick={handleSolve}
            disabled={isLoading || !numericalInput.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                গণনা হচ্ছে...
              </>
            ) : (
              <>
                <Atom className="w-3.5 h-3.5" />
                পদার্থবিজ্ঞান সমাধান দেখুন
              </>
            )}
          </button>
        </div>
      </div>

      {/* Structured Physics Solution Card */}
      {solution && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              পদার্থবিজ্ঞান সমাধান কাঠামো
            </h3>
            <button
              type="button"
              onClick={copyResult}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'কপি হয়েছে' : 'কপি করুন'}
            </button>
          </div>

          {/* Given & Required */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-0.5">
              <span className="font-bold text-blue-900 block">দেওয়া আছে (Given):</span>
              <p className="text-slate-700 font-sans">{solution.given || 'প্রদত্ত উপাত্ত'}</p>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
              <span className="font-bold text-emerald-900 block">নির্ণেয় (Required):</span>
              <p className="text-slate-700 font-sans">{solution.toFind || 'অজানা রাশি'}</p>
            </div>
          </div>

          {/* Formula & Rationale */}
          {solution.formula && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">সূত্র (Formula):</span>
                <span className="font-math font-bold px-2 py-0.5 bg-white rounded border border-slate-300 text-slate-900">
                  {solution.formula}
                </span>
              </div>
              {solution.whyFormula && (
                <p className="text-slate-600 pt-0.5">
                  <strong>কেন এই সূত্র?</strong> {solution.whyFormula}
                </p>
              )}
            </div>
          )}

          {/* Calculation Steps */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              হিসাবের ধাপসমূহ (Calculation):
            </span>
            {solution.steps?.map((st: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs space-y-1"
              >
                <div className="font-semibold text-slate-800">
                  ধাপ {st.stepNumber}: {st.title}
                </div>
                <p className="text-slate-600">{st.content}</p>
                {st.mathExpr && (
                  <div className="p-2 bg-white rounded border border-slate-200 font-math text-slate-900 font-medium">
                    {st.mathExpr}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final Answer with Proper SI Unit */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl text-center shadow-xs space-y-1">
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              চূড়ান্ত উত্তর (SI এককসহ)
            </span>
            <div className="text-xl font-bold font-math tracking-wide text-white">
              {solution.finalAnswer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
