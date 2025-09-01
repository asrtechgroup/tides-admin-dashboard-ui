
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

export interface DashboardStats {
  total_users?: number;
  total_projects?: number;
  system_activity?: number;
  security_alerts?: number;
  kpi_changes?: {
    users?: string;
    users_type?: 'positive' | 'negative';
    projects?: string;
    projects_type?: 'positive' | 'negative';
    activity?: string;
    activity_type?: 'positive' | 'negative';
    security?: string;
    security_type?: 'positive' | 'negative';
    alerts?: string;
    alerts_type?: 'positive' | 'negative';
    engineer_projects?: string;
    engineer_projects_type?: 'positive' | 'negative';
    engineer_boqs?: string;
    engineer_boqs_type?: 'positive' | 'negative';
    engineer_systems?: string;
    engineer_systems_type?: 'positive' | 'negative';
    engineer_efficiency?: string;
    engineer_efficiency_type?: 'positive' | 'negative';
    planner_projects?: string;
    planner_projects_type?: 'positive' | 'negative';
    planner_sites?: string;
    planner_sites_type?: 'positive' | 'negative';
    planner_reports?: string;
    planner_reports_type?: 'positive' | 'negative';
    planner_success?: string;
    planner_success_type?: 'positive' | 'negative';
  };
  recent_activities?: any[];
  engineer_active_projects?: number;
  engineer_boqs_completed?: number;
  engineer_systems_designed?: number;
  engineer_efficiency_rate?: number;
  engineer_recent_work?: any[];
  planner_projects?: number;
  planner_sites_analyzed?: number;
  planner_reports_generated?: number;
  planner_project_success?: number;
  planner_recent_activities?: any[];
  viewer_projects_accessible?: number;
  viewer_reports_available?: number;
  viewer_locations_covered?: number;
  viewer_last_updated?: string;
}
