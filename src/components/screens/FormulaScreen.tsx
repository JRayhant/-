import React, { useState } from 'react';
import {
  ArrowLeft,
  Compass,
  Search,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { FORMULA_LIBRARY, FormulaDetail } from '../../data/curriculumData';

interface FormulaScreenProps {
  onBack: () => void;
  onSolveQuestion: (q: string) => void;
}

export const FormulaScreen: React.FC<FormulaScreenProps> = ({ onBack, onSolveQuestion }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('f-quad');

  const categories = [
    'সব',
    'বীজগণিত',
    'জ্যামিতি',
    'পরিমিতি',
    'ত্রিকোণমিতি',
    'ক্যালকুলাস',
    'পাটিগণিত',
    'পদার্থবিজ্ঞান',
  ];

  const filteredFormulas = FORMULA_LIBRARY.filter((f) => {
    const matchesCat = selectedCategory === 'সব' || f.category === selectedCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
          <h2 className="text-sm font-bold text-slate-900">গাণিতিক সূত্র লাইব্রেরি</h2>
          <span className="text-[11px] text-slate-500">প্রতীক অর্থ, সঠিক প্রয়োগ ও সতর্কতা</span>
        </div>

        <div className="w-16"></div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="সূত্র বা অধ্যায়ের নাম দিয়ে খুঁজুন (যেমন: দ্বিঘাত, পিথাগোরাস)..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-emerald-500 shadow-2xs font-sans"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[34px] ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Formulas List */}
      <div className="space-y-3">
        {filteredFormulas.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Collapsed / Primary Bar */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <div className="font-math font-bold text-sm text-slate-900 pt-0.5">
                    {item.formula}
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-700 ml-2 shrink-0">
                  {isExpanded ? 'সংক্ষেপ' : 'বিস্তারিত ▼'}
                </span>
              </button>

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 text-xs bg-slate-50/30">
                  {/* Symbols Meaning */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">প্রতীকসমূহের অর্থ:</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {item.symbolMeaning.map((sym, sIdx) => (
                        <li key={sIdx}>{sym}</li>
                      ))}
                    </ul>
                  </div>

                  {/* When to use */}
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-0.5">কখন ব্যবহার করবেন?</span>
                    <p className="text-blue-900/90 leading-relaxed">{item.whenToUse}</p>
                  </div>

                  {/* Example with Solution */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">বাস্তব উদাহরণ:</span>
                    <p className="text-slate-700 font-medium">প্রশ্ন: {item.example.question}</p>
                    <p className="text-slate-600 font-sans">সমাধান: {item.example.solution}</p>
                    <div className="pt-1 text-emerald-700 font-bold font-math">
                      উত্তর: {item.example.answer}
                    </div>
                  </div>

                  {/* Common Mistake Alert */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">সাধারণ ভুল (সতর্কতা):</span>
                      <p className="mt-0.5 leading-relaxed">{item.commonMistake}</p>
                    </div>
                  </div>

                  {/* Practice Problem */}
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-emerald-950 block">নিজে চেষ্টা করুন:</span>
                      <p className="text-emerald-900">{item.practiceProblem}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSolveQuestion(item.practiceProblem)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0"
                    >
                      AI সমাধান
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
