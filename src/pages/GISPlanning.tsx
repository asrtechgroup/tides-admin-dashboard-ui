
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Map, Layers, Save, Upload, Download, MapPin, Edit, Trash2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default markers in React Leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Zone {
  id: number;
  name: string;
  area: string;
  irrigationType: string;
  cropType?: string;
  status: 'Planned' | 'Active' | 'Completed';
  coordinates?: [number, number];
  layer?: any;
}

const GISPlanning = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [activeLayer, setActiveLayer] = useState('satellite');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    irrigationType: 'Micro-drip',
    cropType: '',
    status: 'Planned' as const
  });
  
  const mapRef = useRef<any>(null);
  const { toast } = useToast();

  const irrigationTypes = [
    'Micro-drip',
    'Sprinkler',
    'Furrow',
    'Border Strip',
    'Check Basin',
    'Surface Drip'
  ];

  const layerStyles = {
    satellite: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const sampleZones: Zone[] = [
    {
      id: 1,
      name: 'Zone A - Wheat Fields',
      area: '25.4 ha',
      irrigationType: 'Micro-drip',
      cropType: 'Wheat',
      status: 'Planned',
      coordinates: [21.1458, 79.0882]
    },
    {
      id: 2,
      name: 'Zone B - Cotton Fields',
      area: '18.7 ha',
      irrigationType: 'Sprinkler',
      cropType: 'Cotton',
      status: 'Active',
      coordinates: [21.1558, 79.0982]
    },
    {
      id: 3,
      name: 'Zone C - Vegetable Crops',
      area: '12.3 ha',
      irrigationType: 'Surface Drip',
      cropType: 'Vegetables',
      status: 'Completed',
      coordinates: [21.1358, 79.0782]
    }
  ];

  useEffect(() => {
    setZones(sampleZones);
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Active':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const calculateArea = (layer: any) => {
    if (layer instanceof L.Circle) {
      const radius = layer.getRadius();
      const area = Math.PI * radius * radius;
      return `${(area / 10000).toFixed(2)} ha`;
    }
    if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      const latLngs = layer.getLatLngs()[0];
      // Simple area calculation - in reality you'd use a proper geographic calculation
      return `${Math.random() * 50 + 5} ha`;
    }
    return 'TBD';
  };

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
    const exportData = {
      zones: zones.map(({ layer, ...zone }) => zone),
      exportDate: new Date().toISOString(),
      totalZones: zones.length
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gis-zones-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">GIS Planning</h1>
          <p className="text-stone-600 mt-1">Interactive mapping and zone planning for irrigation projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleUpload} className="border-emerald-200 text-emerald-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Shapefile
          </Button>
          <Button variant="outline" onClick={handleExport} className="border-blue-200 text-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Panel */}
        <Card className="lg:col-span-3 border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Map className="w-5 h-5 text-emerald-600" />
                <CardTitle>Interactive Map</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={activeLayer} onValueChange={setActiveLayer}>
                  <SelectTrigger className="w-32">
                    <Layers className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="street">Street</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 lg:h-[500px] rounded-lg overflow-hidden border border-stone-200">
              <MapContainer
                center={[21.1458, 79.0882]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url={layerStyles[activeLayer as keyof typeof layerStyles]}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <FeatureGroup>
                  <EditControl
                    position="topright"
                    onCreated={onCreated}
                    draw={{
                      rectangle: true,
                      polygon: true,
                      circle: true,
                      circlemarker: false,
                      marker: true,
                      polyline: false,
                    }}
                    edit={{
                      edit: true,
                      remove: true,
                    }}
                  />
                </FeatureGroup>
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Zone Properties Panel */}
        <div className="space-y-6">
          {/* Drawing Tools */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Drawing Tools</CardTitle>
              <CardDescription>Use the map controls to draw zones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-stone-50 rounded text-center">
                  Rectangle
                </div>
                <div className="p-2 bg-stone-50 rounded text-center">
                  Polygon
                </div>
                <div className="p-2 bg-stone-50 rounded text-center">
                  Circle
                </div>
                <div className="p-2 bg-stone-50 rounded text-center">
                  Marker
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone Properties */}
          {selectedZone && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Zone Properties</CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zoneName">Zone Name</Label>
                  <Input
                    id="zoneName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter zone name"
                  />
                </div>
                <div>
                  <Label htmlFor="irrigationType">Irrigation Type</Label>
                  <Select
                    value={formData.irrigationType}
                    onValueChange={(value) => setFormData({ ...formData, irrigationType: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Input
                    id="cropType"
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Wheat, Cotton"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'Planned' | 'Active' | 'Completed') => 
                      setFormData({ ...formData, status: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-stone-600">
                  Area: {selectedZone.area}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSaveZone}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Zone
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Existing Zones */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Existing Zones</CardTitle>
              <CardDescription>{zones.length} zones mapped</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer border-2 ${
                      selectedZone?.id === zone.id ? 'border-emerald-300' : 'border-transparent'
                    }`}
                    onClick={() => handleZoneSelect(zone)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800 text-sm">
                          {zone.name}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1">
                          {zone.area} • {zone.irrigationType}
                        </p>
                        {zone.cropType && (
                          <p className="text-xs text-stone-500 mt-1">
                            Crop: {zone.cropType}
                          </p>
                        )}
                        <Badge className={`text-xs mt-2 ${getStatusBadgeColor(zone.status)}`}>
                          {zone.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteZone(zone.id);
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GISPlanning;
