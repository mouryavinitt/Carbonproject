import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: LucideIcon;
  badge?: string;
  color?: 'emerald' | 'blue' | 'amber' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  icon: Icon,
  badge,
  color = 'emerald',
}) => {
  const iconColors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    neutral: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 transition-shadow hover:shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconColors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-gray-900">{value}</span>
        {unit && <span className="text-xs font-medium text-gray-500">{unit}</span>}
      </div>
      {(subtext || badge) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {subtext && <span className="text-gray-500">{subtext}</span>}
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
