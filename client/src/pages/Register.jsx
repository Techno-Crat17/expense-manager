import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, User, Mail, Lock, ArrowRight, Briefcase, GraduationCap, IndianRupee } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('dependent');
  const [annualIncomeOrPocketMoney, setAnnualIncomeOrPocketMoney] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password, employmentStatus, Number(annualIncomeOrPocketMoney || 0));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/80 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/30 mb-1">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Set up your budget profile & personal finance tracker
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Financial Profile Type Selection */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Financial Independence Status *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEmploymentStatus('dependent')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  employmentStatus === 'dependent'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <GraduationCap className="w-4 h-4" /> Dependent
                </div>
                <span className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">
                  Student / Allowance based
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEmploymentStatus('independent')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  employmentStatus === 'independent'
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Briefcase className="w-4 h-4" /> Independent
                </div>
                <span className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">
                  Employed / Freelancer
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Income / Pocket Money Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {employmentStatus === 'independent'
                ? 'Annual Income (CTC in ₹ INR)'
                : 'Monthly Pocket Money / Allowance (₹ INR)'}
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="number"
                min="0"
                step="500"
                value={annualIncomeOrPocketMoney}
                onChange={(e) => setAnnualIncomeOrPocketMoney(e.target.value)}
                placeholder={employmentStatus === 'independent' ? 'e.g. 600000' : 'e.g. 5000'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Creating Account...' : 'Get Started Free'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
