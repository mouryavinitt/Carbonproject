import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organizationName?: string;
    industry?: string;
    ngoName?: string;
    location?: string;
  }) => Promise<void>;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('carbontrack_jwt');
    const savedUser = localStorage.getItem('carbontrack_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('carbontrack_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      setToken(res.token);
      setUser({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organizationName?: string;
    industry?: string;
    ngoName?: string;
    location?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setToken(res.token);
      setUser({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const switchRoleQuick = (newRole: UserRole) => {
    if (!user) {
      const defaultUser: User = {
        id: 1,
        name: newRole === 'PERSONAL' ? 'Dr. Sharma' : newRole === 'ORGANIZATION' ? 'EcoTech Industries' : 'Green Earth Trust',
        email: `${newRole.toLowerCase()}@carbontrack.org`,
        role: newRole,
      };
      setUser(defaultUser);
      localStorage.setItem('carbontrack_user', JSON.stringify(defaultUser));
      localStorage.setItem('carbontrack_jwt', `jwt_demo_${newRole}`);
      setToken(`jwt_demo_${newRole}`);
      return;
    }

    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem('carbontrack_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        switchRoleQuick,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
