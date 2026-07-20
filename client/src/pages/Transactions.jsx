import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CategoryBadge from '../components/CategoryBadge';
import TransactionFormModal from '../components/TransactionFormModal';
import BankImportModal from '../components/BankImportModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import {
  PlusCircle,
  Search,
  Download,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Receipt,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Food',
  'Rent',
  'Education',
  'Entertainment',
  'Medical',
  'Shopping',
  'Transport',
  'Salary',
  'Others',
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');

  // Modals & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        type: typeFilter,
        category: categoryFilter,
        search: searchQuery,
        sort: sortOption,
      };
      const res = await API.get('/transactions', { params });
      setTransactions(res.data);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to load transactions',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, categoryFilter, searchQuery, sortOption]);

  const handleAddOrUpdate = async (formData) => {
    try {
      if (editingTransaction) {
        await API.put(`/transactions/${editingTransaction._id}`, formData);
        setToast({ message: 'Transaction updated successfully!', type: 'success' });
      } else {
        await API.post('/transactions', formData);
        setToast({ message: 'Transaction created successfully!', type: 'success' });
      }
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Operation failed',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      try {
        await API.delete(`/transactions/${id}`);
        setToast({ message: 'Transaction removed successfully!', type: 'info' });
        fetchTransactions();
      } catch (err) {
        setToast({
          message: err.response?.data?.message || 'Failed to delete transaction',
          type: 'error',
        });
      }
    }
  };

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount (INR)', 'Notes'];
    const rows = transactions.map((t) => {
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

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expense_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    setSortOption('date-desc');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
        onOpenBankModal={() => setIsBankModalOpen(true)}
      />
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Transaction Ledger
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage income & expense entries with intelligent search and filtering
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold glass-card text-slate-800 dark:text-slate-200 hover:bg-slate-500/10 transition-all shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Link Bank / CSV
              </button>

              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold glass-card text-slate-700 dark:text-slate-200 hover:bg-slate-500/10 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" /> Export CSV
              </button>

              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Transaction
              </button>
            </div>
          </div>

          {/* Filters Control Panel */}
          <div className="glass-card rounded-3xl p-5 shadow-xl border border-white/20 dark:border-white/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search title or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">All Types (Income & Expense)</option>
                <option value="income">Income Only (+)</option>
                <option value="expense">Expenses Only (-)</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          {loading ? (
            <LoadingSpinner label="Fetching transaction records..." />
          ) : (
            <div className="glass-card rounded-3xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden">
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/60 dark:bg-slate-800/60 font-black uppercase text-slate-400 border-b border-slate-200/40 dark:border-slate-800">
                        <th className="py-3.5 px-5">Transaction</th>
                        <th className="py-3.5 px-5">Category</th>
                        <th className="py-3.5 px-5">Date</th>
                        <th className="py-3.5 px-5 text-right">Amount (₹ INR)</th>
                        <th className="py-3.5 px-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/60 font-medium">
                      {transactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2.5 rounded-2xl ${
                                  tx.type === 'income'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {tx.type === 'income' ? (
                                  <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                                  {tx.title}
                                </span>
                                {tx.note && (
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    {tx.note}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-5">
                            <CategoryBadge category={tx.category} size="small" />
                          </td>

                          <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                            {new Date(tx.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-3.5 px-5 text-right">
                            <span
                              className={`font-black text-sm ${
                                tx.type === 'income'
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {tx.type === 'income' ? '+' : '-'}₹
                              {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          <td className="py-3.5 px-5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingTransaction(tx);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                title="Edit Transaction"
                                aria-label="Edit Transaction"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(tx._id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Delete Transaction"
                                aria-label="Delete Transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Polished Empty State */
                <div className="py-14 px-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">No transactions found</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
                        ? 'No ledger records match your active search filter options.'
                        : 'Your financial ledger is currently empty. Add your first transaction to get started.'}
                    </p>
                  </div>
                  {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all') ? (
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-card text-xs font-bold text-slate-300 hover:text-white transition-all mt-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-400" /> Reset Filters
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all mt-2"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Transaction
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleAddOrUpdate}
        initialData={editingTransaction}
      />

      <BankImportModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onImportSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;
