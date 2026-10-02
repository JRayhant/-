import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Loader2,
  Volume2,
  Trash2,
  Bot,
  User,
  Lightbulb,
  Keyboard,
  X,
} from 'lucide-react';
import { speakText } from '../../utils/speech';
import { MathKeyboard } from '../MathKeyboard';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: number;
}

interface ChatScreenProps {
  onBack: () => void;
  onSolveQuestion: (q: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, onSolveQuestion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'model',
      text: 'আসসালামু আলাইকুম! আমি আপনার ব্যক্তিগত AI গণিত শিক্ষক। গণিতের যে বিষয়টি বুঝতে আপনার সবচেয়ে বেশি কষ্ট হয় আমাকে বলুন। আমরা Concept → Example → Question → Practice এই চার ধাপে সহজভাবে শিখব।',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const insertToken = (token: string) => {
    setInputText((prev) => prev + token);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map((m) => ({ sender: m.sender, text: m.text })),
          currentClass: '৯-১০',
        }),
      });

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'model',
        text: data.text || 'ধন্যবাদ! বিষয়টি নিয়ে আমরা পরের ধাপে যাই।',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'model',
          text: 'উত্তরে একটু বিলম্ব হচ্ছে। দয়া করে আবার প্রশ্ন করুন।',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'model',
        text: 'চ্যাট মুছে ফেলা হয়েছে। গণিত বা পদার্থবিজ্ঞানের যেকোনো নতুন টপিক নিয়ে প্রশ্ন করতে পারেন।',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[750px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          পিছনে
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">AI Math Chat</h2>
          <span className="text-[11px] text-slate-500">শিক্ষক-শিক্ষার্থী ধারাবাহিক কথোপকথন</span>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          title="চ্যাট মুছুন"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed font-sans shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none space-y-1'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {!isUser && (
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Volume2 className="w-3 h-3" />
                      শুনুন
                    </button>
                    <span>গণিত গুরু</span>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="h-7 w-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-9">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            শিক্ষক লিখছেন...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chat Starters */}
      <div className="py-1 px-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {[
          'ভগ্নাংশ আমাকে বাস্তব উদাহরণের গল্পে বুঝান',
          'দ্বিঘাত সমীকরণ কীভাবে চিনব?',
          'ত্রিকোণমিতিক sin ও cos কেন ব্যবহার হয়?',
        ].map((starter, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(starter)}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg whitespace-nowrap shrink-0 shadow-2xs"
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Quick Math Tokens Bar */}
      <div className="pt-1 px-1 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setShowKeyboard(!showKeyboard)}
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 shrink-0 border ${
            showKeyboard
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="ম্যাথ কিবোর্ড"
        >
          <Keyboard className="w-3 h-3" />
          <span>কিবোর্ড</span>
        </button>

        {[
          { label: 'x²', insert: '²' },
          { label: 'xⁿ', insert: 'ⁿ' },
          { label: '√x', insert: '√' },
          { label: 'a/b', insert: ' (a)/(b) ' },
          { label: 'π', insert: 'π' },
          { label: 'θ', insert: 'θ' },
          { label: '±', insert: '±' },
          { label: '≤', insert: '≤' },
          { label: '≥', insert: '≥' },
          { label: '≠', insert: '≠' },
        ].map((tk, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => insertToken(tk.insert)}
            className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 rounded-md text-[11px] font-math font-semibold shrink-0"
          >
            {tk.label}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="pt-1 border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs focus-within:border-emerald-500"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="আপনার প্রশ্নটি শিক্ষককে লিখুন (x², √x, a/b দ্রুত যোগ করুন)..."
            className="flex-1 px-2.5 py-1 text-xs text-slate-900 focus:outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Math Keyboard Drawer for Chat */}
      {showKeyboard && (
        <div className="pt-1 shrink-0 animate-in fade-in duration-100">
          <MathKeyboard
            onInsert={insertToken}
            onBackspace={() => setInputText((prev) => prev.slice(0, -1))}
            onClear={() => setInputText('')}
            onEnter={() => handleSendMessage()}
            onClose={() => setShowKeyboard(false)}
          />
        </div>
      )}
    </div>
  );
};
