import React from 'react';
import {
  Sparkles,
  Camera,
  Mic,
  BookOpen,
  PenTool,
  Award,
  Calculator,
  Compass,
  Atom,
  GraduationCap,
} from 'lucide-react';
import { UserProgress } from '../../utils/storage';

interface HomeScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  progress: UserProgress;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-1 pb-6 select-none">
      {/* Tight, Ergonomic Feature Cards Grid (Compact spacing: gap-1.5, Large touch cards, Big text) */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* 1. AI Math Solver */}
        <button
          type="button"
          onClick={() => onNavigate('solver')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
              AI গণিত শিক্ষক
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              লিখে ধাপে ধাপে সমাধান
            </span>
          </div>
        </button>

        {/* 2. Camera Solver */}
        <button
          type="button"
          onClick={() => onNavigate('camera')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <Camera className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors leading-tight">
              ছবি তুলে সমাধান
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              বই বা খাতার ছবি শনাক্ত
            </span>
          </div>
        </button>

        {/* 3. Voice Teacher */}
        <button
          type="button"
          onClick={() => onNavigate('voice')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <Mic className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-tight">
              কথা বলে শিখুন
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              ভয়েসে শিক্ষককে প্রশ্ন
            </span>
          </div>
        </button>

        {/* 4. Math Practice */}
        <button
          type="button"
          onClick={() => onNavigate('practice')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <PenTool className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors leading-tight">
              গণিত প্র্যাকটিস
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              বিষয়ভিত্তিক প্রচুর অংক
            </span>
          </div>
        </button>

        {/* 5. Quiz & Exam */}
        <button
          type="button"
          onClick={() => onNavigate('quiz')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <Award className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors leading-tight">
              কুইজ ও পরীক্ষা
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              টাইমারসহ স্ব-মূল্যায়ন
            </span>
          </div>
        </button>

        {/* 6. Learn Curriculum */}
        <button
          type="button"
          onClick={() => onNavigate('learn')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-tight">
              অধ্যায়ভিত্তিক পড়া
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              ৬ষ্ঠ - ১২শ শ্রেণির পাঠ
            </span>
          </div>
        </button>

        {/* 7. Calculator */}
        <button
          type="button"
          onClick={() => onNavigate('calculator')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <Calculator className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors leading-tight">
              স্মার্ট ক্যালকুলেটর
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              সরাসরি গণনা ও মান
            </span>
          </div>
        </button>

        {/* 8. Formula Library */}
        <button
          type="button"
          onClick={() => onNavigate('formula')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <Compass className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors leading-tight">
              সূত্র লাইব্রেরি
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              সকল সূত্র ও উপপাদ্য
            </span>
          </div>
        </button>

        {/* 9. Physics Solver */}
        <button
          type="button"
          onClick={() => onNavigate('physics')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <Atom className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors leading-tight">
              পদার্থবিজ্ঞান
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              গতিসূত্র ও বলবিদ্যা
            </span>
          </div>
        </button>

        {/* 10. Teacher Mode */}
        <button
          type="button"
          onClick={() => onNavigate('teacher')}
          className="flex flex-col items-start p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-700 shadow-2xs hover:shadow-md transition-all text-left group min-h-[148px] justify-between"
        >
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors leading-tight">
              শিক্ষক কর্নার
            </h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">
              প্রশ্নপত্র ও ওয়ার্কশিট
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
