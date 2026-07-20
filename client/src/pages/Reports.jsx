import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CategoryBadge from '../components/CategoryBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import {
  Printer,
  FileText,
  Download,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Briefcase,
  GraduationCap,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

const Reports = () => {
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [assetSummary, setAssetSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [presetPeriod, setPresetPeriod] = useState('all');

  const [toast, setToast] = useState(null);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [sumRes, txRes, astRes] = await Promise.all([
        API.get('/transactions/summary'),
        API.get('/transactions'),
        API.get('/assets').catch(() => ({ data: { summary: {} } })),
      ]);
      setSummary(sumRes.data);
      setTransactions(txRes.data);
      setAssetSummary(astRes.data?.summary || null);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to generate financial report',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handlePresetChange = (preset) => {
    setPresetPeriod(preset);
    const now = new Date();

    if (preset === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      setStartDate(firstDay);
      setEndDate(lastDay);
    } else if (preset === 'last_30_days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
      setStartDate(thirtyDaysAgo);
      setEndDate(new Date().toISOString().split('T')[0]);
    } else if (preset === 'fy_2025_2026') {
      setStartDate('2025-04-01');
      setEndDate('2026-03-31');
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  // Filter transactions based on date selections
  const filteredTransactions = transactions.filter((t) => {
    const txDate = new Date(t.date).toISOString().split('T')[0];
    if (startDate && txDate < startDate) return false;
    if (endDate && txDate > endDate) return false;
    return true;
  });

  // Calculate filtered income & expense totals
  const filteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const filteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const filteredSavings = filteredIncome - filteredExpense;
  const filteredSavingsPct = filteredIncome > 0 ? ((filteredSavings / filteredIncome) * 100).toFixed(1) : 0;

  const handleExportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      setToast({ message: 'No transactions available for selected date period.', type: 'error' });
      return;
    }

    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount (INR)', 'Note'];
    const rows = filteredTransactions.map((t) => {
      const d = new Date(t.date);
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthStr = months[d.getMonth()] || 'Jan';
      const year = d.getFullYear();
      const formattedDate = `${day}-${monthStr}-${year}`;

      return [
        `"${formattedDate}"`,
        `"${t.title.replace(/"/g, '""')}"`,
        t.type,
        t.category,
        t.amount,
        `"${(t.note || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Financial_Statement_${startDate || 'start'}_to_${endDate || 'end'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ message: 'Filtered CSV Statement downloaded successfully!', type: 'success' });
  };

  const userStatus = summary?.userDetails?.employmentStatus || user?.employmentStatus || 'dependent';
  const rawIncomeVal = Number(summary?.userDetails?.annualIncomeOrPocketMoney || user?.annualIncomeOrPocketMoney || 0);
  const isIndependent = userStatus === 'independent';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" /> Financial Report Statement
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Filter statements by custom dates or financial period
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold glass-card text-emerald-400 hover:bg-emerald-500/10 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Interactive Date Filter Bar */}
          <div className="glass-card rounded-3xl p-4 shadow-xl border border-white/20 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-blue-400" /> Statement Period:
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-bold uppercase">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPresetPeriod('custom');
                  }}
                  className="px-3 py-1.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-bold uppercase">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPresetPeriod('custom');
                  }}
                  className="px-3 py-1.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs"
                />
              </div>

              <select
                value={presetPeriod}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl glass-input text-blue-400 font-extrabold text-xs"
              >
                <option value="all">All Dates History</option>
                <option value="this_month">This Month</option>
                <option value="last_30_days">Past 30 Days</option>
                <option value="fy_2025_2026">Financial Year (FY 2025-26)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Compiling statement report..." />
          ) : (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 dark:border-white/10 space-y-8 print:p-0 print:shadow-none print:border-none print:bg-white print:text-slate-900">
              {/* Statement Top Info Header */}
              <div className="flex flex-col sm:flex-row justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 font-black text-lg">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" /> Expense Manager Official Statement
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Report Period: <strong className="text-slate-900 dark:text-white">{startDate || 'Beginning of Record'}</strong> to <strong className="text-slate-900 dark:text-white">{endDate || 'Present'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
                  </p>
                </div>
                <div className="text-left sm:text-right text-xs text-slate-400 space-y-1">
                  <p className="font-black text-slate-900 dark:text-white text-sm">Account Holder: {user?.name}</p>
                  <p className="flex items-center sm:justify-end gap-1 font-bold text-blue-400">
                    {isIndependent ? (
                      <>
                        <Briefcase className="w-3.5 h-3.5" /> Independent (Annual CTC: ₹{rawIncomeVal.toLocaleString('en-IN')})
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-3.5 h-3.5" /> Dependent Student (Pocket Money: ₹{rawIncomeVal.toLocaleString('en-IN')})
                      </>
                    )}
                  </p>
                  <p className="text-emerald-400 font-bold flex items-center sm:justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Status: Balanced & Audited
                  </p>
                </div>
              </div>

              {/* 🤖 AI Period Financial Summary */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-indigo-500/15 border border-blue-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-blue-400">
                  <Sparkles className="w-4 h-4 text-amber-300" /> AI Executive Period Brief
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  During the period <strong className="text-slate-900 dark:text-white">{startDate || 'start'} to {endDate || 'present'}</strong>, your total recorded income is <strong className="text-emerald-400">₹{filteredIncome.toLocaleString('en-IN')}</strong> and total expenses are <strong className="text-rose-400">₹{filteredExpense.toLocaleString('en-IN')}</strong>, yielding a net savings of <strong className="text-blue-400">₹{filteredSavings.toLocaleString('en-IN')} ({filteredSavingsPct}%)</strong>.
                  {assetSummary?.totalCurrentValue ? ` Your portfolio asset valuation is ₹${assetSummary.totalCurrentValue.toLocaleString('en-IN')}.` : ''}
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                    <TrendingUp className="w-4 h-4" /> Period Gross Income
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    ₹{filteredIncome.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
                    <TrendingDown className="w-4 h-4" /> Period Expenses
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    ₹{filteredExpense.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                    <PiggyBank className="w-4 h-4" /> Period Savings
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    ₹{filteredSavings.toLocaleString('en-IN')} ({filteredSavingsPct}%)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-400">
                    <Briefcase className="w-4 h-4" /> Asset Valuation
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    ₹{Number(assetSummary?.totalCurrentValue || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Detailed Transaction Audit Ledger Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between uppercase tracking-wider">
                  <span>Transaction Audit Ledger</span>
                  <span className="text-xs font-normal text-slate-400">({filteredTransactions.length} entries in range)</span>
                </h3>
                <div className="border border-white/10 rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-800/60 font-black uppercase text-slate-400 border-b border-white/10 sticky top-0">
                      <tr>
                        <th className="py-3 px-4">Transaction Date</th>
                        <th className="py-3 px-4">Title / Particulars</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 font-medium">
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                          <tr key={tx._id} className="hover:bg-white/5">
                            <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                              {new Date(tx.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{tx.title}</td>
                            <td className="py-2.5 px-4">
                              <CategoryBadge category={tx.category} size="small" />
                            </td>
                            <td className={`py-2.5 px-4 text-right font-black ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-slate-400">
                            No transactions found for selected date range ({startDate || 'start'} to {endDate || 'end'}).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Report Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-bold text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Expense Manager Report Engine (India Edition)
                </span>
                <span>Period: {startDate || 'Start'} — {endDate || 'Present'}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
