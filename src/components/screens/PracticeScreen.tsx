import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  PenTool,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Loader2,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CLASS_GRADES } from '../../data/curriculumData';
import { recordProblemSolved } from '../../utils/storage';

interface PracticeScreenProps {
  onBack: () => void;
  initialGrade?: string;
  initialTopic?: string;
}

interface PracticeProblem {
  id: string;
  question: string;
  difficulty: string;
  options: string[];
  correctOptionIndex: number;
  hint: string;
  formula: string;
  stepSolution: string;
  explanation: string;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  onBack,
  initialGrade = 'Class 9',
  initialTopic = 'বীজগণিতীয় রাশি',
}) => {
  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<'সহজ' | 'মাঝারি' | 'কঠিন' | 'উচ্চতর' | 'বোর্ড পরীক্ষা'>('মাঝারি');

  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showStepSolution, setShowStepSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fallback initial sample problem if offline or before loading
  const defaultProblem: PracticeProblem = {
    id: 'sample-1',
    question: 'x² - 5x + 6 = 0 দ্বিঘাত সমীকরণটির মূলদ্বয় (roots) কত?',
    difficulty: 'মাঝারি',
    options: ['ক) 2, 3', 'খ) -2, -3', 'গ) 1, 6', 'ঘ) -1, -6'],
    correctOptionIndex: 0,
    hint: 'মধ্যপদ বিভাজন (Middle term) করুন: -5x = -2x - 3x। অথবা নিশ্চায়ক সূত্র দেখুন।',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    stepSolution: 'x² - 2x - 3x + 6 = 0\n=> x(x - 2) - 3(x - 2) = 0\n=> (x - 2)(x - 3) = 0\nসুতরাং x = 2 অথবা x = 3।',
    explanation: 'যেহেতু মূলদ্বয়ের যোগফল -(-5)/1 = 5 এবং গুণফল 6/1 = 6, তাই 2 ও 3 মূলদ্বয় সত্য।',
  };

  useEffect(() => {
    setProblems([defaultProblem]);
  }, []);

  // Dynamic Offline Practice Problem Generator covering all math branches
  const generateOfflinePractice = (topicName: string): PracticeProblem[] => {
    const seed = Math.floor(Math.random() * 1000);
    const r1 = Math.floor(Math.random() * 5) + 1;
    const r2 = Math.floor(Math.random() * 5) + 2;
    const sum = r1 + r2;
    const prod = r1 * r2;

    const cost = [100, 200, 400, 500, 1000][seed % 5];
    const rate = [10, 15, 20, 25][seed % 4];
    const profit = (cost * rate) / 100;
    const sp = cost + profit;

    const triplets = [
      { a: 3, b: 4, c: 5 },
      { a: 6, b: 8, c: 10 },
      { a: 5, b: 12, c: 13 },
      { a: 8, b: 15, c: 17 },
    ];
    const trip = triplets[seed % triplets.length];

    const trigAngles = [
      { q: 'sin(30°)', ans: '1/2', options: ['1/2', '√3/2', '1/√2', '0'] },
      { q: 'cos(60°)', ans: '1/2', options: ['1/2', '√3/2', '1', '1/√2'] },
      { q: 'tan(45°)', ans: '1', options: ['1', '0', '√3', '1/√3'] },
    ];
    const trig = trigAngles[seed % trigAngles.length];

    return [
      {
        id: `offline-quad-${seed}`,
        question: `x² - ${sum}x + ${prod} = 0 সমীকরণটির মূলদ্বয় (roots) কত?`,
        difficulty: 'মাঝারি',
        options: [
          `ক) ${r1}, ${r2}`,
          `খ) -${r1}, -${r2}`,
          `গ) ${r1 + 1}, ${r2 - 1}`,
          `ঘ) 0, ${prod}`,
        ],
        correctOptionIndex: 0,
        hint: `মধ্যপদ বিভাজন (Middle term) করুন: -${sum}x = -${r1}x - ${r2}x।`,
        formula: 'x² - (α + β)x + αβ = 0',
        stepSolution: `x² - ${r1}x - ${r2}x + ${prod} = 0\n=> x(x - ${r1}) - ${r2}(x - ${r1}) = 0\n=> (x - ${r1})(x - ${r2}) = 0\nসুতরাং x = ${r1} অথবা x = ${r2}।`,
        explanation: `সমীকরণের মূলদ্বয়ের যোগফল ${sum} এবং গুণফল ${prod} হওয়ায় মূলদ্বয় ${r1} ও ${r2}।`,
      },
      {
        id: `offline-profit-${seed}`,
        question: `একটি দ্রব্য ${cost} টাকায় ক্রয় করে ${rate}% লাভে বিক্রয় করলে বিক্রয়মূল্য কত টাকা হবে?`,
        difficulty: 'সহজ',
        options: [
          `ক) ${sp} টাকা`,
          `খ) ${cost + profit / 2} টাকা`,
          `গ) ${sp + 20} টাকা`,
          `ঘ) ${cost - profit} টাকা`,
        ],
        correctOptionIndex: 0,
        hint: `লাভের পরিমাণ = (${cost} × ${rate}) / ১০০ = ${profit} টাকা। বিক্রয়মূল্য = ক্রয়মূল্য + লাভ।`,
        formula: 'বিক্রয়মূল্য = ক্রয়মূল্য × (১ + শতকরা_লাভ/১০০)',
        stepSolution: `মোট লাভ = (${cost} × ${rate}) / ১০০ = ${profit} টাকা।\nবিক্রয়মূল্য = ${cost} + ${profit} = ${sp} টাকা।`,
        explanation: `${rate}% হারে ${cost} টাকায় লাভ হয় ${profit} টাকা। অতএব বিক্রয়মূল্য ${sp} টাকা।`,
      },
      {
        id: `offline-pyth-${seed}`,
        question: `একটি সমকোণী ত্রিভুজের লম্ব ${trip.a} সেমি এবং ভূমি ${trip.b} সেমি হলে অতিভুজের দৈর্ঘ্য কত সেমি?`,
        difficulty: 'মাঝারি',
        options: [
          `ক) ${trip.c} সেমি`,
          `খ) ${trip.c + 2} সেমি`,
          `গ) ${trip.a + trip.b} সেমি`,
          `ঘ) ${trip.c - 1} সেমি`,
        ],
        correctOptionIndex: 0,
        hint: `পিথাগোরাসের উপপাদ্য অনুযায়ী: অতিভুজ² = লম্ব² + ভূমি²।`,
        formula: 'c = √(a² + b²)',
        stepSolution: `অতিভুজ² = (${trip.a})² + (${trip.b})² = ${trip.a * trip.a} + ${trip.b * trip.b} = ${trip.c * trip.c}\n=> অতিভুজ = √(${trip.c * trip.c}) = ${trip.c} সেমি।`,
        explanation: `পিথাগোরিয়ান ত্রয়ী (${trip.a}, ${trip.b}, ${trip.c}) অনুযায়ী অতিভুজ ${trip.c} সেমি।`,
      },
    ];
  };

  const handleGenerateProblems = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setShowStepSolution(false);

    try {
      if (!navigator.onLine) {
        throw new Error('OFFLINE_NETWORK');
      }

      const res = await fetch('/api/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel: selectedGrade,
          topic: selectedTopic,
          difficulty,
          count: 3,
        }),
      });

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setProblems(data);
        setCurrentIndex(0);
      } else {
        setProblems(generateOfflinePractice(selectedTopic));
        setCurrentIndex(0);
      }
    } catch (err) {
      // Local dynamic offline practice problems
      setProblems(generateOfflinePractice(selectedTopic));
      setCurrentIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const current = problems[currentIndex];
    if (selectedOption === current.correctOptionIndex) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
      recordProblemSolved(current.question.slice(0, 30), selectedTopic);
    }
  };

  const handleNextProblem = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setShowStepSolution(false);
    } else {
      handleGenerateProblems();
    }
  };

  const currentProblem = problems[currentIndex] || defaultProblem;

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header */}
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
          <h2 className="text-sm font-bold text-slate-900">গণিত প্র্যাকটিস</h2>
          <span className="text-[11px] text-slate-500">
            প্রশ্ন {currentIndex + 1} / {problems.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleGenerateProblems}
          disabled={isLoading}
          className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
          title="নতুন প্রশ্ন"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          নতুন
        </button>
      </div>

      {/* Filter / Configuration Controls */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-slate-500 block mb-1">শ্রেণি:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
            >
              <option value="Class 6">৬ষ্ঠ শ্রেণি</option>
              <option value="Class 7">৭ম শ্রেণি</option>
              <option value="Class 8">৮ম শ্রেণি (JSC)</option>
              <option value="Class 9">৯ম শ্রেণি (SSC)</option>
              <option value="Class 10">১০ম শ্রেণি (বোর্ড)</option>
              <option value="Class 11">১১শ শ্রেণি (HSC)</option>
              <option value="Class 12">১২শ শ্রেণি (HSC)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 block mb-1">টপিক:</label>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="অধ্যায়ের নাম"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium mb-1.5"
            />
          </div>
        </div>

        {/* Quick All-Math Branches Chips */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-medium block">
            সব ধরনের গণিত শাখা থেকে নির্বাচন করুন:
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { label: '💰 পাটিগণিত', value: 'পাটিগণিত (লাভ-ক্ষতি, সুদকষা, অনুপাত)' },
              { label: '🔢 বীজগণিত', value: 'বীজগণিতীয় রাশি ও দ্বিঘাত সমীকরণ' },
              { label: '📐 জ্যামিতি', value: 'জ্যামিতি ও বৃত্তের উপপাদ্য' },
              { label: '📏 ত্রিকোণমিতি', value: 'ত্রিকোণমিতিক অভেদাবলি ও মান' },
              { label: '∫ ক্যালকুলাস', value: 'ক্যালকুলাস (লিমিট ও অন্তরীকরণ)' },
              { label: '📊 পরিসংখ্যান', value: 'পরিসংখ্যান ও গড়-মধ্যক-প্রচুরক' },
              { label: '⚡ পদার্থবিজ্ঞান', value: 'পদার্থবিজ্ঞান গতিসূত্র ও বলবিদ্যা' },
            ].map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setSelectedTopic(b.value)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                  selectedTopic === b.value
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="text-[11px] text-slate-500 block mb-1 font-medium">কঠিনতার স্তর:</label>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {(['সহজ', 'মাঝারি', 'কঠিন', 'উচ্চতর', 'বোর্ড পরীক্ষা'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  difficulty === diff
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Practice Problem Card */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-800">AI অনুশীলন প্রশ্ন তৈরি করছে...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
              স্তর: {currentProblem.difficulty}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              #{currentIndex + 1}
            </span>
          </div>

          <div className="text-sm font-semibold text-slate-900 leading-relaxed font-sans">
            {currentProblem.question}
          </div>

          {/* Options */}
          <div className="space-y-2 pt-1">
            {currentProblem.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentProblem.correctOptionIndex;

              let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
              if (isSelected && !isAnswerSubmitted) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
              } else if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-medium';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Row: Hint & Submit */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              {showHint ? 'হিন্ট লুকান' : 'হিন্ট (Hint) দেখুন'}
            </button>

            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                উত্তর যাচাই করুন
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextProblem}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                পরবর্তী প্রশ্ন
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hint Card */}
          {showHint && currentProblem.hint && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                শিক্ষকের ইঙ্গিত:
              </span>
              <p>{currentProblem.hint}</p>
            </div>
          )}

          {/* Step Solution & Explanation (Revealed after submission) */}
          {isAnswerSubmitted && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowStepSolution(!showStepSolution)}
                  className="text-xs text-emerald-700 hover:underline font-bold"
                >
                  {showStepSolution ? 'সমাধান সংক্ষেপ করুন' : 'ধাপে ধাপে সম্পূর্ণ সমাধান দেখুন ▼'}
                </button>
              </div>

              {showStepSolution && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
                  {currentProblem.formula && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">সূত্র:</span>
                      <span className="px-2 py-0.5 bg-white border rounded font-math text-xs">
                        {currentProblem.formula}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">সমাধানের ধাপ:</span>
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                      {currentProblem.stepSolution}
                    </pre>
                  </div>

                  {currentProblem.explanation && (
                    <div>
                      <span className="font-semibold text-slate-700 block mb-0.5">সহজ ব্যাখ্যা:</span>
                      <p className="text-slate-600">{currentProblem.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
