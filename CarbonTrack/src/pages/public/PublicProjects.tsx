import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { NgoProject } from '../../types';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { MapPin, Search, Globe, Mail, HeartHandshake, ExternalLink } from 'lucide-react';

export const PublicProjects: React.FC = () => {
  const [projects, setProjects] = useState<NgoProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await ngoService.getPublicProjects();
      setProjects(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.ngoName && p.ngoName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      !locationFilter || p.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <HeartHandshake className="w-3.5 h-3.5" /> Public Climate Action Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          NGO Environmental Projects & Impact
        </h1>
        <p className="text-base text-gray-600 mt-2">
          Discover verified ecological restoration, renewable energy, and community carbon reduction programs.
          Publicly accessible to researchers, citizens, and sponsors.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by initiative title, keyword, or NGO name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="sm:w-64">
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by city or region..."
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading verified public initiatives..." />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="No projects currently match your criteria"
          description={
            projects.length === 0
              ? 'No NGO projects have been registered on the platform yet. NGOs can register an account to publish their initiatives.'
              : 'Try clearing your search query or region filter to view other initiatives.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <Card key={proj.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {proj.ngoName || 'Environmental NGO'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 font-medium">
                    <MapPin className="w-3.5 h-3.5" /> {proj.location}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                  {proj.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                  {proj.description}
                </p>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-gray-700 mb-4">
                  <span className="font-semibold text-[11px] text-gray-500 uppercase block mb-0.5">Key Goals:</span>
                  <p className="line-clamp-2">{proj.goals}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="text-xs font-semibold text-emerald-900 bg-emerald-100/70 px-2.5 py-1.5 rounded-lg">
                  Estimated Impact: {proj.estimatedImpact}
                </div>

                <div className="text-[11px] text-gray-500 flex items-center justify-between">
                  <span>Contact: <strong className="text-gray-700">{proj.contactInformation}</strong></span>
                  {proj.website && (
                    <a
                      href={proj.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
