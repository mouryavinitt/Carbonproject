import React, { useState } from 'react';
import { SCIENTIFIC_EMISSION_FACTORS } from '../../data/scientificEmissionFactors';
import { Card } from '../../components/common/Card';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Layers,
} from 'lucide-react';

export const Methodology: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Electricity', 'Fuel', 'Transport', 'Flights', 'Food', 'Waste', 'Industry'];

  const filteredFactors = SCIENTIFIC_EMISSION_FACTORS.filter((factor) => {
    const matchesCat =
      selectedCategory === 'All' || factor.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      factor.activityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factor.sourceOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factor.sourceDocument.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title & Badge */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transparent Environmental Science
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          Emission Factors & Calculation Methodology
        </h1>
        <p className="text-base text-gray-600 mt-2 leading-relaxed">
          CarbonTrack uses only peer-reviewed, government, and authoritative institutional emission factors.
          Explore the mathematical formulas, definitions, and complete catalog of verified scientific citations below.
        </p>
      </div>

      {/* Educational Explanations (Section 18) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-emerald-600">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" /> What is CO2e?
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Carbon Dioxide Equivalent (CO2e)</strong> is the universal metric measure used to compare
            the emissions from various greenhouse gases on the basis of their <em>Global Warming Potential (GWP)</em>.
            While Carbon Dioxide (CO2) has a baseline GWP of 1, gases like Methane (CH4) and Nitrous Oxide (N2O) trap 28×
            and 265× more heat over a 100-year timescale respectively. CO2e translates all greenhouse gas impacts into
            an equivalent mass of carbon dioxide.
          </p>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> What is an Emission Factor?
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            An <strong>Emission Factor</strong> is a representative coefficient that quantifies the mass of greenhouse gas
            released into the atmosphere per unit of human activity. For example, burning 1 litre of mineral diesel
            releases 2.51233 kg of CO2e. Emission factors are experimentally established by national laboratories and
            government climate ministries through stoichiometric combustion analysis and lifecycle energy audits.
          </p>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" /> The Calculation Formula
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Every calculation in CarbonTrack adheres strictly to the primary standard formulated by the GHG Protocol:
          </p>
          <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs font-bold text-slate-800 text-center">
            Emissions (kg CO2e) = Activity Data × Emission Factor
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Units must strictly cancel (e.g., 100 kWh × 0.716 kg CO2e/kWh = 71.60 kg CO2e).
          </p>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" /> GHG Protocol Scope 1, 2, and 3
          </h3>
          <ul className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
            <li>
              <strong>Scope 1 (Direct):</strong> Emissions from company-owned or controlled assets (petrol/diesel vehicles, generators, furnace combustion).
            </li>
            <li>
              <strong>Scope 2 (Purchased Energy):</strong> Indirect emissions from the generation of purchased electricity, steam, or heating.
            </li>
            <li>
              <strong>Scope 3 (Value Chain):</strong> All indirect upstream and downstream emissions (business travel, employee commuting, freight, waste).
            </li>
          </ul>
        </Card>
      </div>

      {/* Sourced Emission Factors Registry */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Verified Scientific Emission Factors Repository
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live catalog of the exact coefficients stored in the backend MySQL database.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity or source..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Factors Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3.5 font-semibold">Category</th>
                  <th className="py-3 px-3.5 font-semibold">Activity Type</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Factor</th>
                  <th className="py-3 px-3.5 font-semibold">Unit</th>
                  <th className="py-3 px-3.5 font-semibold">Source Organization</th>
                  <th className="py-3 px-3.5 font-semibold">Document & Year</th>
                  <th className="py-3 px-3.5 font-semibold">Official Source Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFactors.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 font-medium text-gray-900">{f.category}</td>
                    <td className="py-3 px-3.5 text-gray-800">
                      <div className="font-semibold">{f.activityType}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 max-w-sm" title={f.methodology}>
                        {f.methodology}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-800">
                      {f.factor.toFixed(5)}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-gray-600">kg CO2e / {f.unit}</td>
                    <td className="py-3 px-3.5 font-medium text-gray-800">{f.sourceOrganization}</td>
                    <td className="py-3 px-3.5 text-gray-600 max-w-xs">
                      <div className="truncate font-medium text-gray-700" title={f.sourceDocument}>{f.sourceDocument}</div>
                      <span className="text-[10px] text-gray-400">Published: {f.year}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      <a
                        href={f.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
                      >
                        Verify Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Methodological Integrity Policy Note */}
      <Card className="bg-slate-50 border-slate-200">
        <h4 className="text-sm font-bold text-gray-900 mb-2">
          Strict Scientific Verification Policy
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          In strict compliance with academic standards, if an emission factor cannot be verified against an official
          government, peer-reviewed, or international agency source, CarbonTrack prohibits the system from fabricating or
          interpolating arbitrary constants. Unverified factors require explicit documentation and validation prior to ingestion into the database.
        </p>
      </Card>
    </div>
  );
};
