
export interface Material {
  id: string;
  name: string;
  category: 'pipes' | 'fittings' | 'valves' | 'pumps' | 'controllers' | 'sensors' | 'other';
  unit: string;
  basePrice: number;
  supplier: string;
  specifications: string;
  regionalPricing: RegionalPrice[];
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'excavator' | 'trencher' | 'pump' | 'generator' | 'compactor' | 'other';
  hourlyRate: number;
  dailyRate: number;
  operator: boolean;
  fuelConsumption: number;
  availability: string[];
  regionalRates: RegionalRate[];
  createdAt: string;
  updatedAt: string;
}

export interface RegionalPrice {
  region: string;
  price: number;
  transportCost: number;
}

export interface RegionalRate {
  region: string;
  hourlyRate: number;
  dailyRate: number;
}

export interface Labor {
  id: string;
  skill: string;
  dailyRate: number;
  region: string;
  experience: 'entry' | 'intermediate' | 'expert';
  createdAt: string;
  updatedAt: string;
}
