import React, { useState } from 'react';
import {
  X,
  Languages,
  Sun,
  Moon,
  Laptop,
  Check,
  Sparkles,
  Download,
  ShieldCheck,
  BookOpen,
  Volume2,
  Trash2,
  PenTool,
  HelpCircle,
  Lightbulb,
  Camera,
  Mic,
  WifiOff,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import { AppSettings, resetUserProgress } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onInstallApp: () => void;
  isAppInstalled: boolean;
  installPrompt?: any;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onInstallApp,
  isAppInstalled,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'guideline' | 'about'>('settings');
  const [openGuidelineSection, setOpenGuidelineSection] = useState<string>('handwriting');

  if (!isOpen) return null;

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleResetProgress = () => {
    if (confirm('আপনি কি নিশ্চিত যে আপনার সমস্ত প্রগ্রেস ও পয়েন্ট রিসেট করতে চান?')) {
      resetUserProgress();
      alert('প্রগ্রেস রিসেট করা হয়েছে।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-sm text-white shadow-2xs">
              গ
            </div>
            <div>
              <h3 className="text-base font-bold">গণিত গুরু সেটিংস ও গাইড</h3>
              <p className="text-[11px] text-slate-300">
                সকল নির্দেশনা, টিপস ও কাস্টমাইজেশন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all text-center ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            সেটিংস
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guideline')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all text-center ${
              activeTab === 'guideline'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            বাংলা গাইডলাইন
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all text-center ${
              activeTab === 'about'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            অ্যাপ পরিচিতি
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200 flex-1">
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs">
              {/* 1. App Language */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <Languages className="w-4 h-4 text-emerald-600" />
                  <span>অ্যাপ ভাষা (App Language):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => updateSetting('language', 'bn')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      settings.language === 'bn'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {settings.language === 'bn' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSetting('language', 'en')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      settings.language === 'en'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>English</span>
                    {settings.language === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 2. Theme / Mood */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>অ্যাপ মুড / থিম (Theme Mood):</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { id: 'light', label: 'লাইট (Light)', icon: Sun },
                    { id: 'dark', label: 'ডার্ক (Dark)', icon: Moon },
                    { id: 'normal', label: 'স্বাভাবিক', icon: Laptop },
                  ].map((t) => {
                    const IconComp = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateSetting('theme', t.id as any)}
                        className={`py-2 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                          settings.theme === t.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Class Level */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>শ্রেণি নির্বাচন (Default Class):</span>
                </div>
                <select
                  value={settings.classLevel}
                  onChange={(e) => updateSetting('classLevel', e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-emerald-600"
                >
                  <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি (Class 6)</option>
                  <option value="৭ম শ্রেণি">৭ম শ্রেণি (Class 7)</option>
                  <option value="৮ম শ্রেণি">৮ম শ্রেণি (Class 8)</option>
                  <option value="৯ম-১০ম শ্রেণি (SSC)">৯ম-১০ম শ্রেণি (SSC)</option>
                  <option value="একাদশ-দ্বাদশ (HSC)">একাদশ-দ্বাদশ (HSC)</option>
                  <option value="বিশ্ববিদ্যালয় / ইঞ্জিনিয়ারিং ভর্তি">ভর্তি পরীক্ষা (BUET/DU/GST)</option>
                  <option value="গণিত অলিম্পিয়াড">গণিত অলিম্পিয়াড (Math Olympiad)</option>
                </select>
              </div>

              {/* 4. Voice Explanation Settings */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>মৌখিক পাঠ (Voice Explanation):</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={(settings.speechRate ?? 0.95) > 0}
                    onChange={(e) => updateSetting('speechRate', e.target.checked ? 0.95 : 0)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  শিক্ষকসুলভ মিষ্টি কণ্ঠে প্রতিটি ধাপ বুঝিয়ে দেওয়ার গতি ও পিচ
                </p>
              </div>

              {/* 5. Install App (PWA) */}
              <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                    মোবাইলে অ্যাপ ইনস্টল করুন
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    কোনো ব্রাউজার ছাড়াই সরাসরি হোম স্ক্রিন থেকে চালু হবে
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onInstallApp}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAppInstalled ? 'ইনস্টলড' : 'ইনস্টল'}</span>
                </button>
              </div>

              {/* 6. Reset Data */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="w-full py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors border border-rose-200 dark:border-rose-900/50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>অনুশীলন হিস্ট্রি ও প্রগ্রেস রিসেট করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COMPREHENSIVE GUIDELINE (All tutorials & guides consolidated here) */}
          {activeTab === 'guideline' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  বাংলা গাইডলাইন ও ব্যবহারের টিউটোরিয়াল
                </h4>
                <p className="text-emerald-800 dark:text-emerald-400 text-[11px]">
                  অ্যাপের স্ক্রিন পরিষ্কার রাখতে সমস্ত টিউটোরিয়াল, লেখার নিয়ম ও টিপস এখানে সংরক্ষিত।
                </p>
              </div>

              {/* Accordion 1: Handwriting Guidelines & Tutorial */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGuidelineSection(
                      openGuidelineSection === 'handwriting' ? '' : 'handwriting'
                    )
                  }
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-emerald-600" />
                    ১. হস্তাক্ষর ক্যানভাসে অংক লেখার সম্পূর্ণ নিয়ম
                  </span>
                  {openGuidelineSection === 'handwriting' ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openGuidelineSection === 'handwriting' && (
                  <div className="p-3.5 border-t border-slate-100 dark:border-slate-700 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-300">
                      <strong>বড় স্পর্শ ক্যানভাস:</strong> আপনি পুরো স্ক্রিনে বড় করে আঙুল দিয়ে লিখতে পারেন। ক্যানভাসে রুলটানা দাগ বা গ্রাফ চালু করে লেখা সোজা রাখুন।
                    </div>

                    <div className="space-y-2">
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                          • ভগ্নাংশ (Fractions):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300">
                          প্রথমে উপরে লব লিখুন (যেমন: x+1), এরপর মাঝে একটি সোজা অনুভূমিক দাগ (—) টানুন, তারপর নিচে হর লিখুন (যেমন: 2x-3)। তীর্যক দাগ (/) এর চেয়ে অনুভূমিক দাগ AI দ্রুত চেনে।
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                          • ঘাত ও সূচক (Powers & Subscripts):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300">
                          ঘাত বা পাওয়ার মূল অক্ষরের চেয়ে একটু ছোট করে ডানপাশের উপর কোণায় লিখুন (যেমন: x²)। সাবস্ক্রিপ্ট হলে নিচে ডান কোণায় লিখুন (যেমন: a₁)।
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                          • বর্গমূল ও ঘনমূল (Roots):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300">
                          রুটের টিক চিহ্ন দিয়ে পুরো রাশির উপর ছাদ বিস্তৃত রাখুন (√(x²+y²))। ঘনমূল হলে ভি-খাঁজে ছোট করে ৩ লিখুন (∛)।
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                          • গ্রিক ও বিশেষ প্রতীক (π, θ, ∫, ±):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300">
                          থিটা (θ) আঁকতে ডিম্বাকার বৃত্তের পেটের মাঝ দিয়ে অনুভূমিক রেখা দিন। পাই (π) লিখতে উপরে ছাদ ও নিচে দুটি উলম্ব পা দিন। ইন্টিগ্রেশন (∫) লিখতে ওপর থেকে নিচে বাঁকিয়ে লম্বাটে টান দিন।
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Camera Problem Solving */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGuidelineSection(openGuidelineSection === 'camera' ? '' : 'camera')
                  }
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    ২. বই বা খাতার ছবি তুলে সমাধান করার নিয়ম
                  </span>
                  {openGuidelineSection === 'camera' ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openGuidelineSection === 'camera' && (
                  <div className="p-3.5 border-t border-slate-100 dark:border-slate-700 space-y-2 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300">
                    <p>• ক্যামেরায় পর্যাপ্ত আলো রাখুন এবং বই বা খাতাটি সমান্তরালভাবে ফ্রেমের মধ্যে রাখুন।</p>
                    <p>• অপ্রয়োজনীয় অংশ বা অন্য অংক বাদ দিয়ে কেবল সমাধানযোগ্য অংকটির ছবি তুলুন।</p>
                    <p>• ছবির উপর ছায়া বা হাত যাতে না পড়ে তা খেয়াল রাখুন। আমাদের AI অস্পষ্ট বা বাঁকা লেখাও নির্ভুল শনাক্ত করতে সক্ষম।</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Voice Input */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGuidelineSection(openGuidelineSection === 'voice' ? '' : 'voice')
                  }
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-amber-600" />
                    ৩. মুখে বলে (ভয়েস) প্রশ্ন করার নিয়ম
                  </span>
                  {openGuidelineSection === 'voice' ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openGuidelineSection === 'voice' && (
                  <div className="p-3.5 border-t border-slate-100 dark:border-slate-700 space-y-2 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300">
                    <p>• "মুখে বলুন" মাইক্রোফোন আইকনে একবার চাপ দিন।</p>
                    <p>• স্পষ্ট বাংলায় স্বাভাবিক গতিতে অংকটি বলুন। যেমন: "দ্বিঘাত সমীকরণ x স্কয়ার মাইনাস ৫x প্লাস ৬ সমান ০ সমাধান করো" অথবা "একটি ত্রিভুজের ভূমি ১০ মিটার এবং উচ্চতা ৫ মিটার হলে ক্ষেত্রফল কত?"।</p>
                    <p>• কথা শেষ হলে বোতামটি পুনরায় চাপলে বা কথা থামালে স্বয়ংক্রিয়ভাবে অংকটি টেক্সটে রূপান্তরিত হবে।</p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Specific Step Inquiry */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGuidelineSection(openGuidelineSection === 'steps' ? '' : 'steps')
                  }
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    ৪. নির্দিষ্ট ধাপ না বুঝলে বিশদ জেনে নেওয়া
                  </span>
                  {openGuidelineSection === 'steps' ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openGuidelineSection === 'steps' && (
                  <div className="p-3.5 border-t border-slate-100 dark:border-slate-700 space-y-2 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300">
                    <p>• সমাধানের প্রতিটি ধাপের নিচে "এই ধাপের অংশ বুঝিনি?" বোতাম রয়েছে।</p>
                    <p>• সেখানে ক্লিক করে মুখে বলে বা লিখে শিক্ষককে প্রশ্ন করুন (যেমন: "চিহ্নটি কেন পরিবর্তন হলো? বা কোন সূত্র প্রযোজ্য হলো?")।</p>
                    <p>• শিক্ষক আপনাকে ঠিক ওই লাইনটির পেছনের কারণ, পূর্বশর্ত বিষয় এবং ১-লাইনের বাস্তব উদাহরণ দিয়ে বুঝিয়ে দেবেন।</p>
                  </div>
                )}
              </div>

              {/* Accordion 5: Offline Mode */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGuidelineSection(openGuidelineSection === 'offline' ? '' : 'offline')
                  }
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-rose-600" />
                    ৫. সম্পূর্ণ অফলাইন মোড যেভাবে কাজ করে
                  </span>
                  {openGuidelineSection === 'offline' ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openGuidelineSection === 'offline' && (
                  <div className="p-3.5 border-t border-slate-100 dark:border-slate-700 space-y-2 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300">
                    <p>• ইন্টারনেট সংযোগ না থাকলেও অ্যাপ চালু থাকবে এবং সমাধান প্রদান করবে।</p>
                    <p>• দ্বিঘাত সমীকরণ, সরল সমীকরণ, শতকরা, ঐকিক নিয়ম, লাভ-ক্ষতি, বৃত্তের পরিধি ও ক্ষেত্রফল, ত্রিভুজ ও পিথাগোরাস উপপাদ্য এবং ভগ্নাংশের গণনা অ্যাপের স্থানীয় অফলাইন ইঞ্জিন দ্বারা তাৎক্ষণিক সমাধান হয়।</p>
                    <p>• অফলাইন অবস্থাতেও স্পষ্ট বার্তা দেওয়া থাকে: <em>"নেট কানেকশন এ প্রব্লেম আছে তাই উত্তর সম্ভব নয়, তবে অ্যাপের নিজের এআই চলবে।"</em></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT (App Details & Creator Credit) */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-md">
                গ
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  গণিত গুরু AI (Gonite Guru AI)
                </h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  বাংলাদেশের প্রথম ও পূর্ণাঙ্গ AI গণিত শিক্ষক ও লার্নিং প্ল্যাটফর্ম
                </p>
              </div>

              {/* Creator Credit Badge */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center shadow-xs">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  অ্যাপটির পরিকল্পনা ও নির্মাতা:
                </span>
                <span className="text-base font-bold text-emerald-800 dark:text-emerald-300 block">
                  Created by জহির রায়হান
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
                  শিক্ষার্থীদের সহজ ও ভীতিমুক্ত গণিত শিক্ষার প্রত্যয়ে নিবেদিত
                </span>
              </div>

              <div className="text-left space-y-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  এনসিটিবি পাঠ্যক্রম ও বৈশিষ্ট্যসমূহ:
                </h5>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত ৬ষ্ঠ থেকে দ্বাদশ শ্রেণি</li>
                  <li>এসএসসি ও এইচএসসি সাধারণ ও উচ্চতর গণিত এবং পদার্থবিজ্ঞান</li>
                  <li>বুয়েট, রুয়েট, কুয়েট ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার শর্টকাট ও প্রমিত প্রমাণ</li>
                  <li>সম্পূর্ণ স্ক্রিনে বড় হস্তাক্ষর প্যাড ও তাৎক্ষণিক সমীকরণ রূপান্তর</li>
                  <li>নেটওয়ার্ক ছাড়া স্বয়ংক্রিয় অফলাইন সমাধান ব্যবস্থা</li>
                  <li>ধাপে ধাপে শিক্ষণ ও শতভাগ নির্ভুল শুদ্ধি পরীক্ষা (Verification)</li>
                </ul>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed px-2">
                অ্যাপের প্রতিটি ফিচার শিক্ষার্থীদের জন্য সম্পূর্ণ বিজ্ঞাপন ও অযথা ব্যানারমুক্ত রাখা হয়েছে, যাতে পড়াশোনায় পূর্ণ মনোযোগ বজায় থাকে।
              </p>

              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                ভার্সন ২.৬ • অফলাইন ও দ্রুত AI ইঞ্জিন সক্রিয়
              </div>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  );
};
