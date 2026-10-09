import api from './api';
import {
  OrganizationDashboardData,
  OrganizationProfile,
  OrganizationReportData,
  OrgEmissionItem,
} from '../types';
import { SCIENTIFIC_EMISSION_FACTORS } from '../data/scientificEmissionFactors';

const ORG_STORAGE_KEY = 'carbontrack_org_emissions';
const ORG_PROFILE_KEY = 'carbontrack_org_profile';

export const organizationService = {
  async getProfile(): Promise<OrganizationProfile> {
    try {
      const res = await api.get<OrganizationProfile>('/organizations/profile');
      return res.data;
    } catch {
      const stored = localStorage.getItem(ORG_PROFILE_KEY);
      if (stored) return JSON.parse(stored);
      const user = JSON.parse(localStorage.getItem('carbontrack_user') || '{}');
      return {
        organizationName: user.name ? `${user.name} Corp` : 'CleanEnergy Technologies',
        industry: 'Renewable & Technology',
        location: 'Mumbai, India',
        employeeCount: 45,
      };
    }
  },

  async updateProfile(profile: OrganizationProfile): Promise<OrganizationProfile> {
    try {
      const res = await api.put<OrganizationProfile>('/organizations/profile', profile);
      return res.data;
    } catch {
      localStorage.setItem(ORG_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }
  },

  async recordEmission(data: {
    scope: string;
    category: string;
    activityType: string;
    quantity: number;
    unit: string;
    reportingPeriod: string;
  }): Promise<OrgEmissionItem> {
    try {
      const res = await api.post<OrgEmissionItem>('/organizations/emissions', data);
      return res.data;
    } catch {
      // Local calculation fallback
      const factorObj = SCIENTIFIC_EMISSION_FACTORS.find(
        (f) => f.activityType.toLowerCase() === data.activityType.toLowerCase()
      );
      if (!factorObj) {
        throw new Error(`Verified emission factor for "${data.activityType}" not found.`);
      }
      const emission = Math.round(data.quantity * factorObj.factor * 100) / 100;
      const item: OrgEmissionItem = {
        id: Date.now(),
        scope: data.scope,
        category: factorObj.category,
        activityType: factorObj.activityType,
        quantity: data.quantity,
        unit: factorObj.unit,
        emissionFactor: factorObj.factor,
        emission,
        reportingPeriod: data.reportingPeriod,
        factorSource: `${factorObj.sourceOrganization} (${factorObj.year}) - ${factorObj.sourceDocument}`,
      };
      const list = this.getLocalEmissions();
      list.unshift(item);
      localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(list));
      return item;
    }
  },

  async getEmissions(period?: string): Promise<OrgEmissionItem[]> {
    try {
      const res = await api.get<OrgEmissionItem[]>('/organizations/emissions', {
        params: { period },
      });
      return res.data;
    } catch {
      let list = this.getLocalEmissions();
      if (period && period !== 'ALL') {
        list = list.filter((e) => e.reportingPeriod === period);
      }
      return list;
    }
  },

  async getDashboard(): Promise<OrganizationDashboardData> {
    try {
      const res = await api.get<OrganizationDashboardData>('/organizations/dashboard');
      return res.data;
    } catch {
      const profile = await this.getProfile();
      const list = this.getLocalEmissions();

      if (list.length === 0) {
        return {
          organizationName: profile.organizationName,
          industry: profile.industry,
          employeeCount: profile.employeeCount,
          totalEmissions: 0,
          scope1Emissions: 0,
          scope2Emissions: 0,
          scope3Emissions: 0,
          scopeBreakdown: { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 },
          categoryBreakdown: {},
          monthlyTrend: [],
          recentActivities: [],
        };
      }

      let s1 = 0;
      let s2 = 0;
      let s3 = 0;
      const catMap: Record<string, number> = {};
      const periodMap: Record<string, { total: number; s1: number; s2: number; s3: number }> = {};

      for (const e of list) {
        const val = e.emission;
        if (e.scope === 'Scope 1') s1 += val;
        else if (e.scope === 'Scope 2') s2 += val;
        else s3 += val;

        catMap[e.category] = (catMap[e.category] || 0) + val;

        const p = e.reportingPeriod;
        if (!periodMap[p]) periodMap[p] = { total: 0, s1: 0, s2: 0, s3: 0 };
        periodMap[p].total += val;
        if (e.scope === 'Scope 1') periodMap[p].s1 += val;
        else if (e.scope === 'Scope 2') periodMap[p].s2 += val;
        else periodMap[p].s3 += val;
      }

      const total = s1 + s2 + s3;

      const monthlyTrend = Object.entries(periodMap).map(([p, v]) => ({
        period: p,
        total: Math.round(v.total * 100) / 100,
        scope1: Math.round(v.s1 * 100) / 100,
        scope2: Math.round(v.s2 * 100) / 100,
        scope3: Math.round(v.s3 * 100) / 100,
      }));

      return {
        organizationName: profile.organizationName,
        industry: profile.industry,
        employeeCount: profile.employeeCount,
        totalEmissions: Math.round(total * 100) / 100,
        scope1Emissions: Math.round(s1 * 100) / 100,
        scope2Emissions: Math.round(s2 * 100) / 100,
        scope3Emissions: Math.round(s3 * 100) / 100,
        scopeBreakdown: {
          'Scope 1': Math.round(s1 * 100) / 100,
          'Scope 2': Math.round(s2 * 100) / 100,
          'Scope 3': Math.round(s3 * 100) / 100,
        },
        categoryBreakdown: catMap,
        monthlyTrend,
        recentActivities: list.slice(0, 10),
      };
    }
  },

  async getReports(period: string = 'ALL'): Promise<OrganizationReportData> {
    try {
      const res = await api.get<OrganizationReportData>('/organizations/reports', {
        params: { period },
      });
      return res.data;
    } catch {
      const profile = await this.getProfile();
      let list = this.getLocalEmissions();
      if (period !== 'ALL') {
        list = list.filter((e) => e.reportingPeriod === period);
      }

      let s1 = 0;
      let s2 = 0;
      let s3 = 0;
      const catMap: Record<string, number> = {};

      for (const e of list) {
        if (e.scope === 'Scope 1') s1 += e.emission;
        else if (e.scope === 'Scope 2') s2 += e.emission;
        else s3 += e.emission;

        catMap[e.category] = (catMap[e.category] || 0) + e.emission;
      }

      const total = s1 + s2 + s3;

      return {
        organizationName: profile.organizationName,
        reportingPeriod: period === 'ALL' ? 'Complete Corporate History' : period,
        generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        totalEmissions: Math.round(total * 100) / 100,
        scope1Total: Math.round(s1 * 100) / 100,
        scope2Total: Math.round(s2 * 100) / 100,
        scope3Total: Math.round(s3 * 100) / 100,
        scopePercentages: {
          'Scope 1': total > 0 ? Math.round((s1 / total) * 1000) / 10 : 0,
          'Scope 2': total > 0 ? Math.round((s2 / total) * 1000) / 10 : 0,
          'Scope 3': total > 0 ? Math.round((s3 / total) * 1000) / 10 : 0,
        },
        categoryBreakdown: catMap,
        activities: list,
      };
    }
  },

  getLocalEmissions(): OrgEmissionItem[] {
    const raw = localStorage.getItem(ORG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },
};
