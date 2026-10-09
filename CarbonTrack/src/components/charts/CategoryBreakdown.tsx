import React from 'react';
import { Zap, Car, Plane, Utensils, Trash2, Layers } from 'lucide-react';

interface CategoryBreakdownProps {
  breakdown: Record<string, number>;
  total?: number;
  title?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Electricity: <Zap className="w-4 h-4 text-amber-500" />,
  Transport: <Car className="w-4 h-4 text-blue-500" />,
  Fuel: <Car className="w-4 h-4 text-blue-500" />,
  Flights: <Plane className="w-4 h-4 text-indigo-500" />,
  Food: <Utensils className="w-4 h-4 text-emerald-500" />,
  Waste: <Trash2 className="w-4 h-4 text-gray-500" />,
  Other: <Layers className="w-4 h-4 text-purple-500" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Electricity: 'bg-amber-500',
  Transport: 'bg-blue-500',
  Fuel: 'bg-blue-500',
  Flights: 'bg-indigo-500',
  Food: 'bg-emerald-500',
  Waste: 'bg-stone-500',
  Other: 'bg-purple-500',
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  breakdown,
  total,
  title = 'Category Breakdown',
}) => {
  const entries = Object.entries(breakdown).filter(([, val]) => val > 0);

  const calcTotal = total || entries.reduce((acc, [, val]) => acc + val, 0);

  if (entries.length === 0 || calcTotal === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/80 p-6 text-center">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-xs text-gray-400 py-8">No category emissions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <span className="text-xs font-medium text-gray-500">
          Total: {Math.round(calcTotal * 10) / 10} kg CO2e
        </span>
      </div>

      <div className="space-y-3.5">
        {entries.map(([cat, val]) => {
          const pct = Math.round((val / calcTotal) * 1000) / 10;
          const barColor = CATEGORY_COLORS[cat] || 'bg-emerald-500';
          const icon = CATEGORY_ICONS[cat] || <Layers className="w-4 h-4 text-gray-400" />;

          return (
            <div key={cat}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  {icon}
                  <span>{cat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{Math.round(val * 10) / 10} kg</span>
                  <span className="text-gray-400 w-10 text-right">({pct}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
