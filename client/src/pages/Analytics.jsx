import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CategoryPieChart from '../components/CategoryPieChart';
import ExpenseBarChart from '../components/ExpenseBarChart';
import CategoryBadge from '../components/CategoryBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { PieChart as PieIcon, BarChart3, Flame, Award, RefreshCw, Zap } from 'lucide-react';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await API.get('/transactions/summary');
      setSummary(res.data);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to load analytics data',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header & Refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Financial Analytics Suite
                </h1>
                <button
                  onClick={() => fetchAnalytics(true)}
                  disabled={refreshing}
                  className="p-1.5 rounded-xl glass-card text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-all"
                  title="Refresh Analytics Data"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Visual insights into spending patterns, category breakdowns, and monthly cashflows
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-bold text-indigo-400 border border-indigo-500/20">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Interactive Charting Active
              </span>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Generating animated chart visualizations..." />
          ) : (
            <>
              {/* Highlight Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Highest Expense Category */}
                <div className="p-5 rounded-3xl glass-card hover-card-zoom flex items-center gap-4 shadow-xl border border-rose-500/20">
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30 shrink-0">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Top Spending Category
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {summary?.highestCategory?.category || 'None'}
                      </h3>
                      {summary?.highestCategory?.category !== 'None' && (
                        <CategoryBadge category={summary.highestCategory.category} size="small" />
                      )}
                    </div>
                    <p className="text-xs text-rose-400 font-bold mt-0.5">
                      ₹{Number(summary?.highestCategory?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} spent total
                    </p>
                  </div>
                </div>

                {/* Savings Efficiency */}
                <div className="p-5 rounded-3xl glass-card hover-card-zoom flex items-center gap-4 shadow-xl border border-emerald-500/20">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Savings Efficiency Rate
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {summary?.savingsPercentage || 0}%
                    </h3>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">
                      ₹{Number(summary?.savings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} saved out of total income
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Monthly Income vs Expense */}
                <div className="glass-card rounded-3xl p-6 shadow-xl flex flex-col justify-between hover-card-zoom">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-400" /> Monthly Cashflow Dynamics
                      </h2>
                      <p className="text-xs text-slate-400">Income inflows vs spending outflows per month</p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Bar Analytics
                    </span>
                  </div>
                  <ExpenseBarChart monthlyTrend={summary?.monthlyTrend || {}} />
                </div>

                {/* Pie Chart: Category Spending */}
                <div className="glass-card rounded-3xl p-6 shadow-xl flex flex-col justify-between hover-card-zoom">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <PieIcon className="w-4 h-4 text-purple-400" /> Category Breakdown
                      </h2>
                      <p className="text-xs text-slate-400">Distribution of expenditure across categories</p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Doughnut Chart
                    </span>
                  </div>
                  <CategoryPieChart data={summary?.categoryBreakdown || {}} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
