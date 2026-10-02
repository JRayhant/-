import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  BarChart3,
  Radar as RadarIcon,
  TrendingUp,
  Award,
  Sparkles,
  Target,
  ArrowRight,
} from 'lucide-react';
import { enToBnDigits } from '../utils/mathEngine';
import { UserProgress } from '../utils/storage';

interface MathMasteryChartProps {
  progress: UserProgress;
  onSolveQuestion?: (q: string) => void;
}

type ChartViewType = 'bar' | 'radar';

export const MathMasteryChart: React.FC<MathMasteryChartProps> = ({
  progress,
  onSolveQuestion,
}) => {
  const [viewType, setViewType] = useState<ChartViewType>('bar');

  // Standardize topics and calculate mastery percentages
  const defaultTopics: Record<string, { total: number; correct: number }> = {
    'বীজগণিত': { total: 15, correct: 11 },
    'জ্যামিতি': { total: 10, correct: 8 },
    'ত্রিকোণমিতি': { total: 12, correct: 8 },
    'পাটিগণিত': { total: 10, correct: 9 },
    'ক্যালকুলাস': { total: 6, correct: 4 },
  };

  const performanceSource =
    progress.topicPerformance && Object.keys(progress.topicPerformance).length > 0
      ? progress.topicPerformance
      : defaultTopics;

  // Process data for charts
  const chartData = Object.entries(performanceSource).map(([topic, stats]) => {
    const total = stats.total || 1;
    const correct = stats.correct || 0;
    const mastery = Math.round((correct / total) * 100);

    let status = 'উন্নতিশীল';
    let color = '#d97706'; // amber

    if (mastery >= 85) {
      status = 'দক্ষ (Master)';
      color = '#059669'; // emerald
    } else if (mastery >= 70) {
      status = 'ভালো (Good)';
      color = '#2563eb'; // blue
    } else if (mastery < 50) {
      status = 'দুর্বল (Needs Practice)';
      color = '#e11d48'; // rose
    }

    return {
      topic,
      mastery,
      total,
      correct,
      color,
      status,
      fullMark: 100,
    };
  });

  // Calculate overall summary metrics
  const totalAttempted = chartData.reduce((acc, curr) => acc + curr.total, 0);
  const totalCorrect = chartData.reduce((acc, curr) => acc + curr.correct, 0);
  const avgMastery =
    chartData.length > 0
      ? Math.round(chartData.reduce((acc, curr) => acc + curr.mastery, 0) / chartData.length)
      : 0;

  // Find strongest & area to improve
  const sortedByMastery = [...chartData].sort((a, b) => b.mastery - a.mastery);
  const strongestTopic = sortedByMastery[0];
  const weakestTopic = sortedByMastery[sortedByMastery.length - 1];

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[170px] z-50">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
            <span className="font-bold text-white text-sm">{data.topic}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
              style={{ backgroundColor: `${data.color}33`, color: data.color }}
            >
              {data.status}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>দক্ষতার স্কোর:</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">
              {enToBnDigits(data.mastery)}%
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>সমাধানকৃত অংক:</span>
            <span className="font-mono">
              {enToBnDigits(data.correct)} / {enToBnDigits(data.total)} টি
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Chart Header & View Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            গণিত দক্ষতার প্রগ্রেস ট্র্যাকার (Mastery Analytics)
          </h4>
          <p className="text-[11px] text-slate-500">
            সমাধানকৃত অংক ও কুইজের তথ্যের ভিত্তিতে বিষয়ভিত্তিক দক্ষতার চার্ট
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setViewType('bar')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
              viewType === 'bar'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="বার চার্ট দেখুন"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>বার চার্ট</span>
          </button>
          <button
            type="button"
            onClick={() => setViewType('radar')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
              viewType === 'radar'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="রাডার চার্ট দেখুন"
          >
            <RadarIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>রাডার চার্ট</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Average Mastery, Top Mastery & Focus Area */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 block font-medium">গড় দক্ষতা</span>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-700 mt-0.5">
            {enToBnDigits(avgMastery)}%
          </div>
          <span className="text-[9px] text-slate-400">
            {enToBnDigits(totalAttempted)} টি অংক থেকে
          </span>
        </div>

        {strongestTopic && (
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-emerald-700 block font-medium flex items-center gap-0.5">
              <Award className="w-3 h-3 text-emerald-600" />
              শীর্ষ দক্ষতা
            </span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
              {strongestTopic.topic}
            </div>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">
              {enToBnDigits(strongestTopic.mastery)}%
            </span>
          </div>
        )}

        {weakestTopic && (
          <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
            <span className="text-[10px] text-rose-700 block font-medium flex items-center gap-0.5">
              <Target className="w-3 h-3 text-rose-600" />
              মনোযোগ প্রয়োজন
            </span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
              {weakestTopic.topic}
            </div>
            <span className="text-[10px] text-rose-600 font-mono font-semibold">
              {enToBnDigits(weakestTopic.mastery)}%
            </span>
          </div>
        )}
      </div>

      {/* Recharts Visual Progress Chart Area */}
      <div className="w-full h-64 bg-slate-50/50 rounded-xl p-2 border border-slate-100 flex items-center justify-center">
        {viewType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis
                dataKey="topic"
                tick={{ fontSize: 11, fill: '#475569' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(val) => `${enToBnDigits(val)}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="mastery"
                radius={[8, 8, 2, 2]}
                maxBarSize={45}
                animationDuration={600}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="topic"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: '#94a3b8' }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="দক্ষতা (%)"
                dataKey="mastery"
                stroke="#059669"
                fill="#10b981"
                fillOpacity={0.45}
                animationDuration={600}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Topic Mastery List & Direct Practice Triggers */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>অধ্যায়ভিত্তিক বিবরণ</span>
          <span>দক্ষতা ও অনুশীলন</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chartData.map((item) => (
            <div
              key={item.topic}
              className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {item.topic}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="font-mono font-medium">
                    {enToBnDigits(item.mastery)}% দক্ষতা
                  </span>
                  <span>•</span>
                  <span>{enToBnDigits(item.correct)}/{enToBnDigits(item.total)} সঠিক</span>
                </div>
              </div>

              {onSolveQuestion && (
                <button
                  type="button"
                  onClick={() =>
                    onSolveQuestion(`${item.topic} সম্পর্কিত গুরুত্বপূর্ণ এবং বোর্ড পরীক্ষার একটি গাণিতিক সমস্যা সমাধান করে দিন`)
                  }
                  className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg flex items-center gap-1 shrink-0 shadow-2xs transition-colors"
                  title={`${item.topic} অনুশীলন শুরু করুন`}
                >
                  <span>অনুশীলন</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
