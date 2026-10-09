import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Leaf,
  Menu,
  X,
  User,
  LogOut,
  Building2,
  HeartHandshake,
  BarChart3,
  Calculator,
  History,
  FileText,
  BookOpen,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchRoleQuick } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive(path)
        ? 'text-emerald-700 bg-emerald-50 font-semibold'
        : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Carbon<span className="text-emerald-600">Track</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <Link to="/" className={linkClass('/')}>
                  Home
                </Link>
                <Link to="/projects" className={linkClass('/projects')}>
                  NGO Projects
                </Link>
                <Link to="/methodology" className={linkClass('/methodology')}>
                  Methodology & Factors
                </Link>
              </>
            ) : user?.role === 'PERSONAL' ? (
              <>
                <Link to="/personal/dashboard" className={linkClass('/personal/dashboard')}>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" /> Dashboard
                  </span>
                </Link>
                <Link to="/personal/calculator" className={linkClass('/personal/calculator')}>
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" /> Calculator
                  </span>
                </Link>
                <Link to="/personal/history" className={linkClass('/personal/history')}>
                  <span className="flex items-center gap-1.5">
                    <History className="w-4 h-4" /> History
                  </span>
                </Link>
                <Link to="/projects" className={linkClass('/projects')}>
                  NGO Projects
                </Link>
                <Link to="/methodology" className={linkClass('/methodology')}>
                  Methodology
                </Link>
              </>
            ) : user?.role === 'ORGANIZATION' ? (
              <>
                <Link to="/organization/dashboard" className={linkClass('/organization/dashboard')}>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> Dashboard
                  </span>
                </Link>
                <Link to="/organization/activities" className={linkClass('/organization/activities')}>
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" /> Scope 1/2/3 Log
                  </span>
                </Link>
                <Link to="/organization/reports" className={linkClass('/organization/reports')}>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Reports
                  </span>
                </Link>
                <Link to="/methodology" className={linkClass('/methodology')}>
                  Methodology
                </Link>
              </>
            ) : (
              // NGO Role
              <>
                <Link to="/ngo/dashboard" className={linkClass('/ngo/dashboard')}>
                  <span className="flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4" /> Dashboard
                  </span>
                </Link>
                <Link to="/ngo/projects" className={linkClass('/ngo/projects')}>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4" /> My Projects
                  </span>
                </Link>
                <Link to="/projects" className={linkClass('/projects')}>
                  Public Directory
                </Link>
                <Link to="/methodology" className={linkClass('/methodology')}>
                  Methodology
                </Link>
              </>
            )}
          </nav>

          {/* Right Header: Role switcher / User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Active Role Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user.role}
                </div>

                {/* Profile Link */}
                <Link
                  to={
                    user.role === 'ORGANIZATION'
                      ? '/organization/profile'
                      : user.role === 'NGO'
                      ? '/ngo/profile'
                      : '/personal/profile'
                  }
                  className="flex items-center gap-2 p-1.5 text-gray-700 hover:text-emerald-700 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Profile Settings"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs shadow-emerald-700/20 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Home
              </Link>
              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                NGO Projects
              </Link>
              <Link
                to="/methodology"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Methodology
              </Link>
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : user?.role === 'PERSONAL' ? (
            <>
              <Link
                to="/personal/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Dashboard
              </Link>
              <Link
                to="/personal/calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Calculator
              </Link>
              <Link
                to="/personal/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                History
              </Link>
              <Link
                to="/personal/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Profile
              </Link>
              <Link
                to="/methodology"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Methodology
              </Link>
            </>
          ) : user?.role === 'ORGANIZATION' ? (
            <>
              <Link
                to="/organization/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Dashboard
              </Link>
              <Link
                to="/organization/activities"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Scopes Activity Log
              </Link>
              <Link
                to="/organization/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Reports
              </Link>
              <Link
                to="/organization/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/ngo/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Dashboard
              </Link>
              <Link
                to="/ngo/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Manage Projects
              </Link>
              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50"
              >
                Public Projects
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <div className="text-xs text-gray-500 px-3">
                Quick Role Preview Switcher:
              </div>
              <div className="flex gap-2 px-3">
                <button
                  onClick={() => { switchRoleQuick('PERSONAL'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-emerald-100 text-gray-700"
                >
                  Personal
                </button>
                <button
                  onClick={() => { switchRoleQuick('ORGANIZATION'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-emerald-100 text-gray-700"
                >
                  Org
                </button>
                <button
                  onClick={() => { switchRoleQuick('NGO'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-emerald-100 text-gray-700"
                >
                  NGO
                </button>
              </div>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-rose-600 font-medium text-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
