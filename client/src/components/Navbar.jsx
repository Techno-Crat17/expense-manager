import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import UserProfileModal from './UserProfileModal';
import { Sun, Moon, LogOut, PlusCircle, User as UserIcon, Wallet, Building2, Scan } from 'lucide-react';

const Navbar = ({ onOpenAddModal, onOpenBankModal, onOpenAiScanModal }) => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                ExpenseManager
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full glass-card text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                AI Powered 🤖
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* AI Vision Receipt Scanner */}
            {onOpenAiScanModal && (
              <button
                onClick={onOpenAiScanModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold glass-card text-purple-400 hover:bg-purple-500/10 transition-all border border-purple-500/30"
                aria-label="Scan Receipt with AI"
              >
                <Scan className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="hidden sm:inline">AI Scan Bill</span>
              </button>
            )}

            {/* Bank Sync / Importer Button */}
            {onOpenBankModal && (
              <button
                onClick={onOpenBankModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold glass-card text-slate-200 hover:bg-slate-500/10 transition-all"
                aria-label="Link Bank or Upload CSV Statement"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Link Bank</span>
              </button>
            )}

            {/* Quick Add Transaction Button */}
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-500/20"
                aria-label="Add Transaction Entry"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add Entry</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-2xl text-slate-400 hover:text-white glass-card hover:bg-slate-500/10 transition-colors"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Theme Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile Interactive Button */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-white/5 transition-all text-left group"
                  title="View & Edit Profile"
                  aria-label="User Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-sm border border-blue-400/30 group-hover:scale-105 transition-transform">
                    {user.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Edit Profile ⚙️</span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                  aria-label="Logout Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveSuccess={() => {
          window.location.reload();
        }}
      />
    </header>
  );
};

export default Navbar;
