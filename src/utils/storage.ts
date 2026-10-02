export interface UserProgress {
  solvedCount: number;
  practiceCount: number;
  quizCount: number;
  streakDays: number;
  lastActiveDate: string;
  totalTimeMinutes: number;
  weakTopics: string[];
  topicPerformance: Record<string, { total: number; correct: number }>;
  recentActivities: {
    id: string;
    type: 'solve' | 'quiz' | 'practice';
    title: string;
    timestamp: number;
  }[];
}

export interface AppSettings {
  language: 'bn' | 'en';
  volume: number; // 0 to 1
  voiceGender: 'male' | 'female';
  theme: 'light' | 'dark' | 'normal';
  classLevel?: string;
  speechRate?: number;
}

export const defaultAppSettings: AppSettings = {
  language: 'bn',
  volume: 1,
  voiceGender: 'female',
  theme: 'normal',
  classLevel: '৯ম-১০ম শ্রেণি (SSC)',
  speechRate: 0.95,
};

const SETTINGS_KEY = 'gonite_guru_settings_v1';

export const getAppSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultAppSettings, ...JSON.parse(raw) };
  } catch (e) {}
  return defaultAppSettings;
};

export const saveAppSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
};

const STORAGE_KEY = 'gonite_guru_progress_v1';

export const getStoredProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load progress from storage', e);
  }

  return {
    solvedCount: 14,
    practiceCount: 8,
    quizCount: 5,
    streakDays: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalTimeMinutes: 45,
    weakTopics: ['দ্বিঘাত সমীকরণ নিশ্চায়ক', 'ত্রিকোণমিতিক অভেদাবলি', 'ক্যালকুলাস পাওয়ার রুল'],
    topicPerformance: {
      'পাটিগণিত': { total: 10, correct: 9 },
      'বীজগণিত': { total: 15, correct: 11 },
      'জ্যামিতি': { total: 8, correct: 7 },
      'ত্রিকোণমিতি': { total: 12, correct: 8 },
      'ক্যালকুলাস': { total: 6, correct: 4 },
    },
    recentActivities: [
      { id: '1', type: 'solve', title: '2x² - 5x + 2 = 0 সমাধান', timestamp: Date.now() - 3600000 },
      { id: '2', type: 'quiz', title: 'ত্রিকোণমিতি কুইজ (৪/৫)', timestamp: Date.now() - 7200000 },
      { id: '3', type: 'practice', title: 'বৃত্তের পরিধি ও ক্ষেত্রফল অনুশীলন', timestamp: Date.now() - 86400000 },
    ],
  };
};

export const saveProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to storage', e);
  }
};

export const recordProblemSolved = (title: string, topic?: string) => {
  const current = getStoredProgress();
  current.solvedCount += 1;
  current.recentActivities.unshift({
    id: Date.now().toString(),
    type: 'solve',
    title,
    timestamp: Date.now(),
  });
  if (current.recentActivities.length > 20) {
    current.recentActivities.pop();
  }
  if (topic) {
    if (!current.topicPerformance[topic]) {
      current.topicPerformance[topic] = { total: 0, correct: 0 };
    }
    current.topicPerformance[topic].total += 1;
    current.topicPerformance[topic].correct += 1;
  }
  saveProgress(current);
};

export const recordQuizCompleted = (title: string, total: number, correct: number, topic?: string) => {
  const current = getStoredProgress();
  current.quizCount += 1;
  current.recentActivities.unshift({
    id: Date.now().toString(),
    type: 'quiz',
    title: `${title} (${correct}/${total})`,
    timestamp: Date.now(),
  });
  if (current.recentActivities.length > 20) {
    current.recentActivities.pop();
  }
  if (topic) {
    if (!current.topicPerformance[topic]) {
      current.topicPerformance[topic] = { total: 0, correct: 0 };
    }
    current.topicPerformance[topic].total += total;
    current.topicPerformance[topic].correct += correct;
  }
  saveProgress(current);
};

export const resetUserProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
};

