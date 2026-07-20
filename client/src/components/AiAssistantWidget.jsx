import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import API from '../services/api';

const QUICK_PROMPTS = [
  'Can I buy a PS5 next month?',
  'Give me a financial health audit score',
  'Analyze my Swiggy and food spending',
  'How to save ₹2,000 extra this month?',
  'What is SIP mutual fund investing?',
];

// Helper to format simple markdown-like text (bold, bullet points)
const formatMarkdownText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    let formattedLine = line;
    // Replace **bold** with <strong>bold</strong>
    const parts = formattedLine.split(/\*\*(.*?)\*\*/g);
    return (
      <div key={lIdx} className={line.startsWith('•') || line.startsWith('1.') ? 'pl-2 my-0.5' : 'my-0.5'}>
        {parts.map((part, pIdx) =>
          pIdx % 2 === 1 ? (
            <strong key={pIdx} className="font-extrabold text-blue-900 dark:text-blue-200">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </div>
    );
  });
};

const AiAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! 👋 I am **FinBuddy AI 2.0**, your super-intelligent student financial coach.\n\nAsk me anything about your budget, PS5 savings goal, spending habits, or financial health audit!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend = inputMessage) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await API.post('/ai/chat', { message: text });
      const aiMsg = {
        sender: 'ai',
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        sender: 'ai',
        text: 'Sorry, I encountered an issue analyzing your ledger. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        id="ai-assistant-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-white/30 ring-4 ring-purple-500/30 group cursor-pointer"
        title="Open FinBuddy AI Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-amber-300 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping"></span>
        </div>
        <span className="font-extrabold text-xs pr-1">FinBuddy AI Coach</span>
      </button>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[550px] transition-all">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide">FinBuddy AI 2.0</h3>
                <span className="text-[10px] text-blue-100 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Online • Intelligent Coach
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50 dark:bg-gray-900/40 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700/80 rounded-tl-none'
                  }`}
                >
                  <div>{formatMarkdownText(msg.text)}</div>
                  <span
                    className={`block text-[9px] mt-1.5 font-semibold text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-bold text-xs">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                <span>FinBuddy AI is computing financial intelligence...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-semibold whitespace-nowrap transition-colors border border-blue-100 dark:border-blue-900/40"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask FinBuddy AI anything..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AiAssistantWidget;
