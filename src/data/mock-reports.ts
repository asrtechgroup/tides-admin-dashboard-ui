// Mock data for reports and analytics
export const mockReports = [
  {
    id: 1,
    project_id: 1,
    report_type: "progress",
    title: "Monthly Progress Report - March 2024",
    generated_date: "2024-03-31",
    status: "completed",
    file_url: "/reports/progress-march-2024.pdf",
    summary: "85% pipeline installation completed, water testing in progress"
  },
  {
    id: 2,
    project_id: 1,
    report_type: "boq_costing",
    title: "BOQ Cost Analysis Report",
    generated_date: "2024-02-15",
    status: "completed",
    file_url: "/reports/boq-analysis.pdf",
    summary: "Detailed cost breakdown and variance analysis"
  },
  {
    id: 3,
    project_id: 2,
    report_type: "technical",
    title: "Hydraulic Design Report",
    generated_date: "2024-03-20",
    status: "draft",
    file_url: "/reports/hydraulic-design.pdf",
    summary: "Complete hydraulic calculations and system design parameters"
  }
];

export const mockAnalytics = {
  project_summary: {
    total_projects: 12,
    active_projects: 7,
    completed_projects: 3,
    planning_projects: 2,
    total_area: 1250.5,
    total_budget: 85000000
  },
  technology_distribution: [
    { technology: "drip_irrigation", projects: 5, percentage: 41.7 },
    { technology: "micro_sprinkler", projects: 3, percentage: 25.0 },
    { technology: "center_pivot", projects: 2, percentage: 16.7 },
    { technology: "subsurface_drip", projects: 1, percentage: 8.3 },
    { technology: "basin_irrigation", projects: 1, percentage: 8.3 }
  ],
  monthly_progress: [
    { month: "Jan 2024", projects_started: 2, projects_completed: 1, budget_utilized: 8500000 },
    { month: "Feb 2024", projects_started: 1, projects_completed: 0, budget_utilized: 12500000 },
    { month: "Mar 2024", projects_started: 3, projects_completed: 2, budget_utilized: 15800000 }
  ],
  cost_breakdown: {
    materials: 45,
    labor: 25,
    equipment: 20,
    overhead: 10
  },
  efficiency_metrics: [
    { project: "Northern Valley", planned_efficiency: 90, actual_efficiency: 88 },
    { project: "Coastal Agriculture", planned_efficiency: 85, actual_efficiency: 82 },
    { project: "Hill Station", planned_efficiency: 85, actual_efficiency: 91 }
  ]
};

export const mockActivityLogs = [
  {
    id: 1,
    user: "John Engineer",
    action: "Project Created",
    target: "Northern Valley Irrigation Project",
    timestamp: "2024-03-25 14:30:00",
    details: "New drip irrigation project created with 250.5 hectare area"
  },
  {
    id: 2,
    user: "Sarah Planner",
    action: "BOQ Updated",
    target: "Coastal Agriculture Development",
    timestamp: "2024-03-25 11:15:00",
    details: "Added 500 meters of HDPE pipes to material list"
  },
  {
    id: 3,
    user: "Mike Supervisor",
    action: "Status Changed",
    target: "Hill Station Horticulture Project",
    timestamp: "2024-03-24 16:45:00",
    details: "Project status updated from 'In Progress' to 'Completed'"
  },
  {
    id: 4,
    user: "Admin User",
    action: "User Added",
    target: "New Technician Account",
    timestamp: "2024-03-24 09:20:00",
    details: "Created new user account for field technician"
  },
  {
    id: 5,
    user: "John Engineer",
    action: "Report Generated",
    target: "Monthly Progress Report",
    timestamp: "2024-03-23 17:30:00",
    details: "Generated progress report for March 2024"
  }
];

export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@tides.com",
    role: "admin",
    first_name: "System",
    last_name: "Administrator",
    is_active: true,
    date_joined: "2024-01-01",
    last_login: "2024-03-25 14:30:00"
  },
  {
    id: 2,
    username: "john.engineer",
    email: "john@tides.com",
    role: "engineer",
    first_name: "John",
    last_name: "Engineer",
    is_active: true,
    date_joined: "2024-01-15",
    last_login: "2024-03-25 12:15:00"
  },
  {
    id: 3,
    username: "sarah.planner",
    email: "sarah@tides.com",
    role: "planner",
    first_name: "Sarah",
    last_name: "Planner",
    is_active: true,
    date_joined: "2024-02-01",
    last_login: "2024-03-25 11:45:00"
  },
  {
    id: 4,
    username: "mike.supervisor",
    email: "mike@tides.com",
    role: "viewer",
    first_name: "Mike",
    last_name: "Supervisor",
    is_active: true,
    date_joined: "2024-02-15",
    last_login: "2024-03-24 16:30:00"
  }
];