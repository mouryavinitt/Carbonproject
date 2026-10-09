import React from 'react';

interface MonthlyDataPoint {
  month?: string;
  period?: string;
  emission?: number;
  total?: number;
  scope1?: number;
  scope2?: number;
  scope3?: number;
}

interface EmissionChartProps {
  data: MonthlyDataPoint[];
  title?: string;
  unit?: string;
}

export const EmissionChart: React.FC<EmissionChartProps> = ({
  data,
  title = 'Monthly Emissions Trend',
  unit = 'kg CO2e',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/80 p-6 text-center">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-xs text-gray-400 py-8">No historical trend points recorded yet.</p>
      </div>
    );
  }

  // Find max value
  const values = data.map((d) => d.emission ?? d.total ?? 0);
  const maxVal = Math.max(...values, 10);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500">Expressed in {unit}</p>
        </div>
      </div>

      <div className="h-52 flex items-end gap-3 sm:gap-6 pt-4 border-b border-gray-200">
        {data.map((item, idx) => {
          const val = item.emission ?? item.total ?? 0;
          const label = item.month || item.period || `P${idx + 1}`;
          const heightPercent = Math.max(Math.round((val / maxVal) * 100), 4);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Tooltip value */}
              <div className="text-[11px] font-semibold text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {val}
              </div>
              <div className="w-full max-w-[42px] bg-emerald-100 rounded-t-md relative overflow-hidden flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                <div className="w-full bg-emerald-600 rounded-t-md transition-all duration-300 h-full group-hover:bg-emerald-700" />
              </div>
              <span className="text-[11px] text-gray-500 mt-2 truncate max-w-full font-medium">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
