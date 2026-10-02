import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { CLASS_GRADES, ClassGrade, TopicItem, FORMULA_LIBRARY } from '../../data/curriculumData';

interface LearnScreenProps {
  onBack: () => void;
  onStartPractice: (grade: string, topic: string) => void;
  onSolveQuestion: (q: string) => void;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  onBack,
  onStartPractice,
  onSolveQuestion,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<ClassGrade | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);

  // Handle navigation hierarchy
  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedGrade) {
      setSelectedGrade(null);
    } else {
      onBack();
    }
  };

  // 1. TOPIC LESSON VIEW (Step 3: Deepest Focused View)
  if (selectedGrade && selectedTopic) {
    // Find matching formula details if available
    const relatedFormulas = FORMULA_LIBRARY.filter(
      (f) =>
        f.category.includes(selectedTopic.name) ||
        selectedTopic.name.includes(f.category) ||
        selectedTopic.id.includes(f.category)
    );

    return (
      <div className="space-y-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            টপিক তালিকা
          </button>

          <div className="text-center">
            <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">
              {selectedGrade.title}
            </span>
            <h2 className="text-sm font-bold text-slate-900">{selectedTopic.name}</h2>
          </div>

          <button
            type="button"
            onClick={() => onStartPractice(selectedGrade.grade, selectedTopic.name)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            অনুশীলন
          </button>
        </div>

        {/* Lesson Overview Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{selectedTopic.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedTopic.enName}</p>
            <p className="text-xs text-slate-700 leading-relaxed mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedTopic.description}
            </p>
          </div>

          {/* Key Principles / How to Master */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              এই অধ্যায়টি শেখার সহজ কৌশল:
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
              <li>প্রথমে মৌলিক সংজ্ঞা ও গাণিতিক চিহ্নগুলো ভালোভাবে আয়ত্ত করুন।</li>
              <li>পাঠ্যবইয়ের প্রতিটি সূত্রের প্রমাণ ও প্রতিপাদন নিজে খাতায় লিখুন।</li>
              <li>সমস্যা সমাধানের সময় প্রথমে কি দেওয়া আছে এবং কি বের করতে হবে তা চিহ্নিত করুন।</li>
            </ul>
          </div>

          {/* Quick Action Trigger */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStartPractice(selectedGrade.grade, selectedTopic.name)}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold text-center transition-colors shadow-2xs"
            >
              এই অধ্যায়ের প্র্যাকটিস শুরু করুন
            </button>
            <button
              type="button"
              onClick={() =>
                onSolveQuestion(
                  `${selectedGrade.title}-এর ${selectedTopic.name} অধ্যায়ের একটি গুরুত্বপূর্ণ সৃজনশীল অংক সমাধান করে বুঝিয়ে দিন`
                )
              }
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors shadow-2xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI দিয়ে বুঝুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. TOPIC SELECTION VIEW (Step 2: Grade chosen, now choose Topic)
  if (selectedGrade) {
    return (
      <div className="space-y-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            শ্রেণি নির্বাচন
          </button>

          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-900">{selectedGrade.title}</h2>
            <span className="text-[11px] text-slate-500">{selectedGrade.subtitle}</span>
          </div>

          <div className="w-16"></div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 px-1 uppercase tracking-wider">
            অধ্যায় ও বিষয় নির্বাচন করুন:
          </h3>

          <div className="space-y-2">
            {selectedGrade.topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTopic(t)}
                className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-2xs hover:bg-slate-50/50 transition-all text-left group"
              >
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-sans line-clamp-1">
                    {t.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. GRADE SELECTION VIEW (Step 1: Choose Class 6 to 12)
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
          <h2 className="text-sm font-bold text-slate-900">গণিত পাঠক্রম</h2>
          <span className="text-[11px] text-slate-500">আপনার শ্রেণি নির্বাচন করুন</span>
        </div>

        <div className="w-16"></div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 px-1 uppercase tracking-wider">
          শ্রেণি নির্বাচন করুন (Class 6 - 12):
        </h3>

        <div className="space-y-2.5">
          {CLASS_GRADES.map((grade) => (
            <button
              key={grade.grade}
              type="button"
              onClick={() => setSelectedGrade(grade)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-sm transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs group-hover:bg-emerald-600 transition-colors">
                  {grade.grade.replace('Class ', '')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {grade.title}
                  </h4>
                  <p className="text-xs text-slate-500">{grade.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
