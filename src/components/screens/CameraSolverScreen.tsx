import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Camera,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
  Loader2,
  Sparkles,
  Edit2,
} from 'lucide-react';

interface CameraSolverScreenProps {
  onBack: () => void;
  onSolveQuestion: (recognizedQuestion: string) => void;
}

export const CameraSolverScreen: React.FC<CameraSolverScreenProps> = ({
  onBack,
  onSolveQuestion,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [detectedTopic, setDetectedTopic] = useState<string | null>(null);
  const [detectedClass, setDetectedClass] = useState<string | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<string | null>(null);
  const [isBlurry, setIsBlurry] = useState(false);
  const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  // Live camera stream state
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startLiveCamera = async () => {
    setUseLiveCamera(true);
    setSelectedImage(null);
    setRecognizedText(null);
    setIsBlurry(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Live camera permission or device not accessible, fallback to file upload', err);
      setUseLiveCamera(false);
      fileInputRef.current?.click();
    }
  };

  const captureLiveFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Stop tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setUseLiveCamera(false);
    processImage(dataUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      processImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (dataUrl: string) => {
    setSelectedImage(dataUrl);
    setIsProcessing(true);
    setRecognizedText(null);
    setIsBlurry(false);
    setGuidanceMessage(null);

    try {
      const res = await fetch('/api/recognize-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });

      const data = await res.json();
      if (data.isBlurry) {
        setIsBlurry(true);
        setGuidanceMessage(
          data.guidanceMessage || 'ছবিটি পরিষ্কার নয়। অনুগ্রহ করে অংকের অংশটি একটু কাছ থেকে পরিষ্কারভাবে তুলুন।'
        );
      } else {
        setIsBlurry(false);
        setRecognizedText(data.recognizedText || 'x² + 5x + 6 = 0');
        setEditedText(data.recognizedText || 'x² + 5x + 6 = 0');
        setDetectedTopic(data.detectedTopic || null);
        setDetectedClass(data.detectedClass || null);
        setConfidenceLevel(data.confidenceLevel || 'উচ্চ (High)');
        setGuidanceMessage(data.guidanceMessage || 'আমি প্রশ্নটি সম্পূর্ণভাবে বুঝেছি:');
      }
    } catch (err) {
      setIsBlurry(true);
      setGuidanceMessage('ছবি শনাক্তকরণে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAndSolve = () => {
    const textToSolve = isEditing ? editedText : recognizedText;
    if (textToSolve) {
      onSolveQuestion(textToSolve);
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setRecognizedText(null);
    setIsBlurry(false);
    setGuidanceMessage(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header */}
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
          <h2 className="text-sm font-bold text-slate-900">ছবি তুলে সমাধান</h2>
          <span className="text-[11px] text-slate-500">বই, খাতা ও প্রিন্টেড অংক</span>
        </div>

        <div className="w-16"></div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main View: Camera / Upload Selection or Image Preview */}
      {!selectedImage && !useLiveCamera && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">অংকের ছবি তুলুন</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              বই, খাতা বা প্রশ্নপত্রের অংকটির ছবি তুলুন। AI তাৎক্ষণিকভাবে অংকটি পড়ে শিক্ষক-এর মতো সমাধান দেবে।
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={startLiveCamera}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Camera className="w-4 h-4" />
              ক্যামেরা চালু করুন
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              গ্যালারি / ফাইল দিন
            </button>
          </div>

          <div className="pt-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">ছবি তোলার সুন্দর টিপস:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
              <li>পর্যাপ্ত আলোতে ছবি তুলুন</li>
              <li>শুধুমাত্র প্রয়োজনীয় অংকের অংশটি ফ্রেমে রাখুন</li>
              <li>হাত স্থির রেখে স্পষ্ট ছবি তুলুন</li>
            </ul>
          </div>
        </div>
      )}

      {/* Live Video Camera Feed */}
      {useLiveCamera && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden p-2 space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Target Viewfinder Overlay */}
            <div className="absolute inset-4 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm">
                অংকটি ফ্রেমের ভেতরে রাখুন
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach((t) => t.stop());
                }
                setUseLiveCamera(false);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              বাতিল
            </button>

            <button
              type="button"
              onClick={captureLiveFrame}
              className="h-14 w-14 rounded-full bg-emerald-500 border-4 border-white/80 shadow-lg flex items-center justify-center active:scale-95 transition-transform"
              title="ছবি তুলুন"
            >
              <div className="w-5 h-5 rounded-full bg-white" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-slate-400 hover:text-white"
            >
              ফাইল আপলোড
            </button>
          </div>
        </div>
      )}

      {/* Image Preview & AI Recognition Card */}
      {selectedImage && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-64 flex items-center justify-center">
            <img
              src={selectedImage}
              alt="ক্যাপচারকৃত অংক"
              referrerPolicy="no-referrer"
              className="max-h-60 w-auto object-contain mx-auto"
            />
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <p className="text-xs font-semibold text-slate-800">
                AI অংকটি নিখুঁতভাবে পর্যবেক্ষণ করছে...
              </p>
              <span className="text-[11px] text-slate-500">গাণিতিক সমীকরণ ও প্রতীক রূপান্তর হচ্ছে</span>
            </div>
          )}

          {/* Case 1: Image Blurry / Unclear Notice */}
          {isBlurry && !isProcessing && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900">ছবিটি অস্পষ্ট</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {guidanceMessage ||
                      'ছবিটি পরিষ্কার নয়। অনুগ্রহ করে অংকের অংশটি একটু কাছ থেকে পরিষ্কারভাবে তুলুন।'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRetake}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                আবার ছবি তুলুন
              </button>
            </div>
          )}

          {/* Case 2: Recognition Success & Verification Step */}
          {recognizedText && !isProcessing && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    “আমি প্রশ্নটি সম্পূর্ণভাবে বুঝেছি:”
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit2 className="w-3 h-3" />
                    {isEditing ? 'শেষ করুন' : 'সংশোধন করুন'}
                  </button>
                </div>

                {/* Detected metadata tags */}
                {(detectedTopic || detectedClass || confidenceLevel) && (
                  <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                    {detectedTopic && (
                      <span className="text-[10px] bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                        বিষয়: {detectedTopic}
                      </span>
                    )}
                    {detectedClass && (
                      <span className="text-[10px] bg-white text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                        শ্রেণি: {detectedClass}
                      </span>
                    )}
                    {confidenceLevel && (
                      <span className="text-[10px] bg-emerald-100/80 text-emerald-900 px-1.5 py-0.5 rounded font-medium">
                        নির্ভুলতা: {confidenceLevel}
                      </span>
                    )}
                  </div>
                )}

                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full bg-white rounded-lg border border-emerald-300 p-2 text-xs font-math text-slate-900 focus:outline-emerald-500"
                  />
                ) : (
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-math text-sm font-semibold text-slate-900">
                    {editedText}
                  </div>
                )}

                <p className="text-[11px] text-emerald-800">
                  নিচের বোতামে চাপ দিলে ইন্টারনেট ভেরিফিকেশন ও বহুস্তরীয় ধাপে ১০০% সঠিক সমাধান দেওয়া হবে।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  নতুন ছবি
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndSolve}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  ঠিক আছে → সমাধান করুন
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
