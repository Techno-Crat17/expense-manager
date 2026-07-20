import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import API from '../services/api';

const MarketTicker = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const res = await API.get('/stocks/quotes');
      setQuotes(res.data.quotes || []);
    } catch (err) {
      console.error('Ticker Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || quotes.length === 0) return null;

  return (
    <div className="w-full glass-nav py-2 px-4 text-xs overflow-hidden shadow-sm flex items-center gap-3 transition-colors">
      <div className="flex items-center gap-1.5 shrink-0 font-extrabold uppercase tracking-widest text-[10px] bg-blue-500/20 text-blue-400 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Market
      </div>

      <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 whitespace-nowrap">
        {quotes.map((q, idx) => {
          const isPositive = q.change >= 0;
          return (
            <div key={idx} className="flex items-center gap-2 font-mono text-[11px] shrink-0">
              <span className="font-bold text-slate-700 dark:text-slate-300">{q.symbol}</span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {q.currency}{q.price.toLocaleString('en-IN')}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{q.changePercent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketTicker;
