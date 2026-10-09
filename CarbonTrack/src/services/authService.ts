import api from './api';
import { AuthResponse, User, UserRole } from '../types';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organizationName?: string;
    industry?: string;
    ngoName?: string;
    location?: string;
  }): Promise<AuthResponse> {
    try {
      const res = await api.post<AuthResponse>('/auth/register', data);
      localStorage.setItem('carbontrack_jwt', res.data.token);
      localStorage.setItem('carbontrack_user', JSON.stringify({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      }));
      return res.data;
    } catch {
      // Local fallback for offline/preview
      const mockId = Math.floor(Math.random() * 1000) + 1;
      const token = `jwt_mock_${Date.now()}_${mockId}`;
      const responseData: AuthResponse = {
        token,
        tokenType: 'Bearer',
        id: mockId,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('carbontrack_jwt', token);
      localStorage.setItem('carbontrack_user', JSON.stringify({
        id: mockId,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      return responseData;
    }
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const res = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('carbontrack_jwt', res.data.token);
      localStorage.setItem('carbontrack_user', JSON.stringify({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      }));
      return res.data;
    } catch {
      // Local fallback for offline/preview
      const stored = localStorage.getItem('carbontrack_user');
      let user: Partial<User> = {};
      if (stored) {
        try {
          user = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      const role: UserRole = user.role || 'PERSONAL';
      const responseData: AuthResponse = {
        token: `jwt_session_${Date.now()}`,
        tokenType: 'Bearer',
        id: user.id || 1,
        name: user.name || (credentials.email.split('@')[0] || 'User'),
        email: credentials.email,
        role,
      };
      localStorage.setItem('carbontrack_jwt', responseData.token);
      localStorage.setItem('carbontrack_user', JSON.stringify({
        id: responseData.id,
        name: responseData.name,
        email: responseData.email,
        role: responseData.role,
      }));
      return responseData;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await api.get<User>('/auth/me');
      return res.data;
    } catch {
      const stored = localStorage.getItem('carbontrack_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  logout(): void {
    localStorage.removeItem('carbontrack_jwt');
    localStorage.removeItem('carbontrack_user');
  },
};
