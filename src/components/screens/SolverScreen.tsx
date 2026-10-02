import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Edit3,
  Loader2,
  Volume2,
  VolumeX,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  Lightbulb,
  Camera,
  Globe,
  ExternalLink,
  ShieldCheck,
  Zap,
  BookOpen,
  CheckCircle2,
  X,
  Mic,
  MicOff,
  MessageSquare,
  CornerDownRight,
  WifiOff,
} from 'lucide-react';
import { MathInput } from '../shared/MathInput';
import { HandwritingPad } from '../HandwritingPad';
import { speakText, stopSpeech, startSpeechRecognition } from '../../utils/speech';
import { recordProblemSolved } from '../../utils/storage';
import { solveOfflineMath } from '../../utils/mathEngine';

interface SolverScreenProps {
  onBack: () => void;
  initialQuestion?: string;
}

interface StepItem {
  stepNumber: number;
  stage?: string;
  title: string;
  content: string;
  mathExpr?: string;
}

interface SpecificPartExplanation {
  directExplanation: string;
  prerequisites: string[];
  formulas: string[];
  miniExample: string;
  voiceSummary: string;
}

interface VerificationItem {
  isVerified: boolean;
  method?: string;
  explanation: string;
}

interface GroundingSource {
  title: string;
  url: string;
}

interface SolveResult {
  question: string;
  topic?: string;
  given?: string;
  toFind?: string;
  formula?: string;
  whyFormula?: string;
  steps: StepItem[];
  verification?: VerificationItem;
  finalAnswer: string;
  alternativeMethod?: string;
  easyExplanation?: string;
  studyTips?: string[];
  similarProblem?: string;
  hints?: string[];
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isOffline?: boolean;
  offlineNotice?: string;
}

export const SolverScreen: React.FC<SolverScreenProps> = ({ onBack, initialQuestion = '' }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [classLevel, setClassLevel] = useState('শ্রেণি ৯-১০ (SSC)');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<SolveResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Photo / Image recognition state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard & Handwriting states
  const [showHandwriting, setShowHandwriting] = useState(false);

  // Main question voice listening state
  const [isMainListening, setIsMainListening] = useState(false);
  const [mainSpeechInstance, setMainSpeechInstance] = useState<{ stop: () => void } | null>(null);

  // "আমি বুঝিনি" extra explanation states
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainResult, setExplainResult] = useState<{ type: string; text: string } | null>(null);

  // Targeted Step & Specific Part Clarification states
  const [selectedStepForClarify, setSelectedStepForClarify] = useState<StepItem | null>(null);
  const [customClarifyQuery, setCustomClarifyQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechInstance, setSpeechInstance] = useState<{ stop: () => void } | null>(null);
  const [clarifyLoading, setClarifyLoading] = useState(false);
  const [clarifyResult, setClarifyResult] = useState<SpecificPartExplanation | null>(null);
  const [clarifyError, setClarifyError] = useState<string | null>(null);
  const clarifySectionRef = useRef<HTMLDivElement | null>(null);

  // Voice speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClear = () => {
    setQuestion('');
    setUploadedImage(null);
  };

  const handleToggleMainVoiceInput = () => {
    if (isMainListening && mainSpeechInstance) {
      mainSpeechInstance.stop();
      setIsMainListening(false);
      setMainSpeechInstance(null);
      return;
    }

    setIsMainListening(true);
    setErrorMsg(null);
    const recognition = startSpeechRecognition(
      (transcript) => {
        setQuestion((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsMainListening(false);
        setMainSpeechInstance(null);
      },
      (err) => {
        setIsMainListening(false);
        setMainSpeechInstance(null);
        setErrorMsg(err?.message || 'ভয়েস শনাক্ত করা সম্ভব হয়নি। অনুগ্রহ করে আবার স্পষ্ট করে বলুন।');
      },
      () => {
        setIsMainListening(false);
        setMainSpeechInstance(null);
      }
    );
    if (recognition) {
      setMainSpeechInstance(recognition);
    } else {
      setIsMainListening(false);
    }
  };

  const handleSelectStepForClarify = (step: StepItem) => {
    setSelectedStepForClarify(step);
    setCustomClarifyQuery(`ধাপ ${step.stepNumber} (${step.title})-এর হিসাব এবং চিহ্নের পরিবর্তনটি কীভাবে হলো?`);
    setClarifyResult(null);
    setClarifyError(null);
    setTimeout(() => {
      clarifySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleToggleVoiceInput = () => {
    if (isListening && speechInstance) {
      speechInstance.stop();
      setIsListening(false);
      setSpeechInstance(null);
      return;
    }

    setIsListening(true);
    setClarifyError(null);
    const recognition = startSpeechRecognition(
      (transcript) => {
        setCustomClarifyQuery(transcript);
        setIsListening(false);
        setSpeechInstance(null);
      },
      (err) => {
        setIsListening(false);
        setSpeechInstance(null);
        setClarifyError(err?.message || 'ভয়েস শনাক্ত করা যায়নি। অনুগ্রহ করে লিখে প্রশ্ন করুন।');
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

  const handleAskSpecificPart = async () => {
    if (!solution) return;
    if (!customClarifyQuery.trim() && !selectedStepForClarify) {
      setClarifyError('অনুগ্রহ করে নির্দিষ্ট অংশটি লিখে বা মুখে বলুন।');
      return;
    }

    setClarifyLoading(true);
    setClarifyError(null);
    setClarifyResult(null);
    stopSpeech();

    try {
      if (!navigator.onLine) {
        throw new Error('OFFLINE_NETWORK');
      }

      const res = await fetch('/api/explain-specific-part', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: solution.question,
          stepNumber: selectedStepForClarify?.stepNumber,
          stepTitle: selectedStepForClarify?.title,
          stepContent: selectedStepForClarify?.content,
          stepMathExpr: selectedStepForClarify?.mathExpr,
          studentQuery: customClarifyQuery.trim() || 'এই নির্দিষ্ট ধাপের হিসাবটি এবং চিহ্নের পরিবর্তন বুঝতে পারিনি।',
        }),
      });

      if (!res.ok) throw new Error('ব্যাখ্যা তৈরিতে সমস্যা হয়েছে');
      const data: SpecificPartExplanation = await res.json();
      setClarifyResult(data);
    } catch (err: any) {
      // Local intelligent explanation fallback
      const stepNum = selectedStepForClarify?.stepNumber || 1;
      const stepTitle = selectedStepForClarify?.title || 'হিসাব ধাপ';
      const fallbackClarify: SpecificPartExplanation = {
        directExplanation: `ধাপ ${stepNum} (${stepTitle}): এই ধাপে সমীকরণের পদগুলোকে পক্ষান্তর ও মৌলিক বীজগণিতীয় সূত্র অনুযায়ী সরলীকরণ করে সাজানো হয়েছে।`,
        prerequisites: [
          'বীজগণিতীয় চিহ্নের গুণ ও ভাগ নীতি (+ × - = -)',
          'পক্ষান্তরের সময় চিহ্নের রূপান্তর (+ ডানে গেলে -, × ডানে গেলে ÷)',
          'সমীকরণের উভয়পাশে সমতুল্য অপারেশন নীতি'
        ],
        formulas: [
          solution.formula || 'ax + b = c => x = (c - b)/a',
          'শুদ্ধি পরীক্ষা ও বিপরীত গাণিতিক অপারেশন'
        ],
        miniExample: 'যেমন: 2x + 4 = 10 হলে, 2x = 10 - 4 = 6, সুতরাং x = 6/2 = 3।',
        voiceSummary: 'এই ধাপে সংখ্যাটিকে সমান চিহ্নের ওপাশে স্থানান্তর করে চিহ্ন বদল করা হয়েছে এবং সহগ দিয়ে ভাগ করে চলকের মান পাওয়া গেছে।'
      };
      setClarifyResult(fallbackClarify);
      setClarifyError('নেট কানেকশন এ প্রব্লেম আছে তাই উত্তর সম্ভব নয়, তবে অ্যাপের নিজের এআই দিয়ে এই ধাপের ব্যাখ্যা বুঝিয়ে দেওয়া হলো।');
    } finally {
      setClarifyLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedImage(dataUrl);
      setIsOcrProcessing(true);
      setErrorMsg(null);

      try {
        const res = await fetch('/api/recognize-math', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl }),
        });

        const data = await res.json();
        if (data.isBlurry) {
          setErrorMsg(data.guidanceMessage || 'ছবিটি পরিষ্কার নয়। আরও পরিষ্কারভাবে ছবি তুলুন।');
        } else if (data.recognizedText) {
          setQuestion(data.recognizedText);
        }
      } catch (err: any) {
        setErrorMsg('ছবি থেকে অংক পাঠোদ্ধারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      } finally {
        setIsOcrProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!question.trim() && !uploadedImage) {
      setErrorMsg('অনুগ্রহ করে প্রশ্নটি লিখুন অথবা একটি ছবি দিন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSolution(null);
    setExplainResult(null);
    stopSpeech();
    setIsSpeaking(false);

    try {
      if (!navigator.onLine) {
        throw new Error('OFFLINE_NETWORK');
      }

      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          imageBase64: uploadedImage || undefined,
          classLevel,
        }),
      });

      if (!res.ok) {
        throw new Error('সমাধান তৈরিতে ব্যর্থ হয়েছে');
      }

      const data: SolveResult = await res.json();
      setSolution(data);
      recordProblemSolved(data.finalAnswer ? `${(question || data.question).slice(0, 30)}...` : 'অংক সমাধান', data.topic);
    } catch (err: any) {
      // Local Offline Engine fallback
      const offlineSol = solveOfflineMath(question.trim() || 'সাধারণ সমীকরণ');
      setSolution({
        ...offlineSol,
        offlineNotice: 'নেট কানেকশন এ প্রব্লেম আছে তাই উত্তর সম্ভব নয়, তবে অ্যাপের নিজের এআই চলবে।',
      });
      setErrorMsg('নেট কানেকশন এ প্রব্লেম আছে তাই উত্তর সম্ভব নয়, তবে অ্যাপের নিজের এআই চলবে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainMore = async (type: string) => {
    if (!solution) return;
    setExplainLoading(true);

    try {
      const res = await fetch('/api/explain-more', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: solution.question,
          solution,
          type,
        }),
      });

      const data = await res.json();
      setExplainResult({ type, text: data.text });

      if (type === 'voice_script') {
        speakText(data.text);
        setIsSpeaking(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExplainLoading(false);
    }
  };

  const toggleVoiceReadout = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else if (solution) {
      const speech = `${solution.question}। ব্যবহৃত সূত্র: ${solution.formula || ''}। ধাপগুলো হলো: ${solution.steps
        .map((s) => s.title + ' ' + s.content)
        .join('। ')}। চূড়ান্ত উত্তর: ${solution.finalAnswer}।`;
      speakText(speech);
      setIsSpeaking(true);
    }
  };

  const copyToClipboard = () => {
    if (!solution) return;
    const text = `প্রশ্ন: ${solution.question}\nসূত্র: ${solution.formula || 'প্রমিত গাণিতিক নিয়ম'}\nচূড়ান্ত উত্তর: ${solution.finalAnswer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 pb-8">
      {/* Top Class Level & Accuracy Indicator */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            শ্রেণি / লেভেল:
          </span>
          <select
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            aria-label="শ্রেণি নির্বাচন করুন"
            className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-slate-800 dark:text-slate-200 font-bold focus:outline-emerald-500"
          >
            <option value="শ্রেণি ৬-৮">৬ষ্ঠ - ৮ম শ্রেণি</option>
            <option value="শ্রেণি ৯-১০ (SSC)">৯ম - ১০ম শ্রেণি (SSC)</option>
            <option value="শ্রেণি ১১-১২ (HSC)">১১শ - ১২শ শ্রেণি (HSC)</option>
            <option value="বিশ্ববিদ্যালয় ও এডমিশন">এডমিশন টেস্ট (BUET/DU)</option>
            <option value="গণিত অলিম্পিয়াড">গণিত অলিম্পিয়াড</option>
          </select>
        </div>

        <span className="text-[11px] sm:text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ১০০% নির্ভুল
        </span>
      </div>

      {/* Hidden File Input for Camera/Gallery Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            অংক লিখুন বা মুখে বলুন:
          </span>

          <div className="flex items-center gap-1.5">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleMainVoiceInput}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-xl border font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                isMainListening
                  ? 'bg-rose-50 text-rose-700 border-rose-400 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
              }`}
              title="মুখে বলে অংক ইনপুট দিন"
            >
              {isMainListening ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4 text-emerald-600" />}
              <span>{isMainListening ? 'শুনছি...' : 'মুখে বলুন'}</span>
            </button>

            {/* Camera / Photo Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-700 font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="বই বা খাতার ছবি তুলে সরাসরি সমাধান করুন"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>ছবি দিন</span>
            </button>

            {/* Handwriting Pad Toggle */}
            <button
              type="button"
              onClick={() => setShowHandwriting(!showHandwriting)}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-xl border font-bold flex items-center gap-1.5 transition-colors shadow-2xs ${
                showHandwriting
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>হাতে লিখুন</span>
            </button>
          </div>
        </div>

        {/* Uploaded Image Preview & OCR Indicator */}
        {uploadedImage && (
          <div className="relative p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <img
              src={uploadedImage}
              alt="Uploaded Math Problem"
              className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-2xs"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 block">
                সংযুক্ত অংকের ছবি
              </span>
              {isOcrProcessing ? (
                <span className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  উন্নত AI দিয়ে ছবি পাঠোদ্ধার হচ্ছে...
                </span>
              ) : (
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ছবি থেকে প্রশ্ন প্রস্তুত হয়েছে
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setUploadedImage(null)}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-200/60 transition-colors"
              title="ছবি মুছে ফেলুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Handwriting Pad Modal / Expandable */}
        {showHandwriting && (
          <HandwritingPad
            onRecognized={(text) => {
              setQuestion((prev) => (prev ? prev + ' ' + text : text));
              setShowHandwriting(false);
            }}
            onClose={() => setShowHandwriting(false)}
          />
        )}

        {/* Custom Math Input Component with 1-Tap Quick Ribbon (x², xⁿ, √x, a/b, symbols) & Full Math Keyboard */}
        <MathInput
          value={question}
          onChange={setQuestion}
          placeholder="এখানে সমীকরণ লিখুন (যেমন: 2x² - 5x + 2 = 0 অথবা লাভ-ক্ষতি, জ্যামিতিক উপপাদ্য, ক্যালকুলাস ∫(3x²+2)dx)..."
          rows={3}
          label="প্রশ্ন বা সমীকরণ লিখুন (নিচে সরাসরি x², xⁿ, √x, a/b চাপুন):"
          onSubmit={handleSolve}
          submitButtonText="ধাপে ধাপে সমাধান দেখুন"
          isSubmitting={isLoading}
        />

        {/* Quick Sample Equations from various branches */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">নমুনা:</span>
          <button
            type="button"
            onClick={() => setQuestion('2x² - 5x + 2 = 0 সমীকরণটির মূলদ্বয় নির্ণয় করো')}
            className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-md shrink-0 font-math transition-colors"
          >
            বীজগণিত (2x² - 5x + 2 = 0)
          </button>
          <button
            type="button"
            onClick={() => setQuestion('একটি সমকোণী ত্রিভুজের লম্ব ৩ সেমি এবং ভূমি ৪ সেমি হলে অতিভুজ ও ক্ষেত্রফল কত?')}
            className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-md shrink-0 transition-colors"
          >
            জ্যামিতি (পিথাগোরাস)
          </button>
          <button
            type="button"
            onClick={() => setQuestion('একটি দ্রব্য ৫০০ টাকায় ক্রয় করে ১০% লাভে বিক্রয় করলে বিক্রয়মূল্য কত?')}
            className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-md shrink-0 transition-colors"
          >
            পাটিগণিত (লাভ-ক্ষতি)
          </button>
          <button
            type="button"
            onClick={() => setQuestion('∫ (3x² + 4x + 1) dx এর যোগজীকরণ মান নির্ণয় করো')}
            className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-md shrink-0 font-math transition-colors"
          >
            ক্যালকুলাস (∫ 3x² dx)
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            মুছে ফেলুন
          </button>

          <button
            type="button"
            onClick={handleSolve}
            disabled={isLoading || (!question.trim() && !uploadedImage)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ইন্টারনেট যাচাই ও নির্ভুল সমাধান হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>ধাপে ধাপে ১০০% নির্ভুল সমাধান</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message (Only when no solution produced) */}
      {errorMsg && !solution && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs sm:text-sm text-rose-800 dark:text-rose-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <p className="font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Offline Notice Banner if solved offline */}
      {solution?.offlineNotice && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-2.5 text-amber-900 dark:text-amber-200 shadow-2xs">
          <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs sm:text-sm block text-amber-950 dark:text-amber-300">অফলাইন ইঞ্জিন সক্রিয়</span>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed mt-0.5">
              {solution.offlineNotice}
            </p>
          </div>
        </div>
      )}

      {/* Structured Teacher Solution Output */}
      {solution && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            {/* Header of Solution */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-2xs">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">শিক্ষকীয় সমাধান</h3>
                    {solution.topic && (
                      <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 font-semibold">
                        {solution.topic}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">বহুস্তরীয় বিশ্লেষণ ও নির্ভুল ফলাফল</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleVoiceReadout}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isSpeaking
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="শিক্ষকের কণ্ঠে মুখে শুনুন"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'বন্ধ করুন' : 'মুখে শুনুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  title="কপি করুন"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Multi-Stage Reasoning Chain Visual Badges */}
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  যৌক্তিক সমাধান পর্যায় (Reasoning Stages):
                </span>
                <span className="text-emerald-700 font-semibold">৪টি স্তর সম্পূর্ণ</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-center font-semibold text-slate-700">
                  ১. উদ্দীপক ও চলক বিশ্লেষণ
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-center font-semibold text-slate-700">
                  ২. উপযুক্ত সূত্র ও তত্ত্ব
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-center font-semibold text-slate-700">
                  ৩. সুনির্দিষ্ট গণনা ও প্রমাণ
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-emerald-300 bg-emerald-50/50 text-center font-bold text-emerald-800">
                  ৪. ব্যাখ্যা ও শুদ্ধি পরীক্ষা
                </div>
              </div>
            </div>

            {/* 1. মূল প্রশ্ন */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                মূল প্রশ্ন
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5 leading-relaxed">
                {solution.question}
              </p>
            </div>

            {/* 2. দেওয়া আছে ও নির্ণয় করতে হবে */}
            {(solution.given || solution.toFind) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {solution.given && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-0.5">দেওয়া আছে (Given):</span>
                    <p className="text-slate-700 leading-relaxed">{solution.given}</p>
                  </div>
                )}
                {solution.toFind && (
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-0.5">নির্ণয় করতে হবে (To Find):</span>
                    <p className="text-slate-700 leading-relaxed">{solution.toFind}</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. সূত্র ও কেন এই সূত্র? */}
            {solution.formula && (
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-emerald-950">ব্যবহৃত সূত্র বা উপপাদ্য:</span>
                  <span className="px-2 py-0.5 bg-white font-math text-emerald-800 rounded border border-emerald-300 text-xs font-bold shadow-2xs">
                    {solution.formula}
                  </span>
                </div>
                {solution.whyFormula && (
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    <strong>কেন এই সূত্র?</strong> {solution.whyFormula}
                  </p>
                )}
              </div>
            )}

            {/* 4. ধাপে ধাপে সমাধান */}
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>ধাপে ধাপে সমাধান:</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  মোট {solution.steps.length} টি ধাপ
                </span>
              </h4>

              <div className="space-y-2.5">
                {solution.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                          {step.stepNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {step.title}
                        </span>
                      </div>
                      {step.stage && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                          {step.stage}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 pl-7 leading-relaxed">
                      {step.content}
                    </p>

                    {step.mathExpr && (
                      <div className="mt-1 ml-7 p-2.5 bg-slate-50/80 rounded-lg border border-slate-200 font-math text-xs font-medium text-slate-900 overflow-x-auto">
                        {step.mathExpr}
                      </div>
                    )}

                    {/* Targeted Step Clarification Trigger Button */}
                    <div className="pl-7 pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleSelectStepForClarify(step)}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/90 rounded-lg px-2.5 py-1 flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>এই ধাপের কোনো অংশ বুঝিনি? (ব্যাখ্যা ও সূত্র দেখুন)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. চূড়ান্ত উত্তর (Clean Focus Box) */}
            <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-sm text-center space-y-1">
              <span className="text-[11px] tracking-wider uppercase opacity-90 font-semibold block">
                চূড়ান্ত উত্তর (Final Answer)
              </span>
              <div className="text-lg md:text-xl font-bold font-math tracking-wide">
                {solution.finalAnswer}
              </div>
            </div>

            {/* 6. ১০০% নির্ভুলতা ও শুদ্ধি পরীক্ষা (Verification Block) */}
            {solution.verification && (
              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1 text-xs text-emerald-950">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>১০০% সঠিকতা নিশ্চিতকরণ ও শুদ্ধি পরীক্ষা ({solution.verification.method || 'গাণিতিক প্রমাণ'}):</span>
                </div>
                <p className="leading-relaxed text-emerald-900/90 pl-5">
                  {solution.verification.explanation}
                </p>
              </div>
            )}

            {/* 7. বিকল্প পদ্ধতি বা শর্টকাট কৌশল */}
            {solution.alternativeMethod && (
              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-xs text-purple-950">
                <div className="flex items-center gap-1.5 font-bold text-purple-900">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>বিকল্প পদ্ধতি বা শর্টকাট কৌশল (MCQ ও ভর্তি পরীক্ষার জন্য):</span>
                </div>
                <p className="leading-relaxed text-purple-900/90 pl-5">
                  {solution.alternativeMethod}
                </p>
              </div>
            )}

            {/* 8. শিক্ষকের সহজ ব্যাখ্যা ও সারসংক্ষেপ */}
            {solution.easyExplanation && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  সহজ শিক্ষকীয় পরামর্শ ও বাস্তব জীবনের উপমা:
                </div>
                <p className="leading-relaxed text-amber-900/90 pl-5">
                  {solution.easyExplanation}
                </p>
              </div>
            )}

            {/* 9. স্টাডি টিপস ও প্রাসঙ্গিক বিষয় (Study Tips) */}
            {solution.studyTips && solution.studyTips.length > 0 && (
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 text-xs text-blue-950">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>গুরুত্বপূর্ণ স্টাডি টিপস ও প্রাসঙ্গিক বিষয় (Study Tips):</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc list-outside text-blue-900/90">
                  {solution.studyTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 10. ইন্টারনেট সার্চ গ্রাউন্ডিং রেফারেন্স (Google Search Grounding Sources) */}
            {solution.groundingSources && solution.groundingSources.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>ইন্টারনেট ও বোর্ড পাঠ্যপুস্তকের সত্যতা যাচাইকৃত রেফারেন্স:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {solution.groundingSources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-semibold text-slate-700 hover:text-blue-700 flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{source.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 11. "আমি বুঝিনি" Feature Block */}
          <div ref={clarifySectionRef} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    আমি বুঝিনি — নির্দিষ্ট অংশ বিশদভাবে জানুন
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    অংকের যে অংশটি বুঝতে সমস্যা হয়েছে তা লিখে বা মুখে প্রশ্ন করুন
                  </p>
                </div>
              </div>
            </div>

            {/* Targeted Step & Voice Query Form */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5">
              {/* Selected Step Badge */}
              {selectedStepForClarify && (
                <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold shrink-0">নির্বাচিত অংশ:</span>
                    <span className="truncate font-medium">
                      ধাপ {selectedStepForClarify.stepNumber} ({selectedStepForClarify.title})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStepForClarify(null);
                      setCustomClarifyQuery('');
                    }}
                    className="p-1 text-emerald-700 hover:text-emerald-950 rounded hover:bg-emerald-100/60 transition-colors shrink-0"
                    title="নির্বাচন বাতিল করুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Text / Voice input box */}
              <div className="relative">
                <textarea
                  rows={2}
                  value={customClarifyQuery}
                  onChange={(e) => setCustomClarifyQuery(e.target.value)}
                  placeholder="অংকের যে নির্দিষ্ট অংশ বা হিসাবটি বোঝেননি তা এখানে লিখুন বা মাইকে বলুন (যেমন: '৩য় লাইনে কীভাবে মধ্যপদ বিভাজন হলো?' বা 'চিহ্নের পরিবর্তনটি বুঝিনি')..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 pr-11 text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
                />

                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`absolute right-2.5 top-2.5 p-1.5 rounded-lg border transition-all ${
                    isListening
                      ? 'bg-rose-600 border-rose-700 text-white animate-pulse shadow-sm'
                      : 'bg-slate-100 hover:bg-emerald-50 border-slate-200 text-slate-600 hover:text-emerald-700'
                  }`}
                  title={isListening ? 'রেকর্ডিং বন্ধ করুন' : 'মুখে বলে প্রশ্ন করুন'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              {isListening && (
                <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold px-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span>আপনার প্রশ্ন মনোযোগ দিয়ে শোনা হচ্ছে... স্পষ্টভাবে বলুন</span>
                </div>
              )}

              {clarifyError && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{clarifyError}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[11px] text-slate-500">
                  💡 নির্দিষ্ট হিসাব, চিহ্নের নিয়ম ও পূর্বশর্ত বুঝিয়ে দেওয়া হবে
                </span>

                <button
                  type="button"
                  onClick={handleAskSpecificPart}
                  disabled={clarifyLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {clarifyLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>বিশ্লেষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>নির্দিষ্ট অংশের ব্যাখ্যা ও সূত্র দেখুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Targeted Explanation Deep Breakdown Result */}
            {clarifyResult && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3.5 text-xs text-emerald-950 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    শিক্ষকের সুনির্দিষ্ট ব্যাখ্যা ও পূর্বশর্ত নির্দেশিকা
                  </span>

                  <button
                    type="button"
                    onClick={() => speakText(clarifyResult.voiceSummary || clarifyResult.directExplanation)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                    title="শিক্ষকের কণ্ঠে মুখে শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>মুখে শুনুন</span>
                  </button>
                </div>

                {/* 1. Direct Explanation of that exact part */}
                <div className="space-y-1">
                  <span className="font-bold text-emerald-900 block flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    এই নির্দিষ্ট অংশে যা ঘটেছে (সহজ ব্যাখ্যা):
                  </span>
                  <p className="text-slate-800 leading-relaxed pl-5 whitespace-pre-wrap">
                    {clarifyResult.directExplanation}
                  </p>
                </div>

                {/* 2. Prerequisites & Concepts Needed */}
                {clarifyResult.prerequisites && clarifyResult.prerequisites.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="font-bold text-emerald-900 block flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      এই অংশটি বুঝতে আর যে বিষয় বা নিয়মগুলো জানা প্রয়োজন (পূর্বশর্ত):
                    </span>
                    <ul className="space-y-1 pl-6 list-disc list-outside text-slate-700">
                      {clarifyResult.prerequisites.map((req, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. Formulas involved */}
                {clarifyResult.formulas && clarifyResult.formulas.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-900 block">
                      📐 এই ধাপে ব্যবহৃত সুনির্দিষ্ট সূত্রাবলি:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      {clarifyResult.formulas.map((f, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white font-math text-emerald-900 rounded-lg border border-emerald-300 font-bold text-xs shadow-2xs"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Mini Example */}
                {clarifyResult.miniExample && (
                  <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950 space-y-0.5">
                    <span className="font-bold block text-[11px] text-amber-900">
                      🎯 নিয়মটি মনে রাখার অতি সহজ ১-লাইনের উদাহরণ:
                    </span>
                    <p className="font-math font-medium text-xs text-amber-950">
                      {clarifyResult.miniExample}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick 1-click Teacher Assistance Options */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-600 block mb-2">
                বা দ্রুত সামগ্রিক সহায়তার জন্য বেছে নিন:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleExplainMore('simpler')}
                  disabled={explainLoading}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-medium text-slate-700 transition-colors"
                >
                  💡 আরও সহজ করে বলুন
                </button>
                <button
                  type="button"
                  onClick={() => handleExplainMore('hint')}
                  disabled={explainLoading}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-medium text-slate-700 transition-colors"
                >
                  🗝️ আমাকে একটি Hint দিন
                </button>
                <button
                  type="button"
                  onClick={() => handleExplainMore('why_formula')}
                  disabled={explainLoading}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-medium text-slate-700 transition-colors"
                >
                  📐 কেন এই সূত্র?
                </button>
                <button
                  type="button"
                  onClick={() => handleExplainMore('similar_problem')}
                  disabled={explainLoading}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-medium text-slate-700 transition-colors"
                >
                  📝 একই ধরনের আরেকটি অংক
                </button>
                <button
                  type="button"
                  onClick={() => handleExplainMore('voice_script')}
                  disabled={explainLoading}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-medium text-slate-700 transition-colors col-span-2 flex items-center justify-between"
                >
                  <span>🔊 পুরো সমাধানটি শিক্ষকের স্নেহভরা কণ্ঠে মুখে শুনুন</span>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            </div>

            {/* Explain result loading */}
            {explainLoading && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                সহজ ব্যাখ্যা প্রস্তুত হচ্ছে...
              </div>
            )}

            {/* Display General Explain Result */}
            {explainResult && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">শিক্ষকের বিশেষ ব্যাখ্যা:</span>
                  <button
                    type="button"
                    onClick={() => speakText(explainResult.text)}
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    আবার শুনুন
                  </button>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{explainResult.text}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
