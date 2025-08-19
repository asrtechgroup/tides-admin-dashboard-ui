/**
 * API Service Layer for Django Backend Integration
 * 
 * This file contains all the API calls to the Django backend.
 * Replace the base URL with your actual Django server URL.
 */

import axios from 'axios';

// Django API Integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  /**
   * User login
   * Django endpoint: POST /api/auth/token/
   */
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post<{ access: string }>('/auth/token/', credentials);
    const { access } = response.data;
    
    // Store auth data
    localStorage.setItem('auth_token', access);
    
    return response.data;
  },

  /**
   * User logout
   * Django endpoint: POST /api/auth/logout/
   */
  logout: async () => {
    await api.post('/auth/logout/');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  /**
   * Get current user profile
   * Django endpoint: GET /api/auth/profile/
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  /**
   * Admin user registration
   * Django endpoint: POST /api/auth/register/
   */
  registerUser: async (userData: {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
    password: string;
  }) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  /**
   * Get all users (admin only)
   * Django endpoint: GET /api/auth/users/
   */
  getUsers: async () => {
    const response = await api.get('/auth/users/');
    return response.data;
  },
};

// GIS Planning API
export const gisAPI = {
  /**
   * Upload shapefile
   * Django endpoint: POST /api/gis/shapefiles/
   */
  uploadShapefile: async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/gis/shapefiles/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get project zones
   * Django endpoint: GET /api/gis/zones/
   */
  getZones: async (projectId?: string) => {
    const params = projectId ? `?project_id=${projectId}` : '';
    const response = await api.get(`/gis/zones/${params}`);
    return response.data;
  },

  /**
   * Create zone
   * Django endpoint: POST /api/gis/zones/
   */
  createZone: async (zoneData: any) => {
    const response = await api.post('/gis/zones/', zoneData);
    return response.data;
  },

  /**
   * Update zone
   * Django endpoint: PUT /api/gis/zones/{id}/
   */
  updateZone: async (zoneId: string, zoneData: any) => {
    const response = await api.put(`/gis/zones/${zoneId}/`, zoneData);
    return response.data;
  },

  /**
   * Delete zone
   * Django endpoint: DELETE /api/gis/zones/{id}/
   */
  deleteZone: async (zoneId: string) => {
    await api.delete(`/gis/zones/${zoneId}/`);
  },
};

// BOQ Builder API
export const boqAPI = {
  /**
   * Get existing projects for BOQ analysis
   * Django endpoint: GET /api/boq/existing-projects/
   */
  getExistingProjects: async (filters?: { irrigation_type?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.irrigation_type) params.append('irrigation_type', filters.irrigation_type);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/boq/existing-projects/?${params.toString()}`);
    return response.data;
  },

  /**
   * Create new existing project
   * Django endpoint: POST /api/boq/existing-projects/
   */
  createExistingProject: async (projectData: any) => {
    const response = await api.post('/boq/existing-projects/', projectData);
    return response.data;
  },

  /**
   * Create BOQ analysis for an existing project
   * Django endpoint: POST /api/boq/analyses/
   */
  createBOQAnalysis: async (analysisData: any) => {
    const response = await api.post('/boq/analyses/', analysisData);
    return response.data;
  },

  /**
   * Get BOQ analyses
   * Django endpoint: GET /api/boq/analyses/
   */
  getBOQAnalyses: async () => {
    const response = await api.get('/boq/analyses/');
    return response.data;
  },

  /**
   * Get materials database
   * Django endpoint: GET /api/materials/materials/
   */
  getMaterials: async (filters?: { category?: string; region?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    
    const endpoint = filters?.region 
      ? `/materials/materials/by_region/?region=${filters.region}&${params.toString()}`
      : `/materials/materials/?${params.toString()}`;
    
    const response = await api.get(endpoint);
    return response.data;
  },

  /**
   * Get irrigation technologies
   * Django endpoint: GET /api/materials/technologies/
   */
  getTechnologies: async (technologyType?: string) => {
    const params = technologyType ? `?technology_type=${technologyType}` : '';
    const response = await api.get(`/materials/technologies/${params}`);
    return response.data;
  },

  /**
   * Get cost analysis data
   * Django endpoint: GET /api/boq/existing-projects/cost_analysis/
   */
  getCostAnalysis: async () => {
    const response = await api.get('/boq/existing-projects/cost_analysis/');
    return response.data;
  },

  /**
   * Export BOQ analysis
   * Django endpoint: GET /api/boq/analyses/{id}/export_boq/
   */
  exportBOQ: async (analysisId: string, format: 'pdf' | 'excel') => {
    const response = await api.get(`/boq/analyses/${analysisId}/export_boq/?format=${format}`);
    return response.data;
  },

  /**
   * Get BOQ templates
   * Django endpoint: GET /api/boq/templates/
   */
  getBOQTemplates: async (irrigationType?: string) => {
    const params = irrigationType ? `?irrigation_type=${irrigationType}` : '';
    const response = await api.get(`/boq/templates/${params}`);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  /**
   * Get all projects
   * Django endpoint: GET /api/projects/
   */
  getProjects: async (filters?: { status?: string; zone?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.zone) params.append('zone', filters.zone);
    
    const response = await api.get(`/projects/?${params.toString()}`);
    return response.data;
  },

  /**
   * Create new project
   * Django endpoint: POST /api/projects/
   */
  createProject: async (projectData: any) => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },

  /**
   * Get project by ID
   * Django endpoint: GET /api/projects/{id}/
   */
  getProject: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/`);
    return response.data;
  },

  /**
   * Update project
   * Django endpoint: PUT /api/projects/{id}/
   */
  updateProject: async (projectId: string, projectData: any) => {
    const response = await api.put(`/projects/${projectId}/`, projectData);
    return response.data;
  },

  /**
   * Get project wizard data
   * Django endpoint: GET /api/projects/{id}/wizard/
   */
  getProjectWizard: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/wizard/`);
    return response.data;
  },

  /**
   * Update project wizard data
   * Django endpoint: PUT /api/projects/{id}/wizard/
   */
  updateProjectWizard: async (projectId: string, wizardData: any) => {
    const response = await api.put(`/projects/${projectId}/wizard/`, wizardData);
    return response.data;
  },

  /**
   * Submit project for approval
   * Django endpoint: POST /api/projects/{id}/submit/
   */
  submitProject: async (projectId: string) => {
    const response = await api.post(`/projects/${projectId}/submit/`);
    return response.data;
  },

  /**
   * Get dashboard statistics
   * Django endpoint: GET /api/projects/dashboard_stats/
   */
  getDashboardStats: async () => {
    const response = await api.get('/projects/dashboard_stats/');
    return response.data;
  },
};

// Resources API
export const resourcesAPI = {
  /**
   * Get materials
   * Django endpoint: GET /api/resources/materials/
   */
  getMaterials: async () => {
    const response = await api.get('/resources/materials/');
    return response.data;
  },

  /**
   * Get equipment
   * Django endpoint: GET /api/resources/equipment/
   */
  getEquipment: async () => {
    const response = await api.get('/resources/equipment/');
    return response.data;
  },

  /**
   * Get labor rates
   * Django endpoint: GET /api/resources/labor/
   */
  getLaborRates: async () => {
    const response = await api.get('/resources/labor/');
    return response.data;
  },

  /**
   * Suitability Criteria CRUD
   * Django endpoint: /api/materials/suitability-criteria/
   */
  getSuitabilityCriteria: async () => {
    const response = await api.get('/materials/suitability-criteria/');
    return response.data;
  },
  createSuitabilityCriterion: async (data: any) => {
    const response = await api.post('/materials/suitability-criteria/', data);
    return response.data;
  },
  updateSuitabilityCriterion: async (id: string, data: any) => {
    const response = await api.put(`/materials/suitability-criteria/${id}/`, data);
    return response.data;
  },
  deleteSuitabilityCriterion: async (id: string) => {
    await api.delete(`/materials/suitability-criteria/${id}/`);
  },

  /**
   * Costing Rules CRUD
   * Django endpoint: /api/materials/costing-rules/
   */
  getCostingRules: async () => {
    const response = await api.get('/materials/costing-rules/');
    return response.data;
  },
  createCostingRule: async (data: any) => {
    const response = await api.post('/materials/costing-rules/', data);
    return response.data;
  },
  updateCostingRule: async (id: string, data: any) => {
    const response = await api.put(`/materials/costing-rules/${id}/`, data);
    return response.data;
  },
  deleteCostingRule: async (id: string) => {
    await api.delete(`/materials/costing-rules/${id}/`);
  },
};

// Helper function to handle file uploads
export const uploadFile = async (file: File, fileType: string, projectId?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  formData.append('file_type', fileType);
  if (projectId) formData.append('project', projectId);

  const response = await api.post('/files/uploads/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Helper function to handle errors
export const handleAPIError = (error: any) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  } else if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};