import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, LineChart, RefreshCw } from 'lucide-react';
import API from '../services/api';

const DEFAULT_STOCKS = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'TATAMOTORS.NS', 'AAPL'];

const StockTrackerWidget = () => {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInitialStocks = async () => {
    try {
      setLoading(true);
      const promises = DEFAULT_STOCKS.map((s) => API.get(`/stocks/search/${s}`));
      const results = await Promise.all(promises);
      setStocks(results.map((r) => r.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialStocks();
  }, []);

  const handleSearchStock = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      setSearchResult(null);
      const res = await API.get(`/stocks/search/${searchQuery.trim()}`);
      setSearchResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 glass-card shadow-xl hover-card-zoom space-y-4 relative overflow-hidden flex flex-col justify-between">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-400" /> Real-Time Stock Watchlist
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Live prices & portfolio quotes (NSE/BSE & US Markets)
          </p>
        </div>

        {/* Search Stock Input */}
        <form onSubmit={handleSearchStock} className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticker (e.g. TCS, AAPL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-44 pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md disabled:opacity-50 shrink-0"
          >
            {searching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {/* Searched Result Preview */}
      {searchResult && (
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Search Result</span>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{searchResult.name} ({searchResult.symbol})</h4>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-black text-slate-900 dark:text-white block">
              {searchResult.currency}{searchResult.price.toLocaleString('en-IN')}
            </span>
            <span className={`block text-[11px] font-bold ${searchResult.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {searchResult.change >= 0 ? '+' : ''}{searchResult.changePercent}%
            </span>
          </div>
        </div>
      )}

      {/* Stock Cards Grid - Responsive columns with proper spacing */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
          <span>Fetching live market quotes...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {stocks.map((stk, i) => {
            const isPos = stk.change >= 0;
            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white/30 dark:bg-slate-800/40 border border-white/20 dark:border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-sm min-w-0"
              >
                <div className="min-w-0 mb-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white block truncate">{stk.symbol}</span>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5" title={stk.name}>{stk.name}</span>
                </div>
                <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/10">
                  <span className="text-sm font-black text-slate-900 dark:text-white whitespace-nowrap">
                    {stk.currency}{stk.price.toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                      isPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPos ? '+' : ''}{stk.changePercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockTrackerWidget;
