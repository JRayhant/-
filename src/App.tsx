import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Sparkles,
  PenTool,
  User,
  MoreVertical,
  ArrowLeft,
  Settings,
  WifiOff,
} from 'lucide-react';
import { HomeScreen } from './components/screens/HomeScreen';
import { SolverScreen } from './components/screens/SolverScreen';
import { CameraSolverScreen } from './components/screens/CameraSolverScreen';
import { VoiceTeacherScreen } from './components/screens/VoiceTeacherScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { LearnScreen } from './components/screens/LearnScreen';
import { PracticeScreen } from './components/screens/PracticeScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { CalculatorScreen } from './components/screens/CalculatorScreen';
import { FormulaScreen } from './components/screens/FormulaScreen';
import { PhysicsSolverScreen } from './components/screens/PhysicsSolverScreen';
import { TeacherModeScreen } from './components/screens/TeacherModeScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SettingsModal } from './components/SettingsModal';
import { getStoredProgress, UserProgress, getAppSettings, saveAppSettings, AppSettings } from './utils/storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [screenParams, setScreenParams] = useState<any>({});
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress());
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Normal/System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Sync PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Sync progress periodically
  useEffect(() => {
    setProgress(getStoredProgress());
  }, [currentScreen]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
  };

  const handleInstallApp = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsAppInstalled(true);
        }
        setInstallPrompt(null);
      } catch (err) {}
    } else {
      alert('আপনার ব্রাউজার মেনু থেকে "Add to Home Screen" বা "ইনস্টল করুন" বেছে নিয়ে ইনস্টল করতে পারেন।');
    }
  };

  const navigateTo = (screen: string, params: any = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSolveQuestionDirectly = (question: string) => {
    navigateTo('solver', { initialQuestion: question });
  };

  const handleStartPracticeDirectly = (grade: string, topic: string) => {
    navigateTo('practice', { initialGrade: grade, initialTopic: topic });
  };

  // Screen titles in Bengali for header
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'solver':
        return 'AI গণিত শিক্ষক';
      case 'camera':
        return 'ছবি তুলে সমাধান';
      case 'voice':
        return 'কথা বলে শিখুন';
      case 'chat':
        return 'গণিত চ্যাট টিউটর';
      case 'learn':
        return 'অধ্যায়ভিত্তিক পাঠ';
      case 'practice':
        return 'গণিত প্র্যাকটিস';
      case 'quiz':
        return 'কুইজ ও পরীক্ষা';
      case 'calculator':
        return 'স্মার্ট ক্যালকুলেটর';
      case 'formula':
        return 'সূত্র লাইব্রেরি';
      case 'physics':
        return 'পদার্থবিজ্ঞান সলভার';
      case 'teacher':
        return 'শিক্ষক কর্নার';
      case 'profile':
        return 'আমার প্রোফাইল';
      default:
        return 'গণিত গুরু AI';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Mobile-first centered container with desktop responsiveness */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative shadow-xl border-x border-slate-200 dark:border-slate-800">
        
        {/* Top App Bar: Clear Back button when inside features, 3-dots Settings in corner */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 h-14 flex items-center justify-between">
          {/* Left Zone: Back button (if inside a feature) OR Home Brand */}
          {currentScreen !== 'home' ? (
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ব্যাক</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="h-9 w-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                গ
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                গণিত গুরু AI
              </span>
            </button>
          )}

          {/* Center Zone: Active Screen Title & Offline badge */}
          <div className="text-center flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {currentScreen === 'home' ? '' : getScreenTitle()}
            </span>
            {isOffline && (
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800 flex items-center gap-0.5">
                <WifiOff className="w-3 h-3" />
                অফলাইন
              </span>
            )}
          </div>

          {/* Right Zone: Top corner 3-dots Menu button */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="সেটিংস ও মেনু"
            aria-label="সেটিংস ও মেনু"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Screen Viewport Area */}
        <main className={`flex-1 p-3.5 ${currentScreen === 'home' ? 'pb-20' : 'pb-6'}`}>
          {currentScreen === 'home' && (
            <HomeScreen onNavigate={navigateTo} progress={progress} />
          )}

          {currentScreen === 'solver' && (
            <SolverScreen
              onBack={() => navigateTo('home')}
              initialQuestion={screenParams.initialQuestion}
            />
          )}

          {currentScreen === 'camera' && (
            <CameraSolverScreen
              onBack={() => navigateTo('home')}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'voice' && (
            <VoiceTeacherScreen
              onBack={() => navigateTo('home')}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'chat' && (
            <ChatScreen
              onBack={() => navigateTo('home')}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'learn' && (
            <LearnScreen
              onBack={() => navigateTo('home')}
              onStartPractice={handleStartPracticeDirectly}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'practice' && (
            <PracticeScreen
              onBack={() => navigateTo('home')}
              initialGrade={screenParams.initialGrade}
              initialTopic={screenParams.initialTopic}
            />
          )}

          {currentScreen === 'quiz' && (
            <QuizScreen
              onBack={() => navigateTo('home')}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'calculator' && (
            <CalculatorScreen
              onBack={() => navigateTo('home')}
              onSolveInAI={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'formula' && (
            <FormulaScreen
              onBack={() => navigateTo('home')}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'physics' && (
            <PhysicsSolverScreen
              onBack={() => navigateTo('home')}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}

          {currentScreen === 'teacher' && (
            <TeacherModeScreen onBack={() => navigateTo('home')} />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              onBack={() => navigateTo('home')}
              progress={progress}
              onSolveQuestion={handleSolveQuestionDirectly}
            />
          )}
        </main>

        {/* Bottom Nav: ONLY shown on Home Screen (When entering any feature, ONLY that feature is shown with back button) */}
        {currentScreen === 'home' && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
              {/* 1. Home Tab */}
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="flex flex-col items-center justify-center h-full min-h-[44px] text-emerald-700 dark:text-emerald-400 font-bold"
              >
                <Home className="w-5 h-5" />
                <span className="text-[11px] font-bold mt-1">হোম</span>
              </button>

              {/* 2. AI Solver Tab */}
              <button
                type="button"
                onClick={() => navigateTo('solver')}
                className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-600 dark:text-slate-400 hover:text-emerald-700"
              >
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-semibold mt-1">AI শিক্ষক</span>
              </button>

              {/* 3. Practice Tab */}
              <button
                type="button"
                onClick={() => navigateTo('practice')}
                className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-600 dark:text-slate-400 hover:text-emerald-700"
              >
                <PenTool className="w-5 h-5" />
                <span className="text-[11px] font-semibold mt-1">অনুশীলন</span>
              </button>

              {/* 4. Settings Tab */}
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-600 dark:text-slate-400 hover:text-emerald-700"
              >
                <Settings className="w-5 h-5" />
                <span className="text-[11px] font-semibold mt-1">সেটিংস</span>
              </button>
            </div>
          </nav>
        )}

        {/* Settings Modal (Language, Volume, Voice gender, Mood/Theme, Share, Install PWA, Guidelines, Creator credit) */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          installPrompt={installPrompt}
          onInstallApp={handleInstallApp}
          isAppInstalled={isAppInstalled}
        />
      </div>
    </div>
  );
}
