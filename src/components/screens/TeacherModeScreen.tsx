import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Printer,
  Copy,
  Check,
  FileText,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { enToBnDigits } from '../../utils/mathEngine';

interface TeacherModeScreenProps {
  onBack: () => void;
}

export const TeacherModeScreen: React.FC<TeacherModeScreenProps> = ({ onBack }) => {
  const [classLevel, setClassLevel] = useState('৯ম-১০ম শ্রেণি (SSC)');
  const [topic, setTopic] = useState('বীজগণিতীয় সূত্রাবলি ও উৎপাদক');
  const [itemType, setItemType] = useState('মডেল টেস্ট সৃজনশীল প্রশ্নপত্র');
  const [questionCount, setQuestionCount] = useState(4);
  const [difficulty, setDifficulty] = useState('মাঝারি');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedWorksheet(null);

    try {
      const res = await fetch('/api/teacher/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel,
          topic,
          itemType,
          questionCount,
          difficulty,
        }),
      });

      const data = await res.json();
      setGeneratedWorksheet(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copySheet = () => {
    if (!generatedWorksheet) return;
    const text = JSON.stringify(generatedWorksheet, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printSheet = () => {
    window.print();
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
          <h2 className="text-sm font-bold text-slate-900">শিক্ষক কর্নার (Teacher Mode)</h2>
          <span className="text-[11px] text-slate-500">প্রশ্নপত্র, কুইজ ও উত্তরপত্র প্রস্তুতকারক</span>
        </div>

        <div className="w-16"></div>
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">শ্রেণি:</label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-medium"
            >
              <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
              <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
              <option value="৮ম শ্রেণি (JSC)">৮ম শ্রেণি (JSC)</option>
              <option value="৯ম-১০ম শ্রেণি (SSC)">৯ম-১০ম শ্রেণি (SSC)</option>
              <option value="১১শ-১২শ শ্রেণি (HSC)">১১শ-১২শ শ্রেণি (HSC)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">প্রয়োজনীয় আইটেম:</label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-medium"
            >
              <option value="মডেল টেস্ট সৃজনশীল প্রশ্নপত্র">সৃজনশীল প্রশ্নপত্র</option>
              <option value="ক্লাস টেস্ট ও প্র্যাকটিস শিট">প্র্যাকটিস শিট</option>
              <option value="MCQ কুইজ ও উত্তরমালা">MCQ কুইজ শিট</option>
              <option value="পূর্ণাঙ্গ শিক্ষকীয় সমাধানপত্র (Answer Key)">শিক্ষক সমাধানপত্র</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-700 font-semibold block mb-1">টপিক / অধ্যায়:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-medium font-sans"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">প্রশ্নের সংখ্যা:</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-medium"
            >
              <option value={3}>৩টি প্রশ্ন</option>
              <option value={4}>৪টি প্রশ্ন</option>
              <option value={5}>৫টি প্রশ্ন</option>
              <option value={8}>৮টি প্রশ্ন</option>
            </select>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">মান / কঠিনতা:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-medium"
            >
              <option value="সহজ">সহজ</option>
              <option value="মাঝারি">মাঝারি</option>
              <option value="বোর্ড স্ট্যান্ডার্ড">বোর্ড স্ট্যান্ডার্ড</option>
              <option value="উচ্চতর দক্ষতা">উচ্চতর দক্ষতা</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              AI প্রশ্নপত্র প্রস্তুত করছে...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              প্রশ্নপত্র ও ওয়ার্কশিট তৈরি করুন
            </>
          )}
        </button>
      </div>

      {/* Generated Printable Exam Paper */}
      {generatedWorksheet && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 print:border-none print:shadow-none">
          {/* Action Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              ✓ সফলভাবে প্রস্তুত
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={printSheet}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                প্রিন্ট করুন
              </button>
              <button
                type="button"
                onClick={copySheet}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'কপি হয়েছে' : 'কপি করুন'}
              </button>
            </div>
          </div>

          {/* Academic Header (Standard Bangladesh School Examination format) */}
          <div className="text-center space-y-1 border-b pb-4">
            <h3 className="text-base font-bold text-slate-900">{generatedWorksheet.title || 'গণিত পরীক্ষা'}</h3>
            <p className="text-xs text-slate-600 font-semibold">{generatedWorksheet.schoolOrSubject}</p>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-1 font-mono">
              <span>পূর্ণমান: {enToBnDigits(generatedWorksheet.totalMarks || 20)}</span>
              <span>সময়: {generatedWorksheet.timeAllowed || '২৫ মিনিট'}</span>
            </div>
            {generatedWorksheet.instructions && (
              <p className="text-[11px] text-slate-500 italic pt-1">{generatedWorksheet.instructions}</p>
            )}
          </div>

          {/* Questions Body */}
          <div className="space-y-4">
            {generatedWorksheet.items?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-2 text-xs border-b border-slate-100 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">
                      প্রশ্ন {enToBnDigits(item.number || idx + 1)}:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-sans">{item.question}</p>
                  </div>
                  <span className="font-bold font-mono text-slate-500 shrink-0 text-xs">
                    [{enToBnDigits(item.marks || 5)}]
                  </span>
                </div>

                {/* Teacher Solution Key */}
                {item.stepSolution && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-900 block text-[11px]">
                      শিক্ষক উত্তরমালা ও মার্কিং গাইড:
                    </span>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {item.stepSolution}
                    </p>
                  </div>
                )}

                {item.commonMistake && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg">
                    <strong>শিক্ষার্থীদের সাধারণ ভুল:</strong> {item.commonMistake}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
