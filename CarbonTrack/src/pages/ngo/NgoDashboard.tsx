import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import { NgoProfile, NgoProject } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  HeartHandshake,
  Leaf,
  PlusCircle,
  Globe,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<NgoProfile | null>(null);
  const [projects, setProjects] = useState<NgoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profData, projData] = await Promise.all([
        ngoService.getProfile(),
        ngoService.getMyProjects(),
      ]);
      setProfile(profData);
      setProjects(projData);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading NGO initiatives..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {profile?.ngoName || 'NGO Climate Action Hub'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Verified NGO
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Grassroots Climate Action • Project Publication & Carbon Sequestration Showcase
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/ngo/projects')}
            variant="primary"
            size="md"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Manage & Publish Projects
          </Button>
          <Link to="/projects">
            <Button variant="outline" size="md">
              <Globe className="w-4 h-4 mr-1.5" />
              Public Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Active Projects"
          value={projects.length}
          subtext="Published environmental programs"
          icon={Leaf}
          color="emerald"
        />
        <StatCard
          label="Operational Base"
          value={profile?.location || 'India'}
          subtext="Headquarters"
          icon={MapPin}
          color="blue"
        />
        <StatCard
          label="Directory Visibility"
          value="Public"
          subtext="Visible to all platform visitors"
          icon={Globe}
          color="neutral"
        />
      </div>

      {/* Projects List or Empty State */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Published Environmental Projects</h2>
          <Button
            onClick={() => navigate('/ngo/projects')}
            variant="outline"
            size="sm"
          >
            + Create New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={HeartHandshake}
            title="No environmental projects published yet"
            description="Create your first reforestation, renewable installation, waste management, or climate awareness project to showcase its verified impact publicly."
            actionText="Publish Your First Project"
            onAction={() => navigate('/ngo/projects')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Card key={proj.id} className="flex flex-col justify-between hover" onClick={() => navigate('/ngo/projects')}>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {proj.location}
                    </span>
                    <span className="text-[11px] font-mono">{proj.createdAt?.split('T')[0]}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                    Impact: {proj.estimatedImpact}
                  </div>
                  <div className="text-[11px] text-gray-500">Contact: {proj.contactInformation}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
