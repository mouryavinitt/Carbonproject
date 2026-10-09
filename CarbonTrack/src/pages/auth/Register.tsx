import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Leaf } from 'lucide-react';
import { UserRole } from '../../types';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role')?.toUpperCase();
  const initialRole: UserRole =
    roleParam === 'ORGANIZATION' || roleParam === 'NGO' ? (roleParam as UserRole) : 'PERSONAL';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [organizationName, setOrganizationName] = useState('');
  const [industry, setIndustry] = useState('Technology & Services');
  const [ngoName, setNgoName] = useState('');
  const [location, setLocation] = useState('India');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        organizationName: role === 'ORGANIZATION' ? organizationName : undefined,
        industry: role === 'ORGANIZATION' ? industry : undefined,
        ngoName: role === 'NGO' ? ngoName : undefined,
        location,
      });

      if (role === 'ORGANIZATION') navigate('/organization/dashboard');
      else if (role === 'NGO') navigate('/ngo/dashboard');
      else navigate('/personal/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Leaf className="w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Carbon<span className="text-emerald-600">Track</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select your role to start tracking emissions with real scientific data
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-sm">
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name / Representative"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vinitt Mourya"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@carbontrack.org"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />

            <Select
              label="Select Role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { value: 'PERSONAL', label: '👤 Personal - Individual Footprint' },
                { value: 'ORGANIZATION', label: '🏢 Organization - Scope 1, 2, 3 Tracking' },
                { value: 'NGO', label: '🌱 NGO - Climate Projects & Impact' },
              ]}
            />

            {role === 'ORGANIZATION' && (
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-3 animate-in fade-in">
                <Input
                  label="Organization / Company Name"
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. EcoTech Renewable Ltd"
                  required
                />
                <Input
                  label="Industry Sector"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Information Technology"
                />
              </div>
            )}

            {role === 'NGO' && (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 space-y-3 animate-in fade-in">
                <Input
                  label="NGO / Non-Profit Name"
                  type="text"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  placeholder="e.g. Global Tree Foundation"
                  required
                />
              </div>
            )}

            <Input
              label="Location / Country"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New Delhi, India"
            />

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Register Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-600">
            Already registered?{' '}
            <Link to="/auth/login" className="font-semibold text-emerald-700 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
