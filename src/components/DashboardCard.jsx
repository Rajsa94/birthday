import React from 'react';

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'purple', // 'purple' | 'pink' | 'amber' | 'emerald' | 'blue' | 'rose'
  badge = null,
}) {
  const schemes = {
    purple: {
      bg: 'bg-purple-50/70 hover:bg-purple-50',
      border: 'border-purple-200/80',
      iconBg: 'bg-purple-600 text-white shadow-purple-600/20',
      valueColor: 'text-purple-950',
    },
    pink: {
      bg: 'bg-pink-50/70 hover:bg-pink-50',
      border: 'border-pink-200/80',
      iconBg: 'bg-pink-600 text-white shadow-pink-600/20',
      valueColor: 'text-pink-950',
    },
    amber: {
      bg: 'bg-amber-50/70 hover:bg-amber-50',
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
      valueColor: 'text-amber-950',
    },
    emerald: {
      bg: 'bg-emerald-50/70 hover:bg-emerald-50',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-600/20',
      valueColor: 'text-emerald-950',
    },
    rose: {
      bg: 'bg-rose-50/70 hover:bg-rose-50',
      border: 'border-rose-200/80',
      iconBg: 'bg-rose-600 text-white shadow-rose-600/20',
      valueColor: 'text-rose-950',
    },
    blue: {
      bg: 'bg-blue-50/70 hover:bg-blue-50',
      border: 'border-blue-200/80',
      iconBg: 'bg-blue-600 text-white shadow-blue-600/20',
      valueColor: 'text-blue-950',
    },
  };

  const scheme = schemes[colorScheme] || schemes.purple;

  return (
    <div
      className={`rounded-2xl p-5 border ${scheme.border} ${scheme.bg} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <h3 className={`text-3xl font-extrabold font-serif ${scheme.valueColor}`}>
          {value}
        </h3>
        {badge && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white shadow-xs border border-slate-200/60 text-slate-700">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-2 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
