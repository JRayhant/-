import React from 'react';
import {
  ArrowLeft,
  User,
  Award,
  TrendingUp,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
  History,
  ArrowRight,
} from 'lucide-react';
import { enToBnDigits } from '../../utils/mathEngine';
import { UserProgress } from '../../utils/storage';
import { MathMasteryChart } from '../MathMasteryChart';

interface ProfileScreenProps {
  onBack: () => void;
  progress: UserProgress;
  onSolveQuestion: (q: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  progress,
  onSolveQuestion,
}) => {
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
          <h2 className="text-sm font-bold text-slate-900">ব্যক্তিগত প্রোফাইল ও অগ্রগতি</h2>
          <span className="text-[11px] text-slate-500">লার্নিং অ্যানালিটিক্স ও দক্ষতা বিশ্লেষণ</span>
        </div>

        <div className="w-16"></div>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          গ
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900">গণিত শিক্ষার্থী</h3>
          <p className="text-xs text-slate-500">শ্রেণি: ৯-১০ (SSC ও সাধারণ গণিত)</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold pt-0.5">
            <Flame className="w-3.5 h-3.5 fill-emerald-600" />
            <span>{enToBnDigits(progress.streakDays)} দিনের ধারাবাহিকতা (Streak)</span>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">সমাধানকৃত অংক</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {enToBnDigits(progress.solvedCount)}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">প্র্যাকটিস প্রশ্ন</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {enToBnDigits(progress.practiceCount)}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">কুইজ সম্পন্ন</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {enToBnDigits(progress.quizCount)}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">শেখার সময়</span>
            <Clock className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {enToBnDigits(progress.totalTimeMinutes)} মি.
          </div>
        </div>
      </div>

      {/* Visual Progress Tracker: Recharts Chart for Student Mastery */}
      <MathMasteryChart
        progress={progress}
        onSolveQuestion={onSolveQuestion}
      />

      {/* Weak Topics Analysis & Targeted AI Learning */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            চিহ্নিত দুর্বল বিষয়সমূহ (AI শনাক্তকরণ):
          </h4>
          <span className="text-[10px] text-slate-400">উন্নতি প্রয়োজন</span>
        </div>

        <div className="space-y-2">
          {progress.weakTopics.map((topic, idx) => (
            <div
              key={idx}
              className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between gap-2"
            >
              <div>
                <span className="text-xs font-semibold text-amber-950 block">{topic}</span>
                <span className="text-[10px] text-amber-800">
                  ভুল উত্তর হওয়ার প্রবণতা বেশি • অতিরিক্ত সহায়তা প্রয়োজন
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSolveQuestion(`${topic} সম্পর্কিত একটি সহজ উদাহরণসহ বিস্তারিত ব্যাখ্যা বুঝিয়ে দিন`)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-2xs"
              >
                AI দিয়ে শিখুন
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Solved Problems History */}
      {progress.recentActivities && progress.recentActivities.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-600" />
              সম্প্রতি সমাধানকৃত সমস্যা ও ইতিহাস:
            </h4>
            <span className="text-[10px] text-slate-400">
              সর্বশেষ {enToBnDigits(progress.recentActivities.length)} টি
            </span>
          </div>

          <div className="space-y-2">
            {progress.recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      act.type === 'solve'
                        ? 'bg-emerald-500'
                        : act.type === 'quiz'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleDateString('bn-BD', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSolveQuestion(`পুনরায় ব্যাখ্যা করুন: ${act.title}`)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors shrink-0"
                  title="পুনরায় দেখুন"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
