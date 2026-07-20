import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MarketTicker from '../components/MarketTicker';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  PieChart,
  ShieldCheck,
  Building,
  Coins,
  DollarSign,
  Landmark,
  X,
  Sparkles,
} from 'lucide-react';

const ASSET_TYPES = [
  { id: 'stock', name: 'Indian / US Stocks', icon: TrendingUp, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  { id: 'mutual_fund', name: 'Mutual Funds / SIP', icon: PieChart, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
  { id: 'fd', name: 'Fixed Deposits / FDs', icon: Landmark, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  { id: 'gold', name: 'Gold / SGB Bonds', icon: Coins, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { id: 'real_estate', name: 'Real Estate / Property', icon: Building, color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
  { id: 'crypto', name: 'Crypto & Digital Assets', icon: DollarSign, color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
];

const AssetManagement = () => {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState({ assets: [], summary: {} });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    assetType: 'stock',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
    notes: '',
  });

  const [toast, setToast] = useState(null);

  const fetchAssetData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assets');
      setData(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load portfolio assets', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetData();
  }, []);

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.buyPrice) {
      setToast({ message: 'Please enter Name, Quantity, and Buy Price', type: 'error' });
      return;
    }

    try {
      await API.post('/assets', formData);
      setToast({ message: 'Asset added to portfolio successfully!', type: 'success' });
      setIsAddModalOpen(false);
      setFormData({ name: '', symbol: '', assetType: 'stock', quantity: '', buyPrice: '', currentPrice: '', notes: '' });
      fetchAssetData();
    } catch (err) {
      setToast({ message: 'Failed to add asset', type: 'error' });
    }
  };

  const handleDeleteAsset = async (id) => {
    if (window.confirm('Are you sure you want to remove this asset from your portfolio?')) {
      try {
        await API.delete(`/assets/${id}`);
        setToast({ message: 'Asset removed from portfolio', type: 'info' });
        fetchAssetData();
      } catch (err) {
        setToast({ message: 'Failed to delete asset', type: 'error' });
      }
    }
  };

  const { assets, summary } = data;
  const isPositiveReturn = (summary?.totalProfitLoss || 0) >= 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <MarketTicker />
      <Navbar />
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
                <Briefcase className="w-4 h-4 text-blue-400" /> Multi-Asset & Stock Portfolio
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Asset Management & Net Worth
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track Indian & US stocks, Mutual Funds, SGB Gold, and Fixed Deposits
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Asset / Holding
            </button>
          </div>

          {loading ? (
            <LoadingSpinner label="Calculating Net Worth & Stock Holdings..." />
          ) : (
            <>
              {/* Executive Net Worth Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl border border-indigo-500/30 space-y-6 hover-card-zoom relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Total Investment Portfolio Valuation
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                      ₹{(summary?.totalCurrentValue || 0).toLocaleString('en-IN')}
                    </h2>
                  </div>

                  <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Invested Capital</span>
                      <span className="text-lg font-black text-slate-200">
                        ₹{(summary?.totalInvested || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Total Returns (P&L)</span>
                      <span className={`text-lg font-black flex items-center gap-1 ${isPositiveReturn ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositiveReturn ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositiveReturn ? '+' : ''}₹{(summary?.totalProfitLoss || 0).toLocaleString('en-IN')} ({summary?.returnPercentage || 0}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Asset Allocation Pill Grid */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs relative z-10">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Equities / Stocks</span>
                    <span className="font-extrabold text-blue-300">₹{(summary?.allocation?.stock || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Mutual Funds / SIP</span>
                    <span className="font-extrabold text-purple-300">₹{(summary?.allocation?.mutual_fund || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Fixed Deposits (FD)</span>
                    <span className="font-extrabold text-emerald-300">₹{(summary?.allocation?.fd || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Gold & SGB Bonds</span>
                    <span className="font-extrabold text-amber-300">₹{(summary?.allocation?.gold || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Asset List Grid */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Portfolio Holdings ({assets.length} items)
                </h2>

                {assets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assets.map((item) => {
                      const investedVal = Number(item.quantity || 1) * Number(item.buyPrice || 0);
                      const currentVal = Number(item.quantity || 1) * Number(item.currentPrice || item.buyPrice || 0);
                      const pnl = currentVal - investedVal;
                      const pnlPct = investedVal > 0 ? (pnl / investedVal) * 100 : 0;
                      const isPos = pnl >= 0;

                      const typeConfig = ASSET_TYPES.find((t) => t.id === item.assetType) || ASSET_TYPES[0];
                      const IconComp = typeConfig.icon;

                      return (
                        <div
                          key={item._id}
                          className="glass-card rounded-3xl p-5 shadow-xl border border-white/20 dark:border-white/10 space-y-4 hover-card-zoom flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-2xl border ${typeConfig.color}`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                                  {item.name}
                                </h3>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {item.symbol || item.assetType} • Qty: {item.quantity}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteAsset(item._id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Asset"
                              aria-label="Delete Asset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Valuation</span>
                              <span className="text-base font-black text-slate-900 dark:text-white">
                                ₹{currentVal.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">P&L Returns</span>
                              <span className={`font-black text-sm ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPos ? '+' : ''}₹{pnl.toLocaleString('en-IN')} ({pnlPct.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-white/20 dark:border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">No portfolio assets added</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Build your wealth portfolio by adding stocks, mutual funds, gold bonds, or fixed deposits.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all mt-2"
                    >
                      <Plus className="w-4 h-4" /> Add Asset Holding
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
          <div className="glass-modal rounded-3xl shadow-2xl w-full max-w-md border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Asset to Portfolio</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Motors / Nifty 50 Index / HDFC FD"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Ticker / Symbol</label>
                  <input
                    type="text"
                    placeholder="TATAMOTORS.NS"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Asset Type</label>
                  <select
                    value={formData.assetType}
                    onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:outline-none"
                  >
                    {ASSET_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Quantity *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="10"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Buy Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="950"
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Current Market Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Leave blank to match buy price"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all mt-2 cursor-pointer"
              >
                Save Holding to Portfolio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
