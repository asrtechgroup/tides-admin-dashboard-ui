/**
 * API Service Layer for Django Backend Integration
 * 
 * This file contains all the API calls to the Django backend.
 * Replace the base URL with your actual Django server URL.
 * 
 * DJANGO SETUP REQUIRED:
 * 
 * 1. Install required packages:
 *    - djangorestframework
 *    - django-cors-headers
 *    - django-storages (for file uploads)
 *    - django.contrib.gis (for GIS features)
 * 
 * 2. Add to INSTALLED_APPS:
 *    - 'rest_framework'
 *    - 'corsheaders'
 *    - 'django.contrib.gis'
 * 
 * 3. Configure CORS in settings.py:
 *    CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
 * 
 * 4. Add authentication:
 *    REST_FRAMEWORK = {
 *        'DEFAULT_AUTHENTICATION_CLASSES': [
 *            'rest_framework.authentication.TokenAuthentication',
 *        ]
 *    }
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('tides_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // ===== AUTHENTICATION APIs =====
  
  /**
   * Login user
   * Django URL: POST /api/auth/login/
   */
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  /**
   * Get user profile
   * Django URL: GET /api/auth/user/
   */
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/user/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // ===== PROJECT MANAGEMENT APIs =====
  
  /**
   * Get user's projects
   * Django URL: GET /api/projects/
   */
  async getProjects(search?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/projects/?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  /**
   * Create new project
   * Django URL: POST /api/projects/
   */
  async createProject(projectData: any) {
    const response = await fetch(`${API_BASE_URL}/projects/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  /**
   * Update project
   * Django URL: PUT /api/projects/{id}/
   */
  async updateProject(projectId: string, projectData: any) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  /**
   * Delete project
   * Django URL: DELETE /api/projects/{id}/
   */
  async deleteProject(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.ok;
  }

  // ===== PROJECT WIZARD APIs =====
  
  /**
   * Get project wizard data
   * Django URL: GET /api/project-wizard/{id}/
   */
  async getProjectWizard(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/project-wizard/${projectId}/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  /**
   * Save project wizard data
   * Django URL: POST/PUT /api/project-wizard/
   */
  async saveProjectWizard(projectData: any, projectId?: string) {
    const url = projectId 
      ? `${API_BASE_URL}/project-wizard/${projectId}/`
      : `${API_BASE_URL}/project-wizard/`;
    
    const response = await fetch(url, {
      method: projectId ? 'PUT' : 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  /**
   * Submit project for approval
   * Django URL: POST /api/project-wizard/{id}/submit/
   */
  async submitProject(projectId: string, comments?: string) {
    const response = await fetch(`${API_BASE_URL}/project-wizard/${projectId}/submit/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comments }),
    });
    return response.json();
  }

  // ===== MATERIALS & COST DATABASE APIs =====
  
  /**
   * Get materials database
   * Django URL: GET /api/materials/
   */
  async getMaterials(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/materials/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  /**
   * Get technologies database
   * Django URL: GET /api/technologies/
   */
  async getTechnologies(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/technologies/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  /**
   * Get equipment database
   * Django URL: GET /api/equipment/
   */
  async getEquipment(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/equipment/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  /**
   * Get labor rates
   * Django URL: GET /api/labor-rates/
   */
  async getLaborRates(region?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    
    const response = await fetch(`${API_BASE_URL}/labor-rates/?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // ===== BOQ BUILDER APIs =====
  
  /**
   * Get existing projects for BOQ analysis
   * Django URL: GET /api/existing-projects/
   */
  async getExistingProjects(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/existing-projects/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  /**
   * Generate BOQ analysis
   * Django URL: POST /api/boq-analysis/
   */
  async generateBOQAnalysis(analysisData: any) {
    const response = await fetch(`${API_BASE_URL}/boq-analysis/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(analysisData),
    });
    return response.json();
  }

  /**
   * Export BOQ document
   * Django URL: POST /api/boq-export/
   */
  async exportBOQ(boqData: any, format: 'pdf' | 'excel' = 'pdf') {
    const response = await fetch(`${API_BASE_URL}/boq-export/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ ...boqData, format }),
    });
    return response.json();
  }

  // ===== GIS PLANNING APIs =====
  
  /**
   * Upload shapefile
   * Django URL: POST /api/shapefiles/upload/
   */
  async uploadShapefile(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const token = localStorage.getItem('tides_token');
    const response = await fetch(`${API_BASE_URL}/shapefiles/upload/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  }

  /**
   * Get project zones
   * Django URL: GET /api/projects/{project_id}/zones/
   */
  async getProjectZones(projectId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/zones/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  /**
   * Create zone
   * Django URL: POST /api/projects/{project_id}/zones/
   */
  async createZone(projectId: string, zoneData: any) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/zones/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(zoneData),
    });
    return response.json();
  }

  /**
   * Update zone
   * Django URL: PUT /api/zones/{zone_id}/
   */
  async updateZone(zoneId: string, zoneData: any) {
    const response = await fetch(`${API_BASE_URL}/zones/${zoneId}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(zoneData),
    });
    return response.json();
  }

  /**
   * Delete zone
   * Django URL: DELETE /api/zones/{zone_id}/
   */
  async deleteZone(zoneId: string) {
    const response = await fetch(`${API_BASE_URL}/zones/${zoneId}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.ok;
  }

  /**
   * Export shapefile
   * Django URL: POST /api/gis/export-shapefile/
   */
  async exportShapefile(zonesData: any) {
    const response = await fetch(`${API_BASE_URL}/gis/export-shapefile/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(zonesData),
    });
    return response.json();
  }

  /**
   * Get existing projects for map overlay
   * Django URL: GET /api/gis/existing-projects/
   */
  async getExistingProjectsForMap(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/gis/existing-projects/`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // ===== HYDRAULIC DESIGN APIs =====
  
  /**
   * Calculate water requirements
   * Django URL: POST /api/hydraulic-design/water-requirements/
   */
  async calculateWaterRequirements(designData: any) {
    const response = await fetch(`${API_BASE_URL}/hydraulic-design/water-requirements/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(designData),
    });
    return response.json();
  }

  /**
   * Generate hydraulic design
   * Django URL: POST /api/hydraulic-design/generate/
   */
  async generateHydraulicDesign(designParameters: any) {
    const response = await fetch(`${API_BASE_URL}/hydraulic-design/generate/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(designParameters),
    });
    return response.json();
  }

  // ===== FILE MANAGEMENT APIs =====
  
  /**
   * Upload file
   * Django URL: POST /api/files/upload/
   */
  async uploadFile(file: File, fileType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    
    const token = localStorage.getItem('tides_token');
    const response = await fetch(`${API_BASE_URL}/files/upload/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  }

  /**
   * Download file
   * Django URL: GET /api/files/{file_id}/download/
   */
  async downloadFile(fileId: string) {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/download/`, {
      headers: this.getAuthHeaders(),
    });
    return response.blob();
  }
}

export const apiService = new ApiService();
export default apiService;