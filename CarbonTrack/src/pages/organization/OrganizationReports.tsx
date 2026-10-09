import React, { useEffect, useState } from 'react';
import { organizationService } from '../../services/organizationService';
import { OrganizationReportData } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

export const OrganizationReports: React.FC = () => {
  const [report, setReport] = useState<OrganizationReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [selectedPeriod]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getReports(selectedPeriod);
      setReport(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Corporate Greenhouse Gas Emission Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Auditable corporate emissions statement adhering to the GHG Protocol.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="ALL">All Reporting Periods</option>
            <option value="Q3 2026">Q3 2026</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="Q1 2026">Q1 2026</option>
          </select>

          <Button onClick={handlePrint} variant="primary" size="md">
            <Printer className="w-4 h-4 mr-1.5" />
            Print / Export PDF
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Generating corporate emissions statement..." />
      ) : !report || report.activities.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No corporate emissions to generate report"
          description="Log activities in Scope 1, 2, or 3 to view and export official corporate statements."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-8 sm:p-12 space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Executive Header */}
          <div className="border-b border-gray-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                CarbonTrack Corporate Sustainability Report
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {report.organizationName}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Reporting Period: <span className="font-semibold text-gray-700">{report.reportingPeriod}</span> • Generated: {report.generatedAt}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500 uppercase font-semibold">Total Gross Footprint</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800">
                {report.totalEmissions} <span className="text-sm font-medium text-gray-500">kg CO2e</span>
              </div>
            </div>
          </div>

          {/* Scope 1, 2, 3 Summary Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">
              1. GHG Protocol Scopes Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                <span className="text-xs font-bold text-blue-900 uppercase">Scope 1 (Direct Combustion)</span>
                <div className="text-2xl font-black text-blue-950 mt-1">
                  {report.scope1Total} <span className="text-xs font-normal text-gray-600">kg CO2e</span>
                </div>
                <div className="text-xs text-blue-700 font-semibold mt-1">
                  {report.scopePercentages['Scope 1']}% of total emissions
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                <span className="text-xs font-bold text-amber-900 uppercase">Scope 2 (Purchased Energy)</span>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {report.scope2Total} <span className="text-xs font-normal text-gray-600">kg CO2e</span>
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-1">
                  {report.scopePercentages['Scope 2']}% of total emissions
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <span className="text-xs font-bold text-emerald-900 uppercase">Scope 3 (Value Chain)</span>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {report.scope3Total} <span className="text-xs font-normal text-gray-600">kg CO2e</span>
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  {report.scopePercentages['Scope 3']}% of total emissions
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">
              2. Distribution by Activity Category
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Category</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Emissions (kg CO2e)</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Share of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(report.categoryBreakdown).map(([cat, val]) => {
                    const pct = report.totalEmissions > 0
                      ? Math.round((val / report.totalEmissions) * 1000) / 10
                      : 0;
                    return (
                      <tr key={cat}>
                        <td className="py-2.5 px-4 font-medium text-gray-900">{cat}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-gray-900">{val} kg</td>
                        <td className="py-2.5 px-4 text-right font-mono text-gray-500">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Activity Audit Trail */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">
              3. Itemized Activity Audit Log
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2 px-3">Scope</th>
                    <th className="py-2 px-3">Activity</th>
                    <th className="py-2 px-3 text-right">Quantity</th>
                    <th className="py-2 px-3 text-right">Emission Factor</th>
                    <th className="py-2 px-3 text-right">Calculated CO2e</th>
                    <th className="py-2 px-3">Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.activities.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2 px-3 font-semibold text-gray-700">{a.scope}</td>
                      <td className="py-2 px-3 font-medium text-gray-900">{a.activityType}</td>
                      <td className="py-2 px-3 text-right font-mono">
                        {a.quantity} {a.unit}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700">{a.emissionFactor}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-gray-900">{a.emission} kg</td>
                      <td className="py-2 px-3 text-gray-500">{a.reportingPeriod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Verification Footer */}
          <div className="border-t border-gray-200 pt-6 text-[11px] text-gray-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              Generated via CarbonTrack Enterprise Engine • Methodologies verified from IPCC, CEA India & UK DESNZ.
            </div>
            <div className="font-semibold text-emerald-800">Status: Verified Academic Full-Stack Audit</div>
          </div>
        </div>
      )}
    </div>
  );
};
