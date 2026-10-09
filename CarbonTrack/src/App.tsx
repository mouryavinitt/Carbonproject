import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RoleGuard } from './components/common/RoleGuard';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Personal
import { PersonalDashboard } from './pages/personal/PersonalDashboard';
import { PersonalCalculator } from './pages/personal/PersonalCalculator';
import { PersonalHistory } from './pages/personal/PersonalHistory';
import { PersonalProfilePage } from './pages/personal/PersonalProfilePage';

// Organization
import { OrganizationDashboard } from './pages/organization/OrganizationDashboard';
import { OrganizationActivities } from './pages/organization/OrganizationActivities';
import { OrganizationReports } from './pages/organization/OrganizationReports';
import { OrganizationProfilePage } from './pages/organization/OrganizationProfilePage';

// NGO
import { NgoDashboard } from './pages/ngo/NgoDashboard';
import { NgoProjectsPage } from './pages/ngo/NgoProjectsPage';
import { NgoProfilePage } from './pages/ngo/NgoProfilePage';

// Public
import { PublicProjects } from './pages/public/PublicProjects';
import { Methodology } from './pages/public/Methodology';
import { NotFound } from './pages/public/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/projects" element={<PublicProjects />} />
              <Route path="/methodology" element={<Methodology />} />

              {/* Personal Routes */}
              <Route
                path="/personal/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['PERSONAL', 'ORGANIZATION', 'NGO']}>
                      <PersonalDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/personal/calculator"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['PERSONAL', 'ORGANIZATION', 'NGO']}>
                      <PersonalCalculator />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/personal/history"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['PERSONAL', 'ORGANIZATION', 'NGO']}>
                      <PersonalHistory />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/personal/profile"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['PERSONAL', 'ORGANIZATION', 'NGO']}>
                      <PersonalProfilePage />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* Organization Routes */}
              <Route
                path="/organization/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['ORGANIZATION']}>
                      <OrganizationDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organization/activities"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['ORGANIZATION']}>
                      <OrganizationActivities />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organization/reports"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['ORGANIZATION']}>
                      <OrganizationReports />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organization/profile"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['ORGANIZATION']}>
                      <OrganizationProfilePage />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* NGO Routes */}
              <Route
                path="/ngo/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['NGO']}>
                      <NgoDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/projects"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['NGO']}>
                      <NgoProjectsPage />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/profile"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['NGO']}>
                      <NgoProfilePage />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
