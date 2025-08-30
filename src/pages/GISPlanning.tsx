import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Zone, ZoneFormData } from '@/types/gis';
import { calculateArea, handleExportZones } from '@/utils/gis-utils';
// import removed: sampleZones is obsolete, use backend data
import MapComponent from '@/components/gis/MapComponent';
import ZonePropertiesPanel from '@/components/gis/ZonePropertiesPanel';
import ZonesList from '@/components/gis/ZonesList';
import DrawingToolsPanel from '@/components/gis/DrawingToolsPanel';
import PageHeader from '@/components/gis/PageHeader';
import SchemeDesignPanel from '@/components/gis/SchemeDesignPanel';
import BOQGenerationPanel from '@/components/gis/BOQGenerationPanel';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';

/**
 * DJANGO API INTEGRATION POINTS FOR GIS PLANNING:
 * 
 * 1. FILE UPLOAD APIs:
 *    POST /api/shapefiles/upload/ - Upload shapefile (.shp, .dbf, .shx, .prj)
 *    - Headers: Authorization: Bearer {token}
 *    - Body: FormData with files
 *    - Response: { shapefile_id: string, features: GeoJSON }
 * 
 * 2. GIS DATA APIs:
 *    GET /api/projects/{project_id}/zones/ - Fetch project zones
 *    POST /api/projects/{project_id}/zones/ - Create new zone
 *    PUT /api/zones/{zone_id}/ - Update zone properties
 *    DELETE /api/zones/{zone_id}/ - Delete zone
 * 
 * 3. SPATIAL ANALYSIS APIs:
 *    POST /api/gis/calculate-area/ - Calculate zone area from coordinates
 *    POST /api/gis/hydraulic-design/ - Generate hydraulic design
 *    POST /api/gis/water-requirements/ - Calculate water requirements
 * 
 * 4. EXPORT APIs:
 *    POST /api/gis/export-shapefile/ - Export zones as shapefile
 *    POST /api/gis/export-design/ - Export scheme design
 *    GET /api/gis/projects/{project_id}/download/{file_type}/ - Download files
 * 
 * 5. MAP LAYERS APIs:
 *    GET /api/gis/base-layers/ - Get available base map layers
 *    GET /api/gis/existing-projects/ - Get existing projects for overlay
 * 
 * Models Required:
 * 
 * Shapefile:
 * - id, name, file_path, uploaded_by, upload_date
 * - geometry_type, feature_count, bounding_box (JSONField)
 * 
 * Zone:
 * - id, project_id, name, geometry (GeometryField)
 * - area, irrigation_type, crop_type, status
 * - water_requirement, design_parameters (JSONField)
 * 
 * ProjectGIS:
 * - id, project_id, shapefile_id, design_data (JSONField)
 * - hydraulic_design (JSONField), boq_data (JSONField)
 * 
 * REQUIRED DJANGO PACKAGES:
 * - django-rest-framework
 * - django.contrib.gis (GeoDjango)
 * - gdal, geos, proj (spatial libraries)
 * - django-storages (for file handling)
 */

// Fix for default markers in React Leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Make L available globally for the MapComponent
(window as any).L = L;

const GISPlanning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [activeLayer, setActiveLayer] = useState('satellite');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('planning');
  const [isLoading, setIsLoading] = useState(false);
  const [existingProjects, setExistingProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState<ZoneFormData>({
    name: '',
    irrigationType: 'Micro-drip',
    cropType: '',
    status: 'Planned' as 'Planned' | 'Active' | 'Completed'
  });

  useEffect(() => {
    loadExistingProjects();
    loadProjectZones();
  }, []);

  /**
   * Load existing irrigation projects for map overlay
   * TODO: Replace with actual Django API call
   */
  const loadExistingProjects = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/gis/existing-projects/', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });
      // const data = await response.json();
      // setExistingProjects(data.results);
      
      console.log('Loading existing projects for map overlay...');
    } catch (error) {
      console.error('Error loading existing projects:', error);
    }
  };

  /**
   * Load project zones from Django API
   * TODO: Replace with actual Django API call
   */
  const loadProjectZones = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // const projectId = 'current-project-id'; // Get from route params
      // const response = await fetch(`/api/projects/${projectId}/zones/`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });
      // const data = await response.json();
      // setZones(data.results);
      
  // Fetch real zones from backend here if not already
    } catch (error) {
      console.error('Error loading zones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save zone to Django API
   * TODO: Replace with actual Django API call
   */
  const saveZoneToAPI = async (zoneData: Zone) => {
    try {
      const projectId = 'current-project-id'; // Get from route params
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/projects/${projectId}/zones/`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: zoneData.name,
      //     geometry: zoneData.layer ? zoneData.layer.toGeoJSON() : null,
      //     area: zoneData.area,
      //     irrigation_type: zoneData.irrigationType,
      //     crop_type: zoneData.cropType,
      //     status: zoneData.status,
      //   }),
      // });
      // const savedZone = await response.json();
      // return savedZone;
      
      console.log('Saving zone to API:', zoneData);
      return zoneData;
    } catch (error) {
      console.error('Error saving zone:', error);
      throw error;
    }
  };

  useEffect(() => {
  // setZones should be called with real backend data
  }, []);

  const onCreated = (e: any) => {
    const { layer } = e;
    const area = calculateArea(layer);
    const newZone: Zone = {
      id: Date.now(),
      name: `Zone ${zones.length + 1}`,
      area: area,
      irrigationType: 'Micro-drip',
      cropType: '',
      status: 'Planned',
      layer: layer
    };
    setZones([...zones, newZone]);
    setSelectedZone(newZone);
    setFormData({
      name: newZone.name,
      irrigationType: newZone.irrigationType,
      cropType: newZone.cropType || '',
      status: newZone.status
    });
    setIsEditing(true);
    
    toast({
      title: "Zone Created",
      description: `${newZone.name} has been added to the planning area.`,
    });
  };

  const handleSaveZone = () => {
    if (!selectedZone) return;

    const updatedZone = {
      ...selectedZone,
      name: formData.name,
      irrigationType: formData.irrigationType,
      cropType: formData.cropType,
      status: formData.status
    };

    setZones(zones.map(zone => 
      zone.id === selectedZone.id ? updatedZone : zone
    ));
    setSelectedZone(updatedZone);
    setIsEditing(false);

    toast({
      title: "Zone Updated",
      description: `${updatedZone.name} has been saved successfully.`,
    });
  };

  const handleDeleteZone = (zoneId: number) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
    if (selectedZone?.id === zoneId) {
      setSelectedZone(null);
      setIsEditing(false);
    }
    
    toast({
      title: "Zone Deleted",
      description: "Zone has been removed from the project.",
    });
  };

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone);
    setFormData({
      name: zone.name,
      irrigationType: zone.irrigationType,
      cropType: zone.cropType || '',
      status: zone.status
    });
    setIsEditing(false);
  };

  /**
   * Export zones as shapefile via Django API
   * TODO: Replace with actual Django API call
   */
  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/gis/export-shapefile/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     zones: zones.map(zone => ({
      //       name: zone.name,
      //       geometry: zone.layer ? zone.layer.toGeoJSON() : null,
      //       properties: {
      //         area: zone.area,
      //         irrigation_type: zone.irrigationType,
      //         crop_type: zone.cropType,
      //         status: zone.status,
      //       }
      //     }))
      //   }),
      // });
      // const data = await response.json();
      // window.open(data.download_url, '_blank');
      
      // Fallback to client-side export for development
      handleExportZones(zones);
      
      toast({
        title: "Export Complete",
        description: "Scheme data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export shapefile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle shapefile upload to Django API
   * TODO: Replace with actual Django API call
   */
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip,.shp,.dbf,.shx,.prj';
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files) as File[];
      if (files.length > 0) {
        await uploadShapefile(files);
      }
    };
    input.click();
  };

  /**
   * Upload shapefile to Django API
   * TODO: Replace with actual Django API call
   */
  const uploadShapefile = async (files: File[]) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/shapefiles/upload/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      //   body: formData,
      // });
      // const data = await response.json();
      // 
      // // Load the uploaded shapefile features into the map
      // if (data.features) {
      //   // Process GeoJSON features and add to map
      //   const newZones = data.features.map((feature: any) => ({
      //     id: Date.now() + Math.random(),
      //     name: feature.properties.name || 'Imported Zone',
      //     area: feature.properties.area || 0,
      //     irrigationType: 'Micro-drip',
      //     cropType: feature.properties.crop || '',
      //     status: 'Planned',
      //     geometry: feature.geometry,
      //   }));
      //   setZones([...zones, ...newZones]);
      // }
      
      toast({
        title: 'Shapefile Uploaded',
        description: `Successfully uploaded ${files.length} files`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload shapefile. Please check file format.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDesign = () => {
    if (zones.length === 0) {
      toast({
        title: "No Zones Available",
        description: "Please create at least one zone before generating design.",
        variant: "destructive"
      });
      return;
    }
    
    setActiveTab('design');
    toast({
      title: "Design Generated",
      description: "Irrigation scheme design has been created based on your zones.",
    });
  };

  const handleGenerateBOQ = () => {
    if (zones.length === 0) {
      toast({
        title: "No Zones Available",
        description: "Please create zones and design before generating BOQ.",
        variant: "destructive"
      });
      return;
    }
    
    setActiveTab('boq');
    toast({
      title: "BOQ Generated",
      description: "Bill of Quantities has been calculated for your irrigation scheme.",
    });
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <PageHeader onUpload={handleUpload} onExport={handleExport} />
        <div id="toast-root" className="fixed top-6 right-6 z-[100] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <MapComponent
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            onCreated={onCreated}
          />

          <div className="space-y-6">
            {activeTab === 'planning' && (
              <>
                <DrawingToolsPanel />
                
                <ZonePropertiesPanel
                  selectedZone={selectedZone}
                  isEditing={isEditing}
                  formData={formData}
                  setFormData={setFormData}
                  setIsEditing={setIsEditing}
                  onSaveZone={handleSaveZone}
                />

                <ZonesList
                  zones={zones}
                  selectedZone={selectedZone}
                  onZoneSelect={handleZoneSelect}
                  onDeleteZone={handleDeleteZone}
                />
              </>
            )}

            {activeTab === 'design' && (
              <SchemeDesignPanel
                zones={zones}
                onGenerateBOQ={handleGenerateBOQ}
              />
            )}

            {activeTab === 'boq' && (
              <BOQGenerationPanel
                zones={zones}
                onExport={handleExport}
              />
            )}
          </div>
        </div>

        {/* Workflow Navigation */}
        <div className="fixed bottom-6 right-6 flex space-x-2">
          {activeTab !== 'planning' && (
            <button
              onClick={() => setActiveTab('planning')}
              className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
            >
              ← Planning
            </button>
          )}
          {activeTab === 'planning' && zones.length > 0 && (
            <button
              onClick={handleGenerateDesign}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Generate Design →
            </button>
          )}
          {activeTab === 'design' && (
            <button
              onClick={handleGenerateBOQ}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate BOQ →
            </button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default GISPlanning;
