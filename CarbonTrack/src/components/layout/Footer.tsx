import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Leaf className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Carbon<span className="text-emerald-500">Track</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Scientifically grounded carbon footprint calculator and emissions tracking platform.
              Powered by authoritative emission factors from IPCC, CEA India, UK DESNZ, and US EPA.
            </p>
            <div className="text-xs text-gray-500 pt-2">
              Formula: <span className="font-mono text-emerald-400">Emissions = Activity Data × Verified Factor</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home / Overview
                </Link>
              </li>
              <li>
                <Link to="/personal/calculator" className="hover:text-emerald-400 transition-colors">
                  Personal Calculator
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-emerald-400 transition-colors">
                  NGO Projects
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-emerald-400 transition-colors">
                  Methodology & Scientific Data
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Authoritative Sources</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-1.5 hover:text-white">
                <span>Central Electricity Authority (CEA) India</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <span>UK DESNZ GHG Conversion Factors</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <span>IPCC & Poore & Nemecek (Science 2018)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <span>GHG Protocol Corporate Standard</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CarbonTrack. Open scientific carbon methodology for sustainable development.</p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <Link to="/methodology" className="hover:text-gray-400">
              Scientific Methodology
            </Link>
            <span>•</span>
            <span className="text-emerald-400">CO2e Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
