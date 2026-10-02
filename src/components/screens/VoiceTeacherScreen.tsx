import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings2,
  Sparkles,
  Loader2,
  Send,
  HelpCircle,
} from 'lucide-react';
import { speakText, stopSpeech, SpeechSettings, defaultSpeechSettings } from '../../utils/speech';
import { solveOfflineMath } from '../../utils/mathEngine';

interface VoiceTeacherScreenProps {
  onBack: () => void;
  onSolveQuestion: (q: string) => void;
}

export const VoiceTeacherScreen: React.FC<VoiceTeacherScreenProps> = ({ onBack, onSolveQuestion }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [teacherResponse, setTeacherResponse] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState<SpeechSettings>(defaultSpeechSettings);

  const recognitionRef = useRef<any>(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = settings.language;

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopSpeech();
    };
  }, [settings.language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeech();
      setIsSpeaking(false);
      setTranscript('');
      setTeacherResponse(null);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.warn('Could not start speech recognition', e);
        }
      } else {
        alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সক্রিয় নয়। আপনি নিচে প্রশ্নটি টাইপ করতে পারেন।');
      }
    }
  };

  const handleSendVoiceQuery = async (queryText?: string) => {
    const textToSend = queryText || transcript;
    if (!textToSend.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setIsProcessing(true);
    setTeacherResponse(null);
    stopSpeech();
    setIsSpeaking(false);

    try {
      if (!navigator.onLine) {
        throw new Error('OFFLINE_NETWORK');
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: textToSend }],
          currentClass: '৯-১০',
        }),
      });

      const data = await res.json();
      const reply = data.text || 'আপনার প্রশ্নটির সমাধান নিচে দেওয়া হলো।';
      setTeacherResponse(reply);

      // Speak answer automatically
      speakText(reply, settings);
      setIsSpeaking(true);
    } catch (err) {
      const offlineSol = solveOfflineMath(textToSend);
      const reply = `নেট কানেকশন এ প্রব্লেম আছে তাই উত্তর সম্ভব নয়, তবে অ্যাপের নিজের এআই দিয়ে সমাধান দেওয়া হলো: ${offlineSol.given}। সূত্র: ${offlineSol.formula || 'প্রমিত গাণিতিক নিয়ম'}। ফলাফল: ${offlineSol.finalAnswer}। ${offlineSol.easyExplanation}`;
      setTeacherResponse(reply);
      speakText(reply, settings);
      setIsSpeaking(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayAudio = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else if (teacherResponse) {
      speakText(teacherResponse, settings);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            stopSpeech();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          পিছনে
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">কথা বলে শিখুন</h2>
          <span className="text-[11px] text-slate-500">ভয়েস AI গণিত শিক্ষক</span>
        </div>

        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
            showSettings ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="ভয়েস সেটিংস"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Voice Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <h4 className="font-semibold text-slate-900">ভয়েস ও উচ্চারণ সেটিংস</h4>

          <div className="grid grid-cols-2 gap-3">
            {/* Voice Gender */}
            <div>
              <label className="text-slate-500 font-medium block mb-1">কণ্ঠের ধরন:</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, voiceGender: 'female' })}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    settings.voiceGender === 'female'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  মহিলা কণ্ঠ
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, voiceGender: 'male' })}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    settings.voiceGender === 'male'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  পুরুষ কণ্ঠ
                </button>
              </div>
            </div>

            {/* Speed Rate */}
            <div>
              <label className="text-slate-500 font-medium block mb-1">গতি:</label>
              <div className="flex gap-1">
                {(['slow', 'medium', 'fast'] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSettings({ ...settings, speed: spd })}
                    className={`flex-1 py-1.5 rounded-lg border text-[11px] font-medium capitalize ${
                      settings.speed === spd
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {spd === 'slow' ? 'ধীর' : spd === 'medium' ? 'স্বাভাবিক' : 'দ্রুত'}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="text-slate-500 font-medium block mb-1">ভাষা:</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
              >
                <option value="bn-BD">বাংলা (বাংলাদেশ)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>

            {/* Volume */}
            <div>
              <label className="text-slate-500 font-medium block mb-1">
                ভলিউম: {Math.round((settings.volume ?? 1) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume ?? 1}
                onChange={(e) => setSettings({ ...settings, volume: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Microphone Interaction Stage */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            {isListening ? 'শুনছি... আপনার প্রশ্নটি বলুন' : 'মাইক্রোফোন চেপে প্রশ্ন করুন'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            যেমন: “ভগ্নাংশের যোগ কীভাবে করতে হয়?” অথবা “দ্বিঘাত সমীকরণের মূল কী?”
          </p>
        </div>

        {/* Big Mic Button with Pulsing Wave */}
        <div className="relative flex items-center justify-center py-4">
          {isListening && (
            <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping" />
          )}

          <button
            type="button"
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
              isListening
                ? 'bg-rose-600 text-white scale-110 shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-emerald-600/20'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Live Speech Transcript / Input Box */}
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left min-h-[50px] text-xs text-slate-800 font-sans">
            {transcript ? (
              <p className="font-medium text-slate-900">{transcript}</p>
            ) : (
              <span className="text-slate-400 italic">
                {isListening ? 'কথা বলুন...' : 'কথা বললে এখানে লেখা প্রদর্শিত হবে...'}
              </span>
            )}
          </div>

          {transcript && !isProcessing && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTranscript('')}
                className="py-2 px-3 text-xs text-slate-500 hover:text-slate-800"
              >
                মুছে ফেলুন
              </button>

              <button
                type="button"
                onClick={() => handleSendVoiceQuery()}
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                শিক্ষকের উত্তর শুনুন
              </button>
            </div>
          )}
        </div>

        {/* Sample Voice Prompts */}
        <div className="pt-2 text-left">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
            মুখে জিজ্ঞাসা করতে পারেন:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'লগারিদম কী এবং কেন ব্যবহার করা হয়?',
              'একটি সমদ্বিবাহু ত্রিভুজের ক্ষেত্রফলের সূত্র কী?',
              'গতি ও বেগের মধ্যে পার্থক্য কী?',
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTranscript(q);
                  handleSendVoiceQuery(q);
                }}
                className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-left"
              >
                “{q}”
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isProcessing && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-800">
            শিক্ষক আপনার প্রশ্নের ব্যাখ্যা তৈরি করছেন...
          </p>
        </div>
      )}

      {/* Teacher Voice Answer Output */}
      {teacherResponse && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">শিক্ষকের মৌখিক উত্তর</h4>
            </div>

            <button
              type="button"
              onClick={togglePlayAudio}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSpeaking
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isSpeaking ? 'থামান' : 'আবার শুনুন'}
            </button>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            {teacherResponse}
          </div>

          <div className="pt-1 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onSolveQuestion(transcript || teacherResponse.slice(0, 50))}
              className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              সম্পূর্ণ গাণিতিক সমাধানে দেখুন →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
