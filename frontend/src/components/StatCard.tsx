import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'rose' | 'blue' | 'amber' | 'slate';
  change?: {
    value: string;
    isPositive?: boolean;
    isGood?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'slate',
  change,
}) => {
  const variantStyles = {
    emerald: {
      border: 'border-slate-200/90 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
    rose: {
      border: 'border-slate-200/90 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20',
      badgeBg: 'bg-rose-50 text-rose-700',
    },
    blue: {
      border: 'border-slate-200/90 hover:border-blue-300',
      iconBg: 'bg-sky-50 text-sky-600 ring-1 ring-sky-500/20',
      badgeBg: 'bg-sky-50 text-sky-700',
    },
    amber: {
      border: 'border-slate-200/90 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20',
      badgeBg: 'bg-amber-50 text-amber-700',
    },
    slate: {
      border: 'border-slate-200/90 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700 ring-1 ring-slate-400/20',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
  }[variant];

  return (
    <div
      className={`bg-white rounded-xl p-5 border ${variantStyles.border} shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>

        {change && (
          <div
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
              change.isGood !== undefined
                ? change.isGood
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
                : change.isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {change.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{change.value}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-500 tracking-normal">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight font-sans">
          {value}
        </p>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};
