import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { personalService } from '../../services/personalService';
import { ActivityInput, CalculationResult } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  Zap,
  Fuel,
  Bus,
  Plane,
  Utensils,
  Trash2,
  CheckCircle2,
  Info,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const PersonalCalculator: React.FC = () => {
  const navigate = useNavigate();

  // Selected inputs for each category
  const [electricityType, setElectricityType] = useState('Grid Electricity (India Average)');
  const [electricityKwh, setElectricityKwh] = useState<string>('');

  const [fuelType, setFuelType] = useState('Petrol / Gasoline');
  const [fuelLitres, setFuelLitres] = useState<string>('');

  const [transportType, setTransportType] = useState('Local City Bus');
  const [transportKm, setTransportKm] = useState<string>('');

  const [flightType, setFlightType] = useState('Domestic Flight (<500 km)');
  const [flightKm, setFlightKm] = useState<string>('');

  const [foodType, setFoodType] = useState('Medium Meat Diet (50-100g/day)');
  const [foodDays, setFoodDays] = useState<string>('30');

  const [wasteType, setWasteType] = useState('Municipal Landfill Waste');
  const [wasteKg, setWasteKg] = useState<string>('');

  const [periodName, setPeriodName] = useState<string>(
    `Monthly (${new Date().toLocaleString('default', { month: 'short', year: 'numeric' })})`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const activities: ActivityInput[] = [];

    if (electricityKwh && parseFloat(electricityKwh) > 0) {
      activities.push({
        category: 'Electricity',
        activityType: electricityType,
        quantity: parseFloat(electricityKwh),
        unit: 'kWh',
      });
    }

    if (fuelLitres && parseFloat(fuelLitres) > 0) {
      activities.push({
        category: 'Fuel',
        activityType: fuelType,
        quantity: parseFloat(fuelLitres),
        unit: fuelType.includes('CNG') ? 'm3' : 'litre',
      });
    }

    if (transportKm && parseFloat(transportKm) > 0) {
      activities.push({
        category: 'Transport',
        activityType: transportType,
        quantity: parseFloat(transportKm),
        unit: 'km',
      });
    }

    if (flightKm && parseFloat(flightKm) > 0) {
      activities.push({
        category: 'Flights',
        activityType: flightType,
        quantity: parseFloat(flightKm),
        unit: 'km',
      });
    }

    if (foodDays && parseFloat(foodDays) > 0) {
      activities.push({
        category: 'Food',
        activityType: foodType,
        quantity: parseFloat(foodDays),
        unit: 'day',
      });
    }

    if (wasteKg && parseFloat(wasteKg) > 0) {
      activities.push({
        category: 'Waste',
        activityType: wasteType,
        quantity: parseFloat(wasteKg),
        unit: 'kg',
      });
    }

    if (activities.length === 0) {
      setError('Please enter activity data in at least one category to calculate your emissions.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await personalService.calculateAndSave(activities, periodName);
      setCalculationResult(res);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Error executing carbon calculation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Real Authoritative Emission Factors
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Personal Carbon Footprint Calculator
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Enter your activities for this period. All factors strictly follow authoritative formulas:{' '}
          <span className="font-mono text-emerald-700 bg-emerald-50/60 px-1 py-0.5 rounded">
            Activity Data × Emission Factor = Emissions (kg CO2e)
          </span>.
          Leave any unused categories blank.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleCalculate} className="space-y-6">
        {/* Calculation Period Selector */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="text-sm font-medium text-gray-700">
            Reporting Period Label:
          </label>
          <input
            type="text"
            value={periodName}
            onChange={(e) => setPeriodName(e.target.value)}
            className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g. October 2026"
            required
          />
        </div>

        {/* 1. Electricity */}
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">1. Electricity</h3>
              <p className="text-xs text-gray-500">
                CEA India grid emission factor is 0.716 kg CO2e/kWh (CO2 Baseline Database Ver 19).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Regional Grid Type
              </label>
              <select
                value={electricityType}
                onChange={(e) => setElectricityType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Grid Electricity (India Average)">Grid Electricity (India Average) — 0.716 kg CO2e/kWh</option>
                <option value="Grid Electricity (UK Average)">Grid Electricity (UK Average) — 0.207 kg CO2e/kWh</option>
                <option value="Grid Electricity (US Average)">Grid Electricity (US Average) — 0.386 kg CO2e/kWh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Consumption (kWh)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">kWh</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Fuel & Petrol/Diesel */}
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">2. Fuel / Direct Combustion</h3>
              <p className="text-xs text-gray-500">
                UK DESNZ 2023 direct fuel combustion: Petrol = 2.315 kg CO2e/L, Diesel = 2.512 kg CO2e/L.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Petrol / Gasoline">Petrol / Gasoline — 2.31495 kg CO2e/litre</option>
                <option value="Diesel">Diesel — 2.51233 kg CO2e/litre</option>
                <option value="LPG (Liquefied Petroleum Gas)">LPG — 1.55708 kg CO2e/litre</option>
                <option value="Natural Gas / CNG">Natural Gas / CNG — 2.02135 kg CO2e/m³</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quantity ({fuelType.includes('CNG') ? 'm³' : 'Litres'})
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={fuelLitres}
                  onChange={(e) => setFuelLitres(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">
                  {fuelType.includes('CNG') ? 'm³' : 'litres'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Public Transport & Commuting */}
        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">3. Public Transport & Commuting</h3>
              <p className="text-xs text-gray-500">
                UK DESNZ passenger factors: Bus = 0.0965 kg/km, Train = 0.0355 kg/km, Metro = 0.0278 kg/km.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Transit Mode
              </label>
              <select
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Local City Bus">Local City Bus — 0.0965 kg CO2e/km</option>
                <option value="Train / National Rail">Train / National Rail — 0.0355 kg CO2e/km</option>
                <option value="Metro / Subway / Tram">Metro / Subway / Tram — 0.0278 kg CO2e/km</option>
                <option value="Motorcycle / Two-Wheeler">Motorcycle / Two-Wheeler — 0.1134 kg CO2e/km</option>
                <option value="Average Petrol Passenger Car">Passenger Car (solo) — 0.1705 kg CO2e/km</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Distance Traveled (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={transportKm}
                  onChange={(e) => setTransportKm(e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">km</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Aviation / Flights */}
        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">4. Flights & Aviation</h3>
              <p className="text-xs text-gray-500">
                UK DESNZ & IPCC conversion factors including Radiative Forcing (RF) multipliers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Flight Category
              </label>
              <select
                value={flightType}
                onChange={(e) => setFlightType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Domestic Flight (<500 km)">Domestic Flight (&lt;500 km) — 0.24587 kg CO2e/km</option>
                <option value="Short-Haul International (<3700 km)">Short-Haul (&lt;3700 km) — 0.15102 kg CO2e/km</option>
                <option value="Long-Haul International (>3700 km)">Long-Haul (&gt;3700 km) — 0.14787 kg CO2e/km</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Flight Distance (passenger-km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={flightKm}
                  onChange={(e) => setFlightKm(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">km</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 5. Food & Diet */}
        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">5. Food & Dietary Lifestyle</h3>
              <p className="text-xs text-gray-500">
                Poore & Nemecek (Science 2018) global meta-analysis: High Meat = 7.19 kg/day, Vegetarian = 3.81 kg/day, Vegan = 2.89 kg/day.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dietary Pattern
              </label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="High Meat Diet (>100g meat/day)">High Meat (&gt;100g/day) — 7.19 kg CO2e/day</option>
                <option value="Medium Meat Diet (50-100g/day)">Medium Meat (50-100g/day) — 5.63 kg CO2e/day</option>
                <option value="Low Meat Diet (<50g/day)">Low Meat / Flexitarian (&lt;50g/day) — 4.67 kg CO2e/day</option>
                <option value="Pescatarian Diet">Pescatarian (Fish & Veg) — 3.91 kg CO2e/day</option>
                <option value="Vegetarian Diet">Vegetarian (Lacto-ovo) — 3.81 kg CO2e/day</option>
                <option value="Vegan Diet">Vegan (100% plant-based) — 2.89 kg CO2e/day</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Number of Days in Period
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={foodDays}
                  onChange={(e) => setFoodDays(e.target.value)}
                  placeholder="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">days</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 6. Waste Management */}
        <Card className="border-l-4 border-l-stone-500">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-stone-100 text-stone-700 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">6. Domestic Waste</h3>
              <p className="text-xs text-gray-500">
                UK DESNZ 2023: Landfill = 0.446 kg CO2e/kg, Compost = 0.0102 kg CO2e/kg, Recycled = 0.0213 kg CO2e/kg.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Waste Disposal Route
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Municipal Landfill Waste">Municipal Landfill Waste — 0.4460 kg CO2e/kg</option>
                <option value="Composted Organic Waste">Composted Organic Waste — 0.0102 kg CO2e/kg</option>
                <option value="Recycled Mixed Waste">Recycled Mixed Material — 0.0213 kg CO2e/kg</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Waste Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">kg</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base py-3.5 shadow-md shadow-emerald-700/20"
            isLoading={isLoading}
          >
            Calculate Footprint & Save to Database
          </Button>
        </div>
      </form>

      {/* Prominent Calculation Output */}
      {calculationResult && (
        <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-900 text-white rounded-2xl p-8 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800 pb-6 mb-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-emerald-300">
                  Calculation Successful • Saved to History
                </span>
                <h2 className="text-2xl font-bold mt-1">Total Carbon Footprint</h2>
                <p className="text-xs text-emerald-200 mt-0.5">Period: {calculationResult.period}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  {calculationResult.totalEmission}
                </div>
                <div className="text-sm font-semibold text-emerald-300 mt-1">kg CO2e</div>
              </div>
            </div>

            {/* Category Breakdown Subtotals */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/60">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">Electricity</span>
                <div className="text-lg font-bold mt-0.5">{calculationResult.electricityEmission} kg</div>
              </div>
              <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/60">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">Transport</span>
                <div className="text-lg font-bold mt-0.5">{calculationResult.transportEmission} kg</div>
              </div>
              <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/60">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">Flights</span>
                <div className="text-lg font-bold mt-0.5">{calculationResult.flightEmission} kg</div>
              </div>
              <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/60">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">Food/Diet</span>
                <div className="text-lg font-bold mt-0.5">{calculationResult.foodEmission} kg</div>
              </div>
              <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/60">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">Waste</span>
                <div className="text-lg font-bold mt-0.5">{calculationResult.wasteEmission} kg</div>
              </div>
            </div>
          </div>

          {/* Activity Breakdown Table */}
          <Card>
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Activity Data × Emission Factor Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Category</th>
                    <th className="py-2.5 px-3 font-semibold">Activity</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Quantity</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Scientific Factor</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Calculated CO2e</th>
                    <th className="py-2.5 px-3 font-semibold">Authoritative Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {calculationResult.breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-medium text-gray-800">{item.category}</td>
                      <td className="py-2.5 px-3 text-gray-700">{item.activityType}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                        {item.emissionFactor} kg/{item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold font-mono text-gray-900">
                        {item.emission} kg
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 max-w-xs truncate" title={item.factorSource}>
                        {item.factorSource}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Tailored Reduction Suggestions */}
          {calculationResult.recommendations.length > 0 && (
            <Card className="bg-emerald-50/50 border-emerald-200">
              <h3 className="text-base font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> Tailored Reduction Suggestions
              </h3>
              <p className="text-xs text-emerald-800 mb-4">
                Highest emitting category identified:{' '}
                <span className="font-bold underline">{calculationResult.highestCategory}</span>
              </p>
              <ul className="space-y-2.5">
                {calculationResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/personal/history')}
            >
              View Calculation History
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/personal/dashboard')}
            >
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
