import { ActivityInput, CalculatedActivityItem, CalculationResult } from '../types';
import { SCIENTIFIC_EMISSION_FACTORS } from '../data/scientificEmissionFactors';

export function calculateEmissions(activities: ActivityInput[], period: string = 'Current Calculation'): CalculationResult {
  if (!activities || activities.length === 0) {
    throw new Error('At least one activity input is required to compute emissions.');
  }

  let totalEmission = 0;
  let electricityEmission = 0;
  let transportEmission = 0;
  let flightEmission = 0;
  let foodEmission = 0;
  let wasteEmission = 0;
  let otherEmission = 0;

  const breakdown: CalculatedActivityItem[] = [];
  const categoryTotals: Record<string, number> = {};

  for (const act of activities) {
    if (act.quantity <= 0) {
      throw new Error(`Quantity for activity "${act.activityType}" must be greater than zero.`);
    }

    const factorObj = SCIENTIFIC_EMISSION_FACTORS.find(
      (f) => f.activityType.toLowerCase() === act.activityType.toLowerCase()
    );

    if (!factorObj) {
      throw new Error(`No verified scientific emission factor registered for activity: "${act.activityType}". Authoritative source required.`);
    }

    if (factorObj.unit.toLowerCase() !== act.unit.trim().toLowerCase()) {
      throw new Error(`Unit mismatch for "${act.activityType}": expected verified unit "${factorObj.unit}", received "${act.unit}".`);
    }

    // Scientific formula: Emissions = Activity Data * Emission Factor
    const rawEmission = act.quantity * factorObj.factor;
    const computedEmission = Math.round(rawEmission * 100) / 100;

    totalEmission += computedEmission;

    const cat = factorObj.category;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + computedEmission;

    if (cat === 'Electricity') {
      electricityEmission += computedEmission;
    } else if (cat === 'Fuel' || cat === 'Transport') {
      transportEmission += computedEmission;
    } else if (cat === 'Flights') {
      flightEmission += computedEmission;
    } else if (cat === 'Food') {
      foodEmission += computedEmission;
    } else if (cat === 'Waste') {
      wasteEmission += computedEmission;
    } else {
      otherEmission += computedEmission;
    }

    breakdown.push({
      category: factorObj.category,
      activityType: factorObj.activityType,
      quantity: act.quantity,
      unit: factorObj.unit,
      emissionFactor: factorObj.factor,
      emission: computedEmission,
      factorSource: `${factorObj.sourceOrganization} (${factorObj.year}) - ${factorObj.sourceDocument}`,
    });
  }

  // Find highest category
  let highestCategory = 'None';
  let maxCatEmission = 0;
  for (const [cat, val] of Object.entries(categoryTotals)) {
    if (val > maxCatEmission) {
      maxCatEmission = val;
      highestCategory = cat;
    }
  }

  const recommendations = generateRecommendations(highestCategory, totalEmission);

  return {
    id: Date.now(),
    userId: 1,
    calculationDate: new Date().toISOString().split('T')[0],
    period,
    totalEmission: Math.round(totalEmission * 100) / 100,
    electricityEmission: Math.round(electricityEmission * 100) / 100,
    transportEmission: Math.round(transportEmission * 100) / 100,
    flightEmission: Math.round(flightEmission * 100) / 100,
    foodEmission: Math.round(foodEmission * 100) / 100,
    wasteEmission: Math.round(wasteEmission * 100) / 100,
    otherEmission: Math.round(otherEmission * 100) / 100,
    highestCategory,
    createdAt: new Date().toISOString(),
    breakdown,
    recommendations,
  };
}

export function generateRecommendations(highestCategory: string, totalEmission: number): string[] {
  const suggestions: string[] = [];

  if (highestCategory === 'Electricity') {
    suggestions.push(
      'Electricity is currently your largest recorded source of emissions. Consider switching to BEE 5-star energy-efficient appliances, LED lighting, or rooftop solar to reduce grid power draw.',
      'Phantom load reduction: Unplug idle chargers and entertainment equipment on standby to save up to 10% on domestic electricity consumption.'
    );
  } else if (highestCategory === 'Transport' || highestCategory === 'Fuel') {
    suggestions.push(
      'Transport contributes significantly to your footprint. Consider replacing solo car trips with metro, local buses, carpooling, or electric two-wheelers.',
      'For journeys under 3 km, walking or bicycling produces zero direct carbon emissions.'
    );
  } else if (highestCategory === 'Flights') {
    suggestions.push(
      'Aviation has the highest carbon intensity per passenger-kilometer due to high-altitude radiative forcing. For domestic trips under 600 km, opting for express rail saves up to 80% emissions.',
      'Consolidate multiple short business trips into virtual meetings or single itinerary trips where practical.'
    );
  } else if (highestCategory === 'Food') {
    suggestions.push(
      'Food and lifestyle emissions represent your primary footprint. Adopting a flexitarian diet (reducing high-impact red meat and dairy by 2-3 days a week) can reduce dietary emissions by up to 35%.',
      'Minimize domestic food waste by planned meal prep, as unconsumed food in landfill generates potent methane emissions.'
    );
  } else if (highestCategory === 'Waste') {
    suggestions.push(
      'Waste management is your top category. Segregating kitchen organic waste for local composting reduces landfill methane production by over 90%.',
      'Prioritize reusable packaging and ensure dry recyclables (paper, PET, aluminium) are routed to verified recycling streams.'
    );
  } else {
    suggestions.push('Track your recurring energy and travel habits regularly to identify gradual reduction opportunities.');
  }

  if (totalEmission > 500) {
    suggestions.push('Your recorded footprint exceeds the regional monthly median benchmark. Prioritizing efficiency in your top two categories will yield immediate impact.');
  }

  return suggestions;
}
