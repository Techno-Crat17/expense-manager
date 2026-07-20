import React, { useState, useEffect } from 'react';
import { X, Target, IndianRupee, Tag, PlusCircle } from 'lucide-react';

const GOAL_CATEGORIES = ['Gadgets & Gaming', 'Travel & Outings', 'Vehicles', 'Emergency Fund', 'Education & Courses', 'Others'];

const SavingsGoalModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    category: 'Gadgets & Gaming',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        targetAmount: initialData.targetAmount || '',
        currentAmount: initialData.currentAmount || '0',
        category: initialData.category || 'Gadgets & Gaming',
      });
    } else {
      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: '0',
        category: 'Gadgets & Gaming',
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
    if (!formData.title.trim() || !formData.targetAmount || Number(formData.targetAmount) <= 0) {
      setError('Please provide a valid goal title and target amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit Savings Goal' : 'Create Savings Goal'}
            </h2>
          </div>
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

          {/* Goal Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Goal Title / Item Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Buy PlayStation 5, Goa Trip, New iPhone"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Target Price / Amount (₹ INR) *
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                step="500"
                min="100"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="54990"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Already Saved Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Already Saved So Far (₹ INR)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                step="100"
                min="0"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                placeholder="15000"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
              >
                {GOAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/20 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> {loading ? 'Saving...' : initialData ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingsGoalModal;
