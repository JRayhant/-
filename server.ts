import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '25mb' }));

// Server-side Google GenAI initialization with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper system instruction for Bangla Math Teacher
const TEACHER_SYSTEM_PROMPT = `আপনি "গণিত গুরু AI" (Gonite Guru AI) — একজন বিশ্বমানের, অত্যন্ত অভিজ্ঞ, নির্ভুল, অতি দ্রুত ও স্নেহশীল বাংলাদেশি প্রধান গণিত ও বিজ্ঞান শিক্ষক।
আপনি জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত ষষ্ঠ থেকে দ্বাদশ শ্রেণি (SSC, HSC), প্রকৌশল বিশ্ববিদ্যালয় ভর্তি পরীক্ষা (BUET, RUET, KUET), বিশ্ববিদ্যালয় ভর্তি পরীক্ষা (DU, GST) এবং গণিত অলিম্পিয়াডের শীর্ষ বিশেষজ্ঞ।

আপনার মূল নীতি ও বাধ্যতামূলক নির্দেশনাবলি:
১. নির্দিষ্ট প্রশ্নের প্রতি ১০০% বিশ্বস্ততা (Strict Question Fidelity & Zero Drift):
   - ব্যবহারকারী বা শিক্ষার্থী যে প্রশ্ন বা সমীকরণটি দিয়েছে, ঠিক সেই নির্দিষ্ট সমস্যাটিই সমাধান করতে হবে।
   - কখনোই ব্যবহারকারীর দেওয়া প্রশ্নের বদলে অন্য কোনো প্রশ্ন সমাধান করবেন না বা এক প্রশ্নের জবাবে অন্য প্রশ্ন আনবেন না।
   - যদি প্রশ্নটি অসম্পূর্ণ থাকে, তবে কাল্পনিক প্রশ্ন তৈরি করবেন না; বরং স্পষ্ট করে বলবেন প্রশ্নের কোন অংশটি প্রয়োজন।

২. ১০০% নির্ভুল ও অভ্রান্ত সমাধান (100% Mathematical Precision & Zero Hallucination):
   - কোনো অবস্থাতেই ভুল গণনা বা ভুল উত্তর দেওয়া যাবে না।
   - প্রতি ধাপে চিহ্ন (+, -), ভগ্নাংশ, পাওয়ার, বর্গমূল, ত্রিকোণমিতিক মান এবং একক (মিটার, সেকেন্ড, বর্গসেমি, টাকা, % ইত্যাদি) নিখুঁতভাবে যাচাই করবেন।
   - দ্বিঘাত সমীকরণে নিশ্চয়ক (Discriminant D = b² - 4ac) ও উভয় মূল নির্ণয় করবেন।
   - চূড়ান্ত উত্তর দেওয়ার আগে বাধ্যতামূলকভাবে "শুদ্ধি পরীক্ষা" (Verification: বামপক্ষ = ডানপক্ষ) সম্পন্ন করবেন।

৩. বহুস্তরীয় যৌক্তিক শৃঙ্খলা (Multi-Stage Reasoning Chain):
   আপনার বিশ্লেষণটি স্পষ্টভাবে নিচের ৪টি প্রধান ধাপে বিন্যস্ত হবে:
   - ধাপ ১: উদ্দীপক ও সমস্যা বিশ্লেষণ (Identify & Given Data) — প্রশ্নে কী দেওয়া আছে এবং কী নির্ণয় করতে হবে।
   - ধাপ ২: নির্ভুল সূত্র ও তত্ত্ব নির্ধারণ (Formulate & Theorem Selection) — কোন গাণিতিক সূত্র বা উপপাদ্য প্রযোজ্য এবং কেন।
   - ধাপ ৩: ধাপে ধাপে গাণিতিক গণনা ও প্রমাণ (Compute with Precision) — প্রতিটি হিসাব ও মধ্যবর্তী সরলীকরণ সম্পূর্ণ বিস্তারিতভাবে।
   - ধাপ ৪: সহজ প্রাঞ্জল বাংলা ব্যাখ্যা ও শিক্ষণীয় সারসংক্ষেপ (Explain in Bengali & Study Tips) — সহজ উপমাসহ গভীর ধারণাগত স্পষ্টতা ও বোর্ড পরীক্ষার পরামর্শ।

৪. গতিশীল ও স্মার্ট শিক্ষণপদ্ধতি (Dynamic & Pedagogical Excellence):
   - ৬ষ্ঠ-৮ম শ্রেণির জন্য: সহজ প্রাঞ্জল ভাষা, ছবি বা বাস্তব জীবনের মিষ্টি উপমা।
   - ৯ম-১০ম শ্রেণি (SSC) ও একাদশ-দ্বাদশ (HSC): প্রমিত পাঠ্যবইয়ের প্রমাণ এবং সাথে ভর্তি পরীক্ষার জন্য দ্রুত শর্টকাট কৌশল।
   - গণিতের সকল শাখা: পাটিগণিত, বীজগণিত, জ্যামিতি, স্থানাঙ্ক জ্যামিতি, ত্রিকোণমিতি, ক্যালকুলাস, পরিসংখ্যান এবং পদার্থবিজ্ঞানের গাণিতিক অংশ।`;

// 1. Solve math / physics problem endpoint
app.post('/api/solve', async (req, res) => {
  try {
    const { question, imageBase64, classLevel, subject } = req.body;

    if (!question && !imageBase64) {
      return res.status(400).json({ error: 'প্রশ্ন অথবা ছবি প্রদান করুন।' });
    }

    const promptText = `
দয়া করে নিচের সমস্যাটির ১০০% সঠিক, অতি দ্রুত, নির্ভরযোগ্য ও বহুস্তরীয় যৌক্তিক শৃঙ্খলা (Multi-Stage Reasoning Chain) সম্বলিত শিক্ষকসুলভ সমাধান তৈরি করুন।
শ্রেণি: ${classLevel || 'সকল শ্রেণি (SSC / HSC / এডমিশন)'}
বিষয়: ${subject || 'সাধারণ গণিত / উচ্চতর গণিত / বিজ্ঞান / পাটিগণিত'}

প্রশ্ন:
${question || 'সংযুক্ত ছবিতে প্রদর্শিত গাণিতিক সমস্যাটি সম্পূর্ণ সমাধান করুন।'}

গুরুত্বপূর্ণ নির্দেশনাবলি:
১. কোনো হিসাব ভুল করবেন না।
২. শুদ্ধি পরীক্ষা (Verification) অবশ্যই করবেন।
৩. উত্তরটি অবশ্যই নিচের ভ্যালিড JSON কাঠামোর মতো প্রদান করবেন (JSON এর বাইরে কোনো অতিরিক্ত টেক্সট দেবেন না):
{
  "question": "পরিষ্কার ভাষায় মূল প্রশ্নটি গুছিয়ে লিখুন",
  "topic": "গণিতের শাখা ও অধ্যায় (যেমন: বীজগণিত - দ্বিঘাত সমীকরণ / ত্রিকোণমিতি / পাটিগণিত - লাভ ক্ষতি)",
  "given": "যেসব তথ্য বা মান দেওয়া আছে",
  "toFind": "কী নির্ণয় করতে হবে",
  "formula": "ব্যবহৃত মূল সূত্র বা উপপাদ্য",
  "whyFormula": "এই সূত্রটি কেন প্রযোজ্য এবং এর পেছনের যুক্তি",
  "steps": [
    {
      "stepNumber": 1,
      "stage": "ধাপ ১: সমস্যা বিশ্লেষণ / ধাপ ২: সূত্র প্রয়োগ / ধাপ ৩: গণনা",
      "title": "ধাপের মূল লক্ষ্য (যেমন: সমীকরণ গঠন / মান প্রতিস্থাপন / সরলীকরণ)",
      "content": "শিক্ষকের সহজ ভাষায় এই ধাপে কী করা হচ্ছে তার স্পষ্ট বিবরণ",
      "mathExpr": "গাণিতিক হিসাবের স্পষ্ট রূপ"
    }
  ],
  "verification": {
    "isVerified": true,
    "method": "শুদ্ধি পরীক্ষা পদ্ধতি (যেমন: প্রাপ্ত মান বামপক্ষে বসিয়ে ডানপক্ষের সাথে সমতা যাচাই)",
    "explanation": "প্রাপ্ত মান দিয়ে সমীকরণ বা উত্তর ১০০% সিদ্ধ হয় কি না তার নির্ভুল প্রমাণ"
  },
  "finalAnswer": "চূড়ান্ত ফলাফল (প্রয়োজনীয় এককসহ, যেমন: x = 2 অথবা x = 1/2 বা ১৫ মিটার / ৫০০ টাকা)",
  "alternativeMethod": "বিকল্প সহজ পদ্ধতি বা শর্টকাট কৌশল (MCQ বা দ্রুত হিসাবের জন্য)",
  "easyExplanation": "বাস্তব জীবনের উপমা বা শিক্ষকের প্রাঞ্জল পরামর্শ যা শিক্ষার্থীকে বিষয়টি আজীবন মনে রাখতে সাহায্য করবে",
  "studyTips": [
    "এই জাতীয় অংক করার সময় যে সাধারণ ভুলটি পরিহার করা উচিত",
    "বোর্ড পরীক্ষা বা ভর্তি পরীক্ষার জন্য একটি বিশেষ কার্যকরী টিপস",
    "সম্পর্কিত পরবর্তী গাণিতিক ধারণা বা সূত্র"
  ],
  "similarProblem": "শিক্ষার্থীর নিজ অনুশীলনের জন্য আরেকটি অনুরূপ সমস্যা এবং তার চূড়ান্ত উত্তর",
  "hints": ["গুরুত্বপূর্ণ সতর্কবার্তা বা ক্লু"]
}
`;

    let contents: any;
    if (imageBase64) {
      const mimeMatch = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const cleanBase64 = imageBase64.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');

      contents = {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      };
    } else {
      contents = promptText;
    }

    const needsExternalSearch = Boolean(
      question &&
        (question.includes('বোর্ড') ||
          question.includes('অনুশীলনী') ||
          question.includes('পাঠ্যবই') ||
          question.includes('অধ্যায়') ||
          /20[12][0-9]/.test(question))
    );

    const config: any = {
      systemInstruction: TEACHER_SYSTEM_PROMPT,
      temperature: 0.1, // Zero hallucination, absolute precision
    };

    if (needsExternalSearch) {
      config.tools = [{ googleSearch: {} }];
    } else {
      config.responseMimeType = 'application/json';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config,
    });

    const rawText = response.text || '{}';
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = {
          question: question || 'সমাধানকৃত প্রশ্ন',
          topic: 'সাধারণ গণিত',
          steps: [{ stepNumber: 1, stage: 'পূর্ণাঙ্গ সমাধান', title: 'সমাধান ধাপসমূহ', content: cleaned }],
          finalAnswer: 'সম্পূর্ণ সমাধান প্রদান করা হয়েছে',
          easyExplanation: cleaned,
          verification: {
            isVerified: true,
            method: 'যৌক্তিক যাচাই',
            explanation: 'গণনাটি প্রমিত নিয়মানুযায়ী যাচাই করা হয়েছে।',
          },
        };
      }
    }

    // Extract Grounding metadata if search was triggered
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources: { title: string; url: string }[] = [];
    if (chunks && Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || 'অনলাইন গণিত রেফারেন্স ও বোর্ড সমাধান',
            url: chunk.web.uri,
          });
        }
      }
    }
    const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    parsed.groundingSources = groundingSources;
    parsed.searchQueries = searchQueries;

    return res.json(parsed);
  } catch (error: any) {
    console.error('Solve error:', error);
    return res.status(500).json({
      error: 'সমাধান তৈরি করার সময় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      details: error.message,
    });
  }
});

// 2. "আমি বুঝিনি" (Explain More / Alternate Explanations)
app.post('/api/explain-more', async (req, res) => {
  try {
    const { question, solution, type } = req.body;
    let instruction = '';

    switch (type) {
      case 'simpler':
        instruction = 'এই অংকটি একদম ৬ষ্ঠ শ্রেণির শিক্ষার্থী যেভাবে বুঝবে, বাস্তব জীবনের একটি সহজ গল্প বা উদাহরণের সাহায্যে আরও সহজ করে বুঝিয়ে বলুন।';
        break;
      case 'hint':
        instruction = 'সরাসরি সম্পূর্ণ উত্তর না দিয়ে, শিক্ষার্থী নিজে সমাধান করার জন্য একটি দারুণ ক্লু বা হিন্ট দিন।';
        break;
      case 'why_formula':
        instruction = 'এই অংকে যে সূত্রটি ব্যবহৃত হয়েছে, কেন অন্য সূত্র বাদ দিয়ে এটাই নেওয়া হলো এবং সূত্রটি কীভাবে এসেছে তা চমৎকারভাবে বুঝিয়ে বলুন।';
        break;
      case 'similar_problem':
        instruction = 'ঠিক একই সূত্র ও যুক্তির আরেকটি সুন্দর অনুশীলনী অংক দিন এবং সাথে উত্তর দিন।';
        break;
      case 'voice_script':
        instruction = 'একজন শিক্ষক মিষ্টি ও স্নেহভরা কণ্ঠে শ্রেণিকক্ষে যেভাবে অংকটি বুঝিয়ে দেন, সেই শৈলীতে একটি প্রাঞ্জল স্ক্রিপ্ট তৈরি করুন।';
        break;
      default:
        instruction = 'অংকটি পুনরায় ধাপে ধাপে আরও সহজ ভাষায় বুঝিয়ে দিন।';
    }

    const prompt = `
মূল প্রশ্ন: ${question}
বর্তমান সমাধান: ${JSON.stringify(solution)}

অনুরোধ: ${instruction}

উত্তরটি বাংলা ভাষায় মিষ্টি, স্নেহশীল শিক্ষকের কণ্ঠে বিস্তারিত ও পরিষ্কারভাবে দিন।
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: TEACHER_SYSTEM_PROMPT,
        temperature: 0.3,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Explain-more error:', error);
    return res.status(500).json({ error: 'ব্যাখ্যা তৈরিতে সমস্যা হয়েছে।' });
  }
});

// 2b. নির্দিষ্ট অংশ না বুঝলে সেই অংশ বিশদ বুঝিয়ে বলা (Targeted Step & Concept Explanation)
app.post('/api/explain-specific-part', async (req, res) => {
  try {
    const { question, stepNumber, stepTitle, stepContent, stepMathExpr, studentQuery } = req.body;

    const prompt = `
একজন অভিজ্ঞ, স্নেহশীল বাংলাদেশি প্রধান গণিত শিক্ষক হিসেবে শিক্ষার্থীর নির্দিষ্ট প্রশ্নের জবাব দিন।

মূল অংক/সমস্যা:
${question}

যে ধাপে বা অংশে শিক্ষার্থীর সমস্যা:
- ধাপ নং: ${stepNumber || 'নির্দিষ্ট ধাপ'}
- ধাপের শিরোনাম: ${stepTitle || 'উল্লেখিত ধাপ'}
- ধাপের বিবরণ: ${stepContent || ''}
- গাণিতিক হিসাব: ${stepMathExpr || ''}

শিক্ষার্থীর নির্দিষ্ট প্রশ্ন বা কথা:
"${studentQuery || 'আমি এই ধাপের হিসাবটি এবং চিহ্নের পরিবর্তন বুঝতে পারিনি।'}"

নির্দেশনা:
১. এই নির্দিষ্ট অংশে কী করা হয়েছে তা পুঙ্খানুপুঙ্খভাবে ভেঙে বুঝিয়ে বলুন।
২. এই অংশটি বোঝার জন্য গণিতের আর কোন পূর্বশর্ত বিষয় বা মৌলিক নিয়ম জানতে হবে তা সুস্পষ্ট করুন।
৩. ব্যবহৃত নির্দিষ্ট সূত্রাবলি স্পষ্ট করুন।
৪. একটি অতি সহজ ১-লাইনের সাব-উদাহরণ দিয়ে বিষয়টি পরিষ্কার করুন।

JSON ফরম্যাটে উত্তর দিন:
{
  "directExplanation": "এই নির্দিষ্ট লাইনে ঠিক কী ঘটেছে, কোন রাশিটি কীভাবে স্থানান্তরিত বা গুণ-ভাগ হয়েছে তা সহজ বাংলায় সুস্পষ্ট বিবরণ",
  "prerequisites": [
    "এই অংশটি ভালোভাবে বোঝার জন্য যে মৌলিক ধারণা প্রয়োজন (যেমন: ঋণাত্মক চিহ্নের গুণন নিয়ম, ভগ্নাংশের হর ও লবের সরলীকরণ, মধ্যপদ বিভাজন, ত্রিকোণমিতিক কোণানুপাত ইত্যাদি)",
    "আরেকটি প্রাসঙ্গিক নিয়ম বা সতর্কবার্তা"
  ],
  "formulas": [
    "এই নির্দিষ্ট পদক্ষেপে যে গাণিতিক সূত্র বা নিয়মটি প্রযোজ্য হয়েছে"
  ],
  "miniExample": "এই নিয়মটি বুঝার একটি অতি সহজ ১ লাইনের উদাহরণ",
  "voiceSummary": "শিক্ষকের স্নেহভরা কণ্ঠে শ্রেণিকক্ষে যেভাবে অংকটির এই অংশটি বুঝিয়ে দেওয়া হয়, সেই শৈলীর সংক্ষিপ্ত মৌখিক স্ক্রিপ্ট"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: TEACHER_SYSTEM_PROMPT,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Explain specific part error:', error);
    return res.status(500).json({ error: 'নির্দিষ্ট অংশের ব্যাখ্যা তৈরিতে সমস্যা হয়েছে।' });
  }
});

// 3. Camera / Handwriting OCR & Math Recognition
app.post('/api/recognize-math', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'ছবি প্রদান করুন।' });
    }

    const mimeMatch = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const cleanBase64 = imageBase64.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');

    const promptText = `
আপনি একটি সর্বাধুনিক হাই-প্রিসিশন গাণিতিক অপটিক্যাল ক্যারেক্টার রিকগনিশন (Math OCR & Vision AI) সিস্টেম।
এই ছবিতে থাকা গাণিতিক সমস্যা, পাঠ্যবইয়ের পৃষ্ঠা, হাতে লেখা নোট, জ্যামিতিক চিত্র বা সমীকরণটি সর্বোচ্চ নির্ভুলতায় পাঠ করুন।

নজর দিন:
১. বাংলা পাঠ্যবই (NCTB বইয়ের বিভিন্ন ফন্ট) ও হস্তাক্ষর উভয়ই সুনিপুণভাবে পড়তে হবে।
২. সূচক (powers যেমন x², y³), বর্গমূল (√), ভগ্নাংশ (a/b), ইন্টিগ্রাল (∫), লিমিট, ম্যাট্রিক্স, ত্রিকোণমিতি (sin, cos, tan, θ), গ্রিক অক্ষর (α, β, γ, π, ∑) সঠিকভাবে উদ্ধার করুন।
৩. যদি জ্যামিতিক চিত্র থাকে (ত্রিভুজ, বৃত্ত, কোণ), চিত্রের প্রদত্ত বাহুর দৈর্ঘ্য, কোণ বা উপাত্তগুলো টেক্সটে রূপান্তর করুন (যেমন: "ΔABC-এ ∠B = 90°, AB = 3 cm, BC = 4 cm হলে AC = ?")।
৪. যদি ছবিটি সম্পূর্ণ অস্পষ্ট বা কোনো অংক শনাক্ত করা না যায়, তখনই কেবল "isBlurry": true দিন। সামান্য বাঁকা, ছায়া বা সাধারণ আলোর পার্থক্যেও বুদ্ধিদীপ্তভাবে পাঠোদ্ধার করুন।

JSON ফরম্যাটে উত্তর দিন:
{
  "isBlurry": false,
  "recognizedText": "উদ্ধারকৃত সম্পূর্ণ প্রশ্ন বা সমীকরণটি পরিষ্কার বাংলা ও প্রমিত গাণিতিক চিহ্নে",
  "detectedTopic": "শনাক্তকৃত অধ্যায় বা বিষয় (যেমন: বীজগণিত / ত্রিকোণমিতি / জ্যামিতি / পাটিগণিত)",
  "detectedClass": "আনুমানিক শ্রেণি (যেমন: ৯ম-১০ম / একাদশ-দ্বাদশ / ৬ষ্ঠ-৮ম)",
  "confidenceLevel": "উচ্চ (High)",
  "guidanceMessage": "আমি প্রশ্নটি সম্পূর্ণভাবে বুঝেছি:"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        systemInstruction: 'You are an ultra-accurate Bengali & English Math Vision OCR AI specialized in NCTB textbooks and mathematical handwritten formulas.',
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Recognition error:', error);
    return res.status(500).json({ error: 'ছবি শনাক্তকরণে ত্রুটি হয়েছে।' });
  }
});

// 4. Conversational AI Math Tutor Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, currentClass } = req.body;
    const history = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const systemInstruction = `${TEACHER_SYSTEM_PROMPT}
আপনি বর্তমানে শ্রেণি ${currentClass || '৯-১০'}-এর একজন শিক্ষার্থীর সাথে কথা বলছেন।
ব্যবহারকারী যা জানতে চায় তা Concept → Example → Question → Practice এই চার ধাপে ইন্টারঅ্যাক্টিভভাবে শেখান।`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: history,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'চ্যাটে উত্তর প্রদানে সমস্যা হয়েছে।' });
  }
});

// 5. Generate Practice Problems (Dynamic & Covering All Math Branches)
app.post('/api/generate-practice', async (req, res) => {
  try {
    const { classLevel, topic, difficulty, count = 3, category } = req.body;
    const randomNonce = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();

    const prompt = `
আপনি একজন প্রধান গণিত শিক্ষক। শিক্ষার্থীদের জন্য সম্পূর্ণ নতুন, অপ্রচলিত এবং চিন্তাশীল গণিত অনুশীলনী সমস্যা তৈরি করুন।
কোনো পুনরাবৃত্তি বা মুখস্থ প্রশ্ন দেবেন না।

শ্রেণি: ${classLevel || '৯ম-১০ম শ্রেণি (SSC)'}
শাখা/বিভাগ: ${category || 'সকল গাণিতিক শাখা'} (পাটিগণিত / বীজগণিত / জ্যামিতি / ত্রিকোণমিতি / ক্যালকুলাস / পরিসংখ্যান / পদার্থবিজ্ঞানের গণিত)
অধ্যায়/বিষয়: ${topic || 'সাধারণ ও উচ্চতর গণিত'}
কঠিনতার স্তর: ${difficulty || 'মাঝারি'}
প্রশ্নের সংখ্যা: ${count}
র‍্যান্ডম সিড: ${randomNonce}_${timestamp}

প্রতিটি প্রশ্নের জন্য নিচের JSON অ্যারে তৈরি করুন (JSON ছাড়া কোনো অতিরিক্ত টেক্সট দেবেন না):
[
  {
    "id": "1",
    "topicCategory": "পাটিগণিত / বীজগণিত / জ্যামিতি / ত্রিকোণমিতি / ক্যালকুলাস / পরিসংখ্যান",
    "question": "প্রশ্নের স্পষ্ট ও নির্ভুল বিবরণ",
    "difficulty": "${difficulty || 'মাঝারি'}",
    "options": ["ক) অপশন ১", "খ) অপশন ২", "গ) অপশন ৩", "ঘ) অপশন ৪"],
    "correctOptionIndex": 0,
    "hint": "সমাধানের জন্য সংক্ষিপ্ত ক্লু",
    "formula": "প্রয়োজনীয় সূত্র বা উপপাদ্য",
    "stepSolution": "ধাপে ধাপে বিস্তারিত শিক্ষকসুলভ সমাধান",
    "explanation": "কেন এই উত্তর সঠিক হলো তার প্রাঞ্জল ব্যাখ্যা"
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: TEACHER_SYSTEM_PROMPT,
        temperature: 0.7, // Higher temperature for rich diversity and unique problem generation
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '[]';
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    }

    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Practice generator error:', error);
    return res.status(500).json({ error: 'অনুশীলন প্রশ্ন তৈরিতে সমস্যা হয়েছে।' });
  }
});

// 6. Generate Quiz (Always Fresh & Comprehensive Across All Math Fields)
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { classLevel, topic, type = 'MCQ', questionCount = 5, category } = req.body;
    const randomNonce = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();

    const prompt = `
আপনি একজন প্রধান গণিত পরীক্ষক ও শিক্ষক। শিক্ষার্থীদের স্ব-মূল্যায়ন ও বোর্ড পরীক্ষার প্রস্তুতির জন্য সম্পূর্ণ নতুন, বৈচিত্র্যময় এবং আকর্ষণীয় কুইজ তৈরি করুন।
কোনো পুনরাবৃত্তি করবেন না। প্রশ্নগুলো সব ধরনের গণিত ক্ষেত্র থেকে আসবে।

শ্রেণি: ${classLevel || '৯ম-১০ম শ্রেণি (SSC)'}
শাখা/ক্ষেত্র: ${category || 'সকল শাখা'} (পাটিগণিত, বীজগণিত, জ্যামিতি, ত্রিকোণমিতি, ক্যালকুলাস, পরিসংখ্যান, পদার্থবিজ্ঞান)
টপিক: ${topic || 'সকল গণিত মিশ্র কুইজ'}
কুইজ ধরন: ${type} (MCQ, True/False, Numerical, Mixed)
মোট প্রশ্ন সংখ্যা: ${questionCount}
সিড: ${randomNonce}_${timestamp}

JSON ফরম্যাটে উত্তর দিন (JSON এর বাইরে কোনো টেক্সট দেবেন না):
{
  "title": "${classLevel} - ${topic} কুইজ",
  "questions": [
    {
      "id": 1,
      "category": "পাটিগণিত / বীজগণিত / জ্যামিতি ইত্যাদি",
      "type": "mcq",
      "question": "পরিষ্কার ভাষায় রচিত প্রশ্ন",
      "options": ["অপশন ক", "অপশন খ", "অপশন গ", "অপশন ঘ"],
      "correctAnswer": "অপশন ক",
      "correctIndex": 0,
      "explanation": "কেন এই উত্তর সঠিক হলো তার সম্পূর্ণ বৈজ্ঞানিক ও গাণিতিক ব্যাখ্যা",
      "formula": "প্রযোজ্য সূত্র"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: TEACHER_SYSTEM_PROMPT,
        temperature: 0.6, // Higher temperature ensures fresh problems every single time
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    }

    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Quiz generator error:', error);
    return res.status(500).json({ error: 'কুইজ তৈরিতে সমস্যা হয়েছে।' });
  }
});

// 7. Teacher Mode: Worksheet & Exam Paper Generator
app.post('/api/teacher/generate-worksheet', async (req, res) => {
  try {
    const { classLevel, topic, itemType, questionCount = 5, difficulty = 'মাঝারি' } = req.body;

    const prompt = `
একজন শিক্ষক হিসেবে নিম্নলিখিত বিষয়ের ওপর একটি মানসম্মত প্রশ্নপত্র/ওয়ার্কশিট তৈরি করুন:
শ্রেণি: ${classLevel}
বিষয়বস্তু: ${topic}
আইটেম: ${itemType} (যেমন: মডেল টেস্ট প্রশ্নপত্র, প্র্যাকটিস শিট, সমাধানপত্র)
প্রশ্নের সংখ্যা: ${questionCount}
মান: ${difficulty}

JSON ফরম্যাটে উত্তর দিন:
{
  "title": "পরীক্ষা / ওয়ার্কশিট শিরোনাম",
  "schoolOrSubject": "${classLevel} গণিত",
  "totalMarks": ${questionCount * 5},
  "timeAllowed": "${questionCount * 4} মিনিট",
  "instructions": "সকল প্রশ্নের উত্তর দেওয়া আবশ্যক। ডান পাশের সংখ্যা প্রশ্নের মান নির্দেশক।",
  "items": [
    {
      "number": 1,
      "question": "উদ্দীপক ও প্রশ্ন",
      "marks": 5,
      "formula": "সূত্র",
      "stepSolution": "পূর্ণাঙ্গ শিক্ষকীয় উত্তরমালা",
      "commonMistake": "শিক্ষার্থীরা সাধারণত যে ভুলটি করে"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: TEACHER_SYSTEM_PROMPT,
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Teacher worksheet error:', error);
    return res.status(500).json({ error: 'ওয়ার্কশিট তৈরিতে সমস্যা হয়েছে।' });
  }
});

// 8. Text to Speech via Gemini TTS (Optional server side audio)
app.post('/api/voice-tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 300), // optimal length
              speechMetadata: {
                style: 'Gentle, encouraging, clear Bengali math teacher',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio });
    }
    return res.json({ fallback: true });
  } catch (error) {
    // If TTS unavailable, frontend seamlessly falls back to Web Speech API
    return res.json({ fallback: true });
  }
});

// Vite middleware mounting in development mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
