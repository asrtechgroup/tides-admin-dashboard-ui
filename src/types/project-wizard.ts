
export interface ProjectInfo {
  name: string;
  description: string;
  zone: string;
  regions: string[];
  districts: string[];
  schemeName: string;
  shapefileUrl?: string;
  soilType?: string;
  waterSources: string[];
  cropVarieties: string[];
}

export interface CropCalendarEntry {
  cropName: string;
  plantedMonths: boolean[];
  potentialArea: number;
}

export interface CropWaterRequirement {
  cropName: string;
  waterRequirement: number;
  unit: string;
}

export interface HydraulicDesign {
  crossSectionUrl?: string;
  designParameters: Record<string, any>;
}

export interface BOQItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface ProjectWizardData {
  id?: string;
  step: number;
  projectInfo: ProjectInfo;
  cropCalendar: CropCalendarEntry[];
  cropWaterRequirements: CropWaterRequirement[];
  hydraulicDesign: HydraulicDesign;
  boqItems: BOQItem[];
  comments?: string;
  status: 'draft' | 'submitted' | 'approved';
  createdAt?: string;
  updatedAt?: string;
}

export const WIZARD_STEPS = [
  'Project Info & Upload',
  'Crop Calendar',
  'Scheme Design',
  'BOQ & Submission'
];

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const WATER_SOURCES = [
  'River',
  'Lake',
  'Groundwater',
  'Canal',
  'Reservoir',
  'Rainwater Harvesting'
];

export const CROP_VARIETIES = [
  'Wheat',
  'Rice',
  'Cotton',
  'Sugarcane',
  'Maize',
  'Soybean',
  'Vegetables',
  'Fruits'
];
