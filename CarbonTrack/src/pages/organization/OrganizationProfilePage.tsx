import React, { useEffect, useState } from 'react';
import { organizationService } from '../../services/organizationService';
import { OrganizationProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Building2, CheckCircle2 } from 'lucide-react';

export const OrganizationProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [employeeCount, setEmployeeCount] = useState<number>(25);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getProfile();
      setProfile(data);
      setOrganizationName(data.organizationName || '');
      setIndustry(data.industry || '');
      setLocation(data.location || '');
      setEmployeeCount(data.employeeCount || 25);
    } catch {
      setError('Could not load organization profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(false);
    try {
      const updated = await organizationService.updateProfile({
        organizationName,
        industry,
        location,
        employeeCount,
      });
      setProfile(updated);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch {
      setError('Failed to update organization profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading organization profile..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Organization Profile</h1>
          <p className="text-sm text-gray-500">Corporate entity details and environmental reporting profile</p>
        </div>
      </div>

      <Card>
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Corporate profile updated successfully.
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Organization Legal / Trading Name"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
          />

          <Input
            label="Industry Sector"
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. Technology, Manufacturing, Healthcare"
            required
          />

          <Input
            label="Headquarters / Operational Location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Mumbai, Maharashtra, India"
            required
          />

          <Input
            label="Employee Headcount"
            type="number"
            min="1"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 1)}
            required
          />

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
              Save Corporate Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
