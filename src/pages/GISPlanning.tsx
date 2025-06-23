
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Zone, ZoneFormData } from '@/types/gis';
import { calculateArea, handleExportZones } from '@/utils/gis-utils';
import { sampleZones } from '@/data/sample-zones';
import MapComponent from '@/components/gis/MapComponent';
import ZonePropertiesPanel from '@/components/gis/ZonePropertiesPanel';
import ZonesList from '@/components/gis/ZonesList';
import DrawingToolsPanel from '@/components/gis/DrawingToolsPanel';
import PageHeader from '@/components/gis/PageHeader';
import SchemeDesignPanel from '@/components/gis/SchemeDesignPanel';
import BOQGenerationPanel from '@/components/gis/BOQGenerationPanel';

// Fix for default markers in React Leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GISPlanning = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [activeLayer, setActiveLayer] = useState('satellite');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('planning');
  const [formData, setFormData] = useState<ZoneFormData>({
    name: '',
    irrigationType: 'Micro-drip',
    cropType: '',
    status: 'Planned' as 'Planned' | 'Active' | 'Completed'
  });
  
  const { toast } = useToast();

  useEffect(() => {
    setZones(sampleZones);
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

  const handleExport = () => {
    handleExportZones(zones);
    toast({
      title: "Export Complete",
      description: "Scheme data has been exported successfully.",
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Shapefile upload functionality would be implemented here.",
    });
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
    <div className="space-y-6">
      <PageHeader onUpload={handleUpload} onExport={handleExport} />

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
  );
};

export default GISPlanning;
