import React, { useState, useEffect } from 'react';
import { Flame, AlertTriangle, CheckCircle2, Sparkles, Bot, ArrowRight } from 'lucide-react';
import API from '../services/api';

const AiForecastCard = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const res = await API.get('/ai/forecast-burnrate');
      setForecast(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  if (loading || !forecast) return null;

  return (
    <div className="p-5 sm:p-6 rounded-3xl glass-card hover-card-zoom flex flex-col justify-between space-y-4 border border-amber-500/30 shadow-2xl relative overflow-hidden">
      {/* Ambient Glow Backdrop */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-purple-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Section: Icon & AI Burn Pace */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 shadow-inner">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Burn-Rate Predictor
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              Pace: <span className="text-amber-400 font-black">₹{forecast.dailyBurnRate}/day</span>
            </h3>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border ${
          forecast.isOverbudget
            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        }`}>
          {forecast.isOverbudget ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          {forecast.isOverbudget ? 'Overbudget Alert' : 'Safe Zone'}
        </span>
      </div>

      {/* Middle Section: AI Advice Text */}
      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed relative z-10 bg-white/30 dark:bg-slate-900/40 p-3 rounded-2xl border border-white/10">
        {forecast.aiRecommendation}
      </p>

      {/* Bottom Section: Projected Total & Prominent Ask AI Coach Button */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 relative z-10 flex-wrap">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Projected Month End</span>
          <span className={`text-base font-black ${forecast.isOverbudget ? 'text-rose-400' : 'text-emerald-400'}`}>
            ₹{forecast.projectedMonthlyExpense.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('ai-assistant-toggle');
            if (el) el.click();
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/30 border border-purple-400/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>Ask AI Coach</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    </div>
  );
};

export default AiForecastCard;
