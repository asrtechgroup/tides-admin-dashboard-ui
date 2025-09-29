// Mock data for resources (materials, equipment, labor)
export const mockMaterials = [
  // PVC & HDPE Pipes
  {
    id: 1,
    name: "PVC Pipe 20mm",
    category: "PVC Pipes",
    unit: "meter",
    rate: 15.50,
    description: "20mm diameter PVC pipe for laterals",
    supplier: "Finolex Industries",
    specifications: "ISI marked, 6 kg/cm2 pressure rating"
  },
  {
    id: 2,
    name: "PVC Pipe 32mm",
    category: "PVC Pipes",
    unit: "meter",
    rate: 22.75,
    description: "32mm diameter PVC pipe for sub-mains",
    supplier: "Finolex Industries",
    specifications: "ISI marked, 6 kg/cm2 pressure rating"
  },
  {
    id: 3,
    name: "HDPE Pipe 32mm",
    category: "HDPE Pipes",
    unit: "meter",
    rate: 25.50,
    description: "32mm diameter HDPE pipe for main lines",
    supplier: "Supreme Industries",
    specifications: "PE100 grade, PN 6 rating"
  },
  {
    id: 4,
    name: "HDPE Pipe 50mm",
    category: "HDPE Pipes",
    unit: "meter",
    rate: 45.25,
    description: "50mm diameter HDPE pipe for main distribution",
    supplier: "Supreme Industries",
    specifications: "PE100 grade, PN 6 rating"
  },
  
  // Drip Irrigation Components
  {
    id: 5,
    name: "Inline Drip Emitter 2 LPH",
    category: "Drip Emitters",
    unit: "piece",
    rate: 8.75,
    description: "Pressure compensating inline emitter",
    supplier: "Netafim",
    specifications: "2 LPH flow rate, self-flushing"
  },
  {
    id: 6,
    name: "Button Drip Emitter 4 LPH",
    category: "Drip Emitters",
    unit: "piece",
    rate: 12.50,
    description: "Button type pressure compensating emitter",
    supplier: "Jain Irrigation",
    specifications: "4 LPH flow rate, anti-siphon"
  },
  {
    id: 7,
    name: "Online Dripper 8 LPH",
    category: "Drip Emitters",
    unit: "piece",
    rate: 15.25,
    description: "Online dripper for tree irrigation",
    supplier: "Rivulis",
    specifications: "8 LPH flow rate, large filtration area"
  },
  
  // Sprinklers
  {
    id: 8,
    name: "Micro Sprinkler 32 LPH",
    category: "Sprinklers",
    unit: "piece",
    rate: 85.50,
    description: "360° micro sprinkler with deflector",
    supplier: "Netafim",
    specifications: "32 LPH, 2.5m diameter coverage"
  },
  {
    id: 9,
    name: "Mini Sprinkler 60 LPH",
    category: "Sprinklers",
    unit: "piece",
    rate: 125.75,
    description: "Adjustable arc mini sprinkler",
    supplier: "Jain Irrigation",
    specifications: "60 LPH, 4m diameter coverage"
  },
  
  // Valves & Fittings
  {
    id: 10,
    name: "Ball Valve 32mm",
    category: "Valves",
    unit: "piece",
    rate: 145.00,
    description: "PVC ball valve with union ends",
    supplier: "Captain Polyplast",
    specifications: "32mm, full bore, lever operated"
  },
  {
    id: 11,
    name: "Solenoid Valve 1 inch",
    category: "Valves",
    unit: "piece",
    rate: 2850.00,
    description: "24V AC solenoid valve for automation",
    supplier: "Hunter Industries",
    specifications: "1 inch BSP, normally closed, low flow"
  },
  
  // Filtration
  {
    id: 12,
    name: "Screen Filter 2 inch",
    category: "Filters",
    unit: "piece",
    rate: 1250.00,
    description: "Y-type screen filter with 120 mesh",
    supplier: "Irritec",
    specifications: "2 inch BSP, 120 mesh, manual cleaning"
  },
  {
    id: 13,
    name: "Disc Filter 2 inch",
    category: "Filters",
    unit: "piece",
    rate: 3500.00,
    description: "Self-cleaning disc filter system",
    supplier: "Netafim",
    specifications: "2 inch BSP, 130 micron filtration"
  }
];

export const mockEquipment = [
  {
    id: 1,
    name: "Centrifugal Pump 3HP",
    category: "Water Pump",
    unit: "piece",
    rate: 12500.00,
    rental_rate: 350.00,
    description: "Self-priming centrifugal pump for irrigation",
    supplier: "Kirloskar",
    specifications: "3HP, 1450 RPM, 25m head, 180 LPM"
  },
  {
    id: 2,
    name: "Submersible Pump 5HP",
    category: "Water Pump",
    unit: "piece",
    rate: 22500.00,
    rental_rate: 450.00,
    description: "Submersible borewell pump",
    supplier: "CRI Pumps",
    specifications: "5HP, 2850 RPM, 40m head, 300 LPM"
  },
  {
    id: 3,
    name: "Mini Excavator",
    category: "Excavator",
    unit: "hour",
    rate: 1200.00,
    description: "1.5 ton mini excavator for trenching",
    supplier: "Local Rental",
    specifications: "1.5 ton capacity, rubber tracks"
  },
  {
    id: 4,
    name: "Trenching Machine",
    category: "Trenching Machine",
    unit: "hour",
    rate: 800.00,
    description: "Walk-behind trenching machine",
    supplier: "Local Rental",
    specifications: "18 inch depth, 4 inch width"
  },
  {
    id: 5,
    name: "Portable Generator 5KVA",
    category: "Generator",
    unit: "hour",
    rate: 150.00,
    description: "Diesel generator for temporary power",
    supplier: "Local Rental",
    specifications: "5KVA capacity, air cooled, electric start"
  }
];

export const mockLabor = [
  {
    id: 1,
    name: "Irrigation Technician",
    category: "Skilled Technician",
    unit: "day",
    rate: 800.00,
    description: "Skilled technician for drip/sprinkler installation",
    experience_required: "3+ years",
    certifications: "Irrigation system installation certified"
  },
  {
    id: 2,
    name: "Plumber",
    category: "Skilled Technician",
    unit: "day",
    rate: 750.00,
    description: "Skilled plumber for pipeline installation",
    experience_required: "2+ years",
    certifications: "Plumbing trade certification"
  },
  {
    id: 3,
    name: "Electrician",
    category: "Skilled Technician",
    unit: "day",
    rate: 700.00,
    description: "Electrician for pump and control panel wiring",
    experience_required: "2+ years",
    certifications: "Electrical license"
  },
  {
    id: 4,
    name: "Construction Worker",
    category: "Semi-skilled Worker",
    unit: "day",
    rate: 500.00,
    description: "Semi-skilled worker for general construction",
    experience_required: "1+ years",
    certifications: "Basic safety training"
  },
  {
    id: 5,
    name: "Helper/Laborer",
    category: "Unskilled Labor",
    unit: "day",
    rate: 350.00,
    description: "General laborer for material handling",
    experience_required: "No experience required",
    certifications: "None required"
  },
  {
    id: 6,
    name: "Project Engineer",
    category: "Engineer/Supervisor",
    unit: "day",
    rate: 1500.00,
    description: "Agricultural engineer for project supervision",
    experience_required: "5+ years",
    certifications: "B.Tech/Diploma in Agricultural Engineering"
  },
  {
    id: 7,
    name: "Site Supervisor",
    category: "Engineer/Supervisor",
    unit: "day",
    rate: 1000.00,
    description: "Site supervisor for daily work coordination",
    experience_required: "3+ years",
    certifications: "Construction supervision certificate"
  },
  {
    id: 8,
    name: "Equipment Operator",
    category: "Equipment Operator",
    unit: "day",
    rate: 600.00,
    description: "Operator for excavator and heavy equipment",
    experience_required: "2+ years",
    certifications: "Heavy equipment operation license"
  }
];

export const mockResourceCategories = [
  // Material Categories
  { id: 1, name: "PVC Pipes", category_type: "material", unit: "meter", description: "PVC pipes for irrigation systems" },
  { id: 2, name: "HDPE Pipes", category_type: "material", unit: "meter", description: "HDPE pipes for main distribution" },
  { id: 3, name: "Drip Emitters", category_type: "material", unit: "piece", description: "Drip irrigation emitters and drippers" },
  { id: 4, name: "Sprinklers", category_type: "material", unit: "piece", description: "Sprinkler heads and nozzles" },
  { id: 5, name: "Valves", category_type: "material", unit: "piece", description: "Control valves and fittings" },
  { id: 6, name: "Filters", category_type: "material", unit: "piece", description: "Water filtration systems" },
  
  // Equipment Categories
  { id: 7, name: "Water Pump", category_type: "equipment", unit: "piece", description: "Irrigation water pumps" },
  { id: 8, name: "Excavator", category_type: "equipment", unit: "hour", description: "Excavation equipment rental" },
  { id: 9, name: "Trenching Machine", category_type: "equipment", unit: "hour", description: "Trenching equipment rental" },
  { id: 10, name: "Generator", category_type: "equipment", unit: "hour", description: "Power generator rental" },
  
  // Labor Categories
  { id: 11, name: "Skilled Technician", category_type: "labor", unit: "day", description: "Skilled irrigation technicians" },
  { id: 12, name: "Semi-skilled Worker", category_type: "labor", unit: "day", description: "Semi-skilled construction workers" },
  { id: 13, name: "Unskilled Labor", category_type: "labor", unit: "day", description: "General unskilled laborers" },
  { id: 14, name: "Engineer/Supervisor", category_type: "labor", unit: "day", description: "Engineers and supervisors" },
  { id: 15, name: "Equipment Operator", category_type: "labor", unit: "day", description: "Heavy equipment operators" }
];