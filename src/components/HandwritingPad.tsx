import React, { useRef, useState, useEffect } from 'react';
import {
  Eraser,
  RotateCcw,
  Check,
  Sparkles,
  Loader2,
  X,
  Maximize2,
  Minimize2,
  Undo2,
  Grid,
  AlignJustify,
  Square,
  PenTool,
} from 'lucide-react';

interface HandwritingPadProps {
  onRecognized: (text: string) => void;
  onClose: () => void;
}

type GridPattern = 'plain' | 'ruled' | 'grid';

export const HandwritingPad: React.FC<HandwritingPadProps> = ({ onRecognized, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedPreview, setRecognizedPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pen tool configurations
  const [penThickness, setPenThickness] = useState<number>(4);
  const [penColor, setPenColor] = useState<string>('#0f172a');
  const [gridPattern, setGridPattern] = useState<GridPattern>('ruled');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Redraw grid background
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, pattern: GridPattern) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (pattern === 'ruled') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const lineSpacing = 40;
      for (let y = lineSpacing; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (pattern === 'grid') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  };

  // Canvas setup and resizing
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 2;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    drawBackground(ctx, rect.width, rect.height, gridPattern);

    ctx.lineWidth = penThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;

    // Save initial blank state to history
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory([initialData]);
  };

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridPattern, isFullscreen]);

  // Update pen settings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = penThickness;
    ctx.strokeStyle = penColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [penThickness, penColor]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setErrorMessage(null);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setStrokeHistory((prev) => [...prev.slice(-15), currentState]);
    } catch (e) {}
  };

  // Undo single stroke
  const handleUndo = () => {
    if (strokeHistory.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = strokeHistory.slice(0, strokeHistory.length - 1);
    const previousState = newHistory[newHistory.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      setStrokeHistory(newHistory);
      setRecognizedPreview(null);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    drawBackground(ctx, rect.width, rect.height, gridPattern);
    const blankState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory([blankState]);
    setRecognizedPreview(null);
    setErrorMessage(null);
  };

  const handleRecognize = async () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length <= 1) {
      setErrorMessage('অনুগ্রহ করে ক্যানভাসে কিছু অংক বা সমীকরণ লিখুন।');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const res = await fetch('/api/recognize-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });

      const data = await res.json();
      if (data.isBlurry) {
        setErrorMessage(data.guidanceMessage || 'লেখাটি পরিষ্কার হয়নি। অনুগ্রহ করে স্পষ্ট করে লিখুন।');
      } else if (data.recognizedText) {
        setRecognizedPreview(data.recognizedText);
      } else {
        setErrorMessage('কোনো গাণিতিক রাশি শনাক্ত করা যায়নি। আবার লিখুন।');
      }
    } catch (err) {
      // Offline fallback: try to recognize if simple digits or prompt
      setErrorMessage('সার্ভার সংযোগ পাওয়া যায়নি। মেনু থেকে বাংলা গাইডলাইন দেখতে পারেন।');
    } finally {
      setIsLoading(false);
    }
  };

  const appendSymbol = (sym: string) => {
    if (recognizedPreview) {
      setRecognizedPreview(recognizedPreview + sym);
    } else {
      setRecognizedPreview(sym);
    }
  };

  const hasDrawnSomething = strokeHistory.length > 1;

  return (
    <div
      ref={containerRef}
      className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-xl flex flex-col transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-2 z-50 p-4 sm:p-6 overflow-hidden'
          : 'p-3.5 sm:p-5 space-y-3'
      }`}
    >
      {/* Top Header: Title, Fullscreen Toggle, Close */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              হাতে লেখার ক্যানভাস
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full">
                বড় স্পর্শ ক্যানভাস
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              স্ক্রিনে পর্যাপ্ত জায়গা নিয়ে স্বাচ্ছন্দ্যে আঙুল দিয়ে অংক লিখুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Fullscreen Expand/Minimize */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={isFullscreen ? 'স্বাভাবিক আকার' : 'পুরো স্ক্রিনে বড় করুন'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar: Pen thickness, Color, Grid mode, Undo, Clear */}
      <div className="flex items-center justify-between flex-wrap gap-2 py-1 bg-slate-50 dark:bg-slate-900/50 px-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        {/* Pen thickness */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 dark:text-slate-400 font-bold mr-1">কলম:</span>
          {[
            { size: 3, label: 'চিকন' },
            { size: 5, label: 'মাঝারি' },
            { size: 8, label: 'মোটা' },
          ].map((t) => (
            <button
              key={t.size}
              type="button"
              onClick={() => setPenThickness(t.size)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                penThickness === t.size
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-bold mr-1">রং:</span>
          {[
            { color: '#0f172a', title: 'কালো' },
            { color: '#1d4ed8', title: 'নীল' },
            { color: '#047857', title: 'সবুজ' },
          ].map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => setPenColor(c.color)}
              title={c.title}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                penColor === c.color ? 'scale-110 border-emerald-500 shadow-sm' : 'border-white'
              }`}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>

        {/* Paper style */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 dark:text-slate-400 font-bold mr-1">কাগজ:</span>
          <button
            type="button"
            onClick={() => setGridPattern('plain')}
            className={`p-1.5 rounded-lg border ${
              gridPattern === 'plain'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 border-emerald-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
            }`}
            title="সাদা কাগজ"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setGridPattern('ruled')}
            className={`p-1.5 rounded-lg border ${
              gridPattern === 'ruled'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 border-emerald-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
            }`}
            title="রুলটানা লাইন"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setGridPattern('grid')}
            className={`p-1.5 rounded-lg border ${
              gridPattern === 'grid'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 border-emerald-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
            }`}
            title="গ্রাফ ঘর"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Undo & Clear */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokeHistory.length <= 1}
            className="px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:text-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="আগের একটি দাগ মুছুন"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">পূর্বাবস্থা</span>
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:text-rose-600 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="সব মুছে নতুন করে শুরু করুন"
          >
            <Eraser className="w-3.5 h-3.5 text-rose-500" />
            <span>মুছুন</span>
          </button>
        </div>
      </div>

      {/* Spacious High-Resolution Touch Canvas */}
      <div
        className={`relative border-2 border-slate-300 dark:border-slate-600 rounded-2xl overflow-hidden bg-white shadow-inner flex-1 flex flex-col ${
          isFullscreen ? 'min-h-[60vh]' : 'h-80 sm:h-96 md:h-[440px]'
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none bg-white block"
        />

        {!hasDrawnSomething && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-300 dark:text-slate-400 select-none p-4 text-center">
            <span className="text-xl sm:text-2xl font-bold tracking-wide">
              এখানে বড় করে অংক লিখুন...
            </span>
            <span className="text-xs sm:text-sm mt-1.5 text-slate-400 font-medium">
              উদাহরণ: x² - 5x + 6 = 0 বা a/b + c/d বা √16 + sin(30°)
            </span>
          </div>
        )}
      </div>

      {/* Fast Math Helper Symbol Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">চিহ্ন যোগ:</span>
        {['+', '-', '×', '÷', '=', '²', '³', '√', 'π', 'θ', 'x', 'y', '(', ')', '/'].map((sym) => (
          <button
            key={sym}
            type="button"
            onClick={() => appendSymbol(sym)}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-700 rounded-lg font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors shrink-0"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Recognized Preview or Error Message */}
      {recognizedPreview && (
        <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 block font-semibold">
              শনাক্তকৃত সমীকরণ (সম্পাদনাযোগ্য):
            </span>
            <input
              type="text"
              value={recognizedPreview}
              onChange={(e) => setRecognizedPreview(e.target.value)}
              className="w-full font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b border-emerald-300 focus:outline-none focus:border-emerald-600 mt-0.5"
            />
          </div>
          <button
            type="button"
            onClick={() => onRecognized(recognizedPreview)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shrink-0 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>ইনপুট নিন</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm font-semibold text-rose-800 dark:text-rose-200">
          {errorMessage}
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400">
          টিপস দেখতে মেনু থেকে 'বাংলা গাইডলাইন' খুলুন
        </span>

        <button
          type="button"
          onClick={handleRecognize}
          disabled={!hasDrawnSomething || isLoading}
          className="px-6 py-2.5 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI পাঠোদ্ধার করছে...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>AI দিয়ে পাঠোদ্ধার করুন</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
