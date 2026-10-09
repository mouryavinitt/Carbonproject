import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Leaf, Lock, Mail, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const Login: React.FC = () => {
  const { login, switchRoleQuick } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('carbontrack_user') || '{}');
      if (user.role === 'ORGANIZATION') {
        navigate('/organization/dashboard');
      } else if (user.role === 'NGO') {
        navigate('/ngo/dashboard');
      } else {
        navigate('/personal/dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRoleQuick(role);
    if (role === 'ORGANIZATION') navigate('/organization/dashboard');
    else if (role === 'NGO') navigate('/ngo/dashboard');
    else navigate('/personal/dashboard');
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
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your credentials or use the demonstration access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-sm">
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              required
            />

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Access Buttons for college reviewers */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium text-center mb-3">
              College Evaluator / Instant Role Access:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('PERSONAL')}
                className="px-2.5 py-2 text-xs font-medium rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                👤 Personal
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ORGANIZATION')}
                className="px-2.5 py-2 text-xs font-medium rounded-lg border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                🏢 Org (Scopes)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('NGO')}
                className="px-2.5 py-2 text-xs font-medium rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                🌱 NGO
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            Don't have an account yet?{' '}
            <Link to="/auth/register" className="font-semibold text-emerald-700 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
