import React, { useState } from 'react';
import {
  ArrowLeft,
  Calculator as CalcIcon,
  Equal,
  Delete,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  evaluateArithmetic,
  solveQuadratic,
  solveSimultaneous2,
  matrixDeterminant2x2,
  matrixDeterminant3x3,
  calculateStats,
  convertUnits,
  enToBnDigits,
} from '../../utils/mathEngine';

interface CalculatorScreenProps {
  onBack: () => void;
  onSolveInAI?: (expr: string) => void;
}

type CalcMode = 'basic' | 'scientific' | 'algebra' | 'matrix' | 'statistics' | 'units';

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ onBack, onSolveInAI }) => {
  const [mode, setMode] = useState<CalcMode>('basic');

  // Basic & Scientific display
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);

  // Algebra State: Quadratic
  const [qa, setQa] = useState('1');
  const [qb, setQb] = useState('-5');
  const [qc, setQc] = useState('6');
  const [quadResult, setQuadResult] = useState<any>(null);

  // Algebra State: Simultaneous
  const [simA1, setSimA1] = useState('1');
  const [simB1, setSimB1] = useState('1');
  const [simC1, setSimC1] = useState('10');
  const [simA2, setSimA2] = useState('2');
  const [simB2, setSimB2] = useState('-1');
  const [simC2, setSimC2] = useState('5');
  const [simResult, setSimResult] = useState<any>(null);

  // Matrix State (2x2 and 3x3)
  const [matrixDim, setMatrixDim] = useState<'2x2' | '3x3'>('2x2');
  const [m2, setM2] = useState<number[][]>([
    [3, 2],
    [1, 4],
  ]);
  const [m3, setM3] = useState<number[][]>([
    [1, 2, 3],
    [0, 1, 4],
    [5, 6, 0],
  ]);
  const [matResult, setMatResult] = useState<number | null>(null);

  // Statistics State
  const [statInput, setStatInput] = useState('12, 15, 20, 24, 30, 35, 40');
  const [statResult, setStatResult] = useState<any>(null);

  // Unit Converter State
  const [unitCategory, setUnitCategory] = useState<'length' | 'mass' | 'temperature'>('length');
  const [unitVal, setUnitVal] = useState('10');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [convertedVal, setConvertedVal] = useState<number | null>(1000);

  // Basic & Scientific Handlers
  const handlePress = (val: string) => {
    setDisplay((prev) => {
      if (prev === '0' && val !== '.') return val;
      return prev + val;
    });
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    setDisplay((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleCalculate = () => {
    const res = evaluateArithmetic(display);
    if (res.success && res.result !== undefined) {
      setHistory((prev) => [`${display} = ${res.result}`, ...prev.slice(0, 4)]);
      setDisplay(String(Number(res.result.toFixed(6))));
    } else {
      setDisplay('Error');
    }
  };

  // Quadratic handler
  const handleSolveQuad = () => {
    const a = parseFloat(qa);
    const b = parseFloat(qb);
    const c = parseFloat(qc);
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      alert('সঠিক সংখ্যা দিন (a এর মান ০ হতে পারবে না)');
      return;
    }
    const res = solveQuadratic(a, b, c);
    setQuadResult(res);
  };

  // Simultaneous handler
  const handleSolveSim = () => {
    const a1 = parseFloat(simA1);
    const b1 = parseFloat(simB1);
    const c1 = parseFloat(simC1);
    const a2 = parseFloat(simA2);
    const b2 = parseFloat(simB2);
    const c2 = parseFloat(simC2);
    const res = solveSimultaneous2(a1, b1, c1, a2, b2, c2);
    setSimResult(res);
  };

  // Matrix Determinant handler
  const handleMatrixDet = () => {
    if (matrixDim === '2x2') {
      setMatResult(matrixDeterminant2x2(m2));
    } else {
      setMatResult(matrixDeterminant3x3(m3));
    }
  };

  // Statistics handler
  const handleCalcStats = () => {
    const nums = statInput
      .split(/[,;\s]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    if (nums.length === 0) return;
    setStatResult(calculateStats(nums));
  };

  // Units conversion handler
  const handleConvert = () => {
    const v = parseFloat(unitVal);
    if (isNaN(v)) return;
    setConvertedVal(convertUnits(v, unitCategory, fromUnit, toUnit));
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
          <h2 className="text-sm font-bold text-slate-900">ক্যালকুলেটর</h2>
          <span className="text-[11px] text-slate-500">নির্দিষ্ট মোড নির্বাচন করে হিসাব করুন</span>
        </div>

        <div className="w-16"></div>
      </div>

      {/* Mode Selector Tabs (Strict One Screen One Purpose) */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'basic', label: 'সাধারণ (Basic)' },
          { id: 'scientific', label: 'সায়েন্টিফিক' },
          { id: 'algebra', label: 'বীজগণিত সমীকরণ' },
          { id: 'matrix', label: 'ম্যাট্রিক্স ও নির্ণায়ক' },
          { id: 'statistics', label: 'পরিসংখ্যান (Stats)' },
          { id: 'units', label: 'একক রূপান্তর' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id as CalcMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              mode === m.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 1. BASIC CALCULATOR ONLY */}
      {mode === 'basic' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 max-w-sm mx-auto">
          {/* Display */}
          <div className="bg-slate-900 text-white p-4 rounded-xl text-right">
            <div className="text-xs text-slate-400 min-h-[16px] font-mono">
              {history[0] || ''}
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight mt-1 overflow-x-auto">
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2">
            <button type="button" onClick={handleClear} className="calc-btn text-rose-600 bg-rose-50 font-bold">C</button>
            <button type="button" onClick={() => handlePress('(')} className="calc-btn text-slate-700 bg-slate-100">(</button>
            <button type="button" onClick={() => handlePress(')')} className="calc-btn text-slate-700 bg-slate-100">)</button>
            <button type="button" onClick={handleBackspace} className="calc-btn text-slate-700 bg-slate-100">
              <Delete className="w-4 h-4 mx-auto" />
            </button>

            <button type="button" onClick={() => handlePress('7')} className="calc-btn font-semibold">7</button>
            <button type="button" onClick={() => handlePress('8')} className="calc-btn font-semibold">8</button>
            <button type="button" onClick={() => handlePress('9')} className="calc-btn font-semibold">9</button>
            <button type="button" onClick={() => handlePress('÷')} className="calc-btn-op">÷</button>

            <button type="button" onClick={() => handlePress('4')} className="calc-btn font-semibold">4</button>
            <button type="button" onClick={() => handlePress('5')} className="calc-btn font-semibold">5</button>
            <button type="button" onClick={() => handlePress('6')} className="calc-btn font-semibold">6</button>
            <button type="button" onClick={() => handlePress('×')} className="calc-btn-op">×</button>

            <button type="button" onClick={() => handlePress('1')} className="calc-btn font-semibold">1</button>
            <button type="button" onClick={() => handlePress('2')} className="calc-btn font-semibold">2</button>
            <button type="button" onClick={() => handlePress('3')} className="calc-btn font-semibold">3</button>
            <button type="button" onClick={() => handlePress('−')} className="calc-btn-op">−</button>

            <button type="button" onClick={() => handlePress('0')} className="calc-btn font-semibold">0</button>
            <button type="button" onClick={() => handlePress('.')} className="calc-btn font-semibold">.</button>
            <button type="button" onClick={handleCalculate} className="calc-btn bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700">
              =
            </button>
            <button type="button" onClick={() => handlePress('+')} className="calc-btn-op">+</button>
          </div>
        </div>
      )}

      {/* 2. SCIENTIFIC CALCULATOR ONLY */}
      {mode === 'scientific' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 max-w-md mx-auto">
          {/* Display */}
          <div className="bg-slate-900 text-white p-4 rounded-xl text-right">
            <div className="text-xs text-slate-400 min-h-[16px] font-mono">
              {history[0] || ''}
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight mt-1 overflow-x-auto">
              {display}
            </div>
          </div>

          {/* Scientific Keypad */}
          <div className="grid grid-cols-5 gap-1.5">
            <button type="button" onClick={() => handlePress('sin(')} className="calc-sci-btn">sin</button>
            <button type="button" onClick={() => handlePress('cos(')} className="calc-sci-btn">cos</button>
            <button type="button" onClick={() => handlePress('tan(')} className="calc-sci-btn">tan</button>
            <button type="button" onClick={() => handlePress('π')} className="calc-sci-btn">π</button>
            <button type="button" onClick={handleClear} className="calc-btn text-rose-600 bg-rose-50 font-bold">C</button>

            <button type="button" onClick={() => handlePress('log(')} className="calc-sci-btn">log</button>
            <button type="button" onClick={() => handlePress('ln(')} className="calc-sci-btn">ln</button>
            <button type="button" onClick={() => handlePress('^')} className="calc-sci-btn">xʸ</button>
            <button type="button" onClick={() => handlePress('√')} className="calc-sci-btn">√</button>
            <button type="button" onClick={handleBackspace} className="calc-btn text-slate-700 bg-slate-100">
              <Delete className="w-4 h-4 mx-auto" />
            </button>

            <button type="button" onClick={() => handlePress('7')} className="calc-btn font-semibold">7</button>
            <button type="button" onClick={() => handlePress('8')} className="calc-btn font-semibold">8</button>
            <button type="button" onClick={() => handlePress('9')} className="calc-btn font-semibold">9</button>
            <button type="button" onClick={() => handlePress('(')} className="calc-sci-btn">(</button>
            <button type="button" onClick={() => handlePress('÷')} className="calc-btn-op">÷</button>

            <button type="button" onClick={() => handlePress('4')} className="calc-btn font-semibold">4</button>
            <button type="button" onClick={() => handlePress('5')} className="calc-btn font-semibold">5</button>
            <button type="button" onClick={() => handlePress('6')} className="calc-btn font-semibold">6</button>
            <button type="button" onClick={() => handlePress(')')} className="calc-sci-btn">)</button>
            <button type="button" onClick={() => handlePress('×')} className="calc-btn-op">×</button>

            <button type="button" onClick={() => handlePress('1')} className="calc-btn font-semibold">1</button>
            <button type="button" onClick={() => handlePress('2')} className="calc-btn font-semibold">2</button>
            <button type="button" onClick={() => handlePress('3')} className="calc-btn font-semibold">3</button>
            <button type="button" onClick={() => handlePress('^2')} className="calc-sci-btn">x²</button>
            <button type="button" onClick={() => handlePress('−')} className="calc-btn-op">−</button>

            <button type="button" onClick={() => handlePress('0')} className="calc-btn font-semibold">0</button>
            <button type="button" onClick={() => handlePress('.')} className="calc-btn font-semibold">.</button>
            <button type="button" onClick={() => handlePress('%')} className="calc-sci-btn">%</button>
            <button type="button" onClick={handleCalculate} className="calc-btn bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 col-span-1">
              =
            </button>
            <button type="button" onClick={() => handlePress('+')} className="calc-btn-op">+</button>
          </div>
        </div>
      )}

      {/* 3. ALGEBRA EQUATION SOLVER ONLY */}
      {mode === 'algebra' && (
        <div className="space-y-4">
          {/* Quadratic Section */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">
                ১. দ্বিঘাত সমীকরণ সমাধান (ax² + bx + c = 0)
              </h3>
              <span className="text-[11px] font-math bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                ax² + bx + c = 0
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-500 font-math">a (x² এর সহগ):</label>
                <input
                  type="number"
                  value={qa}
                  onChange={(e) => setQa(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg text-center font-math font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-math">b (x এর সহগ):</label>
                <input
                  type="number"
                  value={qb}
                  onChange={(e) => setQb(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg text-center font-math font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-math">c (ধ্রুবক):</label>
                <input
                  type="number"
                  value={qc}
                  onChange={(e) => setQc(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg text-center font-math font-semibold text-sm"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSolveQuad}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              দ্বিঘাত সমীকরণের মূল বের করুন
            </button>

            {quadResult && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>নিশ্চায়ক (D): {quadResult.discriminant}</span>
                  <span>মূলদ্বয়: {quadResult.hasRealRoots ? 'বাস্তব' : 'অবাস্তব'}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-300 font-math text-center text-sm font-bold text-slate-900">
                  x₁ = {quadResult.root1} , x₂ = {quadResult.root2}
                </div>
                <div className="space-y-1 text-[11px] text-emerald-900">
                  {quadResult.steps.map((st: string, idx: number) => (
                    <p key={idx}>• {st}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simultaneous Linear Equations Section */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">
              ২. সরল সহসমীকরণ সমাধান (২টি চলক: x, y)
            </h3>
            <p className="text-[11px] text-slate-500 font-math">
              সমীকরণ ১: a₁x + b₁y = c₁ <br />
              সমীকরণ ২: a₂x + b₂y = c₂
            </p>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="a₁"
                value={simA1}
                onChange={(e) => setSimA1(e.target.value)}
                className="p-1.5 border rounded-lg text-center text-xs font-math"
              />
              <input
                type="number"
                placeholder="b₁"
                value={simB1}
                onChange={(e) => setSimB1(e.target.value)}
                className="p-1.5 border rounded-lg text-center text-xs font-math"
              />
              <input
                type="number"
                placeholder="c₁"
                value={simC1}
                onChange={(e) => setSimC1(e.target.value)}
                className="p-1.5 border rounded-lg text-center text-xs font-math"
              />

              <input
                type="number"
                placeholder="a₂"
                value={simA2}
                onChange={(e) => setSimA2(e.target.value)}
                className="p-1.5 border rounded-lg text-center text-xs font-math"
              />
              <input
                type="number"
                placeholder="b₂"
                value={simB2}
                onChange={(e) => setSimB2(e.target.value)}
                className="p-1.5 border rounded-lg text-center text-xs font-math"
              />
              <input
                type="number"
                placeholder="c₂"
                value={simC2}
                onChange={(e) => setSimC2(e.target.value)}
                className="p-1.5 border rounded-lg text-center text-xs font-math"
              />
            </div>

            <button
              type="button"
              onClick={handleSolveSim}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              ক্র্যামারের নিয়মে x ও y নির্ণয় করুন
            </button>

            {simResult && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-2 text-xs">
                {simResult.solvable ? (
                  <>
                    <div className="p-2 bg-white rounded-lg border border-blue-300 font-math text-center text-sm font-bold text-slate-900">
                      x = {simResult.x} , y = {simResult.y}
                    </div>
                    <div className="space-y-1 text-[11px] text-blue-900">
                      {simResult.steps.map((st: string, idx: number) => (
                        <p key={idx}>{st}</p>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-amber-800">{simResult.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MATRIX & DETERMINANT ONLY */}
      {mode === 'matrix' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 max-w-sm mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">ম্যাট্রিক্স নির্ণায়ক (Determinant)</h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMatrixDim('2x2')}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  matrixDim === '2x2' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                2 × 2
              </button>
              <button
                type="button"
                onClick={() => setMatrixDim('3x3')}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  matrixDim === '3x3' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                3 × 3
              </button>
            </div>
          </div>

          {matrixDim === '2x2' ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={m2[0][0]}
                  onChange={(e) => {
                    const next = [...m2];
                    next[0][0] = parseFloat(e.target.value) || 0;
                    setM2(next);
                  }}
                  className="p-2 bg-white border rounded text-center font-math font-bold"
                />
                <input
                  type="number"
                  value={m2[0][1]}
                  onChange={(e) => {
                    const next = [...m2];
                    next[0][1] = parseFloat(e.target.value) || 0;
                    setM2(next);
                  }}
                  className="p-2 bg-white border rounded text-center font-math font-bold"
                />
                <input
                  type="number"
                  value={m2[1][0]}
                  onChange={(e) => {
                    const next = [...m2];
                    next[1][0] = parseFloat(e.target.value) || 0;
                    setM2(next);
                  }}
                  className="p-2 bg-white border rounded text-center font-math font-bold"
                />
                <input
                  type="number"
                  value={m2[1][1]}
                  onChange={(e) => {
                    const next = [...m2];
                    next[1][1] = parseFloat(e.target.value) || 0;
                    setM2(next);
                  }}
                  className="p-2 bg-white border rounded text-center font-math font-bold"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {m3.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <input
                      key={`${rIdx}-${cIdx}`}
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const next = m3.map((r) => [...r]);
                        next[rIdx][cIdx] = parseFloat(e.target.value) || 0;
                        setM3(next);
                      }}
                      className="p-1.5 bg-white border rounded text-center font-math text-xs font-semibold"
                    />
                  ))
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleMatrixDet}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            মান (Determinant |A|) নির্ণয় করুন
          </button>

          {matResult !== null && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
              <span className="text-[11px] text-emerald-800 font-semibold uppercase">
                নির্ণায়ক মান
              </span>
              <div className="text-xl font-bold font-mono text-emerald-950">
                |A| = {matResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. STATISTICS CALCULATOR ONLY */}
      {mode === 'statistics' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900">পরিসংখ্যান উপাত্ত বিশ্লেষণ (Statistics)</h3>
          <p className="text-xs text-slate-500">
            উপাত্তগুলো কমা (,) দিয়ে আলাদা করে লিখুন:
          </p>

          <textarea
            rows={2}
            value={statInput}
            onChange={(e) => setStatInput(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-emerald-500"
          />

          <button
            type="button"
            onClick={handleCalcStats}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
          >
            গড়, মধ্যক, ভেদাঙ্ক ও পরিমিত ব্যবধান বের করুন
          </button>

          {statResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-500 block text-[11px]">মোট উপাত্ত (n)</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{statResult.count}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-500 block text-[11px]">গাণিতিক গড় (Mean)</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{statResult.mean}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-500 block text-[11px]">মধ্যক (Median)</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{statResult.median}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-500 block text-[11px]">পরিমিত ব্যবধান (Std Dev)</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{statResult.stdDev}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. UNIT CONVERTER ONLY */}
      {mode === 'units' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 max-w-sm mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">গাণিতিক একক রূপান্তর</h3>
            <div className="flex gap-1">
              {(['length', 'mass', 'temperature'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setUnitCategory(cat);
                    if (cat === 'length') {
                      setFromUnit('m');
                      setToUnit('cm');
                    } else if (cat === 'mass') {
                      setFromUnit('kg');
                      setToUnit('g');
                    } else {
                      setFromUnit('C');
                      setToUnit('F');
                    }
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    unitCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {cat === 'length' ? 'দৈর্ঘ্য' : cat === 'mass' ? 'ভর' : 'তাপমাত্রা'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-500 font-medium">মান লিখুন:</label>
              <input
                type="number"
                value={unitVal}
                onChange={(e) => setUnitVal(e.target.value)}
                className="w-full mt-1 p-2 border rounded-xl font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500 font-medium">হতে:</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-xl text-xs font-medium bg-white"
                >
                  {unitCategory === 'length' && (
                    <>
                      <option value="m">মিটার (m)</option>
                      <option value="cm">সেন্টিমিটার (cm)</option>
                      <option value="km">কিলোমিটার (km)</option>
                      <option value="inch">ইঞ্চি (inch)</option>
                      <option value="feet">ফুট (feet)</option>
                    </>
                  )}
                  {unitCategory === 'mass' && (
                    <>
                      <option value="kg">কিলোগ্রাম (kg)</option>
                      <option value="g">গ্রাম (g)</option>
                      <option value="mg">মিলিগ্রাম (mg)</option>
                      <option value="lb">পাউন্ড (lb)</option>
                    </>
                  )}
                  {unitCategory === 'temperature' && (
                    <>
                      <option value="C">সেলসিয়াস (°C)</option>
                      <option value="F">ফারেনহাইট (°F)</option>
                      <option value="K">কেলভিন (K)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-medium">রূপান্তর:</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-xl text-xs font-medium bg-white"
                >
                  {unitCategory === 'length' && (
                    <>
                      <option value="cm">সেন্টিমিটার (cm)</option>
                      <option value="m">মিটার (m)</option>
                      <option value="km">কিলোমিটার (km)</option>
                      <option value="inch">ইঞ্চি (inch)</option>
                      <option value="feet">ফুট (feet)</option>
                    </>
                  )}
                  {unitCategory === 'mass' && (
                    <>
                      <option value="g">গ্রাম (g)</option>
                      <option value="kg">কিলোগ্রাম (kg)</option>
                      <option value="mg">মিলিগ্রাম (mg)</option>
                      <option value="lb">পাউন্ড (lb)</option>
                    </>
                  )}
                  {unitCategory === 'temperature' && (
                    <>
                      <option value="F">ফারেনহাইট (°F)</option>
                      <option value="C">সেলসিয়াস (°C)</option>
                      <option value="K">কেলভিন (K)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConvert}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              রূপান্তর করুন
            </button>

            {convertedVal !== null && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[11px] text-emerald-800 uppercase font-semibold">
                  ফলাফল
                </span>
                <div className="text-xl font-bold font-mono text-emerald-950 mt-0.5">
                  {convertedVal.toFixed(4)} {toUnit}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .calc-btn {
          min-height: 46px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
        }
        .calc-btn:active {
          transform: scale(0.95);
          background-color: #f1f5f9;
        }
        .calc-btn-op {
          min-height: 46px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background-color: #f8fafc;
          color: #0f172a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
        }
        .calc-btn-op:active {
          transform: scale(0.95);
          background-color: #e2e8f0;
        }
        .calc-sci-btn {
          min-height: 42px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .calc-sci-btn:active {
          transform: scale(0.95);
          background-color: #e2e8f0;
        }
      `}</style>
    </div>
  );
};
