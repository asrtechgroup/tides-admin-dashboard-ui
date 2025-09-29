// Mock data for projects and schemes
export const mockProjects = [
  {
    id: 1,
    name: "Northern Valley Irrigation Project",
    location: "Haryana, India",
    area: 250.5,
    status: "active",
    created_at: "2024-01-15",
    updated_at: "2024-02-20",
    description: "Large scale drip irrigation system for vegetable cultivation",
    budget: 15000000,
    completion_percentage: 75
  },
  {
    id: 2,
    name: "Coastal Agriculture Development",
    location: "Gujarat, India",
    area: 180.2,
    status: "planning",
    created_at: "2024-02-10",
    updated_at: "2024-03-05",
    description: "Sprinkler irrigation system for cotton and groundnut",
    budget: 8500000,
    completion_percentage: 25
  },
  {
    id: 3,
    name: "Hill Station Horticulture Project",
    location: "Himachal Pradesh, India",
    area: 95.8,
    status: "completed",
    created_at: "2023-08-20",
    updated_at: "2024-01-10",
    description: "Micro sprinkler system for apple orchards",
    budget: 4200000,
    completion_percentage: 100
  }
];

export const mockProjectSchemes = [
  {
    id: 1,
    project_id: 1,
    step: "basic_info",
    data: {
      project_name: "Northern Valley Irrigation Project",
      location: "Haryana, India",
      area: 250.5,
      water_source: "borewell",
      soil_type: "loamy",
      climate_zone: "semi_arid"
    }
  },
  {
    id: 2,
    project_id: 1,
    step: "technology_selection",
    data: {
      technology_name: "pressurized",
      irrigation_type: "drip_irrigation",
      efficiency: 90,
      maintenance_level: "high"
    }
  },
  {
    id: 3,
    project_id: 1,
    step: "crop_calendar",
    data: {
      crops: [
        {
          crop_name: "Tomato",
          area: 100.5,
          planting_date: "2024-03-15",
          harvest_date: "2024-07-15"
        },
        {
          crop_name: "Onion",
          area: 150.0,
          planting_date: "2024-04-01",
          harvest_date: "2024-12-01"
        }
      ]
    }
  }
];

export const mockBOQItems = [
  {
    id: 1,
    project_id: 1,
    item_category: "material",
    item_name: "HDPE Pipes - 32mm",
    quantity: 2500,
    unit: "meter",
    rate: 25.50,
    amount: 63750
  },
  {
    id: 2,
    project_id: 1,
    item_category: "material",
    item_name: "Drip Emitters",
    quantity: 5000,
    unit: "piece",
    rate: 8.75,
    amount: 43750
  },
  {
    id: 3,
    project_id: 1,
    item_category: "labor",
    item_name: "Skilled Technician",
    quantity: 45,
    unit: "day",
    rate: 800,
    amount: 36000
  },
  {
    id: 4,
    project_id: 1,
    item_category: "equipment",
    item_name: "Water Pump - 5HP",
    quantity: 2,
    unit: "piece",
    rate: 15000,
    amount: 30000
  }
];