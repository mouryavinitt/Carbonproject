import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { OrganizationDashboardData } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { EmissionChart } from '../../components/charts/EmissionChart';
import { CategoryBreakdown } from '../../components/charts/CategoryBreakdown';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  Building2,
  Factory,
  Zap,
  Truck,
  PlusCircle,
  FileText,
  Activity,
} from 'lucide-react';

export const OrganizationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<OrganizationDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await organizationService.getDashboard();
      setDashboard(data);
    } catch {
      setError('Could not load corporate emissions dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading corporate emissions data..." />;

  if (error || !dashboard) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ErrorMessage message={error || 'Failed to load dashboard'} onRetry={loadDashboard} />
      </div>
    );
  }

  const isEmpty = dashboard.totalEmissions === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {dashboard.organizationName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {dashboard.industry}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            GHG Protocol Corporate Accounting • Scopes 1, 2, and 3 Emissions Ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/organization/activities')}
            variant="primary"
            size="md"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Log Scope Activity
          </Button>
          <Button
            onClick={() => navigate('/organization/reports')}
            variant="outline"
            size="md"
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Executive Reports
          </Button>
        </div>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={Building2}
          title="No organizational emissions recorded yet"
          description="Log fuel combustion for company vehicles (Scope 1), purchased electricity (Scope 2), or business freight/travel (Scope 3) to generate your organizational emissions ledger."
          actionText="Log First Activity"
          onAction={() => navigate('/organization/activities')}
        />
      ) : (
        <>
          {/* Scopes Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Total Corporate Footprint"
              value={dashboard.totalEmissions}
              unit="kg CO2e"
              subtext="Scope 1 + Scope 2 + Scope 3"
              icon={Activity}
              color="emerald"
            />
            <StatCard
              label="Scope 1 (Direct)"
              value={dashboard.scope1Emissions}
              unit="kg CO2e"
              subtext="Fleet fuel, generators, combustion"
              icon={Factory}
              color="blue"
            />
            <StatCard
              label="Scope 2 (Purchased Energy)"
              value={dashboard.scope2Emissions}
              unit="kg CO2e"
              subtext="Facility grid electricity draw"
              icon={Zap}
              color="amber"
            />
            <StatCard
              label="Scope 3 (Value Chain)"
              value={dashboard.scope3Emissions}
              unit="kg CO2e"
              subtext="Commuting, freight, flights, waste"
              icon={Truck}
              color="neutral"
            />
          </div>

          {/* Scope and Category Breakdown Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scope Breakdown Card */}
            <Card className="lg:col-span-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                GHG Protocol Scope Distribution
              </h4>
              <div className="space-y-4">
                {Object.entries(dashboard.scopeBreakdown).map(([scope, val]) => {
                  const pct = dashboard.totalEmissions > 0
                    ? Math.round((val / dashboard.totalEmissions) * 1000) / 10
                    : 0;
                  const color =
                    scope === 'Scope 1' ? 'bg-blue-600' : scope === 'Scope 2' ? 'bg-amber-500' : 'bg-emerald-600';

                  return (
                    <div key={scope}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-800">{scope}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">{val} kg</span>
                          <span className="text-gray-400">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color} transition-all duration-300`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Category Breakdown */}
            <div className="lg:col-span-2">
              <CategoryBreakdown
                breakdown={dashboard.categoryBreakdown}
                total={dashboard.totalEmissions}
                title="Emissions by Operational Category"
              />
            </div>
          </div>

          {/* Trend Chart */}
          {dashboard.monthlyTrend.length > 0 && (
            <EmissionChart
              data={dashboard.monthlyTrend}
              title="Emissions Trend by Reporting Period"
              unit="kg CO2e"
            />
          )}

          {/* Recent Activities Ledger */}
          {dashboard.recentActivities.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900">Recent Recorded Activities</h4>
                <Link to="/organization/activities" className="text-xs font-semibold text-emerald-700 hover:underline">
                  Manage all logs →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Scope</th>
                      <th className="py-2.5 px-3 font-semibold">Activity</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Quantity</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Factor</th>
                      <th className="py-2.5 px-3 font-semibold text-right">CO2e Emissions</th>
                      <th className="py-2.5 px-3 font-semibold">Reporting Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dashboard.recentActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-semibold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            act.scope === 'Scope 1'
                              ? 'bg-blue-50 text-blue-700'
                              : act.scope === 'Scope 2'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {act.scope}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-900 font-medium">{act.activityType}</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {act.quantity} {act.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                          {act.emissionFactor}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">
                          {act.emission} kg
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{act.reportingPeriod}</td>
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
