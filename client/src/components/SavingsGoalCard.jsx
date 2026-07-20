import React, { useState } from 'react';
import { Target, Plus, Trash2, Edit2, Gamepad2, Plane, Car, ShieldAlert, Laptop, Sparkles } from 'lucide-react';

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'Gadgets & Gaming':
      return <Gamepad2 className="w-5 h-5 text-indigo-400" />;
    case 'Travel & Outings':
      return <Plane className="w-5 h-5 text-emerald-400" />;
    case 'Vehicles':
      return <Car className="w-5 h-5 text-amber-400" />;
    case 'Emergency Fund':
      return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    case 'Education & Courses':
      return <Laptop className="w-5 h-5 text-blue-400" />;
    default:
      return <Sparkles className="w-5 h-5 text-purple-400" />;
  }
};

const SavingsGoalCard = ({ goal, onDeposit, onDelete, onEdit }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);

  const target = Number(goal.targetAmount || 1);
  const current = Number(goal.currentAmount || 0);
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;
    onDeposit(goal._id, Number(depositAmount));
    setDepositAmount('');
    setShowDeposit(false);
  };

  return (
    <div className="p-5 rounded-3xl glass-card hover-card-zoom flex flex-col justify-between space-y-4 relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 dark:bg-slate-800/60 border border-white/20 dark:border-white/10 shadow-inner">
              {getCategoryIcon(goal.category)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {goal.title}
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {goal.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors"
              title="Edit Goal"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(goal._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Amount Metrics */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Saved</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              ₹{current.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Target</span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              ₹{target.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 space-y-1.5">
          <div className="w-full bg-slate-200/50 dark:bg-slate-800/60 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                percentage >= 100
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className={percentage >= 100 ? 'text-emerald-400 font-bold' : 'text-blue-400'}>
              {percentage >= 100 ? '🎉 Goal Achieved!' : `${percentage}% Completed`}
            </span>
            <span className="text-slate-400">
              {remaining > 0 ? `₹${remaining.toLocaleString('en-IN')} needed` : 'Ready to buy!'}
            </span>
          </div>
        </div>
      </div>

      {/* Action: Add Funds Toggle */}
      <div className="pt-3 border-t border-white/10">
        {showDeposit ? (
          <form onSubmit={handleDepositSubmit} className="flex items-center gap-2">
            <input
              type="number"
              min="10"
              placeholder="Amount (₹)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors whitespace-nowrap shadow-md"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowDeposit(false)}
              className="px-2 py-1.5 rounded-xl text-xs text-slate-400 hover:bg-white/10"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowDeposit(true)}
            className="w-full py-2 rounded-2xl text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Deposit Savings
          </button>
        )}
      </div>
    </div>
  );
};

export default SavingsGoalCard;
