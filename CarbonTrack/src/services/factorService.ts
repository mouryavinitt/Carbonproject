import api from './api';
import { EmissionFactor } from '../types';
import { SCIENTIFIC_EMISSION_FACTORS } from '../data/scientificEmissionFactors';

export const factorService = {
  async getAllFactors(category?: string): Promise<EmissionFactor[]> {
    try {
      const res = await api.get<EmissionFactor[]>('/emission-factors', {
        params: { category },
      });
      return res.data;
    } catch {
      if (category && category !== 'All') {
        return SCIENTIFIC_EMISSION_FACTORS.filter(
          (f) => f.category.toLowerCase() === category.toLowerCase()
        );
      }
      return SCIENTIFIC_EMISSION_FACTORS;
    }
  },

  async getFactorById(id: number): Promise<EmissionFactor> {
    try {
      const res = await api.get<EmissionFactor>(`/emission-factors/${id}`);
      return res.data;
    } catch {
      const found = SCIENTIFIC_EMISSION_FACTORS.find((f) => f.id === id);
      if (!found) throw new Error('Emission factor not found.');
      return found;
    }
  },
};
