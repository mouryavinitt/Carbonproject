import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Building2,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Calculator,
  LineChart,
  Leaf,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { switchRoleQuick } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'PERSONAL' | 'ORGANIZATION' | 'NGO') => {
    switchRoleQuick(role);
    if (role === 'PERSONAL') navigate('/personal/calculator');
    else if (role === 'ORGANIZATION') navigate('/organization/dashboard');
    else navigate('/ngo/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-gray-200/70 bg-gradient-to-b from-white via-slate-50/30 to-emerald-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Grounded in Official IPCC, CEA India & UK DESNZ Factors</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight sm:leading-none">
            Understand Your Carbon Impact.{' '}
            <span className="text-emerald-700 block mt-2">Build a Lower-Carbon Future.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Calculate, track and understand your carbon footprint using scientifically sourced emission factors.
            Accurate, transparent, and defensible environmental accounting.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/personal/calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Calculate Your Footprint
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-all cursor-pointer"
            >
              Explore Projects
            </Link>
            <Link
              to="/methodology"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-lg text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer"
            >
              View Methodology →
            </Link>
          </div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            Tailored For Every Stakeholder
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Select Your Role to Get Started
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Experience role-specific carbon accounting, analytics, and impact management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Personal Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-lg hover:border-emerald-500 transition-all duration-200 p-8 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                👤 Personal
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Calculate and track your personal carbon footprint across domestic electricity, travel, flights, diet, and municipal waste.
              </p>
              <ul className="space-y-2 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real Indian & International grid factors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Categorized breakdown & monthly trends</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Evidence-based reduction recommendations</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleRoleSelect('PERSONAL')}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer group-hover:shadow-sm"
            >
              Start Personal Tracking <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          {/* 2. Organization Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-lg hover:border-emerald-500 transition-all duration-200 p-8 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                🏢 Organization
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Track organizational emissions across GHG Protocol Scope 1 (Direct), Scope 2 (Purchased Energy), and Scope 3 (Value Chain).
              </p>
              <ul className="space-y-2 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Rigorous Scope 1, 2, and 3 accounting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Fleet fuel, backup generators & grid power</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Corporate ESG summary reports & printable export</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleRoleSelect('ORGANIZATION')}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors cursor-pointer"
            >
              Open Organization Portal <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          {/* 3. NGO Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-lg hover:border-emerald-500 transition-all duration-200 p-8 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                🌱 NGO
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Manage, publish, and showcase grassroots environmental projects and their verified carbon sequestration impact.
              </p>
              <ul className="space-y-2 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Publish reforestation & clean energy initiatives</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Public directory accessible without login</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Quantified environmental impact metrics</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleRoleSelect('NGO')}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Manage NGO Projects <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      </section>

      {/* How CarbonTrack Works Section */}
      <section className="py-16 bg-white border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
              Defensible Carbon Accounting
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              How CarbonTrack Works
            </p>
            <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
              Every single calculation follows the internationally standardized greenhouse gas accounting standard:
            </p>
            <div className="mt-3 inline-block bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg font-mono text-sm text-slate-800 font-semibold">
              Emissions (kg CO2e) = Activity Data × Emission Factor
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                1
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Record Activity</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Log real consumption quantities such as kWh electricity, fuel litres, distance traveled in km, or dietary profile days.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                2
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Apply Verified Factors</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                The engine matches each activity with official factors from CEA India, UK DESNZ, or IPCC without synthetic numbers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                3
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Calculate CO2e</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Backend services compute precise carbon dioxide equivalent totals, subtotals, and category distributions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                4
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Track and Reduce</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Review historical emissions over time, identify highest-intensity categories, and implement tailored reduction interventions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Transparency Callout */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Academic & Industry Integrity
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">
              100% Scientifically Sourced. Zero Fabricated Factors.
            </h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Every factor used by CarbonTrack cites its publication source, issuing organization, document title, version year, and direct official URL. Inspect our methodology registry anytime.
            </p>
          </div>
          <Link
            to="/methodology"
            className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-white text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            Explore Methodology Table <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};
