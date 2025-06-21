
export interface ProjectInfo {
  name: string;
  description: string;
  zone: string;
  regions: string[];
  districts: string[];
  schemeName: string;
  totalArea?: number;
  potentialArea?: number;
  shapefileUrl?: string;
  soilType?: string;
  waterSources: string[];
  selectedWaterSource?: string;
  waterSourceName?: string;
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

// New zones structure
export const ZONES = {
  Kilimanjaro: ['Tanga', 'Arusha', 'Kilimanjaro'],
  Dodoma: ['Singida', 'Dodoma', 'Manyara'],
  Mbeya: ['Songwe', 'Njombe', 'Mbeya', 'Iringa'],
  Katavi: ['Katavi', 'Rukwa'],
  Morogoro: ['Pwani', 'Morogoro', 'Dar es Salaam'],
  Tabora: ['Tabora', 'Kigoma', 'Shinyanga'],
  Mwanza: ['Mwanza', 'Geita', 'Kagera', 'Simiyu'],  
  Mtwara: ['Mtwara', 'Lindi', 'Ruvuma'],
};

// Flatten regions from zones
export const REGIONS = Object.values(ZONES).flat();

// Expanded districts object
export const DISTRICTS: Record<string, string[]> = {
  Tanga: ['Tanga City', 'Muheza', 'Korogwe'],
  Arusha: ['Arusha City', 'Meru', 'Karatu'],
  Kilimanjaro: ['Moshi Urban', 'Hai', 'Rombo'],
  Singida: ['Singida Urban', 'Manyoni', 'Iramba'],
  Dodoma: ['Dodoma Urban', 'Bahi', 'Chamwino'],
  Manyara: ['Babati', 'Hanang', 'Kiteto'],
  Songwe: ['Ileje', 'Mbozi', 'Songwe'],
  Njombe: ['Njombe Urban', 'Makambako', "Wanging'ombe"],
  Mbeya: ['Mbeya Urban', 'Chunya', 'Mbarali'],
  Iringa: ['Iringa Urban', 'Kilolo', 'Mufindi'],
  Katavi: ['Mpanda', 'Mlele', 'Tanganyika'],
  Rukwa: ['Sumbawanga', 'Nkasi', 'Kalambo'],
  Pwani: ['Kibaha', 'Bagamoyo', 'Mkuranga'],
  Morogoro: ['Morogoro Urban', 'Kilosa', 'Mvomero'],
  'Dar es Salaam': ['Ilala', 'Kinondoni', 'Temeke'],
  Tabora: ['Tabora Urban', 'Igunga', 'Nzega'],
  Kigoma: ['Kigoma Urban', 'Kasulu', 'Kakonko'],
  Shinyanga: ['Shinyanga Urban', 'Kahama', 'Kishapu'],
};

export const WATER_SOURCES = [
  'River',
  'Lake',
  'Groundwater',
  'Canal',
  'Reservoir',
  'Rainwater Harvesting'
];

// Water source names by district
export const WATER_SOURCE_NAMES: Record<string, Record<string, string[]>> = {
  'Kigoma Urban': {
    Lake: ['Lake Tanganyika'],
    River: ['Malagarasi River', 'Ruchugi River'],
    Groundwater: ['Kigoma Aquifer', 'Urban Wells']
  },
  'Moshi Urban': {
    River: ['Pangani River', 'Weruweru River'],
    Groundwater: ['Kilimanjaro Aquifer'],
    Canal: ['Furrow Canal System']
  },
  'Arusha City': {
    River: ['Themi River', 'Tengeru River'],
    Lake: ['Lake Duluti'],
    Groundwater: ['Arusha Aquifer']
  },
  'Dodoma Urban': {
    River: ['Kizigo River', 'Bubu River'],
    Groundwater: ['Central Plateau Aquifer'],
    Reservoir: ['Hombolo Dam']
  },
  // Add more districts as needed - this is a sample
};

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
