import api from './api';
import { ActivityInput, CalculationResult, PersonalDashboardData, PersonalProfile } from '../types';
import { calculateEmissions } from './calculationEngine';

const STORAGE_KEY = 'carbontrack_personal_calculations';
const PROFILE_KEY = 'carbontrack_personal_profile';

export const personalService = {
  async getProfile(): Promise<PersonalProfile> {
    try {
      const res = await api.get<PersonalProfile>('/personal/profile');
      return res.data;
    } catch {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) return JSON.parse(stored);
      const user = JSON.parse(localStorage.getItem('carbontrack_user') || '{}');
      return {
        name: user.name || 'User',
        email: user.email || 'user@example.com',
        location: 'New Delhi, India',
        occupation: 'Software Engineer',
        bio: 'Tracking my personal emissions to reduce carbon footprint.',
      };
    }
  },

  async updateProfile(profile: PersonalProfile): Promise<PersonalProfile> {
    try {
      const res = await api.put<PersonalProfile>('/personal/profile', profile);
      return res.data;
    } catch {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }
  },

  async calculateAndSave(activities: ActivityInput[], period: string): Promise<CalculationResult> {
    try {
      const res = await api.post<CalculationResult>('/personal/calculations', { activities, period });
      return res.data;
    } catch {
      // Offline calculation fallback using exact same scientific engine
      const result = calculateEmissions(activities, period);
      const current = this.getLocalCalculations();
      current.unshift(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return result;
    }
  },

  async getHistory(year?: string, month?: string): Promise<CalculationResult[]> {
    try {
      const res = await api.get<CalculationResult[]>('/personal/calculations', {
        params: { year, month },
      });
      return res.data;
    } catch {
      let list = this.getLocalCalculations();
      if (year) {
        list = list.filter((c) => c.calculationDate.startsWith(year));
      }
      if (month) {
        const mStr = month.padStart(2, '0');
        list = list.filter((c) => c.calculationDate.split('-')[1] === mStr);
      }
      return list;
    }
  },

  async getCalculationById(id: number): Promise<CalculationResult> {
    try {
      const res = await api.get<CalculationResult>(`/personal/calculations/${id}`);
      return res.data;
    } catch {
      const list = this.getLocalCalculations();
      const item = list.find((c) => c.id === id);
      if (!item) throw new Error('Calculation record not found.');
      return item;
    }
  },

  async deleteCalculation(id: number): Promise<void> {
    try {
      await api.delete(`/personal/calculations/${id}`);
    } catch {
      const list = this.getLocalCalculations().filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  },

  async getDashboard(): Promise<PersonalDashboardData> {
    try {
      const res = await api.get<PersonalDashboardData>('/personal/dashboard');
      return res.data;
    } catch {
      const calculations = this.getLocalCalculations();
      const user = JSON.parse(localStorage.getItem('carbontrack_user') || '{}');
      const userName = user.name || 'Friend';

      if (calculations.length === 0) {
        return {
          userName,
          totalEmissionsRecorded: 0,
          thisMonthEmissions: 0,
          thisYearEmissions: 0,
          highestCategory: 'None',
          totalCalculationsCount: 0,
          categoryBreakdown: {},
          monthlyTrend: [],
          reductionSuggestions: [
            'Welcome to CarbonTrack! You currently have no saved calculations.',
            'Use the Carbon Calculator to record your electricity, fuel, flights, diet, and waste to generate your customized reduction roadmap.',
          ],
          recentCalculations: [],
        };
      }

      const totalEmissionsRecorded = calculations.reduce((acc, c) => acc + c.totalEmission, 0);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const thisYearEmissions = calculations
        .filter((c) => new Date(c.calculationDate).getFullYear() === currentYear)
        .reduce((acc, c) => acc + c.totalEmission, 0);

      const thisMonthEmissions = calculations
        .filter((c) => {
          const d = new Date(c.calculationDate);
          return d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth;
        })
        .reduce((acc, c) => acc + c.totalEmission, 0);

      const categoryBreakdown: Record<string, number> = {
        Electricity: calculations.reduce((acc, c) => acc + (c.electricityEmission || 0), 0),
        Transport: calculations.reduce((acc, c) => acc + (c.transportEmission || 0), 0),
        Flights: calculations.reduce((acc, c) => acc + (c.flightEmission || 0), 0),
        Food: calculations.reduce((acc, c) => acc + (c.foodEmission || 0), 0),
        Waste: calculations.reduce((acc, c) => acc + (c.wasteEmission || 0), 0),
      };

      let highestCategory = 'Electricity';
      let maxCat = 0;
      for (const [k, v] of Object.entries(categoryBreakdown)) {
        if (v > maxCat) {
          maxCat = v;
          highestCategory = k;
        }
      }

      // Generate last 6 months trend
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        const yr = d.getFullYear();
        const mo = d.getMonth() + 1;
        const sum = calculations
          .filter((c) => {
            const cd = new Date(c.calculationDate);
            return cd.getFullYear() === yr && cd.getMonth() + 1 === mo;
          })
          .reduce((acc, c) => acc + c.totalEmission, 0);
        monthlyTrend.push({ month: mLabel, emission: Math.round(sum * 100) / 100 });
      }

      const reductionSuggestions = calculations[0]?.recommendations || [
        'Track recurring lifestyle and transport metrics regularly to identify reduction levers.',
      ];

      return {
        userName,
        totalEmissionsRecorded: Math.round(totalEmissionsRecorded * 100) / 100,
        thisMonthEmissions: Math.round(thisMonthEmissions * 100) / 100,
        thisYearEmissions: Math.round(thisYearEmissions * 100) / 100,
        highestCategory,
        totalCalculationsCount: calculations.length,
        categoryBreakdown,
        monthlyTrend,
        reductionSuggestions,
        recentCalculations: calculations.slice(0, 5),
      };
    }
  },

  getLocalCalculations(): CalculationResult[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },
};
