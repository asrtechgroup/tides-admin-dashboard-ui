
import React, { useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Layers } from 'lucide-react';
import { layerStyles } from '@/types/gis';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

interface MapComponentProps {
  activeLayer: string;
  setActiveLayer: (layer: string) => void;
  onCreated: (e: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  activeLayer,
  setActiveLayer,
  onCreated
}) => {
  const mapRef = useRef<any>(null);

  return (
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
                  rectangle: {
                    shapeOptions: {
                      color: '#3b82f6',
                      weight: 2
                    }
                  },
                  polygon: {
                    shapeOptions: {
                      color: '#10b981',
                      weight: 2
                    }
                  },
                  circle: {
                    shapeOptions: {
                      color: '#f59e0b',
                      weight: 2
                    }
                  },
                  marker: true,
                  polyline: false,
                  circlemarker: false
                }}
                edit={{
                  edit: true,
                  remove: true
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapComponent;
