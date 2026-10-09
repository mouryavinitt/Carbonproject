import api from './api';
import { NgoProfile, NgoProject } from '../types';

const NGO_STORAGE_KEY = 'carbontrack_ngo_projects';
const NGO_PROFILE_KEY = 'carbontrack_ngo_profile';

export const ngoService = {
  async getProfile(): Promise<NgoProfile> {
    try {
      const res = await api.get<NgoProfile>('/ngos/profile');
      return res.data;
    } catch {
      const stored = localStorage.getItem(NGO_PROFILE_KEY);
      if (stored) return JSON.parse(stored);
      const user = JSON.parse(localStorage.getItem('carbontrack_user') || '{}');
      return {
        ngoName: user.name ? `${user.name} Foundation` : 'EcoRestoration Foundation',
        description: 'Community-driven ecological restoration and grassroots carbon sequestration initiatives.',
        location: 'Bengaluru, India',
        website: 'https://ecorestoration.org',
        contactEmail: user.email || 'contact@ecorestoration.org',
      };
    }
  },

  async updateProfile(profile: NgoProfile): Promise<NgoProfile> {
    try {
      const res = await api.put<NgoProfile>('/ngos/profile', profile);
      return res.data;
    } catch {
      localStorage.setItem(NGO_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }
  },

  async getMyProjects(): Promise<NgoProject[]> {
    try {
      const res = await api.get<NgoProject[]>('/ngos/projects');
      return res.data;
    } catch {
      return this.getLocalProjects();
    }
  },

  async getPublicProjects(): Promise<NgoProject[]> {
    try {
      const res = await api.get<NgoProject[]>('/public/ngo-projects');
      return res.data;
    } catch {
      return this.getLocalProjects();
    }
  },

  async createProject(project: Omit<NgoProject, 'id' | 'createdAt'>): Promise<NgoProject> {
    try {
      const res = await api.post<NgoProject>('/ngos/projects', project);
      return res.data;
    } catch {
      const newProj: NgoProject = {
        ...project,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      const list = this.getLocalProjects();
      list.unshift(newProj);
      localStorage.setItem(NGO_STORAGE_KEY, JSON.stringify(list));
      return newProj;
    }
  },

  async updateProject(id: number, project: Partial<NgoProject>): Promise<NgoProject> {
    try {
      const res = await api.put<NgoProject>(`/ngos/projects/${id}`, project);
      return res.data;
    } catch {
      const list = this.getLocalProjects();
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Project not found');
      list[idx] = { ...list[idx], ...project };
      localStorage.setItem(NGO_STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
  },

  async deleteProject(id: number): Promise<void> {
    try {
      await api.delete(`/ngos/projects/${id}`);
    } catch {
      const list = this.getLocalProjects().filter((p) => p.id !== id);
      localStorage.setItem(NGO_STORAGE_KEY, JSON.stringify(list));
    }
  },

  getLocalProjects(): NgoProject[] {
    const raw = localStorage.getItem(NGO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },
};
