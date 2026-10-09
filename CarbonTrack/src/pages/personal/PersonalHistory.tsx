import React, { useEffect, useState } from 'react';
import { personalService } from '../../services/personalService';
import { CalculationResult } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Eye, Trash2, Calendar, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PersonalHistory: React.FC = () => {
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Selected calculation for modal
  const [activeCalculation, setActiveCalculation] = useState<CalculationResult | null>(null);

  useEffect(() => {
    loadHistory();
  }, [selectedYear, selectedMonth]);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await personalService.getHistory(selectedYear, selectedMonth);
      setHistory(data);
    } catch (err: any) {
      setError('Could not load history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this calculation record?')) {
      return;
    }
    try {
      await personalService.deleteCalculation(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (activeCalculation?.id === id) {
        setActiveCalculation(null);
      }
    } catch (err: any) {
      alert('Failed to delete calculation.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Calculation History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review past emissions audits, breakdowns, and factor citations.
          </p>
        </div>

        <Link to="/personal/calculator">
          <Button variant="primary" size="md">
            + New Calculation
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-gray-500">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-xs"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-gray-500">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-xs"
          >
            <option value="">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        {(selectedYear || selectedMonth) && (
          <button
            onClick={() => {
              setSelectedYear('');
              setSelectedMonth('');
            }}
            className="text-xs text-emerald-700 hover:underline font-medium ml-auto cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner message="Loading historical records..." />
      ) : history.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No calculation records found"
          description={
            selectedYear || selectedMonth
              ? 'No calculations match your filter criteria. Try selecting "All Years" or clear your filter.'
              : 'You have not recorded any carbon footprint calculations yet.'
          }
          actionText="Perform Calculation Now"
          onAction={() => (window.location.href = '/personal/calculator')}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Period</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Footprint</th>
                  <th className="py-3 px-4 font-semibold">Highest Category</th>
                  <th className="py-3 px-4 font-semibold text-right">Activities</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.calculationDate}</td>
                    <td className="py-3 px-4 text-gray-700">{item.period}</td>
                    <td className="py-3 px-4 text-right font-bold font-mono text-emerald-800">
                      {item.totalEmission} kg CO2e
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {item.highestCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500 font-mono">
                      {item.breakdown?.length || 0} activities
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveCalculation(item)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="View Full Breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Calculation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Details Modal */}
      {activeCalculation && (
        <Modal
          isOpen={!!activeCalculation}
          onClose={() => setActiveCalculation(null)}
          title={`Calculation Details — ${activeCalculation.period}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Summary Top Banner */}
            <div className="p-4 bg-emerald-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-emerald-300">
                  Recorded on {activeCalculation.calculationDate}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Top Contributor: {activeCalculation.highestCategory}
                </h4>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black">{activeCalculation.totalEmission}</div>
                <div className="text-[11px] text-emerald-300">kg CO2e</div>
              </div>
            </div>

            {/* Activities Table */}
            <div>
              <h5 className="font-bold text-gray-900 mb-2">Itemized Activity Inventory</h5>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Activity</th>
                      <th className="py-2 px-3 text-right">Quantity</th>
                      <th className="py-2 px-3 text-right">Factor</th>
                      <th className="py-2 px-3 text-right">Emissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeCalculation.breakdown?.map((act, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-medium text-gray-800">{act.category}</td>
                        <td className="py-2 px-3 text-gray-700">{act.activityType}</td>
                        <td className="py-2 px-3 text-right font-mono">
                          {act.quantity} {act.unit}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-700">
                          {act.emissionFactor}
                        </td>
                        <td className="py-2 px-3 text-right font-bold font-mono text-gray-900">
                          {act.emission} kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            {activeCalculation.recommendations && activeCalculation.recommendations.length > 0 && (
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80">
                <h5 className="font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Reduction Roadmap
                </h5>
                <ul className="space-y-1.5 text-gray-700">
                  {activeCalculation.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
