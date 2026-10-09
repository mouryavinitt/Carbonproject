import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { NgoProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { HeartHandshake, CheckCircle2 } from 'lucide-react';

export const NgoProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<NgoProfile | null>(null);
  const [ngoName, setNgoName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
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
      const data = await ngoService.getProfile();
      setProfile(data);
      setNgoName(data.ngoName || '');
      setDescription(data.description || '');
      setLocation(data.location || '');
      setWebsite(data.website || '');
      setContactEmail(data.contactEmail || '');
    } catch {
      setError('Could not load NGO profile.');
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
      const updated = await ngoService.updateProfile({
        ngoName,
        description,
        location,
        website,
        contactEmail,
      });
      setProfile(updated);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch {
      setError('Failed to update NGO profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading NGO profile..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">NGO Profile</h1>
          <p className="text-sm text-gray-500">Public organization profile and contact information</p>
        </div>
      </div>

      <Card>
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            NGO profile updated successfully.
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="NGO / Non-Profit Legal Name"
            type="text"
            value={ngoName}
            onChange={(e) => setNgoName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mission / Organization Overview
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your environmental mission and community impact focus..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <Input
            label="Operational Location / Headquarters"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bengaluru, Karnataka, India"
            required
          />

          <Input
            label="Public Contact Email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="contact@ngodomain.org"
            required
          />

          <Input
            label="Official Website URL"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
          />

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
              Save NGO Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
