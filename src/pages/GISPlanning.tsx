import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Map, Layers, Save, Upload, Download, MapPin } from 'lucide-react';
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

const GISPlanning = () => {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [zones, setZones] = useState<any[]>([]);
  const [activeLayer, setActiveLayer] = useState('satellite');
  
  const mapRef = useRef<any>(null);

  const irrigationTypes = [
    'Micro-drip',
    'Sprinkler',
    'Furrow',
    'Border Strip',
    'Check Basin',
    'Surface Drip'
  ];

  const sampleZones = [
    {
      id: 1,
      name: 'Zone A - Wheat Fields',
      area: '25.4 ha',
      irrigationType: 'Micro-drip',
      status: 'Planned',
      coordinates: [21.1458, 79.0882]
    },
    {
      id: 2,
      name: 'Zone B - Cotton Fields',
      area: '18.7 ha',
      irrigationType: 'Sprinkler',
      status: 'Active',
      coordinates: [21.1558, 79.0982]
    },
    {
      id: 3,
      name: 'Zone C - Vegetable Crops',
      area: '12.3 ha',
      irrigationType: 'Surface Drip',
      status: 'Completed',
      coordinates: [21.1358, 79.0782]
    }
  ];

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

  const onCreated = (e: any) => {
    const { layer } = e;
    const newZone = {
      id: Date.now(),
      name: `New Zone ${zones.length + 1}`,
      area: 'TBD',
      irrigationType: 'Micro-drip',
      status: 'Planned',
      layer: layer
    };
    setZones([...zones, newZone]);
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
          <Button variant="outline" className="border-emerald-200 text-emerald-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Shapefile
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-700">
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
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                <CardTitle className="text-lg">Zone Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zoneName">Zone Name</Label>
                  <Input id="zoneName" placeholder="Enter zone name" />
                </div>
                <div>
                  <Label htmlFor="irrigationType">Irrigation Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Input id="cropType" placeholder="e.g., Wheat, Cotton" />
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Zone
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Existing Zones */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Existing Zones</CardTitle>
              <CardDescription>{sampleZones.length} zones mapped</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800 text-sm">
                          {zone.name}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1">
                          {zone.area} • {zone.irrigationType}
                        </p>
                        <Badge className={`text-xs mt-2 ${getStatusBadgeColor(zone.status)}`}>
                          {zone.status}
                        </Badge>
                      </div>
                      <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
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
