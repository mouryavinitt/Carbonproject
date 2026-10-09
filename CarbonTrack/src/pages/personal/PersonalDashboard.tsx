import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { personalService } from '../../services/personalService';
import { PersonalDashboardData } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { CategoryBreakdown } from '../../components/charts/CategoryBreakdown';
import { EmissionChart } from '../../components/charts/EmissionChart';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  Calculator,
  Calendar,
  CloudFog,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

export const PersonalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<PersonalDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await personalService.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError('Could not load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your carbon footprint dashboard..." />;
  }

  if (error || !dashboard) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ErrorMessage message={error || 'Failed to load dashboard'} onRetry={loadDashboard} />
      </div>
    );
  }

  const isEmpty = dashboard.totalCalculationsCount === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {getGreeting()}, {dashboard.userName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Personal emissions monitoring and verified carbon accounting overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/personal/calculator')}
            variant="primary"
            size="md"
          >
            <Calculator className="w-4 h-4 mr-1.5" />
            New Calculation
          </Button>
          <Button
            onClick={() => navigate('/personal/history')}
            variant="outline"
            size="md"
          >
            View History
          </Button>
        </div>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={CloudFog}
          title="No calculations yet"
          description="Start your first carbon footprint calculation to see your monthly emissions, category breakdown, and personalized reduction roadmap."
          actionText="Start First Calculation"
          onAction={() => navigate('/personal/calculator')}
        />
      ) : (
        <>
          {/* 4 Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Total Recorded"
              value={dashboard.totalEmissionsRecorded}
              unit="kg CO2e"
              subtext={`${dashboard.totalCalculationsCount} logged calculations`}
              icon={CloudFog}
              color="emerald"
            />
            <StatCard
              label="This Month"
              value={dashboard.thisMonthEmissions}
              unit="kg CO2e"
              subtext="Current calendar month"
              icon={Calendar}
              color="blue"
            />
            <StatCard
              label="This Year"
              value={dashboard.thisYearEmissions}
              unit="kg CO2e"
              subtext="Year-to-date footprint"
              icon={TrendingDown}
              color="neutral"
            />
            <StatCard
              label="Highest Category"
              value={dashboard.highestCategory}
              subtext="Primary contributor"
              icon={Flame}
              color="amber"
              badge="Top Source"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdown
              breakdown={dashboard.categoryBreakdown}
              total={dashboard.totalEmissionsRecorded}
              title="Emissions by Category (Total)"
            />
            <EmissionChart
              data={dashboard.monthlyTrend}
              title="6-Month Emissions Trend"
              unit="kg CO2e"
            />
          </div>

          {/* Reduction Suggestions Section */}
          <Card className="bg-emerald-50/40 border-emerald-200/80">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-emerald-950">
                Evidence-Based Reduction Recommendations
              </h3>
            </div>
            <p className="text-xs text-emerald-800 mb-4">
              Generated based on your highest emitting source ({dashboard.highestCategory}):
            </p>
            <div className="space-y-3">
              {dashboard.reductionSuggestions.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-emerald-100 text-xs text-gray-800 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Calculations Table */}
          {dashboard.recentCalculations.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Calculations</h3>
                <Link to="/personal/history" className="text-xs font-semibold text-emerald-700 hover:underline">
                  View all history →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Date</th>
                      <th className="py-2.5 px-3 font-semibold">Period</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Total Footprint</th>
                      <th className="py-2.5 px-3 font-semibold">Highest Category</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dashboard.recentCalculations.map((calc) => (
                      <tr key={calc.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-medium text-gray-900">{calc.calculationDate}</td>
                        <td className="py-3 px-3 text-gray-600">{calc.period}</td>
                        <td className="py-3 px-3 text-right font-bold font-mono text-emerald-800">
                          {calc.totalEmission} kg CO2e
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-800">
                            {calc.highestCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            to="/personal/history"
                            className="text-emerald-700 hover:text-emerald-900 font-semibold"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
