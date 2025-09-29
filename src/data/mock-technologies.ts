// Mock data for irrigation technologies
export const mockTechnologies = [
  // Surface Irrigation
  {
    id: 1,
    technology_name: "surface",
    irrigation_type: "basin_irrigation",
    efficiency: 65.00,
    maintenance_level: "low",
    description: "Traditional basin irrigation method suitable for rice and wheat cultivation",
    cost_per_hectare: 25000.00,
    water_requirement_factor: 1.0,
    suitable_crops: ["Rice", "Wheat", "Sugarcane"]
  },
  {
    id: 2,
    technology_name: "surface",
    irrigation_type: "furrow_irrigation",
    efficiency: 70.00,
    maintenance_level: "low",
    description: "Furrow irrigation for row crops like cotton and maize",
    cost_per_hectare: 30000.00,
    water_requirement_factor: 0.9,
    suitable_crops: ["Cotton", "Maize", "Soybean"]
  },
  {
    id: 3,
    technology_name: "surface",
    irrigation_type: "border_irrigation",
    efficiency: 75.00,
    maintenance_level: "medium",
    description: "Border irrigation for field crops with uniform slopes",
    cost_per_hectare: 35000.00,
    water_requirement_factor: 0.8,
    suitable_crops: ["Wheat", "Barley", "Mustard"]
  },
  
  // Subsurface Irrigation
  {
    id: 4,
    technology_name: "subsurface",
    irrigation_type: "subsurface_drip",
    efficiency: 90.00,
    maintenance_level: "high",
    description: "Subsurface drip irrigation with buried laterals",
    cost_per_hectare: 125000.00,
    water_requirement_factor: 0.6,
    suitable_crops: ["Tomato", "Pepper", "Grapes"]
  },
  {
    id: 5,
    technology_name: "subsurface",
    irrigation_type: "capillary_irrigation",
    efficiency: 85.00,
    maintenance_level: "medium",
    description: "Capillary irrigation system for greenhouse cultivation",
    cost_per_hectare: 80000.00,
    water_requirement_factor: 0.7,
    suitable_crops: ["Lettuce", "Herbs", "Flowers"]
  },
  
  // Pressurized Irrigation
  {
    id: 6,
    technology_name: "pressurized",
    irrigation_type: "drip_irrigation",
    efficiency: 90.00,
    maintenance_level: "high",
    description: "Surface drip irrigation system with emitters",
    cost_per_hectare: 100000.00,
    water_requirement_factor: 0.6,
    suitable_crops: ["Tomato", "Onion", "Groundnut", "Cotton"]
  },
  {
    id: 7,
    technology_name: "pressurized",
    irrigation_type: "micro_sprinkler",
    efficiency: 85.00,
    maintenance_level: "medium",
    description: "Micro sprinkler irrigation for fruit trees and vegetables",
    cost_per_hectare: 75000.00,
    water_requirement_factor: 0.7,
    suitable_crops: ["Mango", "Citrus", "Pomegranate", "Vegetables"]
  },
  {
    id: 8,
    technology_name: "pressurized",
    irrigation_type: "center_pivot",
    efficiency: 80.00,
    maintenance_level: "high",
    description: "Center pivot irrigation system for large fields",
    cost_per_hectare: 150000.00,
    water_requirement_factor: 0.8,
    suitable_crops: ["Wheat", "Maize", "Soybean", "Sunflower"]
  }
];

export const mockCrops = [
  // Cereals
  {
    id: 1,
    name: "Rice",
    crop_type: "cereal",
    growth_duration: 120,
    kc_initial: 1.000,
    kc_development: 1.200,
    kc_mid: 1.200,
    kc_late: 0.600,
    initial_stage_days: 30,
    development_stage_days: 30,
    mid_stage_days: 40,
    late_stage_days: 20,
    water_requirement: 1500, // mm per season
    yield_potential: 6.5 // tons per hectare
  },
  {
    id: 2,
    name: "Wheat",
    crop_type: "cereal",
    growth_duration: 150,
    kc_initial: 0.400,
    kc_development: 0.700,
    kc_mid: 1.150,
    kc_late: 0.400,
    initial_stage_days: 20,
    development_stage_days: 60,
    mid_stage_days: 50,
    late_stage_days: 20,
    water_requirement: 650,
    yield_potential: 4.5
  },
  {
    id: 3,
    name: "Maize",
    crop_type: "cereal",
    growth_duration: 125,
    kc_initial: 0.300,
    kc_development: 0.700,
    kc_mid: 1.200,
    kc_late: 0.600,
    initial_stage_days: 20,
    development_stage_days: 35,
    mid_stage_days: 40,
    late_stage_days: 30,
    water_requirement: 800,
    yield_potential: 8.0
  },
  
  // Legumes
  {
    id: 4,
    name: "Groundnut",
    crop_type: "legume",
    growth_duration: 130,
    kc_initial: 0.400,
    kc_development: 0.800,
    kc_mid: 1.150,
    kc_late: 0.600,
    initial_stage_days: 25,
    development_stage_days: 35,
    mid_stage_days: 45,
    late_stage_days: 25,
    water_requirement: 700,
    yield_potential: 2.5
  },
  {
    id: 5,
    name: "Soybean",
    crop_type: "legume",
    growth_duration: 135,
    kc_initial: 0.400,
    kc_development: 0.800,
    kc_mid: 1.150,
    kc_late: 0.500,
    initial_stage_days: 20,
    development_stage_days: 30,
    mid_stage_days: 60,
    late_stage_days: 25,
    water_requirement: 650,
    yield_potential: 3.0
  },
  
  // Vegetables
  {
    id: 6,
    name: "Tomato",
    crop_type: "vegetable",
    growth_duration: 135,
    kc_initial: 0.600,
    kc_development: 1.150,
    kc_mid: 1.150,
    kc_late: 0.800,
    initial_stage_days: 30,
    development_stage_days: 40,
    mid_stage_days: 40,
    late_stage_days: 25,
    water_requirement: 800,
    yield_potential: 60.0
  },
  {
    id: 7,
    name: "Onion",
    crop_type: "vegetable",
    growth_duration: 210,
    kc_initial: 0.700,
    kc_development: 1.050,
    kc_mid: 1.050,
    kc_late: 0.750,
    initial_stage_days: 15,
    development_stage_days: 25,
    mid_stage_days: 110,
    late_stage_days: 60,
    water_requirement: 550,
    yield_potential: 40.0
  },
  
  // Cash Crops
  {
    id: 8,
    name: "Cotton",
    crop_type: "cash_crop",
    growth_duration: 180,
    kc_initial: 0.350,
    kc_development: 0.800,
    kc_mid: 1.200,
    kc_late: 0.700,
    initial_stage_days: 30,
    development_stage_days: 50,
    mid_stage_days: 60,
    late_stage_days: 40,
    water_requirement: 900,
    yield_potential: 2.8
  },
  {
    id: 9,
    name: "Sugarcane",
    crop_type: "cash_crop",
    growth_duration: 365,
    kc_initial: 0.400,
    kc_development: 0.800,
    kc_mid: 1.250,
    kc_late: 0.750,
    initial_stage_days: 35,
    development_stage_days: 60,
    mid_stage_days: 180,
    late_stage_days: 90,
    water_requirement: 2000,
    yield_potential: 80.0
  }
];