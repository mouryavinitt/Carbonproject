export type UserRole = 'PERSONAL' | 'ORGANIZATION' | 'NGO';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface EmissionFactor {
  id: number;
  category: string;
  activityType: string;
  unit: string;
  factor: number;
  sourceOrganization: string;
  sourceDocument: string;
  sourceUrl: string;
  year: string;
  methodology: string;
  scope?: string;
  active: boolean;
}

export interface ActivityInput {
  category: string;
  activityType: string;
  quantity: number;
  unit: string;
}

export interface CalculatedActivityItem {
  category: string;
  activityType: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emission: number; // in kg CO2e
  factorSource: string;
}

export interface CalculationResult {
  id: number;
  userId: number;
  calculationDate: string;
  period: string;
  totalEmission: number;
  electricityEmission: number;
  transportEmission: number;
  flightEmission: number;
  foodEmission: number;
  wasteEmission: number;
  otherEmission: number;
  highestCategory: string;
  createdAt: string;
  breakdown: CalculatedActivityItem[];
  recommendations: string[];
}

export interface PersonalDashboardData {
  userName: string;
  totalEmissionsRecorded: number;
  thisMonthEmissions: number;
  thisYearEmissions: number;
  highestCategory: string;
  totalCalculationsCount: number;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: { month: string; emission: number }[];
  reductionSuggestions: string[];
  recentCalculations: CalculationResult[];
}

export interface PersonalProfile {
  id?: number;
  userId?: number;
  name?: string;
  email?: string;
  location: string;
  occupation: string;
  bio: string;
}

export interface OrganizationProfile {
  id?: number;
  userId?: number;
  organizationName: string;
  industry: string;
  location: string;
  employeeCount: number;
  createdAt?: string;
}

export interface OrgEmissionItem {
  id: number;
  scope: string; // 'Scope 1' | 'Scope 2' | 'Scope 3'
  category: string;
  activityType: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emission: number;
  reportingPeriod: string;
  factorSource: string;
}

export interface OrganizationDashboardData {
  organizationName: string;
  industry: string;
  employeeCount: number;
  totalEmissions: number;
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  scopeBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: { period: string; total: number; scope1: number; scope2: number; scope3: number }[];
  recentActivities: OrgEmissionItem[];
}

export interface OrganizationReportData {
  organizationName: string;
  reportingPeriod: string;
  generatedAt: string;
  totalEmissions: number;
  scope1Total: number;
  scope2Total: number;
  scope3Total: number;
  scopePercentages: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  activities: OrgEmissionItem[];
}

export interface NgoProfile {
  id?: number;
  userId?: number;
  ngoName: string;
  description: string;
  location: string;
  website?: string;
  contactEmail?: string;
  createdAt?: string;
}

export interface NgoProject {
  id: number;
  ngoId?: number;
  ngoName?: string;
  title: string;
  description: string;
  goals: string;
  estimatedImpact: string;
  location: string;
  contactInformation: string;
  website?: string;
  createdAt?: string;
}
