import React, { useEffect, useState } from 'react';
import { organizationService } from '../../services/organizationService';
import { OrgEmissionItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { SCIENTIFIC_EMISSION_FACTORS } from '../../data/scientificEmissionFactors';
import { Factory, Zap, Truck, CheckCircle2, Plus } from 'lucide-react';

export const OrganizationActivities: React.FC = () => {
  const [emissions, setEmissions] = useState<OrgEmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form states
  const [selectedScope, setSelectedScope] = useState<'Scope 1' | 'Scope 2' | 'Scope 3'>('Scope 1');
  const [selectedActivity, setSelectedActivity] = useState<string>('Petrol / Gasoline');
  const [quantity, setQuantity] = useState<string>('');
  const [reportingPeriod, setReportingPeriod] = useState<string>(
    `Q3 ${new Date().getFullYear()}`
  );

  // Filter available factors by scope
  const availableFactors = SCIENTIFIC_EMISSION_FACTORS.filter((f) => {
    if (selectedScope === 'Scope 1') return f.scope === 'Scope 1';
    if (selectedScope === 'Scope 2') return f.scope === 'Scope 2';
    return f.scope === 'Scope 3';
  });

  // Current selected factor details
  const currentFactor = SCIENTIFIC_EMISSION_FACTORS.find((f) => f.activityType === selectedActivity) || availableFactors[0];

  useEffect(() => {
    // When scope changes, update selected activity to first available in scope
    if (availableFactors.length > 0) {
      setSelectedActivity(availableFactors[0].activityType);
    }
  }, [selectedScope]);

  useEffect(() => {
    loadEmissions();
  }, []);

  const loadEmissions = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getEmissions();
      setEmissions(data);
    } catch {
      setError('Could not load recorded organization activities.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(false);

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please provide a positive activity quantity.');
      return;
    }

    if (!currentFactor) {
      setError('Invalid emission factor selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newItem = await organizationService.recordEmission({
        scope: selectedScope,
        category: currentFactor.category,
        activityType: currentFactor.activityType,
        quantity: parseFloat(quantity),
        unit: currentFactor.unit,
        reportingPeriod,
      });

      setEmissions([newItem, ...emissions]);
      setQuantity('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to record activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Scope 1, Scope 2 & Scope 3 Activity Ledger
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Record company operational metrics. Calculations use verified emission factors stored in MySQL.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Activity successfully verified and persisted to database.
        </div>
      )}

      {/* Scope Selector Tabs */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setSelectedScope('Scope 1')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedScope === 'Scope 1'
              ? 'border-blue-500 bg-blue-50/60 shadow-xs'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1">
            <Factory className="w-4 h-4" /> Scope 1: Direct
          </div>
          <p className="text-xs text-gray-600">Company fleet, generators, boilers, onsite combustion</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedScope('Scope 2')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedScope === 'Scope 2'
              ? 'border-amber-500 bg-amber-50/60 shadow-xs'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-1">
            <Zap className="w-4 h-4" /> Scope 2: Purchased Energy
          </div>
          <p className="text-xs text-gray-600">Grid electricity consumed in facilities & offices</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedScope('Scope 3')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedScope === 'Scope 3'
              ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
            <Truck className="w-4 h-4" /> Scope 3: Value Chain
          </div>
          <p className="text-xs text-gray-600">Freight logistics, business travel, commuting, waste</p>
        </button>
      </div>

      {/* Logging Form Card */}
      <Card>
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" /> Log Activity for {selectedScope}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Verified Activity Factor ({selectedScope})
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {availableFactors.map((f) => (
                <option key={f.id} value={f.activityType}>
                  {f.activityType} ({f.factor} kg CO2e / {f.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Quantity ({currentFactor?.unit || 'unit'})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Reporting Period
            </label>
            <input
              type="text"
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              placeholder="e.g. Q3 2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Scientific Calculation Preview */}
          {currentFactor && quantity && parseFloat(quantity) > 0 && (
            <div className="md:col-span-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-gray-600 font-mono">
                {quantity} {currentFactor.unit} × {currentFactor.factor} kg CO2e/{currentFactor.unit}
              </span>
              <span className="font-bold text-emerald-800 font-mono text-sm">
                = {Math.round(parseFloat(quantity) * currentFactor.factor * 100) / 100} kg CO2e
              </span>
            </div>
          )}

          <div className="md:col-span-4 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              Record Activity to Database
            </Button>
          </div>
        </form>
      </Card>

      {/* Logged Activities Ledger Table */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">All Recorded Scope Activities</h3>

        {isLoading ? (
          <LoadingSpinner message="Loading emissions..." />
        ) : emissions.length === 0 ? (
          <EmptyState
            title="No emissions logged yet"
            description="Use the form above to record fuel, electricity, or freight transport activities."
          />
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Scope</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Activity</th>
                    <th className="py-3 px-4 font-semibold text-right">Quantity</th>
                    <th className="py-3 px-4 font-semibold text-right">Factor</th>
                    <th className="py-3 px-4 font-semibold text-right">Emission (kg CO2e)</th>
                    <th className="py-3 px-4 font-semibold">Period</th>
                    <th className="py-3 px-4 font-semibold">Scientific Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {emissions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.scope === 'Scope 1'
                              ? 'bg-blue-50 text-blue-700'
                              : item.scope === 'Scope 2'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {item.scope}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-gray-900">{item.activityType}</td>
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700">
                        {item.emissionFactor}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                        {item.emission} kg
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.reportingPeriod}</td>
                      <td className="py-3 px-4 text-gray-500 max-w-xs truncate" title={item.factorSource}>
                        {item.factorSource}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
