import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Home,
  Briefcase,
  GraduationCap,
  Film,
  Stethoscope,
  Car,
  FolderKanban,
} from 'lucide-react';

const categoryConfig = {
  Food: {
    icon: Utensils,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700/50',
  },
  Shopping: {
    icon: ShoppingBag,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700/50',
  },
  Rent: {
    icon: Home,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-700/50',
  },
  Salary: {
    icon: Briefcase,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50',
  },
  Education: {
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700/50',
  },
  Entertainment: {
    icon: Film,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-700/50',
  },
  Medical: {
    icon: Stethoscope,
    color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700/50',
  },
  Transport: {
    icon: Car,
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/50',
  },
  Others: {
    icon: FolderKanban,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  },
};

const CategoryBadge = ({ category, size = 'normal' }) => {
  const config = categoryConfig[category] || categoryConfig.Others;
  const IconComponent = config.icon;

  const iconSizes = {
    small: 'w-3 h-3',
    normal: 'w-3.5 h-3.5',
    large: 'w-4 h-4',
  };

  const badgePadding = {
    small: 'px-2 py-0.5 text-xs',
    normal: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border ${config.color} ${badgePadding[size]}`}
    >
      <IconComponent className={iconSizes[size]} />
      {category}
    </span>
  );
};

export default CategoryBadge;
