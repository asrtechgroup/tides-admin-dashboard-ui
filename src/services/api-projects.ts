// Extended API for projects and schemes
import { mockProjects, mockProjectSchemes, mockBOQItems } from '@/data/mock-projects';
import { mockReports, mockAnalytics, mockActivityLogs, mockUsers } from '@/data/mock-reports';
import { sampleZones } from '@/data/sample-zones';

const USE_MOCK_DATA = true;
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const logRequest = (method: string, url: string, data?: any) => {
  console.log(`🔍 API Request: ${method.toUpperCase()} ${url}`);
  if (data) console.log('📤 Request data:', data);
};

const logResponse = (method: string, url: string, response: any) => {
  console.log(`✅ API Response: ${method.toUpperCase()} ${url}`);
  console.log('📥 Response data:', response);
};

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    const method = 'GET';
    const url = '/projects/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      logResponse(method, url, mockProjects);
      return mockProjects;
    }
    
    // Real API call would go here
    throw new Error('Backend not connected');
  },

  getProject: async (id: number) => {
    const method = 'GET';
    const url = `/projects/${id}/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      const project = mockProjects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      logResponse(method, url, project);
      return project;
    }
    
    throw new Error('Backend not connected');
  },

  createProject: async (projectData: any) => {
    const method = 'POST';
    const url = '/projects/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, projectData);
      await mockDelay();
      const newProject = {
        id: Math.max(...mockProjects.map(p => p.id)) + 1,
        ...projectData,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        completion_percentage: 0
      };
      mockProjects.push(newProject);
      logResponse(method, url, newProject);
      return newProject;
    }
    
    throw new Error('Backend not connected');
  },

  updateProject: async (id: number, projectData: any) => {
    const method = 'PUT';
    const url = `/projects/${id}/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, projectData);
      await mockDelay();
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Project not found');
      
      mockProjects[index] = {
        ...mockProjects[index],
        ...projectData,
        updated_at: new Date().toISOString().split('T')[0]
      };
      logResponse(method, url, mockProjects[index]);
      return mockProjects[index];
    }
    
    throw new Error('Backend not connected');
  }
};

// Project Schemes API
export const schemesAPI = {
  getProjectSchemes: async (projectId: number) => {
    const method = 'GET';
    const url = `/projects/${projectId}/schemes/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      const schemes = mockProjectSchemes.filter(s => s.project_id === projectId);
      logResponse(method, url, schemes);
      return schemes;
    }
    
    throw new Error('Backend not connected');
  },

  saveSchemeStep: async (projectId: number, step: string, data: any) => {
    const method = 'POST';
    const url = `/projects/${projectId}/schemes/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, { step, data });
      await mockDelay();
      
      const existingIndex = mockProjectSchemes.findIndex(
        s => s.project_id === projectId && s.step === step
      );
      
      const schemeData = {
        id: existingIndex >= 0 ? mockProjectSchemes[existingIndex].id : Date.now(),
        project_id: projectId,
        step,
        data
      };
      
      if (existingIndex >= 0) {
        mockProjectSchemes[existingIndex] = schemeData;
      } else {
        mockProjectSchemes.push(schemeData);
      }
      
      logResponse(method, url, schemeData);
      return schemeData;
    }
    
    throw new Error('Backend not connected');
  }
};

// BOQ API
export const boqAPI = {
  getBOQItems: async (projectId: number) => {
    const method = 'GET';
    const url = `/projects/${projectId}/boq/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      const items = mockBOQItems.filter(item => item.project_id === projectId);
      logResponse(method, url, items);
      return items;
    }
    
    throw new Error('Backend not connected');
  },

  addBOQItem: async (projectId: number, itemData: any) => {
    const method = 'POST';
    const url = `/projects/${projectId}/boq/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, itemData);
      await mockDelay();
      
      const newItem = {
        id: Math.max(...mockBOQItems.map(item => item.id)) + 1,
        project_id: projectId,
        ...itemData,
        amount: itemData.quantity * itemData.rate
      };
      
      mockBOQItems.push(newItem);
      logResponse(method, url, newItem);
      return newItem;
    }
    
    throw new Error('Backend not connected');
  },

  generateBOQ: async (projectId: number, schemeData: any) => {
    const method = 'POST';
    const url = `/projects/${projectId}/boq/generate/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, schemeData);
      await mockDelay(1500); // Simulate longer processing
      
      // Mock BOQ generation based on technology and area
      const generatedItems = [
        {
          id: Date.now() + 1,
          project_id: projectId,
          item_category: 'material',
          item_name: 'HDPE Main Line 50mm',
          quantity: Math.ceil((schemeData.area || 100) * 2.5),
          unit: 'meter',
          rate: 45.25,
          amount: 0
        },
        {
          id: Date.now() + 2,
          project_id: projectId,
          item_category: 'material',
          item_name: 'Drip Laterals 16mm',
          quantity: Math.ceil((schemeData.area || 100) * 25),
          unit: 'meter',
          rate: 12.50,
          amount: 0
        },
        {
          id: Date.now() + 3,
          project_id: projectId,
          item_category: 'labor',
          item_name: 'Installation Labor',
          quantity: Math.ceil((schemeData.area || 100) * 0.8),
          unit: 'day',
          rate: 600,
          amount: 0
        }
      ];
      
      // Calculate amounts
      generatedItems.forEach(item => {
        item.amount = item.quantity * item.rate;
        mockBOQItems.push(item);
      });
      
      logResponse(method, url, generatedItems);
      return generatedItems;
    }
    
    throw new Error('Backend not connected');
  }
};

// GIS API
export const gisAPI = {
  getZones: async (projectId?: number) => {
    const method = 'GET';
    const url = projectId ? `/projects/${projectId}/zones/` : '/zones/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      logResponse(method, url, sampleZones);
      return sampleZones;
    }
    
    throw new Error('Backend not connected');
  },

  saveZones: async (projectId: number, zones: any[]) => {
    const method = 'POST';
    const url = `/projects/${projectId}/zones/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, zones);
      await mockDelay();
      logResponse(method, url, { message: 'Zones saved successfully', count: zones.length });
      return { message: 'Zones saved successfully', count: zones.length };
    }
    
    throw new Error('Backend not connected');
  }
};

// Reports API
export const reportsAPI = {
  getReports: async (projectId?: number) => {
    const method = 'GET';
    const url = projectId ? `/projects/${projectId}/reports/` : '/reports/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      const reports = projectId ? mockReports.filter(r => r.project_id === projectId) : mockReports;
      logResponse(method, url, reports);
      return reports;
    }
    
    throw new Error('Backend not connected');
  },

  generateReport: async (projectId: number, reportType: string) => {
    const method = 'POST';
    const url = `/projects/${projectId}/reports/generate/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, { report_type: reportType });
      await mockDelay(2000); // Simulate report generation time
      
      const newReport = {
        id: Date.now(),
        project_id: projectId,
        report_type: reportType,
        title: `${reportType.replace('_', ' ').toUpperCase()} Report`,
        generated_date: new Date().toISOString().split('T')[0],
        status: 'completed',
        file_url: `/reports/${reportType}-${Date.now()}.pdf`,
        summary: `Generated ${reportType} report for project ${projectId}`
      };
      
      mockReports.push(newReport);
      logResponse(method, url, newReport);
      return newReport;
    }
    
    throw new Error('Backend not connected');
  },

  getAnalytics: async () => {
    const method = 'GET';
    const url = '/analytics/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      logResponse(method, url, mockAnalytics);
      return mockAnalytics;
    }
    
    throw new Error('Backend not connected');
  }
};

// Activity Logs API
export const logsAPI = {
  getActivityLogs: async () => {
    const method = 'GET';
    const url = '/activity-logs/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      logResponse(method, url, mockActivityLogs);
      return mockActivityLogs;
    }
    
    throw new Error('Backend not connected');
  }
};

// User Management API
export const usersAPI = {
  getUsers: async () => {
    const method = 'GET';
    const url = '/users/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url);
      await mockDelay();
      logResponse(method, url, mockUsers);
      return mockUsers;
    }
    
    throw new Error('Backend not connected');
  },

  createUser: async (userData: any) => {
    const method = 'POST';
    const url = '/users/';
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, userData);
      await mockDelay();
      
      const newUser = {
        id: Math.max(...mockUsers.map(u => u.id)) + 1,
        ...userData,
        is_active: true,
        date_joined: new Date().toISOString().split('T')[0],
        last_login: null
      };
      
      mockUsers.push(newUser);
      logResponse(method, url, newUser);
      return newUser;
    }
    
    throw new Error('Backend not connected');
  },

  updateUser: async (id: number, userData: any) => {
    const method = 'PUT';
    const url = `/users/${id}/`;
    
    if (USE_MOCK_DATA) {
      logRequest(method, url, userData);
      await mockDelay();
      
      const index = mockUsers.findIndex(u => u.id === id);
      if (index === -1) throw new Error('User not found');
      
      mockUsers[index] = { ...mockUsers[index], ...userData };
      logResponse(method, url, mockUsers[index]);
      return mockUsers[index];
    }
    
    throw new Error('Backend not connected');
  }
};