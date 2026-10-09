import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { NgoProject } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Plus, Edit3, Trash2, MapPin, Globe, Leaf, CheckCircle2 } from 'lucide-react';

export const NgoProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<NgoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<NgoProject | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [estimatedImpact, setEstimatedImpact] = useState('');
  const [location, setLocation] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await ngoService.getMyProjects();
      setProjects(data);
    } catch {
      setError('Could not load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setGoals('');
    setEstimatedImpact('');
    setLocation('India');
    setContactInformation('');
    setWebsite('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: NgoProject) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setGoals(proj.goals);
    setEstimatedImpact(proj.estimatedImpact);
    setLocation(proj.location);
    setContactInformation(proj.contactInformation);
    setWebsite(proj.website || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !goals.trim() || !estimatedImpact.trim() || !location.trim() || !contactInformation.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProject) {
        const updated = await ngoService.updateProject(editingProject.id, {
          title,
          description,
          goals,
          estimatedImpact,
          location,
          contactInformation,
          website,
        });
        setProjects(projects.map((p) => (p.id === editingProject.id ? updated : p)));
      } else {
        const created = await ngoService.createProject({
          title,
          description,
          goals,
          estimatedImpact,
          location,
          contactInformation,
          website,
        });
        setProjects([created, ...projects]);
      }
      setIsModalOpen(false);
    } catch {
      alert('Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await ngoService.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch {
      alert('Could not delete project.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Manage NGO Environmental Projects
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Publish, edit, and document grassroots climate mitigation and community initiatives.
          </p>
        </div>

        <Button onClick={handleOpenCreateModal} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Project
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner message="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Leaf}
          title="No projects published yet"
          description="Your organization has not added any climate initiatives yet. Click the button below to publish your first restoration, recycling, or clean energy program."
          actionText="Create Project Now"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {proj.location}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(proj)}
                      className="p-1 text-gray-400 hover:text-emerald-700 rounded transition-colors cursor-pointer"
                      title="Edit project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                  {proj.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                  {proj.description}
                </p>

                <div className="text-xs text-gray-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                  <span className="font-semibold block text-[11px] text-gray-500 uppercase mb-0.5">Key Goals:</span>
                  <p className="line-clamp-2">{proj.goals}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Estimated Impact: {proj.estimatedImpact}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  Contact: <span className="text-gray-700 font-medium">{proj.contactInformation}</span>
                </div>
                {proj.website && (
                  <div className="text-[11px] text-emerald-700 truncate">
                    <a href={proj.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {proj.website}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Project Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Environmental Project' : 'Create New Environmental Project'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Project Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mangrove Ecological Restoration & Tidal Sequestration"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the initiative, local community engagement, and environmental focus..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Objectives & Milestones
            </label>
            <textarea
              rows={2}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g. Plant 50,000 indigenous trees by Q4 2026; engage 200 local farmers."
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Carbon / Eco Impact"
              type="text"
              value={estimatedImpact}
              onChange={(e) => setEstimatedImpact(e.target.value)}
              placeholder="e.g. 1,500 tonnes CO2e sequestered annually"
              required
            />

            <Input
              label="Project Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sundarbans, West Bengal, India"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email or Phone"
              type="text"
              value={contactInformation}
              onChange={(e) => setContactInformation(e.target.value)}
              placeholder="e.g. projects@ecofoundation.org"
              required
            />

            <Input
              label="Website URL (optional)"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              {editingProject ? 'Save Changes' : 'Publish Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
