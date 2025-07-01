
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import { Map } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPreviewCardProps {
  coordinates?: [number, number][];
  projectLocation?: { zone?: string; regions?: string[] };
}

// Component to handle map updates
const MapUpdater: React.FC<{ coordinates?: [number, number][] }> = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      // Create bounds from coordinates
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [coordinates, map]);

  return null;
};

const MapPreviewCard: React.FC<MapPreviewCardProps> = ({ 
  coordinates, 
  projectLocation 
}) => {
  // Default center based on project location or default to Tanzania
  const getDefaultCenter = (): [number, number] => {
    if (projectLocation?.zone === 'Kilimanjaro') {
      return [-3.0674, 37.3556];
    } else if (projectLocation?.zone === 'Dodoma') {
      return [-6.1630, 35.7516];
    }
    return [-6.3678, 34.8854]; // Central Tanzania
  };

  const defaultCenter = getDefaultCenter();
  const defaultZoom = coordinates && coordinates.length > 0 ? 12 : 6;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Map className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-lg">Map Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 rounded-lg overflow-hidden border border-stone-200">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/earth/">Google Earth</a>'
            />
            {coordinates && coordinates.length > 0 && (
              <Polygon
                positions={coordinates}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.3,
                  weight: 2
                }}
              />
            )}
            <MapUpdater coordinates={coordinates} />
          </MapContainer>
        </div>
        {coordinates && coordinates.length > 0 && (
          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-sm">
            <strong>File Location:</strong> Coordinates loaded from uploaded file
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapPreviewCard;
