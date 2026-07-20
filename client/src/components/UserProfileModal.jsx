import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { X, User, MapPin, Save, Briefcase, Calendar, ShieldCheck, Mail } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '21',
    sex: 'Male',
    dob: '2004-05-15',
    annualIncomeOrPocketMoney: '12000',
    address: 'Flat 402, Green Valley Apartments, Andheri West, Mumbai, Maharashtra 400053',
    employmentStatus: 'dependent',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen]);

  const fetchProfileData = async () => {
    try {
      const res = await API.get('/auth/profile');
      setFormData({
        name: res.data.name || user?.name || '',
        email: res.data.email || user?.email || '',
        age: res.data.age || '21',
        sex: res.data.sex || 'Male',
        dob: res.data.dob || '2004-05-15',
        annualIncomeOrPocketMoney: res.data.annualIncomeOrPocketMoney || user?.annualIncomeOrPocketMoney || '12000',
        address: res.data.address || 'Flat 402, Green Valley Apartments, Andheri West, Mumbai, Maharashtra 400053',
        employmentStatus: res.data.employmentStatus || user?.employmentStatus || 'dependent',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.put('/auth/profile', formData);
      if (onSaveSuccess) onSaveSuccess(res.data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      {/* Centered Modal Card Box */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Fixed Top Header */}
        <div className="shrink-0 px-6 sm:px-8 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg uppercase shadow-inner border border-white/20 shrink-0">
              {formData.name ? formData.name.charAt(0) : <User className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">{formData.name || 'User Profile'}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> KYC Active
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Personal Demographics, Income & Residential Details
              </p>
            </div>
          </div>

          {/* ✂️ Cut / Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/30 text-white transition-all shadow-md active:scale-95 border border-white/20 flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            title="Close Profile"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs">
            
            {/* Section 1: Demographics & Personal Info */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-700/60 pb-2">
                <User className="w-4 h-4" /> Personal Information & Demographics
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Age</label>
                  <input
                    type="number"
                    min="14"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Sex / Gender</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Date of Birth (DOB)</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Financial & Employment Credentials */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-700/60 pb-2">
                <Briefcase className="w-4 h-4" /> Financial Status & Allowance
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 font-mono text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Employment Category</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="dependent">Dependent College Student</option>
                    <option value="independent">Independent Working Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {formData.employmentStatus === 'independent' ? 'Annual CTC Income (₹)' : 'Monthly Pocket Money (₹)'}
                  </label>
                  <input
                    type="number"
                    value={formData.annualIncomeOrPocketMoney}
                    onChange={(e) => setFormData({ ...formData, annualIncomeOrPocketMoney: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-black text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Residential Address */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-700/60 pb-2">
                <MapPin className="w-4 h-4 text-rose-500" /> Residential Address
              </div>

              <div>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter street, apartment, city, state, and pincode..."
                />
              </div>
            </div>

          </div>

          {/* Fixed Bottom Action Footer Bar */}
          <div className="shrink-0 px-6 sm:px-8 py-4 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving Changes...' : 'Save Profile Credentials'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default UserProfileModal;
