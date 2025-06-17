
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
      name: `New Zone ${zones.length + 1}`,
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
      description: `${newZone.name} has been added to the map.`,
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
      title: "Zone Saved",
      description: `${updatedZone.name} has been updated successfully.`,
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
      description: "Zone data has been exported successfully.",
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Shapefile upload functionality would be implemented here.",
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
        </div>
      </div>
    </div>
  );
};

export default GISPlanning;
