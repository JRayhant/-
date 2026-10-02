import { getAppSettings } from './storage';

/**
 * Voice and Speech synthesis & recognition utility for "গণিত গুরু AI"
 */

export interface SpeechSettings {
  voiceGender?: 'male' | 'female';
  speed?: 'slow' | 'medium' | 'fast';
  volume?: number; // 0 to 1
  language?: 'bn-BD' | 'en-US';
}

export const defaultSpeechSettings: SpeechSettings = {
  voiceGender: 'female',
  speed: 'medium',
  volume: 1,
  language: 'bn-BD',
};

// Play synthesized speech using Web Speech API
export const speakText = (text: string, settings?: SpeechSettings) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const stored = getAppSettings();
  const activeSettings = {
    ...defaultSpeechSettings,
    volume: stored.volume,
    voiceGender: stored.voiceGender,
    ...(settings || {}),
  };

  // Clean mathematical symbols for clear verbalization in Bangla
  const spokenText = text
    .replace(/\^2|²/g, ' স্কয়ার ')
    .replace(/\^3|³/g, ' কিউব ')
    .replace(/√/g, ' রুট ')
    .replace(/×/g, ' গুণ ')
    .replace(/÷/g, ' ভাগ ')
    .replace(/\+/g, ' যোগ ')
    .replace(/−|-/g, ' বিয়োগ ')
    .replace(/=/g, ' সমান ')
    .replace(/π/g, ' পাই ')
    .replace(/θ/g, ' থিটা ')
    .replace(/∑/g, ' সামেশন ')
    .replace(/∫/g, ' ইন্টিগ্রেশন ')
    .slice(0, 450); // Keep reasonable length

  const utterance = new SpeechSynthesisUtterance(spokenText);

  // Speed rate
  const rates = { slow: 0.8, medium: 1.0, fast: 1.25 };
  utterance.rate = rates[activeSettings.speed || 'medium'] || 1.0;
  utterance.volume = activeSettings.volume ?? 1;

  // Language & Voice (male/female matching)
  const voices = window.speechSynthesis.getVoices();
  const bnVoices = voices.filter((v) => v.lang.includes('bn') || v.lang.includes('BD'));
  
  if (bnVoices.length > 0) {
    if (activeSettings.voiceGender === 'male') {
      const maleVoice = bnVoices.find((v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man'));
      utterance.voice = maleVoice || bnVoices[0];
    } else {
      const femaleVoice = bnVoices.find((v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'));
      utterance.voice = femaleVoice || bnVoices[0];
    }
    utterance.lang = utterance.voice?.lang || 'bn-BD';
  } else {
    // Fallback to hindi or en voice with smooth inflection
    const fallbackVoices = voices.filter((v) => v.lang.includes('hi') || v.lang.includes('en'));
    if (fallbackVoices.length > 0) {
      if (activeSettings.voiceGender === 'male') {
        const maleVoice = fallbackVoices.find((v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy'));
        utterance.voice = maleVoice || fallbackVoices[0];
      } else {
        const femaleVoice = fallbackVoices.find((v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('siri'));
        utterance.voice = femaleVoice || fallbackVoices[0];
      }
    }
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Speech Recognition for student voice input (Bengali / English)
 */
export const startSpeechRecognition = (
  onResult: (transcript: string) => void,
  onError?: (err: any) => void,
  onEnd?: () => void
): { stop: () => void } | null => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError(new Error('ভয়েস ইনপুট এই ব্রাউজারে সমর্থিত নয়। অনুগ্রহ করে লিখে প্রশ্ন করুন।'));
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'bn-BD';

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    recognition.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
      // Fallback: try en-US if bn-BD fails
      if (err.error === 'language-not-supported') {
        recognition.lang = 'en-US';
      }
      if (onError) onError(err);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {}
      },
    };
  } catch (e) {
    if (onError) onError(e);
    return null;
  }
};
