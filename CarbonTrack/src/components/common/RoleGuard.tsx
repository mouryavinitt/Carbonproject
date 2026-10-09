import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate home module
    if (user.role === 'ORGANIZATION') {
      return <Navigate to="/organization/dashboard" replace />;
    } else if (user.role === 'NGO') {
      return <Navigate to="/ngo/dashboard" replace />;
    } else {
      return <Navigate to="/personal/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
