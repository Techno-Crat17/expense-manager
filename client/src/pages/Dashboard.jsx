import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import FinancialPulseCard from '../components/FinancialPulseCard';
import ExpenseBarChart from '../components/ExpenseBarChart';
import CategoryPieChart from '../components/CategoryPieChart';
import CategoryBadge from '../components/CategoryBadge';
import TransactionFormModal from '../components/TransactionFormModal';
import SavingsGoalModal from '../components/SavingsGoalModal';
import SavingsGoalCard from '../components/SavingsGoalCard';
import BankImportModal from '../components/BankImportModal';
import AiReceiptScannerModal from '../components/AiReceiptScannerModal';
import AiForecastCard from '../components/AiForecastCard';
import MarketTicker from '../components/MarketTicker';
import StockTrackerWidget from '../components/StockTrackerWidget';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import AnimatedCounter from '../components/AnimatedCounter';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PlusCircle,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Briefcase,
  GraduationCap,
  IndianRupee,
  Target,
  Plus,
  Building2,
  Scan,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isAiScanModalOpen, setIsAiScanModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const [sumRes, goalsRes] = await Promise.all([
        API.get('/transactions/summary'),
        API.get('/goals'),
      ]);
      setSummary(sumRes.data);
      setGoals(goalsRes.data);

      if (isManualRefresh) {
        setToast({ message: 'Dashboard updated with latest insights', type: 'success' });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to load dashboard summary',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddTransaction = async (formData) => {
    await API.post('/transactions', formData);
    setToast({ message: 'Transaction recorded successfully!', type: 'success' });
    fetchDashboardData();
  };

  const handleCreateOrUpdateGoal = async (formData) => {
    if (selectedGoal) {
      await API.put(`/goals/${selectedGoal._id}`, formData);
      setToast({ message: 'Savings goal updated!', type: 'success' });
    } else {
      await API.post('/goals', formData);
      setToast({ message: 'New savings goal created!', type: 'success' });
    }
    fetchDashboardData();
  };

  const handleDepositToGoal = async (goalId, addAmount) => {
    try {
      await API.put(`/goals/${goalId}`, { addAmount });
      setToast({ message: `₹${addAmount} deposited into savings goal!`, type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setToast({ message: 'Failed to deposit funds', type: 'error' });
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to remove this goal?')) {
      try {
        await API.delete(`/goals/${goalId}`);
        setToast({ message: 'Savings goal removed', type: 'info' });
        fetchDashboardData();
      } catch (err) {
        setToast({ message: 'Failed to delete goal', type: 'error' });
      }
    }
  };

  const userStatus = summary?.userDetails?.employmentStatus || user?.employmentStatus || 'dependent';
  const rawIncomeVal = Number(summary?.userDetails?.annualIncomeOrPocketMoney || user?.annualIncomeOrPocketMoney || 0);

  const isIndependent = userStatus === 'independent';
  const annualCTC = isIndependent ? rawIncomeVal : rawIncomeVal * 12;
  const monthlyAllowance = isIndependent ? rawIncomeVal / 12 : rawIncomeVal;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Real-time Market Marquee Ticker */}
      <MarketTicker />

      <Navbar
        onOpenAddModal={() => setIsModalOpen(true)}
        onOpenBankModal={() => setIsBankModalOpen(true)}
        onOpenAiScanModal={() => setIsAiScanModalOpen(true)}
      />
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Compact Dashboard Header & Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Financial Dashboard
                </h1>
                <button
                  onClick={() => fetchDashboardData(true)}
                  disabled={refreshing}
                  className="p-1.5 rounded-xl glass-card text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-all"
                  title="Refresh Dashboard Data"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time financial analytics, budget tracking, and wealth insights
              </p>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setIsAiScanModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-card text-xs font-bold text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 transition-all shadow-sm"
              >
                <Scan className="w-3.5 h-3.5 text-purple-500 animate-pulse" /> AI Scan Bill
              </button>

              <button
                onClick={() => setIsBankModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-card text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-500/10 transition-all shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Link Bank / CSV
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Transaction
              </button>
            </div>
          </div>

          {/* AI Burn Rate Forecast & Market Watchlist */}
          <div className="space-y-6">
            <AiForecastCard />
            <StockTrackerWidget />
          </div>

          {loading ? (
            <LoadingSpinner label="Calculating interactive analytics dashboard metrics..." />
          ) : (
            <>
              {/* 📊 Animated Statistic Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-500" /> Overview Metrics
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Live Auto-Updating Summary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SummaryCard
                    title="Net Balance"
                    amount={summary?.totalBalance || 0}
                    icon={Wallet}
                    variant="blue"
                    trend="Net available balance in ₹"
                    trendType={(summary?.totalBalance || 0) >= 0 ? 'up' : 'down'}
                    subtitle="Available"
                  />
                  <SummaryCard
                    title="Total Income"
                    amount={summary?.totalIncome || 0}
                    icon={TrendingUp}
                    variant="emerald"
                    trend="Allowances, bank sync & stipends"
                    trendType="up"
                    subtitle="Inflow"
                  />
                  <SummaryCard
                    title="Total Expense"
                    amount={summary?.totalExpense || 0}
                    icon={TrendingDown}
                    variant="rose"
                    trend="Total recorded spending till date"
                    trendType="down"
                    subtitle="Outflow"
                  />
                  <SummaryCard
                    title="Total Savings"
                    amount={summary?.savings || 0}
                    icon={PiggyBank}
                    variant="amber"
                    trend={`${summary?.savingsPercentage || 0}% savings efficiency rate`}
                    trendType="up"
                    subtitle="Savings Target"
                  />
                </div>
              </div>

              {/* ⚡ Financial Health Pulse Widget */}
              <FinancialPulseCard
                summary={summary}
                userStatus={userStatus}
                rawIncomeVal={rawIncomeVal}
              />

              {/* 📈 Interactive Analytics & Charts Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Real-Time Analytics & Trend Charts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Visual comparison of monthly cash inflows vs outflows and category breakdown
                    </p>
                  </div>

                  <Link
                    to="/analytics"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Full Analytics Report →
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left (2 cols): Bar Chart */}
                  <div className="lg:col-span-2 glass-card rounded-3xl p-6 shadow-xl flex flex-col justify-between hover-card-zoom">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-emerald-500" /> Monthly Income vs Expense
                        </h3>
                        <p className="text-xs text-slate-400">Cashflow dynamics per month</p>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Historical Trend
                      </span>
                    </div>

                    <ExpenseBarChart monthlyTrend={summary?.monthlyTrend || {}} />
                  </div>

                  {/* Right (1 col): Doughnut Category Pie Chart */}
                  <div className="glass-card rounded-3xl p-6 shadow-xl flex flex-col justify-between hover-card-zoom">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <PieIcon className="w-4 h-4 text-purple-500" /> Category Breakdown
                        </h3>
                        <p className="text-xs text-slate-400">Distribution of total spending</p>
                      </div>
                    </div>

                    <CategoryPieChart data={summary?.categoryBreakdown || {}} />
                  </div>
                </div>
              </div>

              {/* 🎯 Savings Wishlist Targets */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Savings Goals & Wishlist Tracker
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Set and fund target savings for gadgets, trips, or emergency funds
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedGoal(null); setIsGoalModalOpen(true); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" /> New Wishlist Goal
                  </button>
                </div>

                {goals.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.map((goal) => (
                      <SavingsGoalCard
                        key={goal._id}
                        goal={goal}
                        onDeposit={handleDepositToGoal}
                        onDelete={handleDeleteGoal}
                        onEdit={(g) => { setSelectedGoal(g); setIsGoalModalOpen(true); }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 glass-card rounded-3xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No Active Savings Goals
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Create goals to save up for a PS5, new phone, laptop, or dream vacation!
                    </p>
                    <button
                      onClick={() => { setSelectedGoal(null); setIsGoalModalOpen(true); }}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Create First Goal
                    </button>
                  </div>
                )}
              </div>

              {/* 🧾 Recent Transactions Activity Feed */}
              <div className="glass-card rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Recent Transactions Activity
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your latest income, spending entries, and bank imports
                    </p>
                  </div>
                  <Link
                    to="/transactions"
                    className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All Transactions →
                  </Link>
                </div>

                {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {summary.recentTransactions.map((tx) => (
                      <div
                        key={tx._id}
                        className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-2xl transition-all duration-200"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`p-3 rounded-2xl ${
                              tx.type === 'income'
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            }`}
                          >
                            {tx.type === 'income' ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {tx.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <CategoryBadge category={tx.category} size="small" />
                              <span className="text-xs text-slate-400">
                                {new Date(tx.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-base font-black ${
                            tx.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}₹
                          {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                      <Receipt className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No Recent Activity Found
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Record your expenses, income, or link your bank account to see your financial analytics.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2.5">
                      <button
                        onClick={() => setIsBankModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all"
                      >
                        <Building2 className="w-4 h-4 text-emerald-500" /> Link Bank
                      </button>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Transaction
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Manual Entry Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
      />

      {/* Savings Goal Modal */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => { setIsGoalModalOpen(false); setSelectedGoal(null); }}
        onSubmit={handleCreateOrUpdateGoal}
        initialData={selectedGoal}
      />

      {/* Bank Import Modal */}
      <BankImportModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onImportSuccess={fetchDashboardData}
      />

      {/* AI Receipt Scanner Modal */}
      <AiReceiptScannerModal
        isOpen={isAiScanModalOpen}
        onClose={() => setIsAiScanModalOpen(false)}
        onScanSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
