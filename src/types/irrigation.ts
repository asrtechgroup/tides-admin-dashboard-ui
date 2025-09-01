
export interface IrrigationTechnology {
  id: string;
  name: string;
  type: 'drip' | 'sprinkler' | 'micro-spray' | 'surface' | 'subsurface';
  description: string;
  specifications: TechSpecification[];
  costingRules: CostingRule[];
  suitabilityCriteria: SuitabilityCriteria;
  efficiency: number;
  waterRequirement: number;
  maintenanceLevel: 'low' | 'medium' | 'high';
  lifespan: number;
  createdAt: string;
  updatedAt: string;
}

export interface TechSpecification {
  parameter: string;
  value: string;
  unit: string;
  description: string;
}

export interface CostingRule {
  component: string;
  costPerUnit: number;
  unit: string;
  formula: string;
  factors: string[];
}

export interface SuitabilityCriteria {
  soilTypes: string[];
  cropTypes: string[];
  farmSizes: string[];
  waterQuality: string[];
  topography: string[];
  climateZones: string[];
}

export interface TechnologyEntry {
  id?: string;
  technology_name: 'surface' | 'subsurface' | 'pressurized';
  irrigation_type: string;
  description?: string;
  efficiency: number;
  water_requirement: number;
  lifespan: number;
  maintenance_level: 'low' | 'medium' | 'high';
  suitable_soil_types: string[];
  suitable_crop_types: string[];
  suitable_farm_sizes: string[];
  water_quality_requirements: string[];
  suitable_topography: string[];
  climate_zones: string[];
  created_at?: string;
  updated_at?: string;
}
