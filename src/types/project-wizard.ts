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

// Water source names by region instead of district
export const WATER_SOURCE_NAMES: Record<string, Record<string, string[]>> = {
  Kigoma: {
    Lake: ['Lake Tanganyika'],
    River: ['Malagarasi River', 'Ruchugi River', 'Lugufu River'],
    Groundwater: ['Kigoma Aquifer', 'Western Rift Aquifer']
  },
  Kilimanjaro: {
    River: ['Pangani River', 'Weruweru River', 'Kikuletwa River'],
    Groundwater: ['Kilimanjaro Aquifer', 'Northern Highlands Aquifer'],
    Canal: ['Furrow Canal System', 'Traditional Irrigation Canals']
  },
  Arusha: {
    River: ['Themi River', 'Tengeru River', 'Mto wa Mbu River'],
    Lake: ['Lake Duluti', 'Lake Manyara'],
    Groundwater: ['Arusha Aquifer', 'Northern Tanzania Aquifer']
  },
  Tanga: {
    River: ['Pangani River', 'Umba River', 'Zigi River'],
    Groundwater: ['Coastal Aquifer', 'Tanga Regional Aquifer'],
    Canal: ['Pangani Canal System']
  },
  Dodoma: {
    River: ['Kizigo River', 'Bubu River', 'Mvumi River'],
    Groundwater: ['Central Plateau Aquifer', 'Dodoma Basin Aquifer'],
    Reservoir: ['Hombolo Dam', 'Msalatu Dam']
  },
  Singida: {
    River: ['Wembere River', 'Kinyasungwe River'],
    Lake: ['Lake Singida', 'Lake Kindai'],
    Groundwater: ['Central Plateau Aquifer']
  },
  Manyara: {
    River: ['Tarangire River', 'Kwa Mtoro River'],
    Lake: ['Lake Manyara', 'Lake Babati'],
    Groundwater: ['Northern Highlands Aquifer']
  },
  Mbeya: {
    River: ['Great Ruaha River', 'Songwe River', 'Kiwira River'],
    Lake: ['Lake Rukwa', 'Lake Nyasa'],
    Groundwater: ['Southern Highlands Aquifer']
  },
  Iringa: {
    River: ['Great Ruaha River', 'Little Ruaha River', 'Kilombero River'],
    Groundwater: ['Southern Highlands Aquifer', 'Iringa Plateau Aquifer'],
    Reservoir: ['Mtera Dam', 'Kidatu Dam']
  },
  Njombe: {
    River: ['Ruhudje River', 'Livingstone River'],
    Lake: ['Lake Nyasa'],
    Groundwater: ['Southern Highlands Aquifer']
  },
  Songwe: {
    River: ['Songwe River', 'Kiwira River'],
    Lake: ['Lake Nyasa'],
    Groundwater: ['Southern Highlands Aquifer']
  },
  Morogoro: {
    River: ['Wami River', 'Ruvu River', 'Uluguru River'],
    Groundwater: ['Eastern Arc Aquifer', 'Coastal Basin Aquifer'],
    Canal: ['Wami-Ruvu Canal System']
  },
  Pwani: {
    River: ['Wami River', 'Ruvu River'],
    Groundwater: ['Coastal Aquifer', 'Dar es Salaam Aquifer'],
    Canal: ['Coastal Irrigation Canals']
  },
  'Dar es Salaam': {
    River: ['Msimbazi River', 'Kizinga River'],
    Groundwater: ['Dar es Salaam Aquifer', 'Coastal Aquifer']
  },
  Mwanza: {
    Lake: ['Lake Victoria'],
    River: ['Mara River', 'Grumeti River'],
    Groundwater: ['Lake Victoria Basin Aquifer']
  },
  Geita: {
    Lake: ['Lake Victoria'],
    River: ['Mara River', 'Nyashishi River'],
    Groundwater: ['Lake Victoria Basin Aquifer']
  },
  Kagera: {
    Lake: ['Lake Victoria'],
    River: ['Kagera River', 'Nyabarongo River'],
    Groundwater: ['Lake Victoria Basin Aquifer']
  },
  Simiyu: {
    Lake: ['Lake Victoria'],
    River: ['Simiyu River', 'Duma River'],
    Groundwater: ['Lake Victoria Basin Aquifer']
  },
  Tabora: {
    River: ['Wembere River', 'Ugalla River'],
    Groundwater: ['Central Plateau Aquifer', 'Tabora Regional Aquifer']
  },
  Shinyanga: {
    River: ['Wembere River', 'Manonga River'],
    Lake: ['Lake Shinyanga'],
    Groundwater: ['Central Plateau Aquifer']
  },
  Katavi: {
    River: ['Katuma River', 'Ugalla River'],
    Lake: ['Lake Katavi', 'Lake Chada'],
    Groundwater: ['Western Rift Aquifer']
  },
  Rukwa: {
    Lake: ['Lake Rukwa', 'Lake Tanganyika'],
    River: ['Momba River', 'Saisi River'],
    Groundwater: ['Western Rift Aquifer']
  },
  Mtwara: {
    River: ['Ruvuma River', 'Msangasi River'],
    Groundwater: ['Coastal Aquifer', 'Southern Coastal Aquifer']
  },
  Lindi: {
    River: ['Ruvuma River', 'Matandu River'],
    Groundwater: ['Coastal Aquifer', 'Southern Coastal Aquifer']
  },
  Ruvuma: {
    River: ['Ruvuma River', 'Muhuwesi River'],
    Lake: ['Lake Nyasa'],
    Groundwater: ['Southern Highlands Aquifer']
  }
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
