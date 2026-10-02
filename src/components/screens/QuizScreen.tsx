import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { enToBnDigits } from '../../utils/mathEngine';
import { recordQuizCompleted } from '../../utils/storage';

interface QuizScreenProps {
  onBack: () => void;
  onSolveQuestion: (q: string) => void;
}

interface QuizQuestion {
  id: number;
  category?: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  correctIndex: number;
  explanation: string;
  formula?: string;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ onBack, onSolveQuestion }) => {
  // Setup vs Active vs Result
  const [stage, setStage] = useState<'setup' | 'active' | 'result'>('setup');

  // Setup options
  const [classLevel, setClassLevel] = useState('৯ম-১০ম শ্রেণি (SSC)');
  const [topic, setTopic] = useState('বীজগণিত ও ত্রিকোণমিতি');
  const [quizType, setQuizType] = useState('MCQ');
  const [questionCount, setQuestionCount] = useState(5);
  const [isTimedExam, setIsTimedExam] = useState(true);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins default
  const [isLoading, setIsLoading] = useState(false);

  // Timer countdown during active quiz
  useEffect(() => {
    if (stage !== 'active' || !isTimedExam) return;

    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLeft, isTimedExam]);

  // Start Quiz generator
  const handleStartQuiz = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel,
          topic,
          type: quizType,
          questionCount,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // Fallback robust questions
        setQuestions([
          {
            id: 1,
            type: 'mcq',
            question: 'x² - 9 = 0 সমীকরণটির মূলদ্বয় কত?',
            options: ['± 3', '± 9', '3, 0', '0, 9'],
            correctAnswer: '± 3',
            correctIndex: 0,
            explanation: 'x² = 9 => x = ±√9 = ±3',
            formula: 'x = ±√k',
          },
          {
            id: 2,
            type: 'mcq',
            question: 'sin²θ + cos²θ এর মান কত?',
            options: ['0', '1', '2', '-1'],
            correctAnswer: '1',
            correctIndex: 1,
            explanation: 'পিথাগোরাসের উপপাদ্য অনুযায়ী মৌলিক ত্রিকোণমিতিক অভেদ: sin²θ + cos²θ = 1',
            formula: 'sin²θ + cos²θ = 1',
          },
          {
            id: 3,
            type: 'mcq',
            question: 'একটি সমকোণী ত্রিভুজের লম্ব ৬ সেমি ও ভূমি ৮ সেমি হলে অতিভুজ কত?',
            options: ['10 সেমি', '12 সেমি', '14 সেমি', '16 সেমি'],
            correctAnswer: '10 সেমি',
            correctIndex: 0,
            explanation: 'অতিভুজ = √(6² + 8²) = √(36 + 64) = √100 = 10 সেমি',
            formula: 'c = √(a² + b²)',
          },
        ]);
      }

      setUserAnswers({});
      setCurrentIndex(0);
      setTimeLeft(questionCount * 60); // 1 min per question
      setStage('active');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (optIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const finishQuiz = () => {
    setStage('result');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    // Calculate score and save progress
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correct++;
    });
    recordQuizCompleted(topic, questions.length, correct, topic);
  };

  // Result Calculations
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correct++;
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      timeSpentSeconds: questionCount * 60 - timeLeft,
    };
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. SETUP STAGE (Choose parameters)
  if (stage === 'setup') {
    return (
      <div className="space-y-4 pb-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            হোম
          </button>

          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-900">কুইজ ও পরীক্ষা মোড</h2>
            <span className="text-[11px] text-slate-500">স্ব-মূল্যায়ন ও সময়ভিত্তিক প্রস্তুতি</span>
          </div>

          <div className="w-16"></div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-3 text-xs">
            {/* Class selection */}
            <div>
              <label className="text-slate-700 font-semibold block mb-1">শ্রেণি নির্বাচন:</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
              >
                <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                <option value="৮ম শ্রেণি (JSC)">৮ম শ্রেণি (JSC)</option>
                <option value="৯ম-১০ম শ্রেণি (SSC)">৯ম-১০ম শ্রেণি (SSC)</option>
                <option value="১১শ-১২শ শ্রেণি (HSC)">১১শ-১২শ শ্রেণি (HSC)</option>
              </select>
            </div>

            {/* Topic input & All Math Branch Quick Selector Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold block">অধ্যায় বা টপিক:</label>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  সব সময় নতুন প্রশ্ন
                </span>
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="যেমন: ত্রিকোণমিতি, দ্বিঘাত সমীকরণ, লাভ-ক্ষতি, ক্যালকুলাস"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium font-sans mb-2"
              />

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">
                  সব ধরনের গণিত শাখা থেকে বেছে নিন:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '🌟 সব শাখা মিশ্র কুইজ', value: 'সকল গণিত মিশ্র কুইজ' },
                    { label: '💰 পাটিগণিত (লাভ-ক্ষতি ও সুদ)', value: 'পাটিগণিত (লাভ-ক্ষতি, সরল ও চক্রবৃদ্ধি মুনাফা, অনুপাত)' },
                    { label: '📐 জ্যামিতি ও পিথাগোরাস', value: 'জ্যামিতি ও বৃত্তের উপপাদ্য' },
                    { label: '🔢 বীজগণিত ও সমীকরণ', value: 'বীজগণিত ও দ্বিঘাত সমীকরণ' },
                    { label: '📏 ত্রিকোণমিতি', value: 'ত্রিকোণমিতিক অভেদাবলি ও মান' },
                    { label: '∫ ক্যালকুলাস', value: 'ক্যালকুলাস (লিমিট, অন্তরীকরণ ও যোগজীকরণ)' },
                    { label: '📊 পরিসংখ্যান ও সম্ভাবনা', value: 'পরিসংখ্যান ও সম্ভাবনা' },
                    { label: '⚡ পদার্থবিজ্ঞান গণিত', value: 'পদার্থবিজ্ঞানের গাণিতিক অংশ (গতিসূত্র ও বল)' },
                  ].map((branch) => (
                    <button
                      key={branch.value}
                      type="button"
                      onClick={() => setTopic(branch.value)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        topic === branch.value
                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                      }`}
                    >
                      {branch.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quiz Type */}
            <div>
              <label className="text-slate-700 font-semibold block mb-1">প্রশ্নের ধরন:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['MCQ', 'True/False', 'মিশ্র (Mixed)'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQuizType(t)}
                    className={`py-2 rounded-xl border text-xs font-medium ${
                      quizType === t
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="text-slate-700 font-semibold block mb-1">প্রশ্নের সংখ্যা:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[5, 10, 20].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2 rounded-xl border text-xs font-semibold ${
                      questionCount === cnt
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {enToBnDigits(cnt)}টি প্রশ্ন
                  </button>
                ))}
              </div>
            </div>

            {/* Timed Exam toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="font-semibold text-slate-800 block">টাইমারসহ পরীক্ষা মোড</span>
                <span className="text-[11px] text-slate-500">প্রতি প্রশ্নের জন্য ১ মিনিট সময়</span>
              </div>
              <input
                type="checkbox"
                checked={isTimedExam}
                onChange={(e) => setIsTimedExam(e.target.checked)}
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartQuiz}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                পরীক্ষা প্রস্তুত হচ্ছে...
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                পরীক্ষা শুরু করুন
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUIZ / EXAM INTERFACE (Strictly distraction free!)
  if (stage === 'active') {
    const currentQ = questions[currentIndex];
    const isAnswered = userAnswers[currentIndex] !== undefined;
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
      <div className="space-y-4 pb-8">
        {/* Exam Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              if (confirm('আপনি কি পরীক্ষা থেকে প্রস্থান করতে চান?')) {
                setStage('setup');
              }
            }}
            className="text-xs text-rose-600 font-semibold px-2 py-1 hover:bg-rose-50 rounded"
          >
            প্রস্থান
          </button>

          <span className="text-xs font-bold text-slate-900">
            প্রশ্ন {enToBnDigits(currentIndex + 1)} / {enToBnDigits(questions.length)}
          </span>

          {isTimedExam && (
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Question Progress Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {questions.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 flex-1 rounded-full transition-all ${
                currentIndex === idx
                  ? 'bg-slate-900 ring-2 ring-slate-900/20'
                  : userAnswers[idx] !== undefined
                  ? 'bg-emerald-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Question Body */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 leading-relaxed font-sans">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2 pt-1">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = userAnswers[currentIndex] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(oIdx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Controls: Prev / Next / Finish */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 text-xs text-slate-600 disabled:opacity-30 rounded-lg hover:bg-slate-100"
            >
              পূর্ববর্তী
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={finishQuiz}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                পরীক্ষা জমা দিন (Submit)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                পরবর্তী
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULT STAGE (Scorecard & Review)
  const score = calculateScore();

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setStage('setup')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          নতুন পরীক্ষা
        </button>

        <h2 className="text-sm font-bold text-slate-900">ফলাফল ও স্কোরকার্ড</h2>

        <div className="w-16"></div>
      </div>

      {/* Score Summary Box */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 text-center shadow-sm space-y-3">
        <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
          পরীক্ষা সম্পন্ন হয়েছে
        </span>

        <div className="text-4xl font-bold font-mono text-white">
          {score.percentage}%
        </div>

        <p className="text-xs text-slate-300">
          মোট {enToBnDigits(score.total)}টি প্রশ্নের মধ্যে আপনি{' '}
          <strong className="text-emerald-400">{enToBnDigits(score.correct)}টি</strong> সঠিক উত্তর দিয়েছেন।
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">সঠিক উত্তর</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{score.correct}</span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">ভুল উত্তর</span>
            <span className="font-bold text-rose-400 font-mono text-sm">
              {score.total - score.correct}
            </span>
          </div>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider px-1">
          প্রশ্নের বিশদ পর্যালোচনা ও সমাধান:
        </h3>

        <div className="space-y-2.5">
          {questions.map((q, idx) => {
            const userChoice = userAnswers[idx];
            const isCorrect = userChoice === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-900">
                      প্রশ্ন {enToBnDigits(idx + 1)}:
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    {isCorrect ? 'সঠিক' : 'ভুল'}
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-medium">{q.question}</p>

                <div className="text-xs space-y-0.5 pt-1 border-t border-slate-100">
                  <p className="text-slate-600">
                    আপনার উত্তর:{' '}
                    <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                      {userChoice !== undefined ? q.options[userChoice] : 'উত্তর দেননি'}
                    </strong>
                  </p>
                  {!isCorrect && (
                    <p className="text-emerald-800 font-semibold">
                      সঠিক উত্তর: {q.correctAnswer}
                    </p>
                  )}
                </div>

                {q.explanation && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 leading-relaxed">
                    <strong>শিক্ষকের ব্যাখ্যা:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
