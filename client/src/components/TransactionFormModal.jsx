import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Shopping',
  'Rent',
  'Salary',
  'Education',
  'Entertainment',
  'Medical',
  'Transport',
  'Others',
];

const TransactionFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Food',
        note: initialData.note || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount || Number(formData.amount) <= 0) {
      setError('Please provide a valid title and positive amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-modal rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/10 dark:bg-slate-800/40">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 dark:bg-gray-700/60 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  formData.type === 'income'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" /> Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  formData.type === 'expense'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" /> Expense
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Title / Description *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Swiggy Biryani, PG Rent, College Fee, Stipend"
              required
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-gray-900 dark:text-white text-sm focus:outline-none transition-all"
            />
          </div>

          {/* Amount & Category Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Amount (₹ INR) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="500"
                  required
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl glass-input text-gray-900 dark:text-white text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-gray-900 dark:text-white text-sm focus:outline-none transition-all appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-gray-900 dark:text-white text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Notes / UPI Reference (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <textarea
                name="note"
                rows="2"
                value={formData.note}
                onChange={handleChange}
                placeholder="GPay / PhonePe / Paytm reference, hostel room no..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/20 transition-colors"
            >
              {loading ? 'Saving...' : initialData ? 'Update Transaction' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
