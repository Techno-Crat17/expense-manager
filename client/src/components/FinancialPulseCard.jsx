import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import {
  Activity,
  Flame,
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  PieChart,
} from 'lucide-react';

const FinancialPulseCard = ({ summary, userStatus, rawIncomeVal }) => {
  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const netCashflow = summary?.totalBalance || 0;
  const savingsRate = Number(summary?.savingsPercentage || 0);
  const highestCategory = summary?.highestCategory?.category || 'None';
  const highestCatAmt = summary?.highestCategory?.amount || 0;

  // Calculate approximate daily average spend (assuming 30 days)
  const dailyAvgSpend = Math.round(totalExpense / 30);

  // Calculate budget utilization percentage based on user status
  const monthlyBudget = userStatus === 'independent' ? rawIncomeVal / 12 : rawIncomeVal;
  const budgetUsedPct = monthlyBudget > 0 ? Math.min(Math.round((totalExpense / monthlyBudget) * 100), 100) : 0;

  return (
    <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5 animate-pulse text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Financial Health Pulse</h3>
              <p className="text-xs text-indigo-200/70">Real-time spending analysis & cashflow metrics</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Healthy
          </span>
        </div>

        {/* 4 Pulse Grid Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Net Cash Flow */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Net Cash Flow
            </span>
            <div className="mt-1 text-lg font-black text-white">
              <AnimatedCounter value={netCashflow} prefix="₹" decimals={2} />
            </div>
            <span className={`text-[10px] font-bold ${netCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netCashflow >= 0 ? '+ Positive Surplus' : '- Deficit Alert'}
            </span>
          </div>

          {/* Daily Average Spend */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Daily Burn Rate
            </span>
            <div className="mt-1 text-lg font-black text-amber-300">
              <AnimatedCounter value={dailyAvgSpend} prefix="₹" decimals={0} />
              <span className="text-xs font-normal text-slate-400">/day</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Estimated 30-day avg</span>
          </div>

          {/* Top Spending Category */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Top Spend Category
            </span>
            <div className="mt-1 text-lg font-black text-rose-300 truncate">
              {highestCategory}
            </div>
            <span className="text-[10px] font-bold text-rose-400/90">
              ₹{Number(highestCatAmt).toLocaleString('en-IN')} total
            </span>
          </div>

          {/* Savings Rate */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5 text-blue-400" /> Savings Efficiency
            </span>
            <div className="mt-1 text-lg font-black text-blue-300">
              <AnimatedCounter value={savingsRate} prefix="" suffix="%" decimals={1} />
            </div>
            <span className="text-[10px] font-bold text-blue-400">Target: 20% +</span>
          </div>
        </div>

        {/* Budget Meter Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Monthly Budget Utilization
            </span>
            <span className="font-bold text-indigo-300">
              {budgetUsedPct}% of ₹{Math.round(monthlyBudget).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                budgetUsedPct > 90
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : budgetUsedPct > 70
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(budgetUsedPct, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPulseCard;
