import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, FileText, Briefcase } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Assets & Stocks', path: '/assets', icon: Briefcase },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Reports', path: '/reports', icon: FileText },
];

const Sidebar = () => {
  return (
    <aside className="w-full md:w-64 glass-sidebar md:min-h-[calc(100vh-4rem)] p-3 sm:p-4 transition-all border-b md:border-b-0 md:border-r border-white/10 shrink-0">
      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 scrollbar-none py-1 md:py-0">
        <div className="hidden md:block px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Navigation Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-white/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-500/10 hover:text-blue-500 dark:hover:text-blue-400'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
