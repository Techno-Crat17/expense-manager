import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

const SummaryCard = ({
  title,
  amount = 0,
  icon: Icon,
  trend,
  trendType = 'neutral',
  variant = 'blue',
  subtitle,
  sparklineData,
}) => {
  const variantStyles = {
    blue: {
      cardBg: 'bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-gray-900/60',
      border: 'border-blue-200/80 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-500',
      glow: 'group-hover:shadow-[0_12px_30px_-8px_rgba(59,130,246,0.3)]',
      iconContainer: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      textColor: 'text-blue-600 dark:text-blue-400',
      accentGradient: 'from-blue-500 to-indigo-500',
    },
    emerald: {
      cardBg: 'bg-gradient-to-br from-emerald-600/10 via-teal-600/5 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-gray-900/60',
      border: 'border-emerald-200/80 dark:border-emerald-800/40 hover:border-emerald-400 dark:hover:border-emerald-500',
      glow: 'group-hover:shadow-[0_12px_30px_-8px_rgba(16,185,129,0.3)]',
      iconContainer: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      accentGradient: 'from-emerald-500 to-teal-500',
    },
    rose: {
      cardBg: 'bg-gradient-to-br from-rose-600/10 via-pink-600/5 to-transparent dark:from-rose-950/40 dark:via-pink-950/20 dark:to-gray-900/60',
      border: 'border-rose-200/80 dark:border-rose-800/40 hover:border-rose-400 dark:hover:border-rose-500',
      glow: 'group-hover:shadow-[0_12px_30px_-8px_rgba(244,63,94,0.3)]',
      iconContainer: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/25',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
      textColor: 'text-rose-600 dark:text-rose-400',
      accentGradient: 'from-rose-500 to-pink-500',
    },
    amber: {
      cardBg: 'bg-gradient-to-br from-amber-600/10 via-orange-600/5 to-transparent dark:from-amber-950/40 dark:via-orange-950/20 dark:to-gray-900/60',
      border: 'border-amber-200/80 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-500',
      glow: 'group-hover:shadow-[0_12px_30px_-8px_rgba(245,158,11,0.3)]',
      iconContainer: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/25',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      textColor: 'text-amber-600 dark:text-amber-400',
      accentGradient: 'from-amber-500 to-orange-500',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.blue;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl p-5 bg-white dark:bg-gray-800/90 ${currentVariant.cardBg} border ${currentVariant.border} shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${currentVariant.glow} cursor-pointer`}
    >
      {/* Background Decorative Mesh Glow */}
      <div
        className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${currentVariant.accentGradient} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-300 pointer-events-none`}
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          {title}
        </span>
        <div
          className={`p-3 rounded-2xl ${currentVariant.iconContainer} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* Main Counter Display */}
      <div className="mt-4 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          <AnimatedCounter value={amount} prefix="₹" decimals={2} />
        </h3>

        {/* Subtitle or Micro Trend Pill */}
        <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
          {trend && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              {trendType === 'up' && (
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              )}
              {trendType === 'down' && (
                <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded-md">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </span>
              )}
              <span className="line-clamp-1">{trend}</span>
            </div>
          )}

          {subtitle && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentVariant.badge}`}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Decorative Bottom Progress Accent line */}
      <div className="mt-4 w-full h-1 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${currentVariant.accentGradient} transition-all duration-1000 group-hover:w-full`}
          style={{ width: '70%' }}
        />
      </div>
    </div>
  );
};

export default SummaryCard;
