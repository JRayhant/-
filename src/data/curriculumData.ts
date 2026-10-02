export interface TopicItem {
  id: string;
  name: string;
  enName: string;
  description: string;
  iconName: string;
  formulaCount: number;
}

export interface ClassGrade {
  grade: string;
  title: string;
  subtitle: string;
  topics: TopicItem[];
}

export interface FormulaDetail {
  id: string;
  category: string;
  title: string;
  formula: string;
  symbolMeaning: string[];
  whenToUse: string;
  example: {
    question: string;
    solution: string;
    answer: string;
  };
  commonMistake: string;
  practiceProblem: string;
}

export const CLASS_GRADES: ClassGrade[] = [
  {
    grade: 'Class 6',
    title: 'ষষ্ঠ শ্রেণি',
    subtitle: 'পাটিগণিত ও প্রাথমিক গণিত',
    topics: [
      { id: 'c6-num', name: 'স্বাভাবিক সংখ্যা ও ভগ্নাংশ', enName: 'Numbers & Fractions', description: 'মৌলিক ও কৃত্রিম সংখ্যা, লসাগু ও গসাগু, সাধারণ ভগ্নাংশ', iconName: 'Hash', formulaCount: 4 },
      { id: 'c6-ratio', name: 'অনুপাত ও শতকরা', enName: 'Ratio & Percentage', description: 'অনুপাতের রূপান্তর, ঐকিক নিয়ম ও শতকরা হিসাব', iconName: 'Percent', formulaCount: 3 },
      { id: 'c6-alg', name: 'বীজগণিতীয় রাশি', enName: 'Algebraic Expressions', description: 'চলক, সহগ, সূচক ও যোগ-বিয়োগ', iconName: 'Binary', formulaCount: 3 },
      { id: 'c6-geo', name: 'জ্যামিতির মৌলিক ধারণা', enName: 'Basic Geometry', description: 'বিন্দু, রেখা, কোণ, ত্রিভুজ ও চতুর্ভুজ', iconName: 'Shapes', formulaCount: 4 },
      { id: 'c6-stats', name: 'তথ্য ও উপাত্ত', enName: 'Data & Statistics', description: 'পরিসংখ্যান সারণি, গড় ও রেখাচিত্র', iconName: 'BarChart2', formulaCount: 2 },
    ],
  },
  {
    grade: 'Class 7',
    title: 'সপ্তম শ্রেণি',
    subtitle: 'বীজগণিতীয় সূত্রাবলি ও পরিমাপ',
    topics: [
      { id: 'c7-root', name: 'মূলদ ও অমূলদ সংখ্যা', enName: 'Rational & Irrational', description: 'বর্গমূল নির্ণয় ও অমূলদ ধারণা', iconName: 'SquareRoot', formulaCount: 3 },
      { id: 'c7-alg-form', name: 'বীজগণিতীয় সূত্রাবলি ও প্রয়োগ', enName: 'Algebraic Formulae', description: '(a+b)² ও (a-b)² সূত্রের প্রয়োগ এবং উৎপাদক', iconName: 'Sigma', formulaCount: 6 },
      { id: 'c7-linear', name: 'সরল সমীকরণ', enName: 'Linear Equations', description: 'এক চলক বিশিষ্ট সমীকরণ গঠন ও সমাধান', iconName: 'Equal', formulaCount: 3 },
      { id: 'c7-meas', name: 'পরিমাপ ও ক্ষেত্রফল', enName: 'Mensuration', description: 'আয়তক্ষেত্র, বর্গ ও ত্রিভুজের পরিসীমা ও ক্ষেত্রফল', iconName: 'Ruler', formulaCount: 5 },
      { id: 'c7-profit', name: 'লাভ-ক্ষতি ও সরল মুনাফা', enName: 'Profit-Loss & Simple Interest', description: 'I = Pnr সূত্র ও শতকরা লাভ-ক্ষতি', iconName: 'Coins', formulaCount: 4 },
    ],
  },
  {
    grade: 'Class 8',
    title: 'অষ্টম শ্রেণি (JSC Level)',
    subtitle: 'ঘনফল সূত্রাবলি ও বৃত্ত',
    topics: [
      { id: 'c8-pattern', name: 'প্যাটার্ন ও সংখ্যা', enName: 'Patterns', description: 'সংখ্যার প্যাটার্ন, বীজগাণিতিক রাশি ও সমষ্টি', iconName: 'Sparkles', formulaCount: 3 },
      { id: 'c8-interest', name: 'মুনাফা (সরল ও চক্রবৃদ্ধি)', enName: 'Compound Interest', description: 'C = P(1+r)ⁿ এবং চক্রবৃদ্ধি মুনাফা', iconName: 'TrendingUp', formulaCount: 4 },
      { id: 'c8-cube', name: 'বীজগণিতীয় ঘনফল সূত্রাবলি', enName: 'Cube Formulae', description: '(a+b)³, (a-b)³, a³+b³ ও উৎপাদকে বিশ্লেষণ', iconName: 'Box', formulaCount: 6 },
      { id: 'c8-pyth', name: 'পিথাগোরাসের উপপাদ্য', enName: 'Pythagorean Theorem', description: 'অতিভুজ² = লম্ব² + ভূমি² এর প্রমাণ ও প্রয়োগ', iconName: 'Triangle', formulaCount: 3 },
      { id: 'c8-circle', name: 'বৃত্তের পরিধি ও ক্ষেত্রফল', enName: 'Circle Geometry', description: '২πr এবং πr² সূত্রের প্রয়োগ', iconName: 'Circle', formulaCount: 4 },
    ],
  },
  {
    grade: 'Class 9',
    title: 'নবম শ্রেণি (SSC)',
    subtitle: 'সাধারণ গণিত ও বিজ্ঞান ভিত্তি',
    topics: [
      { id: 'c9-set', name: 'সেট ও ফাংশন', enName: 'Set & Function', description: 'সংযোগ, ছেদ, ডোমেন ও রেঞ্জ', iconName: 'Network', formulaCount: 5 },
      { id: 'c9-log', name: 'সূচক ও লগারিদম', enName: 'Indices & Logarithm', description: 'aᵐ × aⁿ, logₐ(xy) সূত্রাবলি', iconName: 'Activity', formulaCount: 8 },
      { id: 'c9-trig', name: 'ত্রিকোণমিতিক অনুপাত (৯.১, ৯.২)', enName: 'Trigonometry', description: 'sin, cos, tan এবং 0°, 30°, 45°, 60°, 90° মান', iconName: 'Compass', formulaCount: 10 },
      { id: 'c9-quad', name: 'দ্বিঘাত সমীকরণ ও উৎপাদক', enName: 'Quadratic & Factors', description: 'মধ্যপদ বিভাজন (Middle term) ও সূত্র প্রয়োগ', iconName: 'Split', formulaCount: 5 },
      { id: 'c9-dist', name: 'দূরত্ব ও উচ্চতা (১০ম অধ্যায়)', enName: 'Height & Distance', description: 'উন্নতি কোণ ও অবনতি কোণ সমস্যা', iconName: 'Mountain', formulaCount: 4 },
    ],
  },
  {
    grade: 'Class 10',
    title: 'দশম শ্রেণি (SSC Board)',
    subtitle: 'বোর্ড পরীক্ষা চূড়ান্ত প্রস্তুতি',
    topics: [
      { id: 'c10-series', name: 'সসীম ধারা (সমান্তর ও গুণোত্তর)', enName: 'Arithmetic & Geometric Series', description: 'n-তম পদ ও সমষ্টির সূত্রাবলি', iconName: 'ListOrdered', formulaCount: 6 },
      { id: 'c10-circle', name: 'বৃত্ত সম্পর্কিত উপপাদ্য', enName: 'Circle Theorems', description: 'বৃত্তস্থ কোণ, কেন্দ্রস্থ কোণ ও স্পর্শক', iconName: 'CircleDot', formulaCount: 5 },
      { id: 'c10-mens', name: 'পরিমিতি (১৬.১ - ১৬.৪)', enName: 'Mensuration (Solid Geometry)', description: 'সিলিন্ডার, গোলক, সমবৃত্তভূমিক কোণক', iconName: 'Boxes', formulaCount: 8 },
      { id: 'c10-stats', name: 'পরিসংখ্যান (সংক্ষিপ্ত পদ্ধতিতে গড়)', enName: 'SSC Statistics', description: 'সংক্ষিপ্ত গড়, মধ্যক, প্রচুরক ও অজিভ রেখা', iconName: 'BarChart', formulaCount: 5 },
    ],
  },
  {
    grade: 'Class 11',
    title: 'একাদশ শ্রেণি (HSC)',
    subtitle: 'উচ্চতর গণিত ১ম পত্র',
    topics: [
      { id: 'c11-mat', name: 'ম্যাট্রিক্স ও নির্ণায়ক', enName: 'Matrix & Determinant', description: 'ম্যাট্রিক্সের গুণ, বিপরীত ম্যাট্রিক্স, ক্র্যামার নিয়ম', iconName: 'Grid', formulaCount: 7 },
      { id: 'c11-vec', name: 'ভেক্টর (ডট ও ক্রস গুণন)', enName: 'Vector Algebra', description: 'A·B = |A||B|cosθ, A×B, লম্ব অভিক্ষেপ', iconName: 'Navigation', formulaCount: 8 },
      { id: 'c11-line', name: 'সরলরেখা (৩য় অধ্যায়)', enName: 'Straight Line', description: 'ঢাল (Slope), দুই বিন্দুগামী রেখা, লম্ব দূরত্ব', iconName: 'Slash', formulaCount: 9 },
      { id: 'c11-circle', name: 'বৃত্ত (৪র্থ অধ্যায়)', enName: 'Circle (HSC)', description: 'x² + y² + 2gx + 2fy + c = 0 সমীকরণ', iconName: 'Disc', formulaCount: 6 },
      { id: 'c11-diff', name: 'অন্তরীকরণ ও লিমিট (৯ম অধ্যায়)', enName: 'Differentiation & Limits', description: 'মূল নিয়মে অন্তরজ, d/dx সূত্রাবলি, চরম মান', iconName: 'TrendingDown', formulaCount: 12 },
    ],
  },
  {
    grade: 'Class 12',
    title: 'দ্বাদশ শ্রেণি (HSC)',
    subtitle: 'উচ্চতর গণিত ২য় পত্র',
    topics: [
      { id: 'c12-complex', name: 'জটিল সংখ্যা', enName: 'Complex Numbers', description: 'আর্গ্যান্ড চিত্র, মডুলাস, আর্গুমেন্ট, এককের ঘনমূল', iconName: 'Layers', formulaCount: 7 },
      { id: 'c12-poly', name: 'বহুপদী ও বহুপদী সমীকরণ', enName: 'Polynomials', description: 'মূল ও সহগের সম্পর্ক, ত্রিঘাত সমীকরণ', iconName: 'FileCode', formulaCount: 5 },
      { id: 'c12-conic', name: 'কনিক (পরাবৃত্ত, উপবৃত্ত, অধিবৃত্ত)', enName: 'Conics', description: 'শীর্ষবিন্দু, উপকেন্দ্র ও দিকাক্ষের সমীকরণ', iconName: 'Orbit', formulaCount: 10 },
      { id: 'c12-int', name: 'যোগজীকরণ (Integration)', enName: 'Integral Calculus', description: 'নির্দিষ্ট ও অনির্দিষ্ট যোগজ, ক্ষেত্রফল নির্ণয়', iconName: 'FunctionSquare', formulaCount: 14 },
      { id: 'c12-prob', name: 'সম্ভাবনা (Probability)', enName: 'Probability', description: 'শর্তাধীন সম্ভাবনা, নমুনা ক্ষেত্র ও সমস্যা', iconName: 'Dice5', formulaCount: 6 },
    ],
  },
];

export const PHYSICS_TOPICS = [
  {
    id: 'phy-motion',
    name: 'গতি ও বেগ (Motion)',
    formula: 'v = u + at, s = ut + ½at², v² = u² + 2as',
    unit: 'm, m/s, m/s²',
    description: 'সরলরৈখিক গতি, গড় বেগ, ত্বরণ ও অতিক্রান্ত দূরত্ব।',
  },
  {
    id: 'phy-force',
    name: 'বল ও নিউটনের ২য় সূত্র (Force)',
    formula: 'F = ma, p = mv, F = (mv - mu)/t',
    unit: 'Newton (N), kg·m/s',
    description: 'ভরবেগ, ভরবেগের নিত্যতা ও বলের ঘাত।',
  },
  {
    id: 'phy-work',
    name: 'কাজ, ক্ষমতা ও শক্তি (Work & Energy)',
    formula: 'W = Fs cosθ, Ek = ½mv², Ep = mgh, P = W/t',
    unit: 'Joule (J), Watt (W)',
    description: 'গতিশক্তি, স্থিতিশক্তি ও কর্মদক্ষতা (η)।',
  },
  {
    id: 'phy-ohm',
    name: 'তড়িৎ ও ওহমের সূত্র (Electricity)',
    formula: 'V = IR, P = VI = I²R = V²/R, R = ρ(L/A)',
    unit: 'Volt (V), Ampere (A), Ohm (Ω)',
    description: 'রোধের সন্নিবেশ (শ্রেণি ও সমান্তরাল), বিদ্যুৎ খরচ হিসাব।',
  },
  {
    id: 'phy-grav',
    name: 'মহাকর্ষ ও অভিকর্ষ (Gravitation)',
    formula: 'F = G(m₁m₂)/r², g = GM/R²',
    unit: 'N, N·m²/kg², m/s²',
    description: 'মহাকর্ষীয় ধ্রুবক, উচ্চতায় g-এর পরিবর্তন।',
  },
  {
    id: 'phy-heat',
    name: 'তাপ ও তাপমাত্রা (Heat & Calorimetry)',
    formula: 'Q = mcΔθ, Q = mL, C/5 = (F-32)/9 = (K-273)/5',
    unit: 'Joule (J), J/kg·K',
    description: 'আপেক্ষিক তাপ, সুপ্ততাপ ও ক্যালরিমিতির মূলনীতি।',
  },
  {
    id: 'phy-optics',
    name: 'আলোর প্রতিফলন ও প্রতিসরণ (Optics)',
    formula: '1/f = 1/u + 1/v, m = -v/u, n = sin i / sin r',
    unit: 'm, Diopter (D)',
    description: 'লেন্স ও দর্পণের সূত্র, ফোকাস দূরত্ব ও বিবর্ধন।',
  },
];

export const FORMULA_LIBRARY: FormulaDetail[] = [
  {
    id: 'f-quad',
    category: 'বীজগণিত',
    title: 'দ্বিঘাত সমীকরণ সমাধানের দ্বিঘাত সূত্র',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    symbolMeaning: [
      'a = x² এর সহগ (a ≠ 0)',
      'b = x এর সহগ',
      'c = ধ্রুবক পদ',
      'b² - 4ac = নিশ্চায়ক (Discriminant)',
    ],
    whenToUse: 'যখন কোনো দ্বিঘাত সমীকরণকে সহজে মধ্যপদ বিভাজন (Middle Term Factorization) করা যায় না বা সরাসরি মূল বের করতে হয়।',
    example: {
      question: '2x² - 5x + 2 = 0 সমীকরণটি সমাধান করো।',
      solution: 'এখানে a = 2, b = -5, c = 2। সূত্র অনুযায়ী x = (-(-5) ± √((-5)² - 4×2×2)) / (2×2) = (5 ± √(25 - 16)) / 4 = (5 ± 3) / 4। অর্থাৎ x₁ = 8/4 = 2, x₂ = 2/4 = 0.5।',
      answer: 'x = 2 অথবা 0.5',
    },
    commonMistake: '-b বসানোর সময় b-এর নিজস্ব মাইনাস চিহ্ন ভুলে যাওয়া এবং 2a দিয়ে কেবল রুট অংশকে ভাগ করা (পুরো লবকে 2a দিয়ে ভাগ করতে হবে)।',
    practiceProblem: '3x² + 7x + 2 = 0 সমীকরণটির মূল বের করো।',
  },
  {
    id: 'f-pyth',
    category: 'জ্যামিতি',
    title: 'পিথাগোরাসের উপপাদ্য (সমকোণী ত্রিভুজ)',
    formula: 'অতিভুজ² = লম্ব² + ভূমি² (c² = a² + b²)',
    symbolMeaning: [
      'c = সমকোণের বিপরীত বাহু (অতিভুজ)',
      'a = লম্ব বাহু',
      'b = ভূমি বাহু',
    ],
    whenToUse: 'সমকোণী ত্রিভুজের যেকোনো দুটি বাহুর দৈর্ঘ্য জানা থাকলে তৃতীয় বাহুটি বের করতে।',
    example: {
      question: 'একটি সমকোণী ত্রিভুজের লম্ব ৩ সেমি এবং ভূমি ৪ সেমি হলে অতিভুজ কত?',
      solution: 'c² = a² + b² = 3² + 4² = 9 + 16 = 25। সুতরাং c = √25 = 5 সেমি।',
      answer: '৫ সেমি',
    },
    commonMistake: 'ত্রিভুজটি সমকোণী না হওয়া সত্ত্বেও সূত্রটি সরাসরি প্রয়োগ করা।',
    practiceProblem: 'অতিভুজ ১৩ সেমি ও ভূমি ১২ সেমি হলে লম্ব কত সেমি?',
  },
  {
    id: 'f-circle-area',
    category: 'পরিমিতি',
    title: 'বৃত্তের পরিধি ও ক্ষেত্রফল',
    formula: 'পরিধি = 2πr, ক্ষেত্রফল = πr²',
    symbolMeaning: [
      'r = বৃত্তের ব্যাসার্ধ (ব্যাসের অর্ধেক, r = d/2)',
      'π ≈ 3.1416 (২২/৭)',
    ],
    whenToUse: 'বৃত্তাকার কোনো বস্তু, চাকা বা মাঠের সীমানা দৈর্ঘ্য ও মেঝের ক্ষেত্রফল নির্ণয়ে।',
    example: {
      question: '৭ সেমি ব্যাসার্ধের একটি বৃত্তের ক্ষেত্রফল কত?',
      solution: 'ক্ষেত্রফল = πr² = (22/7) × 7² = (22/7) × 49 = 154 বর্গ সেমি।',
      answer: '১৫৪ বর্গ সেমি',
    },
    commonMistake: 'ব্যাসার্ধ (r) এর জায়গায় ব্যাস (d) সরাসরি বসিয়ে ফেলা। ব্যাস দেওয়া থাকলে আগে ২ দিয়ে ভাগ করে r বের করতে হবে।',
    practiceProblem: '১৪ মিটার ব্যাসের একটি বৃত্তাকার বাগানের পরিধি কত?',
  },
  {
    id: 'f-trig-basic',
    category: 'ত্রিকোণমিতি',
    title: 'মৌলিক ত্রিকোণমিতিক অভেদাবলি',
    formula: 'sin²θ + cos²θ = 1, sec²θ - tan²θ = 1, cosec²θ - cot²θ = 1',
    symbolMeaning: [
      'θ = সুক্ষ্মকোণ (Angle)',
      'sinθ = লম্ব / অতিভুজ',
      'cosθ = ভূমি / অতিভুজ',
      'tanθ = লম্ব / ভূমি',
    ],
    whenToUse: 'ত্রিকোণমিতিক সমীকরণ সহজীকরণ এবং মান রূপান্তরে।',
    example: {
      question: 'যদি sinθ = 3/5 হয়, তবে cosθ এর মান কত?',
      solution: 'cos²θ = 1 - sin²θ = 1 - (3/5)² = 1 - 9/25 = 16/25। সুতরাং cosθ = √(16/25) = 4/5।',
      answer: '4/5',
    },
    commonMistake: 'sec²θ - tan²θ = 1 এর জায়গায় tan²θ - sec²θ = 1 মনে রাখা।',
    practiceProblem: 'tanθ = 4/3 হলে secθ এর মান নির্ণয় করো।',
  },
  {
    id: 'f-calc-diff',
    category: 'ক্যালকুলাস',
    title: 'পাওয়ার রুল (অন্তরীকরণ / Differentiation)',
    formula: 'd/dx (xⁿ) = n·xⁿ⁻¹',
    symbolMeaning: [
      'x = স্বাধীন চলক',
      'n = যেকোনো বাস্তব সূচক (ধ্রুবক)',
    ],
    whenToUse: 'যেকোনো বীজগণিতীয় ঘাত সংবলিত রাশির পরিবর্তনের হার বা ঢাল বের করতে।',
    example: {
      question: 'f(x) = 5x³ - 4x² + 7 হলে f\'(x) কত?',
      solution: 'd/dx(5x³) = 5 × 3x² = 15x²; d/dx(-4x²) = -4 × 2x = -8x; d/dx(7) = 0। সুতরাং f\'(x) = 15x² - 8x।',
      answer: '15x² - 8x',
    },
    commonMistake: 'ধ্রুবক পদের অন্তরজ শূন্য (0) না লিখে ধ্রুবকটি রেখে দেওয়া।',
    practiceProblem: 'y = 4x⁵ - 3x³ + 2x হলে dy/dx বের করো।',
  },
  {
    id: 'f-interest',
    category: 'পাটিগণিত',
    title: 'সরল মুনাফা ও মুনাফা-আসল',
    formula: 'I = Pnr, A = P + I = P(1 + nr)',
    symbolMeaning: [
      'P = মূলধন বা আসল (Principal)',
      'n = সময় (বছরে)',
      'r = বার্ষিক মুনাফার হার (শতকরা হিসেবে, যেমন 8% = 0.08 বা 8/100)',
      'I = মোট মুনাফা (Interest)',
      'A = মুনাফা-আসল (Total Amount)',
    ],
    whenToUse: 'ব্যাংক জমা, ঋণ বা বিনিয়োগের নির্দিষ্ট সময়ের মুনাফা গণনায়।',
    example: {
      question: '৫০০০ টাকার বার্ষিক ৮% মুনাফায় ৩ বছরের মুনাফা কত হবে?',
      solution: 'I = Pnr = 5000 × 3 × (8/100) = 50 × 3 × 8 = 1200 টাকা।',
      answer: '১২০০ টাকা',
    },
    commonMistake: 'মুনাফার হার r কে শতকরা থেকে ভগ্নাংশ বা দশমিকে রূপান্তর না করে সরাসরি ৮ দিয়ে গুণ করা।',
    practiceProblem: '৮০০০ টাকার ১০% হারে ৪ বছরের মুনাফা-আসল কত হবে?',
  },
];
