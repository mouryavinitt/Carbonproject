import React, { useEffect, useState } from 'react';
import { personalService } from '../../services/personalService';
import { PersonalProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { User, CheckCircle2 } from 'lucide-react';

export const PersonalProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PersonalProfile | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
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
      const data = await personalService.getProfile();
      setProfile(data);
      setName(data.name || '');
      setLocation(data.location || '');
      setOccupation(data.occupation || '');
      setBio(data.bio || '');
    } catch {
      setError('Could not load profile details.');
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
      const updated = await personalService.updateProfile({
        name,
        location,
        occupation,
        bio,
      });
      setProfile(updated);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading user profile..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Personal Profile</h1>
          <p className="text-sm text-gray-500">Manage account information and location preferences</p>
        </div>
      </div>

      <Card>
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile updated successfully.
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="text-xs text-gray-500 font-medium">
            Email: <span className="text-gray-900 font-semibold">{profile?.email || 'N/A'}</span>
          </div>

          <Input
            label="Location (City, Country)"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. New Delhi, India"
          />

          <Input
            label="Occupation / Sector"
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="e.g. Environmental Science Researcher"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Personal Carbon Goal / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Aiming to cut household power consumption by 20% in 2026."
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
